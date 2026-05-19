import type { FieldRuleBinding, FieldRuleSet } from "./field-rules.types";
import { airConditionerRules } from "./rules/air-conditioner.rules";
import { energyLightingRules } from "./rules/energy-lighting.rules";
import { factoryDaylightingRules } from "./rules/factory-daylighting.rules";
import { integratedEnergyMonitoringRules } from "./rules/integrated-energy-monitoring.rules";
import { materialCalculationRules } from "./rules/material-calculation.rules";
import {
  sustainableGreenParkingRules,
  sustainableGreenTransportRules,
} from "./rules/sustainable-design.rules";

const ALL_RATINGS = [
  "green_homes",
  "green_factories",
  "green_new_buildings",
  "green_existing_buildings",
  "green_interiors",
] as const;

const FACTORY_LIKE = [
  "green_factories",
  "green_new_buildings",
  "green_existing_buildings",
] as const;

export const FIELD_RULE_BINDINGS: FieldRuleBinding[] = [
  {
    ratingKeys: [...FACTORY_LIKE],
    tab: "material_resources",
    subtabs: ["sustainable_building_materials"],
    rules: materialCalculationRules,
  },
  {
    ratingKeys: ["green_interiors", ...FACTORY_LIKE],
    tab: "energy_efficency",
    subtabs: ["energy_efficient_lighting"],
    rules: energyLightingRules,
  },
  {
    ratingKeys: [...FACTORY_LIKE],
    tab: "indoor_environment",
    subtabs: ["daylighting"],
    rules: factoryDaylightingRules,
    replaceGenerated: true,
  },
  {
    ratingKeys: ["green_homes"],
    tab: "energy_efficency",
    subtabs: ["integrated_energy_monitoring"],
    rules: integratedEnergyMonitoringRules,
    replaceGenerated: true,
  },
  {
    ratingKeys: ["green_homes", ...FACTORY_LIKE],
    tab: "sustainable_design",
    subtabs: ["green_parking"],
    rules: sustainableGreenParkingRules,
  },
  {
    ratingKeys: ["green_homes", ...FACTORY_LIKE],
    tab: "sustainable_design",
    subtabs: ["green_transportation", "green_parking"],
    rules: sustainableGreenTransportRules,
  },
  {
    ratingKeys: [...FACTORY_LIKE],
    tab: "energy_efficency",
    subtabs: ["efficent_space_conditioning", "efficient_space_conditioning"],
    rules: airConditionerRules,
  },
];

function mergeRuleSets(sets: FieldRuleSet[]): FieldRuleSet | null {
  if (!sets.length) return null;
  const merged: FieldRuleSet = {};
  for (const set of sets) {
    if (set.laravelScript && !merged.laravelScript) {
      merged.laravelScript = set.laravelScript;
    }
    if (set.showWhen?.length) {
      merged.showWhen = [...(merged.showWhen ?? []), ...set.showWhen];
    }
    if (set.hideWhen?.length) {
      merged.hideWhen = [...(merged.hideWhen ?? []), ...set.hideWhen];
    }
    if (set.readonlyWhen?.length) {
      merged.readonlyWhen = [...(merged.readonlyWhen ?? []), ...set.readonlyWhen];
    }
    if (set.computeWhen?.length) {
      merged.computeWhen = [...(merged.computeWhen ?? []), ...set.computeWhen];
    }
  }
  return merged;
}

export function resolveFieldRulesForSection(
  ratingKey: string,
  tab: string,
  subtab: string,
): FieldRuleSet | null {
  const matches = FIELD_RULE_BINDINGS.filter((binding) => {
    if (!binding.ratingKeys.includes(ratingKey)) return false;
    if (binding.tab !== tab) return false;
    if (!binding.subtabs || binding.subtabs === "*") return true;
    return binding.subtabs.includes(subtab);
  });

  return mergeRuleSets(matches.map((m) => m.rules));
}

export function resolveManualFieldRules(
  ratingKey: string,
  tab: string,
  subtab: string,
): { rules: FieldRuleSet | null; replaceGenerated: boolean } {
  const matches = FIELD_RULE_BINDINGS.filter((binding) => {
    if (!binding.ratingKeys.includes(ratingKey)) return false;
    if (binding.tab !== tab) return false;
    if (!binding.subtabs || binding.subtabs === "*") return true;
    return binding.subtabs.includes(subtab);
  });

  const replaceGenerated = matches.some((m) => m.replaceGenerated);
  return {
    rules: mergeRuleSets(matches.map((m) => m.rules)),
    replaceGenerated,
  };
}

/** All section keys that have rules for a rating (for workspace payload). */
export function listFieldRuleSectionKeys(ratingKey: string): string[] {
  const keys = new Set<string>();
  for (const binding of FIELD_RULE_BINDINGS) {
    if (!binding.ratingKeys.includes(ratingKey)) continue;
    if (!binding.subtabs || binding.subtabs === "*") {
      keys.add(`${binding.tab}/*`);
    } else {
      for (const sub of binding.subtabs) {
        keys.add(`${binding.tab}/${sub}`);
      }
    }
  }
  return [...keys];
}

export { ALL_RATINGS };
