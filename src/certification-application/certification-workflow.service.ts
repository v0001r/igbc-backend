import { BadRequestException, ForbiddenException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { CertificateEligibilityService } from "../review/client-report.service";
import { ReviewCycleService } from "../review/review-cycle.service";
import { ProjectAccessService } from "../projects/project-access.service";
import { ProjectAuditService } from "../projects/project-audit.service";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import type { RegistrationRatingContext } from "../projects/rating-form.service";
import { CertificationApplication } from "./certification-application.entity";

@Injectable()
export class CertificationWorkflowService {
  constructor(
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
    private readonly projectAccessService: ProjectAccessService,
    private readonly auditService: ProjectAuditService,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
    @Inject(forwardRef(() => ReviewCycleService))
    private readonly reviewCycleService: ReviewCycleService,
    @Inject(forwardRef(() => CertificateEligibilityService))
    private readonly certificateEligibilityService: CertificateEligibilityService,
  ) {}

  async finalSubmit(email: string, projectId: number, _ctx: RegistrationRatingContext) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "write");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can submit");
    }

    const certApp = access.certificationApplication;
    if (!certApp) {
      throw new BadRequestException("Certification application not found");
    }

    const canResubmit =
      !certApp.isSubmitted &&
      (certApp.workflowStatus === "draft" ||
        certApp.clientReportStatus === "rejected" ||
        certApp.workflowStatus === "reappeal_in_progress");

    if (certApp.isSubmitted && !canResubmit) {
      throw new BadRequestException("Project has already been submitted");
    }

    const prevCount = certApp.submissionCount ?? 0;
    const newCount = prevCount + 1;
    const submittedAt = new Date();
    const isResubmit = prevCount > 0;

    await this.dataSource.transaction(async (manager) => {
      certApp.isSubmitted = true;
      certApp.submittedAt = submittedAt;
      certApp.workflowStatus = "final_submitted";
      certApp.submissionCount = newCount;
      certApp.clientReportStatus = "pending";
      certApp.reportPhase = "none";
      certApp.isReappeal = false;
      await manager.getRepository(CertificationApplication).save(certApp);

      await this.reviewCycleService.openCycle(projectId, newCount, manager);

      await this.activityLogService.log(
        {
          projectId,
          certificationApplicationId: certApp.id,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: isResubmit ? ActivityType.CERT_RESUBMITTED : ActivityType.FINAL_SUBMITTED,
          module: "certification",
          activityTitle: isResubmit ? "Certification resubmitted" : "Final submission",
          activityDescription: `Submission #${newCount}`,
          oldValue: { submissionCount: prevCount },
          newValue: { submissionCount: newCount, workflowStatus: "final_submitted" },
          submissionCount: newCount,
        },
        manager,
      );
    });

    return {
      message: isResubmit ? "Project resubmitted successfully" : "Project submitted successfully",
      isSubmitted: true,
      workflowStatus: certApp.workflowStatus,
      submittedAt: certApp.submittedAt?.toISOString() ?? null,
      submissionCount: newCount,
    };
  }

  async getWorkflowSummary(projectId: number) {
    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    const staffAssignment = await this.staffAssignmentRepository.findOne({
      where: { projectId },
      relations: { staff: true },
    });
    const tpaAssignment = await this.tpaAssignmentRepository.findOne({
      where: { projectId },
      relations: { tpa: true },
    });
    const timeline = await this.auditService.getTimeline(projectId);
    if (certApp?.isSubmitted) {
      await this.reviewCycleService.ensureCycleFromCertApp(projectId);
    }
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    const eligibility = await this.certificateEligibilityService.getEligibility(projectId);

    return {
      isSubmitted: certApp?.isSubmitted ?? false,
      workflowStatus: certApp?.workflowStatus ?? "draft",
      reportPhase: certApp?.reportPhase ?? "none",
      clientReportStatus: certApp?.clientReportStatus ?? "pending",
      isPending: certApp?.isPending ?? false,
      certificateStatus: certApp?.certificateStatus ?? "pending",
      submittedAt: certApp?.submittedAt?.toISOString() ?? null,
      submissionCount: certApp?.submissionCount ?? 0,
      reviewCycle: this.reviewCycleService.getCycleSummary(cycle),
      certificateEligible: eligibility.certificateEligible,
      pendingPointsTotal: eligibility.totalPendingPoints,
      blockingCredits: eligibility.blockingCredits,
      assignedStaff: staffAssignment
        ? {
            id: staffAssignment.staffId,
            displayName: staffAssignment.staff.displayName,
            assignedAt: staffAssignment.assignedAt.toISOString(),
          }
        : null,
      assignedTpa: tpaAssignment
        ? {
            id: tpaAssignment.tpaId,
            displayName: tpaAssignment.tpa.displayName,
            assignedAt: tpaAssignment.assignedAt.toISOString(),
          }
        : null,
      timeline,
    };
  }
}
