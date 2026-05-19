/** Serializable field rule definitions (ported from Laravel jQuery scripts). */

export type FieldRuleOperator = "==" | "!=" | "in" | "notIn" | "checked" | "notChecked";

export type FieldRuleCondition = {
  field: string;
  op: FieldRuleOperator;
  /** String, or list for `in` / `notIn`. Omitted for checked/notChecked. */
  value?: string | string[];
};

/** Show targets when condition is true (in addition to config `required_if`). */
export type ShowWhenRule = {
  targets: string[];
  when: FieldRuleCondition;
};

/** Hide targets when condition is true (evaluated after show rules). */
export type HideWhenRule = {
  targets: string[];
  when: FieldRuleCondition;
};

export type ReadonlyWhenRule = {
  target: string;
  when: FieldRuleCondition;
};

/** Set target from a registered compute id (see compute-registry). */
export type ComputeWhenRule = {
  target: string;
  computeId: string;
  /** Field names to read from current section values. */
  sources: string[];
};

export type FieldRuleSet = {
  /** Laravel script filename (without .js) for traceability. */
  laravelScript?: string;
  showWhen?: ShowWhenRule[];
  hideWhen?: HideWhenRule[];
  readonlyWhen?: ReadonlyWhenRule[];
  computeWhen?: ComputeWhenRule[];
};

export type FieldRuleBinding = {
  /** Config registry keys, e.g. `green_homes`, `green_factories`. */
  ratingKeys: string[];
  tab: string;
  /** Omit or use `*` for all subtabs under the tab. */
  subtabs?: string[] | "*";
  rules: FieldRuleSet;
  /** When true, manual `rules` replace generated Laravel rules for this section. */
  replaceGenerated?: boolean;
};

export type FieldRulesManifest = {
  bindings: FieldRuleBinding[];
};
