import type { FieldRuleSet } from "../field-rules.types";

/** Ported from `laravel-scripts/energy-lighting.js` */
export const energyLightingRules: FieldRuleSet = {
  laravelScript: "energy-lighting",
  showWhen: [
    {
      targets: ["saving_percentage_space_method"],
      when: {
        field: "case_for_energy_efficent_lighting",
        op: "==",
        value: "space area method",
      },
    },
    {
      targets: ["saving_percentage_building_method"],
      when: {
        field: "case_for_energy_efficent_lighting",
        op: "==",
        value: "building area method",
      },
    },
  ],
};
