import { Module } from "@nestjs/common";
import { RatingTypesModule } from "../projects/rating-types.module";
import { ProjectCategoryController } from "./project-category.controller";
import { ProjectCategoryService } from "./project-category.service";

@Module({
  imports: [RatingTypesModule],
  controllers: [ProjectCategoryController],
  providers: [ProjectCategoryService],
})
export class ProjectCategoryModule {}
