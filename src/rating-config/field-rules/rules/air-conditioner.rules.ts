import type { FieldRuleSet } from "../field-rules.types";

/** Ported from `laravel-scripts/air_conditioner.js` — rows 1..10 */
const acTypes = ["split_ac", "cassette_unit", "packaged_air_conditioning"];

function acReadonlyRules(): FieldRuleSet["readonlyWhen"] {
  const rules: NonNullable<FieldRuleSet["readonlyWhen"]> = [];
  for (let i = 1; i <= 10; i++) {
    rules.push({
      target: `type_of_system${i}`,
      when: {
        field: `type_of_conditioner${i}`,
        op: "notIn",
        value: acTypes,
      },
    });
  }
  return rules;
}

export const airConditionerRules: FieldRuleSet = {
  laravelScript: "air_conditioner",
  readonlyWhen: acReadonlyRules(),
};
