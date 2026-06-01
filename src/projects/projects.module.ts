import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
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
})
export class ProjectsModule {}
