import { existsSync } from "fs";
import { join } from "path";
import type { RatingConfigEntryMeta } from "./rating-config.types";

function resolveConfigRoot(): string {
  const candidates = [
    join(__dirname, "configs"),
    join(process.cwd(), "src", "rating-config", "configs"),
    join(process.cwd(), "dist", "rating-config", "configs"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return join(process.cwd(), "src", "rating-config", "configs");
}

const CONFIG_ROOT = resolveConfigRoot();

/** Registry: rating configKey → JSON file paths per version (under `configs/`). */
export const RATING_CONFIG_REGISTRY: RatingConfigEntryMeta[] = [
  {
    key: "green_homes",
    label: "IGBC Green Homes",
    registerId: "green-homes",
    ratingTypeIds: [2],
    abbreviations: ["GH"],
    defaultVersion: "3",
    versionPaths: {
      "3": join(CONFIG_ROOT, "greenhomes", "config.json"),
    },
  },
  {
    key: "green_new_buildings",
    label: "IGBC Green New Buildings",
    registerId: "green-new",
    ratingTypeIds: [1],
    abbreviations: ["GNB"],
    defaultVersion: "4",
    versionPaths: {
      "4": join(CONFIG_ROOT, "newbuilding", "newbuilding.json"),
    },
  },
  {
    key: "green_existing_buildings",
    label: "IGBC Green Existing Buildings",
    registerId: "green-existing",
    ratingTypeIds: [4],
    abbreviations: ["EB"],
    defaultVersion: "3",
    versionPaths: {
      "3": join(CONFIG_ROOT, "existingbuilding", "existingbuilding.json"),
    },
  },
  {
    key: "green_factories",
    label: "IGBC Green Factory Buildings",
    registerId: "green-factory",
    ratingTypeIds: [3],
    abbreviations: ["GFB"],
    defaultVersion: "3",
    versionPaths: {
      "3": join(CONFIG_ROOT, "greenFactories", "version3", "greenFactories.json"),
      "3.3.1": join(CONFIG_ROOT, "greenFactories", "version3.3.1", "greenFactories.v331.config.json"),
    },
  },
  {
    key: "green_interiors",
    label: "IGBC Green Interiors",
    registerId: "green-interiors",
    ratingTypeIds: [5],
    abbreviations: ["GI"],
    defaultVersion: "3",
    versionPaths: {
      "3": join(CONFIG_ROOT, "greeninteriors", "greeninteriors.json"),
    },
  },
];

const byKey = new Map(RATING_CONFIG_REGISTRY.map((e) => [e.key, e]));
const byRatingTypeId = new Map<number, RatingConfigEntryMeta>();
const byAbbreviation = new Map<string, RatingConfigEntryMeta>();

for (const entry of RATING_CONFIG_REGISTRY) {
  for (const id of entry.ratingTypeIds ?? []) {
    byRatingTypeId.set(id, entry);
  }
  for (const abbr of entry.abbreviations ?? []) {
    byAbbreviation.set(abbr.toUpperCase(), entry);
  }
}

export function getRegistryEntry(key: string): RatingConfigEntryMeta | undefined {
  return byKey.get(key);
}

export function resolveConfigKey(input: {
  ratingTypeId?: number | null;
  configKey?: string | null;
  ratingTypeName?: string | null;
  abbreviation?: string | null;
}): string | null {
  if (input.configKey && byKey.has(input.configKey)) {
    return input.configKey;
  }
  if (input.ratingTypeId != null && byRatingTypeId.has(input.ratingTypeId)) {
    return byRatingTypeId.get(input.ratingTypeId)!.key;
  }
  if (input.abbreviation) {
    const fromAbbr = byAbbreviation.get(input.abbreviation.toUpperCase());
    if (fromAbbr) return fromAbbr.key;
  }
  if (input.ratingTypeName) {
    const lower = input.ratingTypeName.toLowerCase();
    for (const entry of RATING_CONFIG_REGISTRY) {
      if (entry.label.toLowerCase() === lower) return entry.key;
    }
    for (const entry of RATING_CONFIG_REGISTRY) {
      if (lower.includes(entry.label.toLowerCase().replace("igbc ", ""))) return entry.key;
    }
  }
  return null;
}

export function hasConfigForVersion(key: string, versionType: string): boolean {
  const entry = byKey.get(key);
  if (!entry) return false;
  return Boolean(entry.versionPaths[versionType] ?? entry.versionPaths[entry.defaultVersion]);
}

export function resolveConfigFilePath(key: string, versionType: string): string | null {
  const entry = byKey.get(key);
  if (!entry) return null;
  return entry.versionPaths[versionType] ?? entry.versionPaths[entry.defaultVersion] ?? null;
}
