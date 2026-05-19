import { Injectable, NotFoundException } from "@nestjs/common";
import { readFileSync } from "fs";
import type {
  CertificationSectionDto,
  CertificationWorkspaceResponse,
  RatingRuntimeConfig,
} from "./rating-config.types";
import {
  getRegistryEntry,
  hasConfigForVersion,
  resolveConfigFilePath,
  resolveConfigKey,
} from "./rating-config.registry";
import {
  getFieldsForTabSubtab,
  getSubtabsForTab,
  initialTabSubtab,
  resolveSubtabTitle,
} from "./rating-config.resolver";
import { loadAnnexureBladeRoutes, resolveAnnexure } from "./annexure-registry";
import type { CertificationFormResponse } from "../projects/certification-form.types";
import { FieldRulesService } from "./field-rules/field-rules.service";

@Injectable()
export class RatingConfigService {
  constructor(private readonly fieldRulesService: FieldRulesService) {}

  private readonly configCache = new Map<string, RatingRuntimeConfig>();

  getConfig(configKey: string, versionType: string): RatingRuntimeConfig {
    const cacheKey = `${configKey}::${versionType}`;
    const cached = this.configCache.get(cacheKey);
    if (cached) return cached;

    const filePath = resolveConfigFilePath(configKey, versionType);
    if (!filePath) {
      throw new NotFoundException(`No config for ${configKey} version ${versionType}`);
    }

    const raw = readFileSync(filePath, "utf8");
    const config = JSON.parse(raw) as RatingRuntimeConfig;
    this.configCache.set(cacheKey, config);
    return config;
  }

  resolveKey(input: {
    ratingTypeId?: number | null;
    configKey?: string | null;
    ratingTypeName?: string | null;
    abbreviation?: string | null;
  }): string | null {
    return resolveConfigKey(input);
  }

  hasConfig(configKey: string, versionType: string): boolean {
    return hasConfigForVersion(configKey, versionType);
  }

  getLabel(configKey: string): string {
    return getRegistryEntry(configKey)?.label ?? configKey;
  }

  buildWorkspacePayload(input: {
    projectId: string;
    projectCode: string;
    projectName: string;
    ratingTypeId: number;
    ratingTypeName: string;
    configKey: string;
    versionType: string;
    form: CertificationFormResponse;
  }): CertificationWorkspaceResponse {
    const config = this.getConfig(input.configKey, input.versionType);
    const annexureRoutes = loadAnnexureBladeRoutes();

    return {
      projectId: input.projectId,
      projectCode: input.projectCode,
      projectName: input.projectName,
      projectLabel: `${input.projectCode} / ${input.projectName}`,
      ratingTypeId: input.ratingTypeId,
      ratingTypeName: input.ratingTypeName,
      ratingKey: input.configKey,
      ratingLabel: this.getLabel(input.configKey),
      versionType: input.versionType,
      config,
      form: input.form,
      annexureRoutes,
      fieldRules: this.fieldRulesService.buildRulesIndex(input.configKey, config),
    };
  }

  buildSection(
    configKey: string,
    versionType: string,
    ratingTypeId: number,
    tab: string,
    subtab: string,
  ): CertificationSectionDto {
    const config = this.getConfig(configKey, versionType);
    const routes = loadAnnexureBladeRoutes();
    const fields = getFieldsForTabSubtab(config, tab, subtab);
    const annexure = resolveAnnexure(routes, config, tab, subtab, versionType, ratingTypeId);

    return {
      tab,
      subtab,
      title: resolveSubtabTitle(config, tab, subtab),
      fields,
      annexure,
    };
  }

  getInitialNavigation(config: RatingRuntimeConfig): { tab: string; subtab: string } {
    const { tab, sub } = initialTabSubtab(config);
    return { tab, subtab: sub };
  }

  getSubtabs(config: RatingRuntimeConfig, tabSlug: string) {
    return getSubtabsForTab(config, tabSlug);
  }
}
