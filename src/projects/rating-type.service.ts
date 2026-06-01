import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  getRegistryEntry,
  hasConfigForVersion,
  resolveConfigKey,
} from "../rating-config/rating-config.registry";
import type { RatingConfigEntryMeta } from "../rating-config/rating-config.types";
import { RATING_TYPE_SEED } from "./rating-types.seed";
import { RatingType } from "./rating-type.entity";

export type ResolvedProjectRating = {
  ratingTypeId: number;
  ratingTypeName: string;
  abbreviation: string;
  configKey: string;
  versionType: string;
  entry: RatingConfigEntryMeta;
  ratingType: RatingType;
};

@Injectable()
export class RatingTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(RatingType)
    private readonly ratingTypeRepository: Repository<RatingType>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncCertificationMetadata();
  }

  async findAll(): Promise<RatingType[]> {
    return this.ratingTypeRepository.find({ order: { id: "ASC" } });
  }

  async findById(id: number): Promise<RatingType | null> {
    return this.ratingTypeRepository.findOne({ where: { id } });
  }

  async findByRatingName(ratingName: string): Promise<RatingType | null> {
    const trimmed = ratingName.trim();
    const exact = await this.ratingTypeRepository.findOne({
      where: { ratingName: trimmed },
    });
    if (exact) return exact;

    const all = await this.ratingTypeRepository.find();
    const lower = trimmed.toLowerCase();
    return (
      all.find((r) => r.ratingName.toLowerCase() === lower) ??
      all.find((r) => lower.includes(r.ratingName.toLowerCase().replace(/^igbc\s+/i, ""))) ??
      null
    );
  }

  async findByCategory(categoryId: number): Promise<RatingType[]> {
    return this.ratingTypeRepository.find({
      where: { category: categoryId },
      order: { ratingName: "ASC" },
    });
  }

  hasCertificationConfig(ratingType: RatingType): boolean {
    const configKey = this.resolveConfigKeyForRow(ratingType);
    if (!configKey) return false;
    const version = this.resolveVersionForRow(ratingType, configKey);
    return Boolean(version);
  }

  async resolveForProject(input: {
    ratingTypeId?: number | null;
    ratingSystemName: string;
    versionTypeOverride?: string | null;
  }): Promise<ResolvedProjectRating> {
    let row: RatingType | null = null;

    if (input.ratingTypeId != null) {
      row = await this.findById(input.ratingTypeId);
    }
    if (!row) {
      row = await this.findByRatingName(input.ratingSystemName);
    }
    if (!row) {
      throw new NotFoundException(
        `Unknown rating system "${input.ratingSystemName}". Not found in rating_type table.`,
      );
    }

    const configKey = this.resolveConfigKeyForRow(row);
    if (!configKey) {
      throw new NotFoundException(
        `No certification config is available for rating type id ${row.id} (${row.ratingName})`,
      );
    }

    const entry = getRegistryEntry(configKey);
    if (!entry) {
      throw new NotFoundException(`Rating config "${configKey}" is not registered`);
    }

    const versionType = this.resolveVersionForRow(row, configKey, input.versionTypeOverride);
    if (!versionType) {
      throw new NotFoundException(
        `No certification config version is available for ${row.ratingName} (config ${configKey})`,
      );
    }

    return {
      ratingTypeId: row.id,
      ratingTypeName: row.ratingName,
      abbreviation: row.shortRatingName,
      configKey,
      versionType,
      entry,
      ratingType: row,
    };
  }

  resolveConfigKeyForRow(row: RatingType): string | null {
    if (row.configKey?.trim()) {
      return row.configKey.trim();
    }
    return resolveConfigKey({
      ratingTypeId: row.id,
      ratingTypeName: row.ratingName,
      abbreviation: row.shortRatingName,
    });
  }

  resolveVersionForRow(
    row: RatingType,
    configKey: string,
    versionOverride?: string | null,
  ): string | null {
    if (versionOverride?.trim() && hasConfigForVersion(configKey, versionOverride.trim())) {
      return versionOverride.trim();
    }

    const versions = this.normalizedVersionTypes(row);
    if (row.defaultVersion?.trim() && versions.includes(row.defaultVersion.trim())) {
      const preferred = row.defaultVersion.trim();
      if (hasConfigForVersion(configKey, preferred)) return preferred;
    }

    if (versions.includes("3") && hasConfigForVersion(configKey, "3")) {
      return "3";
    }

    for (const version of versions) {
      if (hasConfigForVersion(configKey, version)) {
        return version;
      }
    }

    const entry = getRegistryEntry(configKey);
    if (entry && hasConfigForVersion(configKey, entry.defaultVersion)) {
      return entry.defaultVersion;
    }

    return null;
  }

  private normalizedVersionTypes(row: RatingType): string[] {
    const fromDb = row.versionTypes?.filter((v) => typeof v === "string" && v.trim()) ?? [];
    if (fromDb.length) return fromDb.map((v) => v.trim());

    const entry = getRegistryEntry(this.resolveConfigKeyForRow(row) ?? "");
    if (entry) {
      return Object.keys(entry.versionPaths);
    }

    return ["3"];
  }

  /** Upsert config_key / version_types / default_version from seed onto existing rating_type rows. */
  async syncCertificationMetadata(): Promise<void> {
    const count = await this.ratingTypeRepository.count();
    if (count === 0) {
      await this.seedFromCatalog();
      return;
    }

    for (const seed of RATING_TYPE_SEED) {
      const existing = await this.ratingTypeRepository.findOne({ where: { id: seed.id } });
      if (!existing) continue;

      const versionTypes = seed.versionTypes.length ? seed.versionTypes : ["3"];
      const defaultVersion =
        seed.id === 1 ? "4" : versionTypes.includes("3") ? "3" : versionTypes[0];

      await this.ratingTypeRepository.save(
        this.ratingTypeRepository.merge(existing, {
          configKey: seed.configKey ?? existing.configKey ?? null,
          versionTypes: existing.versionTypes?.length ? existing.versionTypes : versionTypes,
          defaultVersion: existing.defaultVersion ?? defaultVersion,
        }),
      );
    }
  }

  private async seedFromCatalog(): Promise<void> {
    for (const seed of RATING_TYPE_SEED) {
      const versionTypes = seed.versionTypes.length ? seed.versionTypes : ["3"];
      const defaultVersion =
        seed.id === 1 ? "4" : versionTypes.includes("3") ? "3" : versionTypes[0];

      await this.ratingTypeRepository.save(
        this.ratingTypeRepository.create({
          id: seed.id,
          ratingName: seed.name,
          shortRatingName: seed.abbreviation,
          category: this.defaultCategoryForRating(seed.id),
          type: ["New / Upcoming"],
          specifics: [],
          configKey: seed.configKey,
          versionTypes,
          defaultVersion,
        }),
      );
    }
  }

  private defaultCategoryForRating(ratingTypeId: number): number {
    const map: Record<number, number> = {
      1: 2,
      2: 1,
      3: 3,
      4: 2,
      5: 2,
    };
    return map[ratingTypeId] ?? 2;
  }
}
