import type { FieldRuleSet } from "../field-rules.types";

/** Ported from `laravel-scripts/interiorhome.js` — subtab `integrated_energy_monitoring` */
export const integratedEnergyMonitoringRules: FieldRuleSet = {
  laravelScript: "interiorhome",
  showWhen: [
    {
      targets: ["area_lighting", "area_lighting_ex"],
      when: { field: "energy_metering_monitoring", op: "==", value: "1" },
    },
    {
      targets: ["manag_sys", "manag_sys_light"],
      when: { field: "energy_metering_monitoring", op: "==", value: "2" },
    },
  ],
};
