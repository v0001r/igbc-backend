import { BadRequestException, Controller, Get, Param } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProjectCategoryService } from "./project-category.service";

@ApiTags("project-category")
@Controller("project-category")
export class ProjectCategoryController {
  constructor(private readonly projectCategoryService: ProjectCategoryService) {}

  @ApiOperation({ summary: "Get project categories from JSON" })
  @Get()
  getProjectCategories() {
    return this.projectCategoryService.getProjectCategories();
  }

  @ApiOperation({
    summary:
      "Get rating systems by category (includes specifics as subcategory and annual/founding/non-member fee)",
  })
  @Get(":categoryId/rating-systems")
  async getRatingSystemsByCategory(@Param("categoryId") categoryIdParam: string) {
    const categoryId = Number(categoryIdParam);
    if (Number.isNaN(categoryId)) {
      throw new BadRequestException("categoryId must be a number");
    }
    return this.projectCategoryService.getRatingSystemsByCategory(categoryId);
  }
}
