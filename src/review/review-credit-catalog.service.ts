import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RatingConfigService } from "../rating-config/rating-config.service";
import { getSubtabsForTab } from "../rating-config/rating-config.resolver";
import { Project } from "../projects/project.entity";

export type CreditCatalogItem = {
  tab: string;
  subtab: string;
  tabTitle: string;
  subtabTitle: string;
  maxPoints: number;
};

@Injectable()
export class ReviewCreditCatalogService {
  constructor(
    private readonly ratingConfigService: RatingConfigService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  private resolveConfigKeyForProject(project: Project): string | null {
    return this.ratingConfigService.resolveKey({
      ratingTypeId: project.ratingTypeId,
      ratingTypeName: project.ratingSystem,
    });
  }

  async listCreditsForProject(projectId: number): Promise<CreditCatalogItem[]> {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) return [];

    const configKey = this.resolveConfigKeyForProject(project);
    if (!configKey) {
      throw new BadRequestException(
        `No rating config found for "${project.ratingSystem}" (project ${projectId})`,
      );
    }

    const versionType = project.versionType?.trim() || "3";
    const config = this.ratingConfigService.getConfig(configKey, versionType);
    const tabs = Array.isArray(config.tabs) ? config.tabs : [];
    const items: CreditCatalogItem[] = [];

    for (const tabDef of tabs) {
      const tab = tabDef.slug;
      const tabTitle = tabDef.name ?? tab;
      const subtabs = getSubtabsForTab(config, tab);
      for (const subtabDef of subtabs) {
        const subtabPoints =
          typeof subtabDef.points === "number" ? subtabDef.points : undefined;
        const tabPoints = typeof tabDef.points === "number" ? tabDef.points : 0;
        items.push({
          tab,
          subtab: subtabDef.sub_slug,
          tabTitle,
          subtabTitle: subtabDef.name ?? subtabDef.sub_slug,
          maxPoints: subtabPoints ?? tabPoints,
        });
      }
    }

    return items;
  }

  async assertCreditExists(projectId: number, tab: string, subtab: string) {
    const credit = await this.getCredit(projectId, tab, subtab);
    if (!credit) {
      throw new BadRequestException(`Credit ${tab}/${subtab} not found in rating config`);
    }
    return credit;
  }

  async getCredit(projectId: number, tab: string, subtab: string) {
    const credits = await this.listCreditsForProject(projectId);
    return credits.find((c) => c.tab === tab && c.subtab === subtab) ?? null;
  }

  async getMaxPoints(projectId: number, tab: string, subtab: string) {
    const credit = await this.getCredit(projectId, tab, subtab);
    return credit?.maxPoints ?? 0;
  }
}
