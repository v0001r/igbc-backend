import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {
  CertificationAccessService,
  CertificateLevelService,
} from "../certification-application/certification-access.service";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectDetail } from "../projects/project-detail.entity";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import { Project } from "../projects/project.entity";
import { ProjectsModule } from "../projects/projects.module";
import { RatingConfigModule } from "../rating-config/rating-config.module";
import { RatingTypesModule } from "../projects/rating-types.module";
import { CertificateActionLog } from "./certificate-action-log.entity";
import { CertificateCustomization } from "./certificate-customization.entity";
import { CertificatePdfService } from "./certificate-pdf.service";
import { CertificateService } from "./certificate.service";
import {
  CertificateEligibilityService,
  ClientReportService,
} from "./client-report.service";
import { ClientReportResponse } from "./client-report-response.entity";
import { CreditReview } from "./credit-review.entity";
import { CreditReviewService } from "./credit-review.service";
import { ReappealRequest } from "./reappeal-request.entity";
import { ReappealService } from "./reappeal.service";
import { ReportPdfVersion } from "./report-pdf-version.entity";
import { ReportPdfService } from "./report-pdf.service";
import { ReportRelease } from "./report-release.entity";
import { ReportReleaseService } from "./report-release.service";
import { ReviewAccessService } from "./review-access.service";
import { ReviewController } from "./review.controller";
import { ReviewCreditCatalogService } from "./review-credit-catalog.service";
import { ReviewCycle } from "./review-cycle.entity";
import { ReviewCycleService } from "./review-cycle.service";
import { ReviewHistoryService } from "./review-history.service";

@Module({
  imports: [
    forwardRef(() => ProjectsModule),
    RatingConfigModule,
    RatingTypesModule,
    TypeOrmModule.forFeature([
      ReviewCycle,
      CreditReview,
      ReportRelease,
      ReportPdfVersion,
      ClientReportResponse,
      ReappealRequest,
      CertificationApplication,
      CertificateCustomization,
      CertificateActionLog,
      Project,
      ProjectDetail,
      ProjectStaffAssignment,
      ProjectTpaAssignment,
    ]),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewCycleService,
    ReviewCreditCatalogService,
    ReviewAccessService,
    CreditReviewService,
    ReportPdfService,
    ReportReleaseService,
    CertificateEligibilityService,
    ClientReportService,
    ReappealService,
    ReviewHistoryService,
    CertificationAccessService,
    CertificateLevelService,
    CertificatePdfService,
    CertificateService,
  ],
  exports: [ReviewCycleService, CertificateEligibilityService, CreditReviewService],
})
export class ReviewModule {}
