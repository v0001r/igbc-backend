import { Injectable } from "@nestjs/common";
import type { RatingRuntimeConfig } from "../rating-config.types";
import { getSubtabsForTab } from "../rating-config.resolver";
import type { FieldRuleSet } from "./field-rules.types";
import {
  resolveManualFieldRules,
} from "./field-rules.manifest";
import { loadLaravelGeneratedRules } from "./laravel-generated.loader";

function mergeRuleSets(sets: (FieldRuleSet | null | undefined)[]): FieldRuleSet | null {
  const parts = sets.filter((s): s is FieldRuleSet => Boolean(s));
  if (!parts.length) return null;

  const merged: FieldRuleSet = {};
  for (const set of parts) {
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

  const hasRules =
    (merged.showWhen?.length ?? 0) > 0 ||
    (merged.hideWhen?.length ?? 0) > 0 ||
    (merged.readonlyWhen?.length ?? 0) > 0 ||
    (merged.computeWhen?.length ?? 0) > 0;

  return hasRules ? merged : null;
}

function isNonEmptyRuleSet(rules: FieldRuleSet | null): rules is FieldRuleSet {
  if (!rules) return false;
  return Boolean(
    rules.showWhen?.length ||
      rules.hideWhen?.length ||
      rules.readonlyWhen?.length ||
      rules.computeWhen?.length,
  );
}

@Injectable()
export class FieldRulesService {
  getRulesForSection(
    ratingKey: string,
    tab: string,
    subtab: string,
    config?: RatingRuntimeConfig,
  ): FieldRuleSet | null {
    if (config) {
      return this.resolveSectionRules(ratingKey, tab, subtab, config);
    }
    const generated = loadLaravelGeneratedRules()[subtab];
    const { rules: manual, replaceGenerated } = resolveManualFieldRules(ratingKey, tab, subtab);
    if (replaceGenerated && manual) return manual;
    return mergeRuleSets([generated, manual]);
  }

  private resolveSectionRules(
    ratingKey: string,
    tab: string,
    subtab: string,
    _config: RatingRuntimeConfig,
  ): FieldRuleSet | null {
    const generated = loadLaravelGeneratedRules()[subtab];
    const { rules: manual, replaceGenerated } = resolveManualFieldRules(ratingKey, tab, subtab);
    if (replaceGenerated && manual) return manual;
    return mergeRuleSets([generated, manual]);
  }

  /**
   * Map of `tab/subtab` → rule set for client-side evaluation.
   * Includes every subtab in the rating config that has generated or manual rules.
   */
  buildRulesIndex(ratingKey: string, config: RatingRuntimeConfig): Record<string, FieldRuleSet> {
    const generated = loadLaravelGeneratedRules();
    const index: Record<string, FieldRuleSet> = {};
    const tabs = Array.isArray(config.tabs) ? config.tabs : [];

    for (const tabEntry of tabs) {
      const tabSlug = tabEntry.slug;
      if (!tabSlug) continue;

      for (const sub of getSubtabsForTab(config, tabSlug)) {
        const subSlug = sub.sub_slug;
        if (!subSlug) continue;

        const key = `${tabSlug}/${subSlug}`;
        const gen = generated[subSlug];
        const { rules: manual, replaceGenerated } = resolveManualFieldRules(
          ratingKey,
          tabSlug,
          subSlug,
        );

        const merged =
          replaceGenerated && manual
            ? manual
            : mergeRuleSets([gen, manual]);

        if (isNonEmptyRuleSet(merged)) {
          index[key] = merged;
        }
      }
    }

    return index;
  }
}
