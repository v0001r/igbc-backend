import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { RoleName } from "../rbac/role.enum";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ProjectAuditService } from "./project-audit.service";
import { ProjectStaffAssignment } from "./project-staff-assignment.entity";
import { ProjectTpaAssignment } from "./project-tpa-assignment.entity";
import { Project } from "./project.entity";
import { ProjectDetail } from "./project-detail.entity";

@Injectable()
export class ProjectAssignmentService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRatingType)
    private readonly userRatingTypeRepository: Repository<UserRatingType>,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
    private readonly usersService: UsersService,
    private readonly auditService: ProjectAuditService,
  ) {}

  async listLeadSubmittedProjects(email: string) {
    const lead = await this.requireLead(email);
    const ratingTypeIds = await this.getUserRatingTypeIds(lead.id);
    if (!ratingTypeIds.length) return { items: [] };

    const apps = await this.certificationRepository.find({
      where: { isSubmitted: true },
      order: { submittedAt: "DESC" },
    });

    const projects = await this.projectRepository.find({
      where: { id: In(apps.map((a) => a.projectId)), ratingTypeId: In(ratingTypeIds) },
    });
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const details = await this.projectDetailRepository.find({
      where: { projectId: In(projects.map((p) => p.id)) },
    });
    const detailMap = new Map(details.map((d) => [d.projectId, d]));
    const staffAssignments = await this.staffAssignmentRepository.find({
      where: { projectId: In(projects.map((p) => p.id)) },
      relations: { staff: true },
    });
    const staffMap = new Map(staffAssignments.map((a) => [a.projectId, a]));

    const clientIds = [...new Set(projects.map((p) => p.createdByUserId))];
    const clients = clientIds.length
      ? await this.userRepository.find({ where: { id: In(clientIds) } })
      : [];
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    const items = apps
      .filter((app) => projectMap.has(app.projectId))
      .map((app) => {
        const project = projectMap.get(app.projectId)!;
        const client = clientMap.get(project.createdByUserId);
        const staff = staffMap.get(project.id);
        return {
          projectId: project.id,
          igbcProjectId: project.igbcProjectId ?? project.temporaryProjectId,
          projectName: detailMap.get(project.id)?.projectName ?? project.ratingSystem,
          clientName: client?.displayName ?? "—",
          ratingType: project.ratingSystem,
          ratingTypeId: project.ratingTypeId,
          submissionDate: app.submittedAt?.toISOString() ?? null,
          workflowStatus: app.workflowStatus,
          assignedStaff: staff
            ? { id: staff.staffId, displayName: staff.staff.displayName }
            : null,
        };
      });

    return { items };
  }

  async assignStaff(email: string, projectId: number, staffId: string) {
    const lead = await this.requireLead(email);
    const project = await this.requireSubmittedProject(projectId);
    await this.assertRatingTypeMatch(lead.id, project.ratingTypeId);

    const staff = await this.userRepository.findOne({
      where: { id: staffId },
      relations: { role: true },
    });
    if (!staff || staff.userType !== "s" || staff.status !== "active") {
      throw new BadRequestException("Invalid staff user");
    }
    if (staff.isLead) {
      throw new BadRequestException("Cannot assign to a lead user");
    }
    await this.assertUserRatingType(staffId, project.ratingTypeId);

    const existing = await this.staffAssignmentRepository.findOne({ where: { projectId } });
    const action = existing ? "STAFF_REASSIGNED" : "STAFF_ASSIGNED";

    if (existing) {
      existing.staffId = staffId;
      existing.assignedBy = lead.id;
      await this.staffAssignmentRepository.save(existing);
    } else {
      await this.staffAssignmentRepository.save(
        this.staffAssignmentRepository.create({
          projectId,
          staffId,
          assignedBy: lead.id,
        }),
      );
    }

    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (certApp) {
      certApp.workflowStatus = "assigned_to_staff";
      await this.certificationRepository.save(certApp);
    }

    await this.auditService.log(projectId, action, lead.id, {
      staffId,
      staffName: staff.displayName,
      previousStaffId: existing?.staffId ?? null,
      assignedBy: lead.displayName,
    });

    // ACTIVITY_LOG: Add STAFF_CREDIT_REVIEW when staff credit review API is implemented.

    return { message: "Staff assigned successfully", staffId };
  }

  async assignTpa(email: string, projectId: number, tpaId: string) {
    const staffUser = await this.usersService.findByEmail(email);
    if (!staffUser || staffUser.userType !== "s") {
      throw new ForbiddenException("Only staff can assign TPA");
    }

    const staffAssignment = await this.staffAssignmentRepository.findOne({
      where: { projectId, staffId: staffUser.id },
    });
    if (!staffAssignment) {
      throw new ForbiddenException("You are not assigned to this project");
    }

    const project = await this.requireSubmittedProject(projectId);
    const tpa = await this.userRepository.findOne({
      where: { id: tpaId },
      relations: { role: true },
    });
    if (!tpa || tpa.userType !== "T" || tpa.status !== "active") {
      throw new BadRequestException("Invalid TPA user");
    }
    await this.assertUserRatingType(tpaId, project.ratingTypeId);

    const existing = await this.tpaAssignmentRepository.findOne({ where: { projectId } });
    const action = existing ? "TPA_REASSIGNED" : "TPA_ASSIGNED";

    if (existing) {
      existing.tpaId = tpaId;
      existing.assignedBy = staffUser.id;
      await this.tpaAssignmentRepository.save(existing);
    } else {
      await this.tpaAssignmentRepository.save(
        this.tpaAssignmentRepository.create({
          projectId,
          tpaId,
          assignedBy: staffUser.id,
        }),
      );
    }

    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (certApp) {
      certApp.workflowStatus = "assigned_to_tpa";
      await this.certificationRepository.save(certApp);
    }

    await this.auditService.log(projectId, action, staffUser.id, {
      tpaId,
      tpaName: tpa.displayName,
      previousTpaId: existing?.tpaId ?? null,
      assignedBy: staffUser.displayName,
    });

    // ACTIVITY_LOG: Add TPA_POINTS_ASSIGNED / TPA_POINTS_UPDATED / TPA_POINTS_REMOVED when TPA scoring APIs exist.
    // ACTIVITY_LOG: Add TPA_REMARKS_ADDED / TPA_REMARKS_UPDATED when per-credit TPA remark APIs exist.

    return { message: "TPA assigned successfully", tpaId };
  }

  async getEligibleStaff(projectId: number, leadEmail: string) {
    const lead = await this.requireLead(leadEmail);
    const project = await this.requireSubmittedProject(projectId);
    await this.assertRatingTypeMatch(lead.id, project.ratingTypeId);

    const ratingTypeIds = project.ratingTypeId ? [project.ratingTypeId] : [];
    const userIds = await this.getUserIdsForRatingTypes(ratingTypeIds);
    if (!userIds.length) return { items: [] };

    const users = await this.userRepository.find({
      where: { id: In(userIds), userType: "s", status: "active", isLead: false },
      order: { displayName: "ASC" },
    });

    return {
      items: users.map((u) => ({
        id: u.id,
        displayName: u.displayName,
        email: u.email,
      })),
    };
  }

  async getEligibleTpas(projectId: number, staffEmail: string) {
    const staffUser = await this.usersService.findByEmail(staffEmail);
    if (!staffUser) throw new NotFoundException("User not found");

    const staffAssignment = await this.staffAssignmentRepository.findOne({
      where: { projectId, staffId: staffUser.id },
    });
    if (!staffAssignment) {
      throw new ForbiddenException("You are not assigned to this project");
    }

    const project = await this.requireSubmittedProject(projectId);
    const ratingTypeIds = project.ratingTypeId ? [project.ratingTypeId] : [];
    const userIds = await this.getUserIdsForRatingTypes(ratingTypeIds);
    if (!userIds.length) return { items: [] };

    const users = await this.userRepository.find({
      where: { id: In(userIds), userType: "T", status: "active" },
      order: { displayName: "ASC" },
    });

    return {
      items: users.map((u) => ({
        id: u.id,
        displayName: u.displayName,
        email: u.email,
      })),
    };
  }

  private async requireLead(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "s" || !user.isLead) {
      throw new ForbiddenException("Lead access required");
    }
    return user;
  }

  private async requireSubmittedProject(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException("Project not found");

    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (!certApp?.isSubmitted) {
      throw new BadRequestException("Project must be final submitted");
    }
    return project;
  }

  private async getUserRatingTypeIds(userId: string) {
    const rows = await this.userRatingTypeRepository.find({ where: { userId } });
    return rows.map((r) => r.ratingTypeId);
  }

  private async assertRatingTypeMatch(userId: string, ratingTypeId?: number | null) {
    if (!ratingTypeId) return;
    const count = await this.userRatingTypeRepository.count({
      where: { userId, ratingTypeId },
    });
    if (!count) {
      throw new ForbiddenException("Project rating type does not match your assignments");
    }
  }

  private async assertUserRatingType(userId: string, ratingTypeId?: number | null) {
    if (!ratingTypeId) return;
    const count = await this.userRatingTypeRepository.count({
      where: { userId, ratingTypeId },
    });
    if (!count) {
      throw new BadRequestException("User is not assigned to this rating type");
    }
  }

  private async getUserIdsForRatingTypes(ratingTypeIds: number[]) {
    if (!ratingTypeIds.length) return [];
    const rows = await this.userRatingTypeRepository.find({
      where: { ratingTypeId: In(ratingTypeIds) },
    });
    return [...new Set(rows.map((r) => r.userId))];
  }
}
