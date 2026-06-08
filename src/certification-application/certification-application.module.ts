import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectContact } from "../projects/project-contact.entity";
import { ProjectDetail } from "../projects/project-detail.entity";
import { ProjectInvoice } from "../projects/project-invoice.entity";
import { ProjectPayment } from "../projects/project-payment.entity";
import { Project } from "../projects/project.entity";
import { UsersModule } from "../users/users.module";
import { CertificationApplicationController } from "./certification-application.controller";
import { CertificationApplication } from "./certification-application.entity";
import { CertificationApplicationService } from "./certification-application.service";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      CertificationApplication,
      Project,
      ProjectDetail,
      ProjectInvoice,
      ProjectPayment,
      ProjectContact,
    ]),
  ],
  controllers: [CertificationApplicationController],
  providers: [CertificationApplicationService],
})
export class CertificationApplicationModule {}
