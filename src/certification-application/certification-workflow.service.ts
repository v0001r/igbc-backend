import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
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
    if (certApp.isSubmitted) {
      // ACTIVITY_LOG: When re-submit after rejection is implemented, reset isSubmitted here
      // and reuse the submission_count increment block below.
      throw new BadRequestException("Project has already been submitted");
    }

    const prevCount = certApp.submissionCount ?? 0;
    const newCount = prevCount + 1;
    const submittedAt = new Date();

    await this.dataSource.transaction(async (manager) => {
      certApp.isSubmitted = true;
      certApp.submittedAt = submittedAt;
      certApp.workflowStatus = "final_submitted";
      certApp.submissionCount = newCount;
      await manager.getRepository(CertificationApplication).save(certApp);

      await this.activityLogService.log(
        {
          projectId,
          certificationApplicationId: certApp.id,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.FINAL_SUBMITTED,
          module: "certification",
          activityTitle: "Final submission",
          activityDescription: `Submission #${newCount}`,
          oldValue: { submissionCount: prevCount },
          newValue: { submissionCount: newCount, workflowStatus: "final_submitted" },
          submissionCount: newCount,
        },
        manager,
      );
    });

    return {
      message: "Project submitted successfully",
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

    return {
      isSubmitted: certApp?.isSubmitted ?? false,
      workflowStatus: certApp?.workflowStatus ?? "draft",
      submittedAt: certApp?.submittedAt?.toISOString() ?? null,
      submissionCount: certApp?.submissionCount ?? 0,
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
