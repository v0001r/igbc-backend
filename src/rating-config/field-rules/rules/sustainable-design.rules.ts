import type { FieldRuleSet } from "../field-rules.types";

/** Partial port from `laravel-scripts/sustainable.js` */
export const sustainableGreenParkingRules: FieldRuleSet = {
  laravelScript: "sustainable",
  computeWhen: [
    {
      target: "bycycle_parking_percent",
      computeId: "green_parking_bycycle_percent",
      sources: ["bycycle", "dwelling_units"],
    },
  ],
};

export const sustainableGreenTransportRules: FieldRuleSet = {
  laravelScript: "sustainable",
  computeWhen: [
    {
      target: "two_parking_percent_green",
      computeId: "two_wheel_ev_percent",
      sources: ["two_wheel", "ev_twowheel"],
    },
    {
      target: "four_parking_percent_green",
      computeId: "four_wheel_ev_percent",
      sources: ["four_wheel", "ev_fourwheel"],
    },
  ],
};
