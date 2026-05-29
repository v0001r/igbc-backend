import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
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
    const rows = await this.ratingTypeService.findByCategory(categoryId);

    const ratingSystems: RatingSystemItem[] = rows.map((row) => ({
      id: row.id,
      categoryId: row.category,
      ratingName: row.ratingName,
      shortRatingName: row.shortRatingName,
      type: Array.isArray(row.type) ? row.type : [],
      specifics: Array.isArray(row.specifics) ? row.specifics : [],
      configKey: this.ratingTypeService.resolveConfigKeyForRow(row),
      versionTypes: row.versionTypes ?? ["3"],
      defaultVersion: row.defaultVersion ?? null,
      hasCertificationConfig: this.ratingTypeService.hasCertificationConfig(row),
      fees: {
        annual: Number(row.igbcAnnualRegFee ?? 25000),
        founding: Number(row.igbcFoundingRegFee ?? 25000),
        nonMember: Number(row.nonMemberRegFee ?? 30000),
      },
    }));

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
}
