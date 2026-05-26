import { Module } from "@nestjs/common";
import { ProjectCategoryController } from "./project-category.controller";
import { ProjectCategoryService } from "./project-category.service";

@Module({
  controllers: [ProjectCategoryController],
  providers: [ProjectCategoryService],
})
export class ProjectCategoryModule {}
