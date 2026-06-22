import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { DashboardModule } from "../dashboard/dashboard.module";
import { RatingConfigModule } from "../rating-config/rating-config.module";
import { RbacModule } from "../rbac/rbac.module";
import { UsersModule } from "../users/users.module";
import { ProjectContact } from "./project-contact.entity";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectInvoice } from "./project-invoice.entity";
import { ProjectPayment } from "./project-payment.entity";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";
import { CertificationWorkflowService } from "../certification-application/certification-workflow.service";
import {
  CertificationAccessService,
  CertificateLevelService,
} from "../certification-application/certification-access.service";
import { CertificationCompletionService } from "./certification-completion.service";
import { ProjectAccessService } from "./project-access.service";
import { ProjectAssignmentService } from "./project-assignment.service";
import { ProjectAuditLog } from "./project-audit-log.entity";
import { ProjectAuditService } from "./project-audit.service";
import { ProjectStaffAssignment } from "./project-staff-assignment.entity";
import { ProjectTpaAssignment } from "./project-tpa-assignment.entity";
import { Project } from "./project.entity";
import { ProjectsController } from "./projects.controller";
import { ProjectsEmailService } from "./projects-email.service";
import { ProjectsService } from "./projects.service";
import { RatingData } from "./rating-data.entity";
import { RatingDocument } from "./rating-document.entity";
import { CertificateActionLog } from "../review/certificate-action-log.entity";
import { RatingFormService } from "./rating-form.service";
import { RatingTypesModule } from "./rating-types.module";
import { ReviewModule } from "../review/review.module";

@Module({
  imports: [
    UsersModule,
    RbacModule,
    DashboardModule,
    RatingConfigModule,
    RatingTypesModule,
    forwardRef(() => ReviewModule),
    TypeOrmModule.forFeature([
      Project,
      ProjectDetail,
      ProjectContact,
      ProjectInvoice,
      ProjectPayment,
      CertificationApplication,
      RatingData,
      RatingDocument,
      ProjectStaffAssignment,
      ProjectTpaAssignment,
      ProjectAuditLog,
      CertificateActionLog,
      User,
      UserRatingType,
    ]),
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectsEmailService,
    RatingFormService,
    ProjectAccessService,
    ProjectAuditService,
    CertificationCompletionService,
    CertificationWorkflowService,
    ProjectAssignmentService,
    CertificationAccessService,
    CertificateLevelService,
  ],
  exports: [
    ProjectAccessService,
    ProjectAssignmentService,
    CertificationWorkflowService,
    CertificationAccessService,
    CertificateLevelService,
  ],
})
export class ProjectsModule {}
