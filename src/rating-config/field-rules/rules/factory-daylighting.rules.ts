import type { FieldRuleSet } from "../field-rules.types";

/** Ported from `laravel-scripts/factory.js` — subtab `daylighting` */
const simulationFields = [
  "day_parameters_area",
  "day_total_area",
  "day_narrative",
  "day_narrative_doc",
  "day_floor_plan",
  "day_floor_plan_doc",
  "day_manufacturer",
  "day_manufacturer_doc",
  "day_site_plan",
  "day_site_plan_doc",
  "day_simulation_report",
  "day_simulation_report_doc",
  "day_photographs",
  "day_photographs_doc",
  "day_purchase_invoices",
  "day_purchase_invoices_doc",
];

const manualFields = [
  "mannual_parameters_area",
  "mannual_total",
  "mannual_narrative",
  "mannual_narrative_doc",
  "mannual_def_report",
  "mannual_def_report_doc",
  "mannual_floor_plan",
  "mannual_floor_plan_doc",
  "mannual_site_plan",
  "mannual_site_plan_doc",
  "mannual_manufacturer",
  "mannual_manufacturer_doc",
  "mannual_build",
  "mannual_build_doc",
  "mannual_purchase_invoices",
  "mannual_purchase_invoices_doc",
];

export const factoryDaylightingRules: FieldRuleSet = {
  laravelScript: "factory",
  showWhen: [
    {
      targets: simulationFields,
      when: { field: "daylight_approch", op: "==", value: "Simulation Approach" },
    },
    {
      targets: manualFields,
      when: { field: "daylight_approch", op: "==", value: "Mannual Approach" },
    },
  ],
};
