import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingConfigModule } from "../rating-config/rating-config.module";
import { UsersModule } from "../users/users.module";
import { ProjectContact } from "./project-contact.entity";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectInvoice } from "./project-invoice.entity";
import { ProjectPayment } from "./project-payment.entity";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsEmailService } from "./projects-email.service";
import { ProjectsService } from "./projects.service";
import { RatingData } from "./rating-data.entity";
import { RatingDocument } from "./rating-document.entity";
import { RatingFormService } from "./rating-form.service";
import { RatingTypesModule } from "./rating-types.module";

@Module({
  imports: [
    UsersModule,
    RatingConfigModule,
    RatingTypesModule,
    TypeOrmModule.forFeature([
      Project,
      ProjectDetail,
      ProjectContact,
      ProjectInvoice,
      ProjectPayment,
      RatingData,
      RatingDocument,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsEmailService, RatingFormService],
})
export class ProjectsModule {}
