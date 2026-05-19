import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { AnnexureBladeRoute, ResolvedAnnexureDto } from "./rating-config.types";
import { getFieldsForTabSubtab } from "./rating-config.resolver";
import type { RatingRuntimeConfig } from "./rating-config.types";

const INTERIORS_RATING_TYPE_ID = 5;

let cachedRoutes: AnnexureBladeRoute[] | null = null;

function resolveAnnexureRoutesPath(): string {
  const candidates = [
    join(__dirname, "data", "annexure-blade-routes.json"),
    join(process.cwd(), "src", "rating-config", "data", "annexure-blade-routes.json"),
    join(process.cwd(), "dist", "rating-config", "data", "annexure-blade-routes.json"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return candidates[0];
}

export function loadAnnexureBladeRoutes(): AnnexureBladeRoute[] {
  if (cachedRoutes) return cachedRoutes;
  const raw = readFileSync(resolveAnnexureRoutesPath(), "utf8");
  cachedRoutes = JSON.parse(raw) as AnnexureBladeRoute[];
  return cachedRoutes;
}

export function annexVersionMatches(projectVersion: string, routeVersion: string): boolean {
  if (projectVersion === routeVersion) return true;
  if (routeVersion === "3" && projectVersion.startsWith("3")) return true;
  if (routeVersion === "4" && projectVersion.startsWith("4")) return true;
  return false;
}

function isAnnexSubtabSlug(subSlug: string): boolean {
  return subSlug.startsWith("annex") || subSlug.includes("annexure") || subSlug.includes("epi_");
}

export function resolveAnnexureRoute(
  routes: AnnexureBladeRoute[],
  tab: string,
  subtab: string,
  projectVersion: string,
  ratingTypeId: number,
): AnnexureBladeRoute | null {
  const candidates = routes.filter(
    (r) =>
      r.tab === tab &&
      r.subtab === subtab &&
      annexVersionMatches(projectVersion, r.version) &&
      r.bladeInclude,
  );

  for (const route of candidates) {
    if (route.ratingTypeId5Only && ratingTypeId !== INTERIORS_RATING_TYPE_ID) continue;
    if (route.ratingTypeExclude5 && ratingTypeId === INTERIORS_RATING_TYPE_ID) continue;
    return route;
  }
  return null;
}

export function resolveAnnexure(
  routes: AnnexureBladeRoute[],
  config: RatingRuntimeConfig,
  tab: string,
  subtab: string,
  projectVersion: string,
  ratingTypeId: number,
): ResolvedAnnexureDto {
  const fields = getFieldsForTabSubtab(config, tab, subtab);
  const hasConfigFields = fields.length > 0;
  const route = resolveAnnexureRoute(routes, tab, subtab, projectVersion, ratingTypeId);

  if (!route?.bladeInclude) {
    if (isAnnexSubtabSlug(subtab) && !hasConfigFields) {
      return {
        tab,
        subtab,
        bladeInclude: "(unknown — not in index.blade.php)",
        customUiOnly: true,
      };
    }
    return null;
  }

  return {
    tab,
    subtab,
    bladeInclude: route.bladeInclude,
    customUiOnly: !hasConfigFields,
  };
}
