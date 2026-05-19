import type {
  FieldRuleCondition,
  FieldRuleSet,
  HideWhenRule,
  ReadonlyWhenRule,
  ShowWhenRule,
} from "./field-rules.types";
import { runCompute } from "./compute-registry";

export function parseNum(value: string | undefined): number {
  const n = parseFloat((value ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function isCheckedValue(value: string | undefined): boolean {
  const v = (value ?? "").trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function normalize(value: string | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

export function evaluateCondition(
  condition: FieldRuleCondition,
  values: Record<string, string>,
): boolean {
  const actual = values[condition.field] ?? "";

  switch (condition.op) {
    case "checked":
      return isCheckedValue(actual);
    case "notChecked":
      return !isCheckedValue(actual);
    case "==":
      return normalize(actual) === normalize(String(condition.value ?? ""));
    case "!=":
      return normalize(actual) !== normalize(String(condition.value ?? ""));
    case "in": {
      const list = Array.isArray(condition.value)
        ? condition.value
        : [String(condition.value ?? "")];
      return list.map((v) => normalize(v)).includes(normalize(actual));
    }
    case "notIn": {
      const list = Array.isArray(condition.value)
        ? condition.value
        : [String(condition.value ?? "")];
      return !list.map((v) => normalize(v)).includes(normalize(actual));
    }
    default:
      return false;
  }
}

function applyShowRules(
  visible: Map<string, boolean>,
  rules: ShowWhenRule[],
  values: Record<string, string>,
): void {
  for (const rule of rules) {
    if (!evaluateCondition(rule.when, values)) continue;
    for (const target of rule.targets) {
      visible.set(target, true);
    }
  }
}

function applyHideRules(
  visible: Map<string, boolean>,
  rules: HideWhenRule[],
  values: Record<string, string>,
): void {
  for (const rule of rules) {
    if (!evaluateCondition(rule.when, values)) continue;
    for (const target of rule.targets) {
      visible.set(target, false);
    }
  }
}

export type FieldRulesEvaluation = {
  visible: Record<string, boolean>;
  readonly: Record<string, boolean>;
  computed: Record<string, string>;
};

/**
 * Evaluate Laravel-ported rules for one section.
 * Fields not mentioned in show/hide rules default to visible.
 */
export function evaluateFieldRules(
  ruleSet: FieldRuleSet | null | undefined,
  fieldNames: string[],
  values: Record<string, string>,
): FieldRulesEvaluation {
  const showControlled = new Set<string>();
  for (const rule of ruleSet?.showWhen ?? []) {
    for (const target of rule.targets) {
      showControlled.add(target);
    }
  }

  const visible = new Map<string, boolean>();
  for (const name of fieldNames) {
    visible.set(name, !showControlled.has(name));
  }

  const readonly: Record<string, boolean> = {};
  const computed: Record<string, string> = {};

  if (!ruleSet) {
    return {
      visible: Object.fromEntries(fieldNames.map((n) => [n, true])),
      readonly,
      computed,
    };
  }

  if (ruleSet.showWhen?.length) {
    applyShowRules(visible, ruleSet.showWhen, values);
  }

  if (ruleSet.hideWhen?.length) {
    applyHideRules(visible, ruleSet.hideWhen, values);
  }

  for (const rule of ruleSet.readonlyWhen ?? []) {
    readonly[rule.target] = evaluateCondition(rule.when, values);
  }

  for (const rule of ruleSet.computeWhen ?? []) {
    const result = runCompute(rule.computeId, values, rule.sources);
    if (result !== null) {
      computed[rule.target] = result;
    }
  }

  return {
    visible: Object.fromEntries(visible),
    readonly,
    computed,
  };
}

export function isFieldVisibleByRules(
  fieldName: string,
  evaluation: FieldRulesEvaluation | null | undefined,
): boolean {
  if (!evaluation) return true;
  if (fieldName in evaluation.visible) {
    return evaluation.visible[fieldName];
  }
  return true;
}

export function isFieldReadonlyByRules(
  fieldName: string,
  evaluation: FieldRulesEvaluation | null | undefined,
): boolean {
  return evaluation?.readonly[fieldName] === true;
}
