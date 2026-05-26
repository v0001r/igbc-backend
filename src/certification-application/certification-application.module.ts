import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectDetail } from "../projects/project-detail.entity";
import { ProjectInvoice } from "../projects/project-invoice.entity";
import { Project } from "../projects/project.entity";
import { UsersModule } from "../users/users.module";
import { CertificationApplicationController } from "./certification-application.controller";
import { CertificationApplication } from "./certification-application.entity";
import { CertificationApplicationService } from "./certification-application.service";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([CertificationApplication, Project, ProjectDetail, ProjectInvoice]),
  ],
  controllers: [CertificationApplicationController],
  providers: [CertificationApplicationService],
})
export class CertificationApplicationModule {}
