import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { FieldRuleSet } from "./field-rules.types";

function resolveGeneratedPath(): string | null {
  const candidates = [
    join(__dirname, "generated", "laravel-field-rules.json"),
    join(process.cwd(), "src", "rating-config", "field-rules", "generated", "laravel-field-rules.json"),
    join(process.cwd(), "dist", "rating-config", "field-rules", "generated", "laravel-field-rules.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

let cached: Record<string, FieldRuleSet> | null = null;

/** Subtab slug → rules parsed from `laravel-scripts/*.js`. */
export function loadLaravelGeneratedRules(): Record<string, FieldRuleSet> {
  if (cached) return cached;
  const path = resolveGeneratedPath();
  if (!path) {
    cached = {};
    return cached;
  }
  try {
    const raw = readFileSync(path, "utf8");
    cached = JSON.parse(raw) as Record<string, FieldRuleSet>;
  } catch {
    cached = {};
  }
  return cached;
}
