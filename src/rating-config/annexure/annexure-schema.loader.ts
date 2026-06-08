import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import type { AnnexureBladeRoute } from "../rating-config.types";
import { resolveAnnexureRoute } from "../annexure-registry";
import { getSubtabsForTab, resolveSubtabTitle } from "../rating-config.resolver";
import type { RatingRuntimeConfig } from "../rating-config.types";
import type { AnnexureSchemaDefinition } from "./annexure-schema.types";

function resolveAnnexuresRoot(): string {
  const candidates = [
    join(__dirname, "..", "data", "annexures"),
    join(process.cwd(), "src", "rating-config", "data", "annexures"),
    join(process.cwd(), "dist", "rating-config", "data", "annexures"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return candidates[0];
}

function resolveGreenhomeDataRoot(): string | null {
  const candidates = [
    join(__dirname, "..", "data", "greenhome"),
    join(process.cwd(), "src", "rating-config", "data", "greenhome"),
    join(process.cwd(), "dist", "rating-config", "data", "greenhome"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function resolveGreeninteriorsDataRoot(): string | null {
  const candidates = [
    join(__dirname, "..", "data", "greeninteriors"),
    join(process.cwd(), "src", "rating-config", "data", "greeninteriors"),
    join(process.cwd(), "dist", "rating-config", "data", "greeninteriors"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

type LpdBaselineCatalog = {
  entries?: { slug: string; label: string; baseline: number }[];
};

type LocationCatalog = {
  entries?: { slug: string; label: string; latitude: string; climatic_zone: string }[];
};

function enrichSchemaFromGreenhomeCatalog(
  parsed: AnnexureSchemaDefinition,
  schemaFilePath: string,
): AnnexureSchemaDefinition {
  if (!parsed.baselineCatalogPath) return parsed;
  // Schema lives at `greenhome/{version}/{tab}/annex_*.json`; shared catalogs under `{version}/shared/`.
  const versionDir = dirname(dirname(schemaFilePath));
  const catalogPath = join(versionDir, parsed.baselineCatalogPath);
  if (!existsSync(catalogPath)) return parsed;

  const catalogRaw = JSON.parse(readFileSync(catalogPath, "utf8")) as LpdBaselineCatalog | LocationCatalog;
  const entries = catalogRaw.entries ?? [];
  const lookupMaps: Record<string, Record<string, number | string>> = {
    ...(parsed.lookupMaps ?? {}),
  };
  let next = parsed;

  const first = entries[0] as { baseline?: number; latitude?: string };
  if (first && "baseline" in first && first.baseline != null) {
    const lpdBaselines: Record<string, number> = {};
    const selectOptions: Record<string, string> = { "": "Select Space Type" };
    for (const e of entries) {
      if (!e || !("baseline" in e)) continue;
      lpdBaselines[e.slug] = e.baseline;
      selectOptions[e.slug] = e.label;
    }
    if (parsed.table?.columns?.length) {
      const columns = parsed.table.columns.map((c) =>
        c.param === "applicable_space_lpd" ? { ...c, options: selectOptions } : c,
      );
      next = { ...next, table: { ...parsed.table, columns } };
    }
    lookupMaps.lpdBaselines = lpdBaselines;

    if (parsed.renderMode === "lpdBuildingAreaMethod" && parsed.lpdBuildingAreaLayout) {
      const typologyBaselines = entries
        .filter(
          (e): e is { slug: string; label: string; baseline: number } =>
            Boolean(e && "baseline" in e && typeof (e as { baseline?: number }).baseline === "number"),
        )
        .map((e) => ({ slug: e.slug, label: e.label, baseline: e.baseline }));
      const typologyOptions: Record<string, string> = { "": "Select" };
      for (const e of typologyBaselines) typologyOptions[e.slug] = e.label;
      lookupMaps.lpdBuildingTypology = lpdBaselines;
      next = {
        ...next,
        lpdBuildingAreaLayout: {
          ...parsed.lpdBuildingAreaLayout,
          typologyBaselines,
          typologyOptions,
        },
      };
    }

    if (parsed.renderMode === "lpdSpaceFunctionMethod" && parsed.lpdSpaceFunctionLayout) {
      const spaceBaselines = entries
        .filter(
          (e): e is { slug: string; label: string; baseline: number } =>
            Boolean(e && "baseline" in e && typeof (e as { baseline?: number }).baseline === "number"),
        )
        .map((e) => ({ slug: e.slug, label: e.label, baseline: e.baseline }));
      const spaceTypeOptions: Record<string, string> = { "": "Select" };
      for (const e of spaceBaselines) spaceTypeOptions[e.slug] = e.label;
      lookupMaps.lpdSpaceBaselines = lpdBaselines;
      next = {
        ...next,
        lpdSpaceFunctionLayout: {
          ...parsed.lpdSpaceFunctionLayout,
          spaceBaselines,
          spaceTypeOptions,
        },
      };
    }
  }

  if (first && "latitude" in first) {
    const locations: Record<string, { latitude: string; climatic_zone: string }> = {};
    const locationOptions: Record<string, string> = { "": "Select Location" };
    for (const e of entries) {
      if (!e || !("latitude" in e)) continue;
      locations[e.slug] = { latitude: e.latitude, climatic_zone: e.climatic_zone };
      locationOptions[e.slug] = e.label;
    }
    lookupMaps.locations = locations as unknown as Record<string, number | string>;
    if (next.dwellingLayout?.globalFields) {
      const globalFields = next.dwellingLayout.globalFields.map((f) =>
        f.param === "location_select" ? { ...f, options: locationOptions } : f,
      );
      next = { ...next, dwellingLayout: { ...next.dwellingLayout, globalFields } };
    }
  }

  const firstCoeff = entries[0] as { coefficient?: number };
  if (firstCoeff && "coefficient" in firstCoeff && firstCoeff.coefficient != null) {
    const runoffCoefficients: Record<string, number> = {};
    const selectOptions: Record<string, string> = { "": "Select Surface Type" };
    for (const e of entries) {
      const row = e as unknown as { slug: string; label: string; coefficient: number };
      if (!row?.slug) continue;
      runoffCoefficients[row.slug] = row.coefficient;
      selectOptions[row.slug] = row.label;
    }
    if (next.rainwaterLayout?.surfaceTable?.columns?.length) {
      const columns = next.rainwaterLayout.surfaceTable.columns.map((c) =>
        c.param === "surface" ? { ...c, options: { ...selectOptions, ...(c.options ?? {}) } } : c,
      );
      next = {
        ...next,
        rainwaterLayout: { ...next.rainwaterLayout, surfaceTable: { ...next.rainwaterLayout.surfaceTable, columns } },
      };
    }
    lookupMaps.runoffCoefficients = runoffCoefficients;
  }

  const firstTarget = entries[0] as { target?: number };
  if (firstTarget && "target" in firstTarget && firstTarget.target != null) {
    const glazingTargets: Record<string, number> = {};
    const selectOptions: Record<string, string> = { "": "Select" };
    for (const e of entries) {
      const row = e as unknown as { slug: string; label: string; target: number };
      if (!row?.slug || row.target == null) continue;
      glazingTargets[row.slug] = row.target;
      selectOptions[row.slug] = row.label;
    }
    lookupMaps.glazingTargets = glazingTargets;
    if (next.dwellingLayout?.orientationColumns?.length) {
      const orientationColumns = next.dwellingLayout.orientationColumns.map((c) =>
        c.param === "type_reg_occ" ? { ...c, options: selectOptions } : c,
      );
      next = { ...next, dwellingLayout: { ...next.dwellingLayout, orientationColumns } };
    }
  }

  return { ...next, lookupMaps };
}

function enrichWasteMaterialOptions(
  parsed: AnnexureSchemaDefinition,
  schemaFilePath: string,
): AnnexureSchemaDefinition {
  const catalogPath = parsed.wasteManagementLayout?.materialOptionsCatalogPath;
  if (!catalogPath || parsed.renderMode !== "wasteManagement") return parsed;
  const versionDir = dirname(dirname(schemaFilePath));
  const fullPath = join(versionDir, catalogPath);
  if (!existsSync(fullPath)) return parsed;
  const materialOptions = JSON.parse(readFileSync(fullPath, "utf8")) as Record<string, string>;
  return {
    ...parsed,
    wasteManagementLayout: {
      ...parsed.wasteManagementLayout!,
      materialOptions,
    },
  };
}

export function resolveLaravelAnnexureBladesDir(): string | null {
  const candidates = [
    join(__dirname, "..", "data", "laravel-annexure-blades"),
    join(process.cwd(), "src", "rating-config", "data", "laravel-annexure-blades"),
    join(process.cwd(), "dist", "rating-config", "data", "laravel-annexure-blades"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function walkJsonFiles(dir: string, baseRel: string, out: { rel: string; full: string }[]): void {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = baseRel ? `${baseRel}/${name}` : name;
    const st = statSync(full, { throwIfNoEntry: false });
    if (!st) continue;
    if (st.isDirectory()) {
      walkJsonFiles(full, rel, out);
    } else if (name.endsWith(".json")) {
      out.push({ rel: rel.replace(/\\/g, "/").replace(/\.json$/, ""), full });
    }
  }
}

/** Last segment of `.rating.greenhomes.rwh-one` → `rwh-one` */
export function bladeIncludeToSegment(bladeInclude: string): string {
  const trimmed = bladeInclude.replace(/^\./, "");
  const parts = trimmed.split(".");
  return parts[parts.length - 1] ?? "annex";
}

/** Match Laravel blade on disk (case-insensitive base name). */
export function findBladeFileForInclude(bladeInclude: string): string | null {
  const seg = bladeIncludeToSegment(bladeInclude);
  const dir = resolveLaravelAnnexureBladesDir();
  if (!dir) return null;
  const files = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".blade.php"));
  const lower = seg.toLowerCase();
  const exact = files.find((f) => f.replace(/\.blade\.php$/i, "").toLowerCase() === lower);
  if (exact) return exact;
  const fuzzy = files.find((f) => f.toLowerCase().includes(lower));
  return fuzzy ?? null;
}

function loadOneAnnexureFile(
  full: string,
  ratingTypeId: number | undefined,
): AnnexureSchemaDefinition | null {
  try {
    const raw = readFileSync(full, "utf8");
    let parsed = JSON.parse(raw) as AnnexureSchemaDefinition;
    parsed = enrichSchemaFromGreenhomeCatalog(parsed, full);
    parsed = enrichWasteMaterialOptions(parsed, full);
    const hasTable = (parsed.table?.columns?.length ?? 0) > 0;
    const hasComparison =
      parsed.renderMode === "comparison" && (parsed.comparisonLayout?.sections?.length ?? 0) > 0;
    const hasDwelling =
      parsed.renderMode === "dwelling" && Boolean(parsed.dwellingLayout?.orientationColumns?.length);
    const hasRainwater =
      parsed.renderMode === "rainwater" && Boolean(parsed.rainwaterLayout?.rainfall);
    const hasWaterEfficiency =
      parsed.renderMode === "waterEfficiency" &&
      (parsed.waterEfficiencyLayout?.presetRows?.length ?? 0) > 0;
    const hasGiWcTwo =
      parsed.renderMode === "greenInteriorsWcTwo" &&
      (parsed.greenInteriorsWcTwoLayout?.presetRows?.length ?? 0) > 0;
    const hasConditionedSpaces =
      parsed.renderMode === "conditionedSpaces" &&
      Boolean(parsed.conditionedSpacesLayout?.sourceAnnex?.subtab);
    const hasNaturalVentilation =
      parsed.renderMode === "naturalVentilation" &&
      Boolean(parsed.naturalVentilationLayout?.sourceAnnex?.subtab);
    const hasLpdBuildingAreaMethod =
      parsed.renderMode === "lpdBuildingAreaMethod" &&
      Boolean(parsed.lpdBuildingAreaLayout?.sourceAnnex?.subtab);
    const hasLpdSpaceFunctionMethod =
      parsed.renderMode === "lpdSpaceFunctionMethod" &&
      Boolean(parsed.lpdSpaceFunctionLayout?.sourceAnnex?.subtab);
    const hasOnsiteRenewableEnergy =
      parsed.renderMode === "onsiteRenewableEnergy" &&
      Boolean(parsed.onsiteRenewableLayout);
    const hasMasterMaterial =
      parsed.renderMode === "masterMaterial" &&
      Boolean(parsed.masterMaterialLayout?.materialOptions);
    const hasAcFreshAir =
      parsed.renderMode === "acFreshAir" &&
      Boolean(parsed.acFreshAirLayout?.sourceAnnex?.subtab);
    const hasDaylightNoise =
      parsed.renderMode === "daylightNoise" &&
      Boolean(parsed.daylightNoiseLayout?.sourceAnnex?.subtab);
    const hasOccupantWellbeing =
      parsed.renderMode === "occupantWellbeing" &&
      Boolean(parsed.occupantWellbeingLayout);
    const hasWasteManagement =
      parsed.renderMode === "wasteManagement" &&
      Boolean(parsed.wasteManagementLayout?.sourceAnnex?.subtab);
    const hasWaterBalance =
      parsed.renderMode === "waterBalance" &&
      (parsed.waterBalanceLayout?.sections?.length ?? 0) > 0;
    const hasWastewaterReuse =
      parsed.renderMode === "wastewaterReuse" &&
      (parsed.wastewaterReuseLayout?.reuseSection?.rows?.length ?? 0) > 0;
    if (
      !parsed?.id ||
      (!hasTable &&
        !hasComparison &&
        !hasDwelling &&
        !hasRainwater &&
        !hasWaterEfficiency &&
        !hasGiWcTwo &&
        !hasConditionedSpaces &&
        !hasNaturalVentilation &&
        !hasLpdBuildingAreaMethod &&
        !hasLpdSpaceFunctionMethod &&
        !hasOnsiteRenewableEnergy &&
        !hasMasterMaterial &&
        !hasAcFreshAir &&
        !hasDaylightNoise &&
        !hasOccupantWellbeing &&
        !hasWasteManagement &&
        !hasWaterBalance &&
        !hasWastewaterReuse)
    )
      return null;
    if (
      parsed.ratingTypeIds?.length &&
      ratingTypeId != null &&
      !parsed.ratingTypeIds.includes(ratingTypeId)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function loadJsonAnnexureSchemas(
  ratingKey: string,
  versionType: string,
  ratingTypeId?: number,
): Record<string, AnnexureSchemaDefinition> {
  const index: Record<string, AnnexureSchemaDefinition> = {};

  const roots: string[] = [];
  const annexRoot = join(resolveAnnexuresRoot(), ratingKey, versionType);
  if (existsSync(annexRoot)) roots.push(annexRoot);

  const ghRoot = resolveGreenhomeDataRoot();
  if (ratingKey === "green_homes" && ghRoot) {
    const ghVersion = join(ghRoot, versionType);
    if (existsSync(ghVersion)) roots.push(ghVersion);
  }

  const giRoot = resolveGreeninteriorsDataRoot();
  if (ratingKey === "green_interiors" && giRoot) {
    const giVersion = join(giRoot, versionType);
    if (existsSync(giVersion)) roots.push(giVersion);
  }

  for (const base of roots) {
    const files: { rel: string; full: string }[] = [];
    walkJsonFiles(base, "", files);
    for (const { rel, full } of files) {
      if (rel.includes("/shared/")) continue;
      const parts = rel.split("/").filter(Boolean);
      if (parts.length < 2) continue;
      const tab = parts[0];
      const subtab = parts.slice(1).join("/");
      const key = `${tab}/${subtab}`;
      const parsed = loadOneAnnexureFile(full, ratingTypeId);
      if (parsed) index[key] = parsed;
    }
  }

  return index;
}

function buildReferenceStub(
  config: RatingRuntimeConfig,
  ratingKey: string,
  versionType: string,
  tab: string,
  subtab: string,
  route: AnnexureBladeRoute,
): AnnexureSchemaDefinition {
  const title = resolveSubtabTitle(config, tab, subtab);
  const refFile = findBladeFileForInclude(route.bladeInclude ?? "");
  const key = `${tab}/${subtab}`;
  const desc =
    "Interactive editor is not wired for this annex yet. Laravel Blade templates have been removed from this repo; add a JSON schema under data/greenhome/, data/greeninteriors/, or data/annexures/ to enable the MERN editor.";
  return {
    id: `ref_${key.replace(/\//g, "__")}`,
    title,
    schemaVersion: 1,
    renderMode: "reference",
    bladeInclude: route.bladeInclude,
    referenceFile: refFile,
    referenceDescription: desc,
    table: { columns: [] },
    rowPipeline: [],
    scalarPipeline: [],
    scalarParams: [],
  };
}

/**
 * JSON schemas from `data/annexures/{ratingKey}/{version}/` (all nested `*.json` files)
 * plus **reference** stubs for every config section that has a Laravel route but no JSON yet.
 */
export function buildAnnexureSchemaIndex(
  ratingKey: string,
  versionType: string,
  ratingTypeId: number | undefined,
  config: RatingRuntimeConfig,
  routes: AnnexureBladeRoute[],
): Record<string, AnnexureSchemaDefinition> {
  const merged = loadJsonAnnexureSchemas(ratingKey, versionType, ratingTypeId);
  const rt = ratingTypeId ?? -1;

  for (const t of config.tabs ?? []) {
    const tab = t.slug;
    for (const sub of getSubtabsForTab(config, tab)) {
      const subtab = sub.sub_slug;
      if (!subtab) continue;
      const key = `${tab}/${subtab}`;
      const picked = resolveAnnexureRoute(routes, tab, subtab, versionType, rt);
      if (!picked?.bladeInclude) continue;

      const existing = merged[key];
      const hasFullEditor =
        (existing?.table?.columns?.length ?? 0) > 0 ||
        (existing?.renderMode === "comparison" &&
          (existing?.comparisonLayout?.sections?.length ?? 0) > 0) ||
        (existing?.renderMode === "dwelling" &&
          Boolean(existing?.dwellingLayout?.orientationColumns?.length)) ||
        (existing?.renderMode === "rainwater" &&
          Boolean(existing?.rainwaterLayout?.rainfall)) ||
        (existing?.renderMode === "waterEfficiency" &&
          (existing?.waterEfficiencyLayout?.presetRows?.length ?? 0) > 0) ||
        (existing?.renderMode === "greenInteriorsWcTwo" &&
          (existing?.greenInteriorsWcTwoLayout?.presetRows?.length ?? 0) > 0) ||
        (existing?.renderMode === "conditionedSpaces" &&
          Boolean(existing?.conditionedSpacesLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "naturalVentilation" &&
          Boolean(existing?.naturalVentilationLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "lpdBuildingAreaMethod" &&
          Boolean(existing?.lpdBuildingAreaLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "lpdSpaceFunctionMethod" &&
          Boolean(existing?.lpdSpaceFunctionLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "onsiteRenewableEnergy" &&
          Boolean(existing?.onsiteRenewableLayout)) ||
        (existing?.renderMode === "masterMaterial" &&
          Boolean(existing?.masterMaterialLayout?.materialOptions)) ||
        (existing?.renderMode === "acFreshAir" &&
          Boolean(existing?.acFreshAirLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "daylightNoise" &&
          Boolean(existing?.daylightNoiseLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "occupantWellbeing" &&
          Boolean(existing?.occupantWellbeingLayout)) ||
        (existing?.renderMode === "wasteManagement" &&
          Boolean(existing?.wasteManagementLayout?.sourceAnnex?.subtab)) ||
        (existing?.renderMode === "waterBalance" &&
          (existing?.waterBalanceLayout?.sections?.length ?? 0) > 0) ||
        (existing?.renderMode === "wastewaterReuse" &&
          (existing?.wastewaterReuseLayout?.reuseSection?.rows?.length ?? 0) > 0) ||
        Boolean(existing?.ventilationSummary?.sources?.length);
      if (hasFullEditor) continue;

      merged[key] = buildReferenceStub(config, ratingKey, versionType, tab, subtab, picked);
    }
  }

  return merged;
}
