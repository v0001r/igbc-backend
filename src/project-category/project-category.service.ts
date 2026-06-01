import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { RatingType } from "../projects/rating-type.entity";
import { RatingTypeService } from "../projects/rating-type.service";

export interface ProjectCategoryItem {
  id: number;
  name: string;
}

export interface RatingSystemItem {
  id: number;
  categoryId: number;
  ratingName: string;
  shortRatingName: string;
  type: string[];
  specifics: string[];
  configKey: string | null;
  versionTypes: string[];
  defaultVersion: string | null;
  hasCertificationConfig: boolean;
  fees: {
    annual: number;
    founding: number;
    nonMember: number;
  };
}

interface RatingSystemCatalogItem {
  id: number;
  categoryId: number;
  ratingName: string;
  shortRatingName: string;
  type: string[];
  specifics: string[];
  fees: {
    annual: number;
    founding: number;
    nonMember: number;
  };
}

@Injectable()
export class ProjectCategoryService {
  constructor(private readonly ratingTypeService: RatingTypeService) {}

  getProjectCategories() {
    const jsonPath = this.resolveJsonPath();
    const content = readFileSync(jsonPath, "utf8");
    const categories = JSON.parse(content) as ProjectCategoryItem[];
    return {
      categories,
    };
  }

  async getRatingSystemsByCategory(categoryId: number) {
    const categories = this.readCategories();
    const category = categories.find((item) => item.id === categoryId);
    const catalogItems = this.readRatingSystems().filter((item) => item.categoryId === categoryId);
    const rows = await this.ratingTypeService.findAll();
    const rowsById = new Map(rows.map((row) => [row.id, row]));
    const rowsByRatingName = new Map(rows.map((row) => [row.ratingName, row]));

    const ratingSystems: RatingSystemItem[] = catalogItems.map((item) => {
      const row = rowsById.get(item.id) ?? rowsByRatingName.get(item.ratingName);
      const metadataSource = row ?? this.catalogItemToRatingType(item);

      return {
        id: item.id,
        categoryId: item.categoryId,
        ratingName: item.ratingName,
        shortRatingName: item.shortRatingName,
        type: Array.isArray(item.type) ? item.type : [],
        specifics: Array.isArray(item.specifics) ? item.specifics : [],
        configKey: this.ratingTypeService.resolveConfigKeyForRow(metadataSource),
        versionTypes: metadataSource.versionTypes ?? ["3"],
        defaultVersion: metadataSource.defaultVersion ?? null,
        hasCertificationConfig: this.ratingTypeService.hasCertificationConfig(metadataSource),
        fees: {
          annual: Number(item.fees?.annual ?? 25000),
          founding: Number(item.fees?.founding ?? 25000),
          nonMember: Number(item.fees?.nonMember ?? 30000),
        },
      };
    });

    return {
      categoryId,
      categoryName: category?.name ?? null,
      ratingSystems,
    };
  }

  private readCategories() {
    const content = readFileSync(this.resolveCategoriesJsonPath(), "utf8");
    return JSON.parse(content) as ProjectCategoryItem[];
  }

  private readRatingSystems() {
    const content = readFileSync(this.resolveRatingSystemsJsonPath(), "utf8");
    return JSON.parse(content) as RatingSystemCatalogItem[];
  }

  private resolveJsonPath() {
    return this.resolveCategoriesJsonPath();
  }

  private resolveCategoriesJsonPath() {
    const sourcePath = join(
      process.cwd(),
      "src",
      "project-category",
      "data",
      "project-categories.json",
    );
    const distPath = join(
      process.cwd(),
      "dist",
      "project-category",
      "data",
      "project-categories.json",
    );
    return existsSync(sourcePath) ? sourcePath : distPath;
  }

  private resolveRatingSystemsJsonPath() {
    const sourcePath = join(
      process.cwd(),
      "src",
      "project-category",
      "data",
      "rating-systems.json",
    );
    const distPath = join(
      process.cwd(),
      "dist",
      "project-category",
      "data",
      "rating-systems.json",
    );
    return existsSync(sourcePath) ? sourcePath : distPath;
  }

  private catalogItemToRatingType(item: RatingSystemCatalogItem): RatingType {
    return {
      id: item.id,
      ratingName: item.ratingName,
      shortRatingName: item.shortRatingName,
      category: item.categoryId,
      type: item.type,
      specifics: item.specifics,
      nonMemberRegFee: String(item.fees?.nonMember ?? 30000),
      igbcAnnualRegFee: String(item.fees?.annual ?? 25000),
      igbcFoundingRegFee: String(item.fees?.founding ?? 25000),
      configKey: null,
      versionTypes: ["3"],
      defaultVersion: "3",
    };
  }
}
