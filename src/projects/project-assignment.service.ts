import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";
import { UsersService } from "../users/users.service";
import { ProjectAuditService } from "./project-audit.service";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectPayment } from "./project-payment.entity";
import { ProjectStaffAssignment } from "./project-staff-assignment.entity";
import { ProjectTpaAssignment } from "./project-tpa-assignment.entity";
import { ProjectsEmailService } from "./projects-email.service";
import { Project } from "./project.entity";
import { ReviewCycleService } from "../review/review-cycle.service";

type LeadProjectListItem = {
  projectId: number;
  igbcProjectId: string;
  projectName: string;
  clientName: string;
  ownerEmail: string | null;
  ownerMobile: string | null;
  ownerOrganisation: string | null;
  ratingType: string;
  ratingTypeId: number | null;
  city: string | null;
  state: string | null;
  paymentStatus: string;
  paymentMode: string | null;
  submissionDate: string | null;
  workflowStatus: string;
  expediteReview: boolean;
  certificationTypeLabel: string | null;
  assignedStaff: { id: string; displayName: string } | null;
  assignedTpa: { id: string; displayName: string } | null;
  assignmentFee: number | null;
  assignmentCount: number | null;
};

@Injectable()
export class ProjectAssignmentService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
    @InjectRepository(ProjectPayment)
    private readonly projectPaymentRepository: Repository<ProjectPayment>,
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
    private readonly projectsEmailService: ProjectsEmailService,
    @Inject(forwardRef(() => ReviewCycleService))
    private readonly reviewCycleService: ReviewCycleService,
  ) {}

  async listLeadRegisteredProjects(email: string) {
    const lead = await this.requireLead(email);
    const ratingTypeIds = await this.getUserRatingTypeIds(lead.id);
    if (!ratingTypeIds.length) return { items: [] };

    const projects = await this.projectRepository.find({
      where: { ratingTypeId: In(ratingTypeIds) },
      order: { updatedAt: "DESC" },
    });

    const approved = projects.filter(
      (p) => p.paymentStatus === "approved" || p.paymentStatus === "paid",
    );
    return { items: await this.mapLeadProjectRows(approved) };
  }

  async listLeadTpaCoordinatorProjects(email: string) {
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
    const filtered = apps
      .map((a) => projectMap.get(a.projectId))
      .filter((p): p is Project => Boolean(p));

    return { items: await this.mapLeadProjectRows(filtered) };
  }

  async listLeadAssignedProjects(email: string) {
    const lead = await this.requireLead(email);
    const ratingTypeIds = await this.getUserRatingTypeIds(lead.id);
    if (!ratingTypeIds.length) return { items: [] };

    const staffAssignments = await this.staffAssignmentRepository.find({
      relations: { staff: true },
    });
    const tpaAssignments = await this.tpaAssignmentRepository.find({
      relations: { tpa: true },
    });
    const tpaMap = new Map(tpaAssignments.map((a) => [a.projectId, a]));
    const fullyAssigned = staffAssignments.filter((s) => tpaMap.has(s.projectId));
    if (!fullyAssigned.length) return { items: [] };

    const projects = await this.projectRepository.find({
      where: {
        id: In(fullyAssigned.map((a) => a.projectId)),
        ratingTypeId: In(ratingTypeIds),
      },
      order: { updatedAt: "DESC" },
    });

    return { items: await this.mapLeadProjectRows(projects) };
  }

  /** @deprecated Use assignTeam — kept for backward compatibility */
  async listLeadSubmittedProjects(email: string) {
    return this.listLeadTpaCoordinatorProjects(email);
  }

  async assignTeam(
    email: string,
    projectId: number,
    payload: { staffId: string; tpaId: string; fee: number; count: number },
  ) {
    const lead = await this.requireLead(email);
    const project = await this.requireSubmittedProject(projectId);
    await this.assertRatingTypeMatch(lead.id, project.ratingTypeId);

    const staff = await this.userRepository.findOne({ where: { id: payload.staffId } });
    if (!staff || staff.userType !== "s" || staff.status !== "active") {
      throw new BadRequestException("Invalid coordinator (staff) user");
    }
    if (staff.isLead) {
      throw new BadRequestException("Cannot assign to a lead user");
    }
    await this.assertUserRatingType(payload.staffId, project.ratingTypeId);

    const tpa = await this.userRepository.findOne({ where: { id: payload.tpaId } });
    if (!tpa || tpa.userType !== "T" || tpa.status !== "active") {
      throw new BadRequestException("Invalid TPA user");
    }
    await this.assertUserRatingType(payload.tpaId, project.ratingTypeId);

    const existingStaff = await this.staffAssignmentRepository.findOne({ where: { projectId } });
    const existingTpa = await this.tpaAssignmentRepository.findOne({ where: { projectId } });
    const staffAction = existingStaff ? "STAFF_REASSIGNED" : "STAFF_ASSIGNED";
    const tpaAction = existingTpa ? "TPA_REASSIGNED" : "TPA_ASSIGNED";

    if (existingStaff) {
      existingStaff.staffId = payload.staffId;
      existingStaff.assignedBy = lead.id;
      existingStaff.fee = String(payload.fee);
      existingStaff.count = payload.count;
      await this.staffAssignmentRepository.save(existingStaff);
    } else {
      await this.staffAssignmentRepository.save(
        this.staffAssignmentRepository.create({
          projectId,
          staffId: payload.staffId,
          assignedBy: lead.id,
          fee: String(payload.fee),
          count: payload.count,
        }),
      );
    }

    if (existingTpa) {
      existingTpa.tpaId = payload.tpaId;
      existingTpa.assignedBy = lead.id;
      await this.tpaAssignmentRepository.save(existingTpa);
    } else {
      await this.tpaAssignmentRepository.save(
        this.tpaAssignmentRepository.create({
          projectId,
          tpaId: payload.tpaId,
          assignedBy: lead.id,
        }),
      );
    }

    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (certApp) {
      certApp.workflowStatus = "assigned_to_tpa";
      await this.certificationRepository.save(certApp);
    }

    if (certApp?.isSubmitted) {
      await this.reviewCycleService.ensureCycleFromCertApp(projectId);
    }

    await this.reviewCycleService.syncAssignments(projectId, payload.staffId, payload.tpaId);

    const detail = await this.projectDetailRepository.findOne({ where: { projectId } });
    const projectLabel = project.igbcProjectId ?? project.temporaryProjectId;

    await this.auditService.log(projectId, "TEAM_ASSIGNED", lead.id, {
      staffId: payload.staffId,
      staffName: staff.displayName,
      tpaId: payload.tpaId,
      tpaName: tpa.displayName,
      fee: payload.fee,
      count: payload.count,
      assignedBy: lead.displayName,
    });
    await this.auditService.log(projectId, staffAction, lead.id, {
      staffId: payload.staffId,
      staffName: staff.displayName,
      previousStaffId: existingStaff?.staffId ?? null,
      assignedBy: lead.displayName,
    });
    await this.auditService.log(projectId, tpaAction, lead.id, {
      tpaId: payload.tpaId,
      tpaName: tpa.displayName,
      previousTpaId: existingTpa?.tpaId ?? null,
      assignedBy: lead.displayName,
    });

    await this.projectsEmailService.sendProjectAssignmentEmail({
      to: staff.email,
      recipientName: staff.displayName,
      roleLabel: "Coordinator",
      projectId: projectLabel,
      projectName: detail?.projectName ?? project.ratingSystem,
      ratingSystem: project.ratingSystem,
      fee: payload.fee,
      count: payload.count,
    });
    await this.projectsEmailService.sendProjectAssignmentEmail({
      to: tpa.email,
      recipientName: tpa.displayName,
      roleLabel: "TPA",
      projectId: projectLabel,
      projectName: detail?.projectName ?? project.ratingSystem,
      ratingSystem: project.ratingSystem,
      fee: payload.fee,
      count: payload.count,
    });

    return {
      message: "Coordinator and TPA assigned successfully",
      staffId: payload.staffId,
      tpaId: payload.tpaId,
    };
  }

  /** @deprecated Use assignTeam */
  async assignStaff(email: string, projectId: number, staffId: string) {
    throw new BadRequestException(
      "Staff-only assignment is disabled. Assign coordinator and TPA together.",
    );
  }

  async assignTpa(_email: string, _projectId: number, _tpaId: string) {
    throw new BadRequestException(
      "TPA-only assignment is disabled for staff. Use lead team assignment instead.",
    );
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

  async getEligibleTpas(projectId: number, leadEmail: string) {
    const lead = await this.requireLead(leadEmail);
    const project = await this.requireSubmittedProject(projectId);
    await this.assertRatingTypeMatch(lead.id, project.ratingTypeId);

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

  private async mapLeadProjectRows(projects: Project[]): Promise<LeadProjectListItem[]> {
    if (!projects.length) return [];

    const projectIds = projects.map((p) => p.id);
    const [details, payments, apps, staffAssignments, tpaAssignments] = await Promise.all([
      this.projectDetailRepository.find({ where: { projectId: In(projectIds) } }),
      this.projectPaymentRepository.find({ where: { projectId: In(projectIds) } }),
      this.certificationRepository.find({ where: { projectId: In(projectIds) } }),
      this.staffAssignmentRepository.find({
        where: { projectId: In(projectIds) },
        relations: { staff: true },
      }),
      this.tpaAssignmentRepository.find({
        where: { projectId: In(projectIds) },
        relations: { tpa: true },
      }),
    ]);

    const detailMap = new Map(details.map((d) => [d.projectId, d]));
    const paymentMap = new Map(payments.map((p) => [p.projectId, p]));
    const appMap = new Map(apps.map((a) => [a.projectId, a]));
    const staffMap = new Map(staffAssignments.map((a) => [a.projectId, a]));
    const tpaMap = new Map(tpaAssignments.map((a) => [a.projectId, a]));

    const clientIds = [...new Set(projects.map((p) => p.createdByUserId))];
    const clients = await this.userRepository.find({ where: { id: In(clientIds) } });
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    return projects.map((project) => {
      const detail = detailMap.get(project.id);
      const payment = paymentMap.get(project.id);
      const app = appMap.get(project.id);
      const client = clientMap.get(project.createdByUserId);
      const staff = staffMap.get(project.id);
      const tpa = tpaMap.get(project.id);
      const certificationTypeLabel =
        app?.certificationType === 1
          ? "Pre-Certification"
          : app?.certificationType === 2
            ? "Certification"
            : null;

      return {
        projectId: project.id,
        igbcProjectId: project.igbcProjectId ?? project.temporaryProjectId,
        projectName: detail?.projectName ?? project.ratingSystem,
        clientName: client?.displayName ?? "—",
        ownerEmail: client?.email ?? null,
        ownerMobile: client?.mobile ?? client?.telephone ?? null,
        ownerOrganisation: client?.organization ?? null,
        ratingType: project.ratingSystem,
        ratingTypeId: project.ratingTypeId ?? null,
        city: detail?.city ?? null,
        state: detail?.state ?? null,
        paymentStatus: project.paymentStatus,
        paymentMode: payment?.paymentMethod ?? null,
        submissionDate: app?.submittedAt?.toISOString() ?? null,
        workflowStatus: app?.workflowStatus ?? "draft",
        expediteReview: app?.expediteReview === true,
        certificationTypeLabel,
        assignedStaff: staff
          ? { id: staff.staffId, displayName: staff.staff.displayName }
          : null,
        assignedTpa: tpa ? { id: tpa.tpaId, displayName: tpa.tpa.displayName } : null,
        assignmentFee: staff?.fee != null ? Number(staff.fee) : null,
        assignmentCount: staff?.count ?? null,
      };
    });
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
