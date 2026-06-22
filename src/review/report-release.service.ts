import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { isPendingFromTotalPoints } from "../certification-application/certification-pending.util";
import { CreditReviewService } from "./credit-review.service";
import { ReleaseReportDto } from "./dto/review.dto";
import { ReportRelease } from "./report-release.entity";
import { ReportPdfService } from "./report-pdf.service";
import { ReviewAccessService } from "./review-access.service";
import { ReviewCycle } from "./review-cycle.entity";
import { ReviewCycleService } from "./review-cycle.service";

@Injectable()
export class ReportReleaseService {
  constructor(
    @InjectRepository(ReportRelease)
    private readonly reportReleaseRepository: Repository<ReportRelease>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(ReviewCycle)
    private readonly reviewCycleRepository: Repository<ReviewCycle>,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly reviewAccessService: ReviewAccessService,
    private readonly creditReviewService: CreditReviewService,
    private readonly reportPdfService: ReportPdfService,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
  ) {}

  async previewReport(
    email: string,
    projectId: number,
    role: "tpa" | "coordinator",
    dto: ReleaseReportDto,
  ) {
    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    const access =
      role === "tpa"
        ? await this.reviewAccessService.assertTpaReviewer(email, projectId, cycle)
        : await this.reviewAccessService.assertCoordinator(email, projectId, cycle);

    const effective = await this.creditReviewService.getMergedReviewsForReport(cycle.id, role);
    const phase = role === "tpa" ? "tpa_preview" : "coordinator_preview";
    const { pdfVersion, downloadUrl } = await this.reportPdfService.generateReport({
      cycle,
      reviews: effective,
      phase,
      generatedBy: access.user.id,
      watermark: true,
      tpaRemark: role === "tpa" ? dto.remark : undefined,
      staffRemark: role === "coordinator" ? dto.remark : undefined,
    });

    return {
      message: "Preview generated",
      pdfVersionId: pdfVersion.id,
      downloadUrl,
      versionNo: pdfVersion.versionNo,
    };
  }

  async releaseTpaReport(email: string, projectId: number, dto: ReleaseReportDto) {
    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    const access = await this.reviewAccessService.assertTpaReviewer(email, projectId, cycle);
    this.reviewAccessService.assertTpaCanEdit(cycle);

    return this.dataSource.transaction(async (manager) => {
      const cycleRepo = manager.getRepository(ReviewCycle);
      const releaseRepo = manager.getRepository(ReportRelease);
      const certRepo = manager.getRepository(CertificationApplication);

      await this.creditReviewService.lockDraftsForRole(cycle, "tpa", manager);
      const reviews = await this.creditReviewService.getLockedReviews(cycle.id, "tpa");

      const release = await releaseRepo.save(
        releaseRepo.create({
          reviewCycleId: cycle.id,
          releasePhase: "tpa_released",
          tpaRemark: dto.remark ?? null,
          releasedBy: access.user.id,
          releasedAt: new Date(),
        }),
      );

      const { pdfVersion, downloadUrl } = await this.reportPdfService.generateReport({
        cycle,
        reviews,
        phase: "tpa_released",
        generatedBy: access.user.id,
        releaseId: release.id,
        tpaRemark: dto.remark,
      });
      release.reportDocKey = downloadUrl;
      await releaseRepo.save(release);

      cycle.cycleStatus = "tpa_locked";
      cycle.tpaLockedAt = new Date();
      await cycleRepo.save(cycle);

      const certApp = await certRepo.findOne({ where: { projectId } });
      if (certApp) {
        certApp.workflowStatus = "tpa_report_released";
        certApp.reportPhase = "tpa_released";
        await certRepo.save(certApp);
      }

      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.WORKFLOW_STATUS_CHANGED,
          module: "review",
          activityTitle: "TPA report released",
          newValue: { pdfVersionId: pdfVersion.id, submissionCount: cycle.submissionCount },
          submissionCount: cycle.submissionCount,
        },
        manager,
      );

      return {
        message: "Report released to coordinator",
        downloadUrl,
        cycleStatus: cycle.cycleStatus,
        workflowStatus: certApp?.workflowStatus,
      };
    });
  }

  async rereleaseCoordinatorReport(email: string, projectId: number, dto: ReleaseReportDto) {
    let cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    const access = await this.reviewAccessService.assertCoordinator(email, projectId, cycle);
    cycle = await this.reviewCycleService.ensureCoordinatorPhase(cycle);
    this.reviewAccessService.assertCoordinatorCanRelease(cycle);

    return this.dataSource.transaction(async (manager) => {
      const cycleRepo = manager.getRepository(ReviewCycle);
      const releaseRepo = manager.getRepository(ReportRelease);
      const certRepo = manager.getRepository(CertificationApplication);

      await this.creditReviewService.lockDraftsForRole(cycle, "coordinator", manager);
      const effectiveReviews = await this.creditReviewService.getMergedReviewsForReport(
        cycle.id,
        "coordinator",
      );

      const release = await releaseRepo.save(
        releaseRepo.create({
          reviewCycleId: cycle.id,
          releasePhase: "coordinator_released",
          staffRemark: dto.remark ?? null,
          releasedBy: access.user.id,
          releasedAt: new Date(),
        }),
      );

      const { pdfVersion, downloadUrl } = await this.reportPdfService.generateReport({
        cycle,
        reviews: effectiveReviews,
        phase: "coordinator_released",
        generatedBy: access.user.id,
        releaseId: release.id,
        staffRemark: dto.remark,
      });
      release.reportDocKey = downloadUrl;
      await releaseRepo.save(release);

      await releaseRepo.save(
        releaseRepo.create({
          reviewCycleId: cycle.id,
          releasePhase: "client_delivered",
          reportDocKey: downloadUrl,
          releasedBy: access.user.id,
          releasedAt: new Date(),
        }),
      );

      cycle.cycleStatus = "client_pending";
      cycle.coordinatorLockedAt = new Date();
      await this.reviewCycleService.recomputePendingPoints(cycle, manager);
      await cycleRepo.save(cycle);

      const certApp = await certRepo.findOne({ where: { projectId } });
      if (certApp) {
        certApp.workflowStatus = "client_review_pending";
        certApp.reportPhase = "client_pending";
        certApp.clientReportStatus = "pending";
        certApp.isPending = isPendingFromTotalPoints(cycle.totalPendingPoints);
        certApp.certificateStatus = "pending";
        certApp.certificateAcceptedAt = null;
        certApp.certificateAcceptedBy = null;
        certApp.certificateRejectedAt = null;
        certApp.certificateRejectedBy = null;
        certApp.certificateRejectRemarks = null;
        await certRepo.save(certApp);
      }

      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.STAFF_APPROVAL,
          module: "review",
          activityTitle: "Coordinator report delivered to client",
          newValue: { pdfVersionId: pdfVersion.id, submissionCount: cycle.submissionCount },
          submissionCount: cycle.submissionCount,
        },
        manager,
      );

      return {
        message: "Report delivered to client",
        downloadUrl,
        cycleStatus: cycle.cycleStatus,
        totalPendingPoints: parseFloat(cycle.totalPendingPoints ?? "0"),
        workflowStatus: certApp?.workflowStatus,
      };
    });
  }

  async getCurrentReport(email: string, projectId: number) {
    await this.reviewAccessService.assertProjectRead(email, projectId);
    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    const pdf = await this.reportPdfService.getLatestDeliveredReport(cycle.id);
    if (!pdf) {
      return { available: false, cycle: this.reviewCycleService.getCycleSummary(cycle) };
    }
    return {
      available: true,
      cycle: this.reviewCycleService.getCycleSummary(cycle),
      downloadUrl: pdf.storageKey,
      versionNo: pdf.versionNo,
      generatedAt: pdf.generatedAt.toISOString(),
    };
  }
}
