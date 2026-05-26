import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

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
  fees: {
    annual: number;
    founding: number;
    nonMember: number;
  };
}

@Injectable()
export class ProjectCategoryService {
  getProjectCategories() {
    const jsonPath = this.resolveJsonPath();
    const content = readFileSync(jsonPath, "utf8");
    const categories = JSON.parse(content) as ProjectCategoryItem[];
    return {
      categories,
    };
  }

  getRatingSystemsByCategory(categoryId: number) {
    const categories = this.readCategories();
    const category = categories.find((item) => item.id === categoryId);
    const ratingSystems = this.readRatingSystems().filter((item) => item.categoryId === categoryId);

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
    return JSON.parse(content) as RatingSystemItem[];
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
}
