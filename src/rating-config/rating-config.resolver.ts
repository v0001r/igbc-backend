import type {
  RatingConfigFieldDef,
  RatingConfigSubtab,
  RatingRuntimeConfig,
} from "./rating-config.types";

export function getSubtabsForTab(
  config: RatingRuntimeConfig,
  tabSlug: string,
): RatingConfigSubtab[] {
  const map = config.subtabs_by_tab ?? config.subtabs ?? {};
  const list = map[tabSlug];
  return Array.isArray(list) ? list : [];
}

function isFieldRow(x: unknown): x is RatingConfigFieldDef {
  return x !== null && typeof x === "object" && "type" in (x as object);
}

function normalizeFieldList(raw: unknown): RatingConfigFieldDef[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isFieldRow) as RatingConfigFieldDef[];
}

export function getFieldsForTabSubtab(
  config: RatingRuntimeConfig,
  tabSlug: string,
  subSlug: string,
): RatingConfigFieldDef[] {
  const root = config.params ?? {};
  const byTab = root[tabSlug];
  if (byTab !== null && typeof byTab === "object" && !Array.isArray(byTab)) {
    const bySub = (byTab as Record<string, unknown>)[subSlug];
    if (Array.isArray(bySub)) return normalizeFieldList(bySub);
    if (bySub && typeof bySub === "object" && Array.isArray((bySub as { params?: unknown }).params)) {
      return normalizeFieldList((bySub as { params: unknown[] }).params);
    }
  }
  const flat = root[subSlug];
  if (Array.isArray(flat)) return normalizeFieldList(flat);
  if (flat && typeof flat === "object" && Array.isArray((flat as { params?: unknown }).params)) {
    return normalizeFieldList((flat as { params: unknown[] }).params);
  }
  return [];
}

export function fieldIsRequired(f: RatingConfigFieldDef): boolean {
  if (f.required === true) return true;
  if (typeof f.validation === "string" && f.validation.trim() === "required") return true;
  return false;
}

export function initialTabSubtab(config: RatingRuntimeConfig): { tab: string; sub: string } {
  const tabs = Array.isArray(config.tabs) ? config.tabs : [];
  const tab = tabs[0]?.slug ?? "project_details";
  const sub = getSubtabsForTab(config, tab)[0]?.sub_slug ?? "project_details";
  return { tab, sub };
}

export function resolveSubtabTitle(
  config: RatingRuntimeConfig,
  tabSlug: string,
  subSlug: string,
): string {
  const sub = getSubtabsForTab(config, tabSlug).find((s) => s.sub_slug === subSlug);
  return sub?.name ?? "Section";
}
