import { parseNum } from "./field-rules.engine";

type ComputeFn = (values: Record<string, string>, sources: string[]) => string | null;

const REGISTRY: Record<string, ComputeFn> = {
  /** sustainable.js — green_parking: bycycle % of dwelling units */
  green_parking_bycycle_percent: (values) => {
    const totCycle = parseNum(values.bycycle);
    const evUnits = parseNum(values.dwelling_units);
    if (evUnits <= 0) return "";
    return ((totCycle / evUnits) * 100).toFixed(2);
  },

  /** sustainable.js — green_transportation / green_parking EV % */
  two_wheel_ev_percent: (values) => {
    const total = parseNum(values.two_wheel);
    const ev = parseNum(values.ev_twowheel);
    if (total <= 0) return "";
    return ((ev / total) * 100).toFixed(2);
  },

  four_wheel_ev_percent: (values) => {
    const total = parseNum(values.four_wheel);
    const ev = parseNum(values.ev_fourwheel);
    if (total <= 0) return "";
    return ((ev / total) * 100).toFixed(2);
  },

  /** material_calculation.js — eco labelled furniture % */
  percent_eco_labelled_interior_furniture: (values) => {
    const total = parseNum(values.total_furniture_cost);
    const eco = parseNum(values.total_ecolabelled_furniture_cost);
    if (total <= 0 || eco <= 0) return "";
    return String((eco / total) * 100);
  },
};

export function runCompute(
  id: string,
  values: Record<string, string>,
  sources: string[],
): string | null {
  const fn = REGISTRY[id];
  if (!fn) return null;
  return fn(values, sources);
}
