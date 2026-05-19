import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { RatingData } from "./rating-data.entity";
import { RatingDocument } from "./rating-document.entity";
import { RatingFormService } from "./rating-form.service";
import { RatingType } from "./rating-type.entity";
import { RatingConfigModule } from "../rating-config/rating-config.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, RatingType, RatingData, RatingDocument]),
    RatingConfigModule,
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, RatingFormService],
  exports: [ProjectsService, RatingFormService],
})
export class ProjectsModule {}
