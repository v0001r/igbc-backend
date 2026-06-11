import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { RoleName } from "../rbac/role.enum";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ProjectStaffAssignment } from "./project-staff-assignment.entity";
import { ProjectTpaAssignment } from "./project-tpa-assignment.entity";
import { Project } from "./project.entity";

export type ProjectAccessRole = "admin" | "client" | "lead" | "staff" | "tpa";

export type ProjectAccessContext = {
  user: User;
  project: Project;
  certificationApplication: CertificationApplication | null;
  role: ProjectAccessRole;
  canView: boolean;
  canWrite: boolean;
  isSubmitted: boolean;
  workflowStatus: string;
};

@Injectable()
export class ProjectAccessService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(UserRatingType)
    private readonly userRatingTypeRepository: Repository<UserRatingType>,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
    private readonly usersService: UsersService,
  ) {}

  async resolveAccess(
    email: string,
    projectId: number,
    mode: "read" | "write",
  ): Promise<ProjectAccessContext> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const certificationApplication = await this.certificationRepository.findOne({
      where: { projectId },
    });
    const isSubmitted = certificationApplication?.isSubmitted === true;
    const workflowStatus = certificationApplication?.workflowStatus ?? "draft";

    const role = await this.resolveRole(user, project, certificationApplication);
    const canView = role !== null;
    const isAdmin = role === "admin";
    const isOwner = project.createdByUserId === user.id;

    let canWrite = false;
    if (isAdmin) {
      canWrite = true;
    } else if (isOwner && !isSubmitted) {
      canWrite = true;
    }

    if (!canView) {
      throw new ForbiddenException("You do not have access to this project");
    }
    if (mode === "write" && !canWrite) {
      throw new ForbiddenException(
        isSubmitted
          ? "This project is read-only after final submission"
          : "You cannot modify this project",
      );
    }

    return {
      user,
      project,
      certificationApplication,
      role: role ?? "client",
      canView,
      canWrite,
      isSubmitted,
      workflowStatus,
    };
  }

  async assertClientRegistrationWritable(email: string, projectId: number) {
    const ctx = await this.resolveAccess(email, projectId, "write");
    if (ctx.role !== "admin" && ctx.project.createdByUserId !== ctx.user.id) {
      throw new ForbiddenException("You can update only your own project");
    }
    return ctx;
  }

  private async resolveRole(
    user: User,
    project: Project,
    certificationApplication: CertificationApplication | null,
  ): Promise<ProjectAccessRole | null> {
    const roleName = user.role?.roleName ?? null;
    if (user.userType === "a" || roleName === RoleName.ADMIN) {
      return "admin";
    }

    if (project.createdByUserId === user.id) {
      return "client";
    }

    const isSubmitted = certificationApplication?.isSubmitted === true;
    if (!isSubmitted) {
      return null;
    }

    if (user.userType === "s" && user.isLead) {
      const matches = await this.userHasRatingType(user.id, project.ratingTypeId);
      if (matches) return "lead";
    }

    if (user.userType === "s") {
      const assigned = await this.staffAssignmentRepository.findOne({
        where: { projectId: project.id, staffId: user.id },
      });
      if (assigned) return "staff";
    }

    if (user.userType === "T") {
      const assigned = await this.tpaAssignmentRepository.findOne({
        where: { projectId: project.id, tpaId: user.id },
      });
      if (assigned) return "tpa";
    }

    return null;
  }

  private async userHasRatingType(userId: string, ratingTypeId?: number | null) {
    if (!ratingTypeId) return false;
    const count = await this.userRatingTypeRepository.count({
      where: { userId, ratingTypeId },
    });
    return count > 0;
  }
}
