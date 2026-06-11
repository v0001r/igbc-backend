import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import { Project } from "../projects/project.entity";
import { RoleName, USER_TYPE_ROLE_MAP } from "../rbac/role.enum";
import { UserProjectAssignment } from "../users/user-project-assignment.entity";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(UserProjectAssignment)
    private readonly assignmentRepository: Repository<UserProjectAssignment>,
    @InjectRepository(UserRatingType)
    private readonly userRatingTypeRepository: Repository<UserRatingType>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
  ) {}

  async getAdminStats() {
    const [totalUsers, totalProjects, activeProjects, pendingProjects, completedProjects] =
      await Promise.all([
        this.userRepository.count(),
        this.projectRepository.count(),
        this.projectRepository.count({ where: { status: "approved" } }),
        this.projectRepository.count({ where: { status: "submitted" } }),
        this.projectRepository.count({ where: { certificateAppliedStatus: "yes" } }),
      ]);

    return {
      totalUsers,
      totalProjects,
      activeProjects,
      pendingProjects,
      completedProjects,
    };
  }

  async getLeadStats(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user?.isLead) {
      return { submittedProjects: 0, unassignedStaff: 0, assignedStaff: 0 };
    }

    const ratingTypeIds = (
      await this.userRatingTypeRepository.find({ where: { userId: user.id } })
    ).map((r) => r.ratingTypeId);

    if (!ratingTypeIds.length) {
      return { submittedProjects: 0, unassignedStaff: 0, assignedStaff: 0 };
    }

    const submittedApps = await this.certificationRepository.find({
      where: { isSubmitted: true },
    });
    const projectIds = submittedApps.map((a) => a.projectId);
    const matchingProjects = projectIds.length
      ? await this.projectRepository.find({
          where: { id: In(projectIds), ratingTypeId: In(ratingTypeIds) },
        })
      : [];
    const matchingIds = matchingProjects.map((p) => p.id);
    const staffAssignments = matchingIds.length
      ? await this.staffAssignmentRepository.find({
          where: { projectId: In(matchingIds) },
        })
      : [];

    return {
      submittedProjects: matchingIds.length,
      unassignedStaff: matchingIds.length - staffAssignments.length,
      assignedStaff: staffAssignments.length,
    };
  }

  async getStaffStats(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: { role: true },
    });
    if (!user) {
      return {
        assignedProjects: 0,
        pendingProjects: 0,
        assignedToTpa: 0,
        completedProjects: 0,
      };
    }

    const assignments = await this.staffAssignmentRepository.find({
      where: { staffId: user.id },
    });
    const projectIds = assignments.map((a) => a.projectId);

    let pendingProjects = 0;
    let assignedToTpa = 0;
    let completedProjects = 0;

    if (projectIds.length) {
      const apps = await this.certificationRepository.find({
        where: { projectId: In(projectIds) },
      });
      pendingProjects = apps.filter(
        (a) => a.workflowStatus === "assigned_to_staff" || a.workflowStatus === "final_submitted",
      ).length;
      assignedToTpa = apps.filter(
        (a) =>
          a.workflowStatus === "assigned_to_tpa" ||
          a.workflowStatus === "under_review",
      ).length;
      completedProjects = apps.filter((a) => a.workflowStatus === "completed").length;
    }

    return {
      assignedProjects: projectIds.length,
      pendingProjects,
      assignedToTpa,
      completedProjects,
    };
  }

  async getTpaStats(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      return { assignedProjects: 0, underReview: 0, completedProjects: 0 };
    }

    const assignments = await this.tpaAssignmentRepository.find({
      where: { tpaId: user.id },
    });
    const projectIds = assignments.map((a) => a.projectId);

    let underReview = 0;
    let completedProjects = 0;
    if (projectIds.length) {
      const apps = await this.certificationRepository.find({
        where: { projectId: In(projectIds) },
      });
      underReview = apps.filter(
        (a) => a.workflowStatus === "assigned_to_tpa" || a.workflowStatus === "under_review",
      ).length;
      completedProjects = apps.filter((a) => a.workflowStatus === "completed").length;
    }

    return {
      assignedProjects: projectIds.length,
      underReview,
      completedProjects,
    };
  }

  async getStaffOrTpaStats(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: { role: true },
    });
    if (!user) {
      return {
        assignedProjects: 0,
        activeProjects: 0,
        pendingReviews: 0,
        assignedRatingTypes: 0,
      };
    }

    if (user.userType === "T") {
      const tpa = await this.getTpaStats(email);
      return {
        assignedProjects: tpa.assignedProjects,
        activeProjects: tpa.underReview,
        pendingReviews: tpa.underReview,
        assignedRatingTypes: await this.userRatingTypeRepository.count({
          where: { userId: user.id },
        }),
      };
    }

    const staff = await this.getStaffStats(email);
    return {
      assignedProjects: staff.assignedProjects,
      activeProjects: staff.pendingProjects,
      pendingReviews: staff.pendingProjects,
      assignedRatingTypes: await this.userRatingTypeRepository.count({
        where: { userId: user.id },
      }),
    };
  }

  async getAssignedProjects(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) return { items: [] };

    if (user.userType === "T") {
      const assignments = await this.tpaAssignmentRepository.find({
        where: { tpaId: user.id },
        relations: { project: true },
        order: { assignedAt: "DESC" },
      });
      return {
        items: await this.mapAssignmentItems(assignments.map((a) => a.project)),
      };
    }

    if (user.userType === "s") {
      const assignments = await this.staffAssignmentRepository.find({
        where: { staffId: user.id },
        relations: { project: true },
        order: { assignedAt: "DESC" },
      });
      return {
        items: await this.mapAssignmentItems(assignments.map((a) => a.project)),
      };
    }

    const assignments = await this.assignmentRepository.find({
      where: { userId: user.id },
      relations: { project: true },
      order: { assignedAt: "DESC" },
    });
    return {
      items: await this.mapAssignmentItems(assignments.map((a) => a.project)),
    };
  }

  private async mapAssignmentItems(projects: Project[]) {
    if (!projects.length) return [];
    const apps = await this.certificationRepository.find({
      where: { projectId: In(projects.map((p) => p.id)) },
    });
    const appMap = new Map(apps.map((a) => [a.projectId, a]));

    return projects.map((p) => {
      const app = appMap.get(p.id);
      return {
        projectId: p.id,
        igbcProjectId: p.igbcProjectId ?? p.temporaryProjectId,
        ratingSystem: p.ratingSystem,
        status: p.status,
        paymentStatus: p.paymentStatus,
        workflowStatus: app?.workflowStatus ?? "draft",
        isSubmitted: app?.isSubmitted ?? false,
        assignedAt: p.updatedAt?.toISOString?.() ?? null,
      };
    });
  }

  resolveDashboardPermission(user: User): "admin" | "staff" | "tpa" | null {
    const roleName = user.role?.roleName ?? USER_TYPE_ROLE_MAP[user.userType];
    if (roleName === RoleName.ADMIN) return "admin";
    if (roleName === RoleName.IGBC_STAFF) return "staff";
    if (roleName === RoleName.TPA) return "tpa";
    return null;
  }
}
