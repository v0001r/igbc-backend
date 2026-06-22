import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectAccessService } from "../projects/project-access.service";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import { ReviewCycle } from "./review-cycle.entity";
import type { ReviewerRole } from "./review.enums";

@Injectable()
export class ReviewAccessService {
  constructor(
    private readonly projectAccessService: ProjectAccessService,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
  ) {}

  async assertProjectRead(email: string, projectId: number) {
    return this.projectAccessService.resolveAccess(email, projectId, "read");
  }

  async assertTpaReviewer(email: string, projectId: number, cycle: ReviewCycle) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role === "admin") return access;

    if (access.role !== "tpa") {
      throw new ForbiddenException("Only assigned TPA can perform this action");
    }
    const assigned = await this.tpaAssignmentRepository.findOne({
      where: { projectId, tpaId: access.user.id },
    });
    if (!assigned) throw new ForbiddenException("You are not assigned to this project");
    if (cycle.tpaId && cycle.tpaId !== access.user.id) {
      throw new ForbiddenException("You are not the TPA for this review cycle");
    }
    return access;
  }

  async assertCoordinator(email: string, projectId: number, cycle: ReviewCycle) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role === "admin") return access;

    if (access.role !== "staff") {
      throw new ForbiddenException("Only assigned coordinator can perform this action");
    }
    const assigned = await this.staffAssignmentRepository.findOne({
      where: { projectId, staffId: access.user.id },
    });
    if (!assigned) throw new ForbiddenException("You are not assigned to this project");
    if (cycle.coordinatorId && cycle.coordinatorId !== access.user.id) {
      throw new ForbiddenException("You are not the coordinator for this review cycle");
    }
    return access;
  }

  assertTpaCanEdit(cycle: ReviewCycle) {
    if (cycle.cycleStatus !== "open") {
      throw new BadRequestException("TPA review is locked for this cycle");
    }
  }

  assertCoordinatorCanEdit(cycle: ReviewCycle) {
    if (cycle.cycleStatus === "tpa_locked" || cycle.cycleStatus === "client_pending") {
      return;
    }
    throw new BadRequestException("Coordinator review is not available for this cycle");
  }

  assertCoordinatorCanRelease(cycle: ReviewCycle) {
    if (cycle.cycleStatus === "tpa_locked" || cycle.cycleStatus === "client_pending") {
      return;
    }
    if (cycle.cycleStatus === "accepted") {
      throw new BadRequestException("Report already accepted by the client");
    }
    throw new BadRequestException("Coordinator review is not available for this cycle");
  }

  assertRoleCanEdit(role: ReviewerRole, cycle: ReviewCycle) {
    if (role === "tpa") {
      this.assertTpaCanEdit(cycle);
    } else {
      this.assertCoordinatorCanEdit(cycle);
    }
  }
}
