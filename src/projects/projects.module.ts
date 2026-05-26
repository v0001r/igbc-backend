import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
<<<<<<< HEAD
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
=======
import { ProjectContact } from "./project-contact.entity";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectInvoice } from "./project-invoice.entity";
import { ProjectPayment } from "./project-payment.entity";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsEmailService } from "./projects-email.service";
import { ProjectsService } from "./projects.service";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      Project,
      ProjectDetail,
      ProjectContact,
      ProjectInvoice,
      ProjectPayment,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsEmailService],
>>>>>>> 1a65c5fd1385100852a1babe840f1fbe50e22a05
})
export class ProjectsModule {}
