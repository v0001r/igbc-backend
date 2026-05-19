/**
 * Parses Laravel jQuery scripts → field rule sets keyed by subtab slug.
 * Run: node scripts/generate-laravel-field-rules.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = join(__dirname, "../src/rating-config/laravel-scripts");
const OUT_FILE = join(__dirname, "../src/rating-config/field-rules/generated/laravel-field-rules.json");

const SKIP_FILES = new Set(["app.js", "app-menu.min.js", "JsUtility.js"]);

/** `#div_foo` / `motionDiv#foo_doc` → field name */
function parseDivTargets(selectorChunk) {
  const names = new Set();
  for (const m of selectorChunk.matchAll(/#div_([a-zA-Z0-9_]+)/g)) {
    names.add(m[1]);
  }
  for (const m of selectorChunk.matchAll(/motionDiv#([a-zA-Z0-9_]+)/gi)) {
    names.add(m[1]);
  }
  for (const m of selectorChunk.matchAll(/div#([a-zA-Z0-9_]+)/g)) {
    names.add(m[1]);
  }
  return [...names];
}

function parseInputName(selectorChunk) {
  const m = selectorChunk.match(/input\[name=['"]([^'"]+)['"]\]/);
  return m ? m[1] : null;
}

function mergeRuleSet(into, part) {
  if (!part) return;
  into.showWhen = [...(into.showWhen ?? []), ...(part.showWhen ?? [])];
  into.hideWhen = [...(into.hideWhen ?? []), ...(part.hideWhen ?? [])];
}

function collectShowTargetsFromBlock(block) {
  const targets = [];
  const parts = block.split(/\.show\s*\(\s*\)/);
  for (let i = 0; i < parts.length - 1; i++) {
    targets.push(...parseDivTargets(parts[i]));
  }
  return [...new Set(targets)];
}

function collectHideTargetsFromBlock(block) {
  const targets = [];
  const parts = block.split(/\.hide\s*\(\s*\)/);
  for (let i = 0; i < parts.length - 1; i++) {
    targets.push(...parseDivTargets(parts[i]));
  }
  return [...new Set(targets)];
}

/** `if (value === "X") { ... .show(...)` branches inside helper functions */
function parseValueBranches(fnBody, controllerField) {
  const showWhen = [];
  const hideWhen = [];
  const branchRe =
    /if\s*\(\s*(?:value|val)\s*===?\s*["']([^"']+)["']\s*\)\s*\{([\s\S]*?)(?=\}\s*else|\}$)/g;
  let m;
  while ((m = branchRe.exec(fnBody))) {
    const literal = m[1];
    const block = m[2];
    const showTargets = collectShowTargetsFromBlock(block);
    if (showTargets.length) {
      showWhen.push({
        targets: showTargets,
        when: { field: controllerField, op: "==", value: literal },
      });
    }
    const hideTargets = collectHideTargetsFromBlock(block);
    if (hideTargets.length) {
      hideWhen.push({
        targets: hideTargets,
        when: { field: controllerField, op: "==", value: literal },
      });
    }
  }
  return { showWhen, hideWhen };
}

/** Checkbox / radio checked show-hide */
function parseCheckedShowHide(chunk) {
  const showWhen = [];
  const checkedRe =
    /if\s*\(\s*\$\(\s*["']?input\[name=['"]([^'"]+)['"]\][^)]*\)\s*\.is\s*\(\s*["']:checked["']\s*\)\s*\)\s*\{([\s\S]*?)\}\s*else\s*\{/g;
  let m;
  while ((m = checkedRe.exec(chunk))) {
    const field = m[1];
    const ifBlock = m[2] ?? "";
    const targets = collectShowTargetsFromBlock(ifBlock);
    if (targets.length) {
      showWhen.push({
        targets,
        when: { field, op: "checked" },
      });
    }
  }

  const changeCheckedRe =
    /if\s*\(\s*this\.checked\s*\)\s*\{([\s\S]*?)\}\s*else\s*\{/g;
  const nameFromChange = chunk.match(/['"]?#([a-zA-Z0-9_]+)['"]?\s*\.change/);
  if (nameFromChange) {
    let cm;
    while ((cm = changeCheckedRe.exec(chunk))) {
      const targets = parseDivTargets(cm[1]);
      if (targets.length) {
        showWhen.push({
          targets,
          when: { field: nameFromChange[1], op: "checked" },
        });
      }
    }
  }

  return { showWhen };
}

/** Select / input val() change: if (val === "x") show ... */
function parseValConditions(chunk) {
  const showWhen = [];
  const fieldFromSelect = chunk.match(/\$\(\s*["']?(#?[a-zA-Z0-9_]+|select\[name=['"]([^'"]+)['"]\])[^)]*\)/);
  let controller = null;
  if (fieldFromSelect) {
    if (fieldFromSelect[2]) controller = fieldFromSelect[2];
    else if (fieldFromSelect[1]?.startsWith("#")) {
      controller = fieldFromSelect[1].slice(1);
    }
  }

  const ifValRe =
    /if\s*\(\s*(?:val|case_opt|caseValue)\s*===?\s*["']([^"']+)["']\s*\)\s*\{([\s\S]*?)(?=\}\s*(?:else|if|\)))/g;
  let m;
  while ((m = ifValRe.exec(chunk))) {
    const literal = m[1];
    const block = m[2];
    if (!block.includes(".show()")) continue;
    const targets = parseDivTargets(block.split(".show()")[0]);
    if (!targets.length || !controller) continue;
    showWhen.push({
      targets,
      when: { field: controller, op: "==", value: literal },
    });
  }

  return { showWhen };
}

function parseSubtabBlock(subtab, block, fullSource) {
  const rules = { showWhen: [] };

  mergeRuleSet(rules, parseCheckedShowHide(block));
  mergeRuleSet(rules, parseValConditions(block));

  const helperCalls = [
    ...block.matchAll(/(\w+)\s*\(\s*\$\(\s*["']#?([a-zA-Z0-9_]+)["']\s*\)\.val\(\)/g),
  ];
  for (const [, fnName, field] of helperCalls) {
    const fnRe = new RegExp(`function\\s+${fnName}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}`, "m");
    const fnMatch = fullSource.match(fnRe);
    if (fnMatch) {
      mergeRuleSet(rules, parseValueBranches(fnMatch[1], field));
    }
  }

  const directChecked = [
    ...block.matchAll(
      /if\s*\(\s*\$\(\s*["']?#?([a-zA-Z0-9_]+)["']?\s*\)\s*\.is\s*\(\s*["']:checked["']\s*\)\s*\)/g,
    ),
  ];
  for (const [, id] of directChecked) {
    const showLine = block.match(
      new RegExp(
        `if\\s*\\(\\s*\\$\\(\\s*["']?#?${id}["']?\\s*\\)\\.is\\s*\\(\\s*["']:checked["']\\s*\\)\\s*\\)[\\s\\S]*?\\.show\\s*\\(\\s*\\)`,
        "m",
      ),
    );
    if (showLine) {
      const targets = parseDivTargets(showLine[0]);
      if (targets.length) {
        rules.showWhen.push({ targets, when: { field: id, op: "checked" } });
      }
    }
  }

  const radioChecked = [
    ...block.matchAll(
      /let\s+val\s*=\s*\$\(\s*["']input\[name=['"]([^'"]+)['"]\][^)]*\)\.val\(\)/g,
    ),
  ];
  for (const [, name] of radioChecked) {
    const valIfRe =
      /if\s*\(\s*val\s*==\s*["']([^"']+)["']\s*\)\s*\{([\s\S]*?)\}\s*(?=else if|else|\})/g;
    let vm;
    while ((vm = valIfRe.exec(block))) {
      const showTargets = collectShowTargetsFromBlock(vm[2]);
      if (showTargets.length) {
        rules.showWhen.push({
          targets: showTargets,
          when: { field: name, op: "==", value: vm[1] },
        });
      }
      const hideTargets = collectHideTargetsFromBlock(vm[2]);
      if (hideTargets.length) {
        rules.hideWhen = rules.hideWhen ?? [];
        rules.hideWhen.push({
          targets: hideTargets,
          when: { field: name, op: "==", value: vm[1] },
        });
      }
    }
  }

  if (!rules.showWhen?.length) return null;
  return rules;
}

function parseFile(filePath, fileName) {
  const source = readFileSync(filePath, "utf8");
  const bySubtab = {};
  const subtabRe = /if\s*\(\s*subtab\s*===?\s*["']([^"']+)["']\s*\)/g;
  const matches = [...source.matchAll(subtabRe)];
  for (let i = 0; i < matches.length; i++) {
    const subtab = matches[i][1];
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : source.length;
    const block = source.slice(start, end);
    const rules = parseSubtabBlock(subtab, block, source);
    if (!rules) continue;
    if (!bySubtab[subtab]) {
      bySubtab[subtab] = { laravelScript: fileName.replace(/\.js$/, ""), showWhen: [] };
    }
    mergeRuleSet(bySubtab[subtab], rules);
  }
  return bySubtab;
}

function main() {
  const merged = {};
  const files = readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith(".js") && !SKIP_FILES.has(f));
  for (const file of files) {
    const part = parseFile(join(SCRIPTS_DIR, file), file);
    for (const [subtab, rules] of Object.entries(part)) {
      if (!merged[subtab]) {
        merged[subtab] = rules;
      } else {
        mergeRuleSet(merged[subtab], rules);
      }
    }
  }

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2), "utf8");
  console.log(`Wrote ${Object.keys(merged).length} subtab rule sets → ${OUT_FILE}`);
}

main();
