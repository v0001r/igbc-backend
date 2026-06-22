import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectAccessService } from "../projects/project-access.service";
import { InitiateReappealDto } from "./dto/review.dto";
import { ReappealRequest } from "./reappeal-request.entity";
import { ReviewCycleService } from "./review-cycle.service";

@Injectable()
export class ReappealService {
  constructor(
    @InjectRepository(ReappealRequest)
    private readonly reappealRepository: Repository<ReappealRequest>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    private readonly projectAccessService: ProjectAccessService,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async initiate(email: string, projectId: number, dto: InitiateReappealDto) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can initiate reappeal");
    }

    const cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    if (!["client_pending", "accepted"].includes(cycle.cycleStatus)) {
      throw new BadRequestException("Reappeal is not available for the current cycle status");
    }

    const request = await this.reappealRepository.save(
      this.reappealRepository.create({
        projectId,
        reviewCycleId: cycle.id,
        paymentStatus: "pending",
        reappealChecklist: dto.tabs,
        approvedTabs: [],
        feeAmount: dto.feeAmount != null ? String(dto.feeAmount) : null,
      }),
    );

    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (certApp) {
      certApp.isReappeal = true;
      certApp.reappealPaymentStatus = "pending";
      certApp.workflowStatus = "reappeal_in_progress";
      certApp.reportPhase = "reappeal";
      await this.certificationRepository.save(certApp);
    }

    cycle.cycleStatus = "reappeal_open";
    const { ReviewCycle } = await import("./review-cycle.entity");
    await this.reappealRepository.manager.getRepository(ReviewCycle).save(cycle);

    await this.activityLogService.log({
      projectId,
      userId: access.user.id,
      userRole: access.user.userType,
      activityType: ActivityType.WORKFLOW_STATUS_CHANGED,
      module: "review",
      activityTitle: "Reappeal initiated",
      newValue: { reappealId: request.id, tabs: dto.tabs },
      submissionCount: cycle.submissionCount,
    });

    return { message: "Reappeal initiated", reappealId: request.id };
  }

  async markPaid(reappealId: string, email: string) {
    const request = await this.reappealRepository.findOne({ where: { id: reappealId } });
    if (!request) throw new NotFoundException("Reappeal request not found");

    const access = await this.projectAccessService.resolveAccess(
      email,
      request.projectId,
      "read",
    );
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Not allowed");
    }

    request.paymentStatus = "paid";
    request.approvedTabs = request.reappealChecklist;
    await this.reappealRepository.save(request);

    const certApp = await this.certificationRepository.findOne({
      where: { projectId: request.projectId },
    });
    if (certApp) {
      certApp.reappealPaymentStatus = "paid";
      certApp.isSubmitted = false;
      certApp.workflowStatus = "draft";
      await this.certificationRepository.save(certApp);
    }

    const cycle = await this.reviewCycleService.requireCurrentCycle(request.projectId);
    cycle.cycleStatus = "reappeal_open";
    const { ReviewCycle } = await import("./review-cycle.entity");
    await this.reappealRepository.manager.getRepository(ReviewCycle).save(cycle);

    await this.activityLogService.log({
      projectId: request.projectId,
      userId: access.user.id,
      userRole: access.user.userType,
      activityType: ActivityType.WORKFLOW_STATUS_CHANGED,
      module: "review",
      activityTitle: "Reappeal payment recorded",
      newValue: { reappealId: request.id, approvedTabs: request.approvedTabs },
      submissionCount: cycle.submissionCount,
    });

    return { message: "Reappeal payment recorded", approvedTabs: request.approvedTabs };
  }

  async approveTabs(reappealId: string, adminUserId: string, tabs: string[]) {
    const request = await this.reappealRepository.findOne({ where: { id: reappealId } });
    if (!request) throw new NotFoundException("Reappeal request not found");

    request.approvedTabs = tabs;
    await this.reappealRepository.save(request);

    await this.activityLogService.log({
      projectId: request.projectId,
      userId: adminUserId,
      userRole: "a",
      activityType: ActivityType.WORKFLOW_STATUS_CHANGED,
      module: "review",
      activityTitle: "Reappeal tabs approved",
      newValue: { reappealId: request.id, approvedTabs: tabs },
    });

    return { message: "Reappeal tabs approved", approvedTabs: tabs };
  }
}
