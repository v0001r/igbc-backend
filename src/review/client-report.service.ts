import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectAccessService } from "../projects/project-access.service";
import { ClientReportResponse } from "./client-report-response.entity";
import { CreditReview } from "./credit-review.entity";
import { AcceptRejectReportDto } from "./dto/review.dto";
import { ReviewCycleService } from "./review-cycle.service";
import { CertificateService } from "./certificate.service";

@Injectable()
export class CertificateEligibilityService {
  constructor(
    private readonly reviewCycleService: ReviewCycleService,
    @InjectRepository(CreditReview)
    private readonly creditReviewRepository: Repository<CreditReview>,
  ) {}

  async getEligibility(projectId: number) {
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!cycle || cycle.cycleStatus !== "accepted") {
      return {
        certificateEligible: false,
        totalPendingPoints: cycle ? parseFloat(cycle.totalPendingPoints ?? "0") : 0,
        blockingCredits: [] as Array<{ tab: string; subtab: string; pendingPoints: number }>,
        reason: "Report not yet accepted",
      };
    }

    const blocking = await this.getBlockingCredits(cycle.id);
    const totalPending = parseFloat(cycle.totalPendingPoints ?? "0");

    return {
      certificateEligible: cycle.certificateEligible && totalPending === 0,
      totalPendingPoints: totalPending,
      blockingCredits: blocking,
      reason:
        totalPending > 0
          ? "Certificate cannot be generated while pending points remain"
          : null,
    };
  }

  async assertEligible(projectId: number) {
    const eligibility = await this.getEligibility(projectId);
    if (!eligibility.certificateEligible) {
      throw new ForbiddenException(
        eligibility.reason ?? "Certificate generation is not allowed",
      );
    }
    return eligibility;
  }

  private async getBlockingCredits(cycleId: string) {
    const rows = await this.creditReviewRepository.find({
      where: { reviewCycleId: cycleId, reviewerRole: "coordinator", rowStatus: "locked" },
    });
    return rows
      .filter((r) => parseFloat(r.pendingPoints ?? "0") > 0)
      .map((r) => ({
        tab: r.tab,
        subtab: r.subtab,
        pendingPoints: parseFloat(r.pendingPoints ?? "0"),
      }));
  }
}

@Injectable()
export class ClientReportService {
  constructor(
    @InjectRepository(ClientReportResponse)
    private readonly clientResponseRepository: Repository<ClientReportResponse>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    private readonly projectAccessService: ProjectAccessService,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly certificateEligibilityService: CertificateEligibilityService,
    private readonly certificateService: CertificateService,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
  ) {}

  async acceptReport(email: string, projectId: number, dto: AcceptRejectReportDto) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can accept the report");
    }

    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    if (cycle.cycleStatus !== "client_pending") {
      throw new BadRequestException("No report pending client review");
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.getRepository(ClientReportResponse).save(
        manager.getRepository(ClientReportResponse).create({
          reviewCycleId: cycle.id,
          response: "accepted",
          clientRemark: dto.remark ?? null,
          respondedBy: access.user.id,
          respondedAt: new Date(),
        }),
      );

      cycle.cycleStatus = "accepted";
      cycle.closedAt = new Date();
      await this.reviewCycleService.recomputePendingPoints(cycle, manager);
      const { ReviewCycle } = await import("./review-cycle.entity");
      await manager.getRepository(ReviewCycle).save(cycle);

      const certApp = await this.certificationRepository.findOne({ where: { projectId } });
      if (certApp) {
        certApp.workflowStatus = "client_accepted";
        certApp.reportPhase = "client_accepted";
        certApp.clientReportStatus = "accepted";
        await manager.getRepository(CertificationApplication).save(certApp);
      }

      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.STAFF_APPROVAL,
          module: "review",
          activityTitle: "Client accepted report",
          newValue: {
            submissionCount: cycle.submissionCount,
            certificateEligible: cycle.certificateEligible,
            totalPendingPoints: cycle.totalPendingPoints,
          },
          submissionCount: cycle.submissionCount,
        },
        manager,
      );

      const eligibility = await this.certificateEligibilityService.getEligibility(projectId);
      return {
        message: "Report accepted",
        workflowStatus: certApp?.workflowStatus,
        ...eligibility,
      };
    });
  }

  async rejectReport(email: string, projectId: number, dto: AcceptRejectReportDto) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can reject the report");
    }

    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    if (cycle.cycleStatus !== "client_pending") {
      throw new BadRequestException("No report pending client review");
    }

    return this.dataSource.transaction(async (manager) => {
      await manager.getRepository(ClientReportResponse).save(
        manager.getRepository(ClientReportResponse).create({
          reviewCycleId: cycle.id,
          response: "rejected",
          clientRemark: dto.remark ?? null,
          respondedBy: access.user.id,
          respondedAt: new Date(),
        }),
      );

      cycle.cycleStatus = "rejected";
      cycle.closedAt = new Date();
      const { ReviewCycle } = await import("./review-cycle.entity");
      await manager.getRepository(ReviewCycle).save(cycle);

      const certApp = await this.certificationRepository.findOne({ where: { projectId } });
      if (certApp) {
        certApp.isSubmitted = false;
        certApp.workflowStatus = "draft";
        certApp.reportPhase = "client_rejected";
        certApp.clientReportStatus = "rejected";
        await manager.getRepository(CertificationApplication).save(certApp);
      }

      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.STAFF_REJECTION,
          module: "review",
          activityTitle: "Client rejected report",
          newValue: { submissionCount: cycle.submissionCount, remark: dto.remark ?? null },
          submissionCount: cycle.submissionCount,
        },
        manager,
      );

      return {
        message: "Report rejected. Project unlocked for revision.",
        workflowStatus: certApp?.workflowStatus,
        isSubmitted: false,
      };
    });
  }

  async generateCertificate(email: string, projectId: number) {
    return this.certificateService.download(email, projectId);
  }
}
