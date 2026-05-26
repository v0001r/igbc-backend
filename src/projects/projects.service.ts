<<<<<<< HEAD
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CertificationFormResponse } from "./certification-form.types";
import { CreateProjectDto } from "./dto/create-project.dto";
import { SaveCertificationSectionDto } from "./dto/save-certification-section.dto";
import { UploadCertificationDocumentsDto } from "./dto/upload-certification-documents.dto";
import { Project } from "./project.entity";
import { RatingFormService, certificationLocked } from "./rating-form.service";
import { RatingType } from "./rating-type.entity";
import { RatingConfigService } from "../rating-config/rating-config.service";
import type { CertificationWorkspaceResponse } from "../rating-config/rating-config.types";
import { defaultVersionFromList, resolveAutoVersionType } from "./project-form-data.types";
import { RATING_TYPE_SEED } from "./rating-types.seed";
import type { UploadedFile } from "./uploaded-file.type";
import { UsersService } from "../users/users.service";
import { UpdateProjectStatusDto } from "./dto/update-project-status.dto";
import type { ProjectRegistrationStatus, ProjectCertificationStatus } from "./project.entity";

export type ProjectResponse = {
  id: string;
  projectCode: string;
  projectName: string;
  category?: string;
  constructionType?: string;
  city?: string;
  ownerName?: string;
  ownerMobile?: string;
  ownerEmail?: string;
  ownerOrg?: string;
  paymentMode: string;
  registrationStatus: string;
  certificationStatus: string;
  invoiceNo?: string;
  area?: string;
  ratingTypeId: number;
  ratingTypeName: string;
  ratingAbbreviation: string;
  configKey: string | null;
  hasConfig: boolean;
  versionTypes: string[];
  versionType: string;
  createdAt: string;
};

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(RatingType)
    private readonly ratingTypeRepo: Repository<RatingType>,
    private readonly ratingFormService: RatingFormService,
    private readonly ratingConfigService: RatingConfigService,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    await this.seedRatingTypes();
    await this.seedDemoProjectsIfEmpty();
    await this.ensureFactoryV331Demo();
  }

  private async seedRatingTypes() {
    for (const row of RATING_TYPE_SEED) {
      const existing = await this.ratingTypeRepo.findOne({ where: { id: row.id } });
      if (existing) {
        existing.name = row.name;
        existing.abbreviation = row.abbreviation;
        existing.configKey = row.configKey;
        existing.versionTypes = row.versionTypes;
        await this.ratingTypeRepo.save(existing);
      } else {
        await this.ratingTypeRepo.save(this.ratingTypeRepo.create(row));
      }
    }
  }

  /** Demo for testing greenFactories v3.3.1 config (rating type 3). */
  private async ensureFactoryV331Demo() {
    const code = "IGBCGFB331260007";
    const existing = await this.projectRepo.findOne({ where: { projectCode: code } });
    if (existing) return;

    const ratingType = await this.ratingTypeRepo.findOne({ where: { id: 3 } });
    if (!ratingType) return;

    const project = this.projectRepo.create({
      projectCode: code,
      userId: "00000000-0000-0000-0000-000000000001",
      ratingTypeId: 3,
      ratingType,
      versionType: "3.3.1",
      projectName: "Factory v3.3.1 Test Project",
      category: "Industrial",
      constructionType: "New / Upcoming",
      city: "Chennai",
      ownerName: "Test Owner",
      ownerMobile: "9000000001",
      ownerEmail: "factory331@test.in",
      ownerOrg: "IGBC Test",
      paymentMode: "offline",
      registrationStatus: "approved",
      certificationStatus: "approved",
    });
    await this.projectRepo.save(project);
  }

  private async seedDemoProjectsIfEmpty() {
    const count = await this.projectRepo.count();
    if (count > 0) return;

    const demos: Array<Partial<Project> & { code: string; ratingId: number; versionType?: string }> = [
      {
        code: "IGBCGFB260001",
        ratingId: 3,
        projectName: "CII GBC New Test 2",
        category: "Industrial",
        constructionType: "New / Upcoming",
        city: "Hyderabad",
        ownerName: "Rishav Kumar",
        ownerMobile: "9424858879",
        ownerEmail: "rishav.kumar@cii.in",
        ownerOrg: "CII IGBC",
        paymentMode: "offline",
        registrationStatus: "approved",
        certificationStatus: "approved",
        area: "1,00,000 sq ft",
        invoiceNo: "PI-20260301",
      },
      {
        code: "IGBCGI260002",
        ratingId: 5,
        projectName: "SBI GHAZIPUR DAIRY FARM BRANCH NEW DELHI",
        category: "Commercial",
        constructionType: "Existing",
        city: "New Delhi",
        ownerName: "NAVIN KUMAR",
        ownerMobile: "9430966364",
        ownerEmail: "agmpre.lhodel@sbi.co.in",
        ownerOrg: "STATE BANK OF INDIA",
        paymentMode: "offline",
        registrationStatus: "pending",
        certificationStatus: "approved",
        area: "65,000 sq ft",
        invoiceNo: "PI-20260215",
      },
      {
        code: "IGBCGH260003",
        ratingId: 2,
        projectName: "Conscient 4, Residential Development at Sector-106, Gurugram",
        category: "Residential",
        constructionType: "New / Upcoming",
        city: "Gurugram",
        ownerName: "Sanjay Rastogi",
        ownerMobile: "9810030139",
        ownerEmail: "sanjay.rastogi@conscient.in",
        ownerOrg: "Prime Infradevelopers Pvt. Ltd.",
        paymentMode: "offline",
        registrationStatus: "pending",
        certificationStatus: "approved",
        area: "3,50,000 sq ft",
        invoiceNo: "PI-20260110",
      },
      {
        code: "IGBCGNB260004",
        ratingId: 1,
        versionType: "4",
        projectName: "Green Heights Commercial",
        category: "Commercial",
        constructionType: "New / Upcoming",
        city: "Mumbai",
        ownerName: "Rajesh Sharma",
        ownerMobile: "9876543210",
        ownerEmail: "rajesh@greenheights.com",
        ownerOrg: "GreenHeights Corp",
        paymentMode: "online",
        registrationStatus: "approved",
        certificationStatus: "accepted",
        area: "1,20,000 sq ft",
        invoiceNo: "PI-20251201",
      },
      {
        code: "IGBCGH260005",
        ratingId: 2,
        projectName: "Sunrise Residences Phase 2",
        category: "Residential",
        constructionType: "New / Upcoming",
        city: "Bangalore",
        ownerName: "Priya Mehta",
        ownerMobile: "9988776655",
        ownerEmail: "priya@sunrise.in",
        ownerOrg: "Sunrise Developers",
        paymentMode: "online",
        registrationStatus: "approved",
        certificationStatus: "accepted",
        area: "85,000 sq ft",
        invoiceNo: "PI-20251115",
      },
      {
        code: "IGBCGEB260006",
        ratingId: 4,
        projectName: "Heritage Green Campus",
        category: "Education",
        constructionType: "Existing",
        city: "Delhi",
        ownerName: "Dr. Sunita Rao",
        ownerMobile: "9112233445",
        ownerEmail: "sunita@heritagecampus.edu",
        ownerOrg: "Heritage Foundation",
        paymentMode: "offline",
        registrationStatus: "in-review",
        certificationStatus: "pending",
        area: "3,50,000 sq ft",
        invoiceNo: "PI-20251005",
      },
    ];

    for (const d of demos) {
      const ratingType = await this.ratingTypeRepo.findOne({ where: { id: d.ratingId } });
      if (!ratingType) continue;
      const project = this.projectRepo.create({
        projectCode: d.code,
        userId: "00000000-0000-0000-0000-000000000001",
        ratingTypeId: d.ratingId,
        ratingType,
        projectName: d.projectName!,
        category: d.category,
        constructionType: d.constructionType,
        city: d.city,
        ownerName: d.ownerName,
        ownerMobile: d.ownerMobile,
        ownerEmail: d.ownerEmail,
        ownerOrg: d.ownerOrg,
        paymentMode: d.paymentMode ?? "offline",
        registrationStatus: d.registrationStatus as Project["registrationStatus"],
        certificationStatus: d.certificationStatus as Project["certificationStatus"],
        area: d.area,
        invoiceNo: d.invoiceNo,
        versionType: d.versionType ?? defaultVersionFromList(ratingType.versionTypes),
      });
      await this.projectRepo.save(project);
    }
  }

  async listRatingTypes() {
    const rows = await this.ratingTypeRepo.find({ order: { id: "ASC" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      abbreviation: r.abbreviation,
      configKey: r.configKey,
      hasConfig: Boolean(r.configKey),
      versionTypes: r.versionTypes ?? ["3"],
    }));
  }

  async listForUser(userId: string): Promise<ProjectResponse[]> {
    const rows = await this.projectRepo.find({
      where: { userId },
      relations: ["ratingType"],
      order: { createdAt: "DESC" },
    });
    if (rows.length === 0) {
      const demos = await this.projectRepo.find({
        where: { userId: "00000000-0000-0000-0000-000000000001" },
        relations: ["ratingType"],
        order: { createdAt: "DESC" },
      });
      return demos.map((p) => this.toResponse(p));
    }
    return rows.map((p) => this.toResponse(p));
  }

  async getByIdForUser(id: string, userId: string): Promise<ProjectResponse> {
    const project = await this.findProjectWithAccess(id, userId);
    return this.toResponse(project);
  }

  async listForAdmin(
    adminEmail: string,
    filters?: { registrationStatus?: string; certificationStatus?: string },
  ): Promise<ProjectResponse[]> {
    await this.ensureAdminAccess(adminEmail);
    const where: Record<string, string> = {};
    if (filters?.registrationStatus) {
      where.registrationStatus = filters.registrationStatus;
    }
    if (filters?.certificationStatus) {
      where.certificationStatus = filters.certificationStatus;
    }
    const rows = await this.projectRepo.find({
      where,
      relations: ["ratingType"],
      order: { createdAt: "DESC" },
    });
    return rows.map((p) => this.toResponse(p));
  }

  async getByIdForAdmin(id: string, adminEmail: string): Promise<ProjectResponse> {
    await this.ensureAdminAccess(adminEmail);
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ["ratingType"],
    });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    return this.toResponse(project);
  }

  async updateStatusForAdmin(
    id: string,
    adminEmail: string,
    dto: UpdateProjectStatusDto,
  ): Promise<ProjectResponse> {
    await this.ensureAdminAccess(adminEmail);
    if (!dto.registrationStatus && !dto.certificationStatus) {
      throw new BadRequestException("Provide registrationStatus and/or certificationStatus");
    }
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ["ratingType"],
    });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (dto.registrationStatus) {
      project.registrationStatus = dto.registrationStatus as ProjectRegistrationStatus;
    }
    if (dto.certificationStatus) {
      project.certificationStatus = dto.certificationStatus as ProjectCertificationStatus;
    }
    const saved = await this.projectRepo.save(project);
    return this.toResponse(saved);
  }

  async approveRegistrationForAdmin(id: string, adminEmail: string): Promise<ProjectResponse> {
    await this.ensureAdminAccess(adminEmail);
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ["ratingType"],
    });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    project.registrationStatus = "approved";
    const response = this.toResponse(project);
    if (response.hasConfig) {
      project.certificationStatus = "approved";
    }
    const saved = await this.projectRepo.save(project);
    return this.toResponse(saved);
  }

  async rejectRegistrationForAdmin(id: string, adminEmail: string): Promise<ProjectResponse> {
    return this.updateStatusForAdmin(id, adminEmail, { registrationStatus: "rejected" });
  }

  async approveCertificationForAdmin(id: string, adminEmail: string): Promise<ProjectResponse> {
    return this.updateStatusForAdmin(id, adminEmail, { certificationStatus: "approved" });
  }

  async create(userId: string, dto: CreateProjectDto): Promise<ProjectResponse> {
    const ratingType = await this.ratingTypeRepo.findOne({ where: { id: dto.ratingTypeId } });
    if (!ratingType) {
      throw new BadRequestException("Invalid rating type");
    }

    const versionType = this.resolveVersionType(ratingType);
    const projectCode = await this.generateProjectCode(ratingType.abbreviation);
    const project = this.projectRepo.create({
      projectCode,
      userId,
      ratingTypeId: ratingType.id,
      ratingType,
      versionType,
      projectName: dto.projectName,
      category: dto.category,
      constructionType: dto.constructionType,
      city: dto.city,
      ownerName: dto.ownerName,
      ownerMobile: dto.ownerMobile,
      ownerEmail: dto.ownerEmail,
      ownerOrg: dto.ownerOrg,
      paymentMode: dto.paymentMode ?? "offline",
      registrationStatus: "pending",
      certificationStatus: "not_started",
    });
    const saved = await this.projectRepo.save(project);
    return this.toResponse(saved);
  }

  async getCertificationForm(id: string, userId: string): Promise<CertificationFormResponse> {
    const project = await this.findProjectWithAccess(id, userId);
    if (!this.isCertificationUnlocked(project.certificationStatus)) {
      throw certificationLocked();
    }
    if (!project.ratingType?.configKey) {
      throw new BadRequestException("No certification config for this rating type");
    }
    return this.ratingFormService.getForm(project);
  }

  async getCertificationWorkspace(
    id: string,
    userId: string,
  ): Promise<CertificationWorkspaceResponse> {
    const project = await this.findProjectWithAccess(id, userId);
    if (!this.isCertificationUnlocked(project.certificationStatus)) {
      throw certificationLocked();
    }

    const configKey = project.ratingType?.configKey;
    if (!configKey) {
      throw new BadRequestException("No certification config for this rating type");
    }

    const versionType = project.versionType ?? defaultVersionFromList(project.ratingType?.versionTypes);
    if (!this.ratingConfigService.hasConfig(configKey, versionType)) {
      throw new BadRequestException(
        `No certification config file for ${configKey} version ${versionType}`,
      );
    }

    const form = await this.ratingFormService.getForm(project);
    return this.ratingConfigService.buildWorkspacePayload({
      projectId: project.id,
      projectCode: project.projectCode,
      projectName: project.projectName,
      ratingTypeId: project.ratingTypeId,
      ratingTypeName: project.ratingType?.name ?? "",
      configKey,
      versionType,
      form,
    });
  }

  async saveCertificationSection(
    id: string,
    userId: string,
    dto: SaveCertificationSectionDto,
  ): Promise<CertificationFormResponse> {
    const project = await this.findProjectWithAccess(id, userId);
    if (!this.isCertificationUnlocked(project.certificationStatus)) {
      throw certificationLocked();
    }
    if (!project.ratingType?.configKey) {
      throw new BadRequestException("No certification config for this rating type");
    }
    const form = await this.ratingFormService.saveSection(project, dto);
    project.certificationCurrentTab = dto.currentTab ?? dto.tab;
    project.certificationCurrentSubtab = dto.currentSubtab ?? dto.subtab;
    await this.projectRepo.save(project);
    return form;
  }

  async uploadCertificationDocuments(
    id: string,
    userId: string,
    dto: UploadCertificationDocumentsDto,
    files: UploadedFile[],
    replace: boolean,
  ): Promise<CertificationFormResponse> {
    const project = await this.findProjectWithAccess(id, userId);
    if (!this.isCertificationUnlocked(project.certificationStatus)) {
      throw certificationLocked();
    }
    if (!project.ratingType?.configKey) {
      throw new BadRequestException("No certification config for this rating type");
    }
    return this.ratingFormService.uploadDocuments(
      project,
      dto.tab,
      dto.subtab,
      dto.paramName,
      files,
      replace,
    );
=======
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Like, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateProjectStepOneDto } from "./dto/create-project-step-one.dto";
import { UpsertProjectStepFourDto } from "./dto/upsert-project-step-four.dto";
import { UpsertProjectStepFiveDto } from "./dto/upsert-project-step-five.dto";
import { UpsertProjectStepTwoDto } from "./dto/upsert-project-step-two.dto";
import { UpsertProjectStepThreeDto } from "./dto/upsert-project-step-three.dto";
import { ProjectContact } from "./project-contact.entity";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectInvoice } from "./project-invoice.entity";
import { ProjectPayment } from "./project-payment.entity";
import { ProjectsEmailService } from "./projects-email.service";
import { Project } from "./project.entity";

interface RatingSystemFeeItem {
  ratingName: string;
  shortRatingName: string;
  fees: {
    nonMember: number;
  };
}

@Injectable()
export class ProjectsService {
  private static readonly TOTAL_REGISTRATION_STEPS = 5;

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
    @InjectRepository(ProjectContact)
    private readonly projectContactRepository: Repository<ProjectContact>,
    @InjectRepository(ProjectInvoice)
    private readonly projectInvoiceRepository: Repository<ProjectInvoice>,
    @InjectRepository(ProjectPayment)
    private readonly projectPaymentRepository: Repository<ProjectPayment>,
    private readonly usersService: UsersService,
    private readonly projectsEmailService: ProjectsEmailService,
  ) {}

  async createStepOne(email: string, dto: CreateProjectStepOneDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (dto.projectId || dto.temporaryProjectId) {
      const project = dto.projectId
        ? await this.projectRepository.findOne({ where: { id: dto.projectId } })
        : await this.projectRepository.findOne({
            where: { temporaryProjectId: dto.temporaryProjectId },
          });

      if (!project) {
        throw new NotFoundException("Project not found");
      }
      if (project.createdByUserId !== user.id) {
        throw new ForbiddenException("You can update only your own project");
      }

      return this.upsertStepOne(email, project.id, dto);
    }

    const registrationFee = this.getNonMemberFeeByRatingSystem(dto.ratingSystem);

    const saved = await this.projectRepository.save(
      this.projectRepository.create({
        createdByUserId: user.id,
        categoryId: dto.category,
        ratingSystem: dto.ratingSystem,
        subRatingType: dto.subRatingType,
        projectType: dto.projectType,
        constructionType: dto.constructionType,
        temporaryProjectId: "P00TEMP",
        status: "saved",
        paymentStatus: "pending",
        currentStep: 1,
        registrationFee: registrationFee.toFixed(2),
      }),
    );

    const temporaryProjectId = `P00${saved.id}`;
    const updated = await this.projectRepository.save(
      this.projectRepository.merge(saved, {
        temporaryProjectId,
      }),
    );

    return {
      id: updated.id,
      igbcProjectId: updated.igbcProjectId ?? null,
      temporaryProjectId: updated.temporaryProjectId,
      createdByUserId: updated.createdByUserId,
      status: updated.status,
      currentStep: updated.currentStep,
      stepOne: {
        category: updated.categoryId,
        ratingSystem: updated.ratingSystem,
        subRatingType: updated.subRatingType,
        projectType: updated.projectType,
        constructionType: updated.constructionType,
        registrationFee: Number(updated.registrationFee ?? 0),
      },
      createdAt: updated.createdAt,
    };
  }

  async upsertStepOne(email: string, projectId: number, dto: CreateProjectStepOneDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can update only your own project");
    }

    const registrationFee = this.getNonMemberFeeByRatingSystem(dto.ratingSystem);

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        categoryId: dto.category,
        ratingSystem: dto.ratingSystem,
        subRatingType: dto.subRatingType,
        projectType: dto.projectType,
        constructionType: dto.constructionType,
        registrationFee: registrationFee.toFixed(2),
      }),
    );

    const recalculatedInvoice = await this.recalculateStepFourAmountsIfExists(
      updatedProject.id,
      registrationFee,
    );

    return {
      id: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      temporaryProjectId: updatedProject.temporaryProjectId,
      status: updatedProject.status,
      currentStep: updatedProject.currentStep,
      stepOne: {
        category: updatedProject.categoryId,
        ratingSystem: updatedProject.ratingSystem,
        subRatingType: updatedProject.subRatingType,
        projectType: updatedProject.projectType,
        constructionType: updatedProject.constructionType,
        registrationFee: Number(updatedProject.registrationFee ?? 0),
      },
      finalPayableAmount: Number(recalculatedInvoice?.totalPayable ?? updatedProject.finalPayableAmount ?? 0),
      message: recalculatedInvoice
        ? "Step-1 updated and step-4 invoice totals recalculated based on new rating system fee."
        : "Step-1 updated and registration fee refreshed based on new rating system.",
    };
  }

  async getMyProjects(
    email: string,
    tab?: "saved" | "submitted" | "approved" | "rejected",
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const allProjects = await this.projectRepository.find({
      where: { createdByUserId: user.id },
      order: { updatedAt: "DESC", id: "DESC" },
    });

    const projectIds = allProjects.map((project) => project.id);
    const details = projectIds.length
      ? await this.projectDetailRepository.find({
          where: projectIds.map((projectId) => ({ projectId })),
        })
      : [];
    const detailByProjectId = new Map(details.map((detail) => [detail.projectId, detail]));

    const counts = {
      saved: allProjects.filter((project) => project.status === "saved").length,
      submitted: allProjects.filter((project) => project.status === "submitted").length,
      approved: allProjects.filter(
        (project) => project.paymentStatus === "approved" || project.paymentStatus === "paid",
      ).length,
      rejected: allProjects.filter((project) => project.paymentStatus === "rejected").length,
    };

    const filtered = tab
      ? allProjects.filter((project) => {
          if (tab === "saved" || tab === "submitted") {
            return project.status === tab;
          }
          if (tab === "approved") {
            return project.paymentStatus === "approved" || project.paymentStatus === "paid";
          }
          return project.paymentStatus === tab;
        })
      : allProjects;

    return {
      counts,
      tab: tab ?? "all",
      total: filtered.length,
      items: filtered.map((project) => {
        const detail = detailByProjectId.get(project.id);
        return {
          id: project.id,
          igbcProjectId: project.igbcProjectId ?? null,
          temporaryProjectId: project.temporaryProjectId,
          status: project.status,
          paymentStatus: project.paymentStatus,
          certificateAppliedStatus: project.certificateAppliedStatus,
          currentStep: project.currentStep,
          categoryId: project.categoryId,
          ratingSystem: project.ratingSystem,
          subRatingType: project.subRatingType,
          projectType: project.projectType,
          constructionType: project.constructionType,
          registrationFee: Number(project.registrationFee ?? 0),
          finalPayableAmount: Number(project.finalPayableAmount ?? 0),
          rejectRemark: project.rejectRemark ?? null,
          projectName: detail?.projectName ?? null,
          city: detail?.city ?? null,
          state: detail?.state ?? null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      }),
    };
  }

  async getAdminProjects(
    email: string,
    tab?: "saved" | "submitted" | "approved" | "rejected",
  ) {
    await this.ensureAdminAccess(email);

    const allProjects = await this.projectRepository.find({
      order: { updatedAt: "DESC", id: "DESC" },
    });

    const projectIds = allProjects.map((project) => project.id);
    const details = projectIds.length
      ? await this.projectDetailRepository.find({
          where: projectIds.map((projectId) => ({ projectId })),
        })
      : [];
    const payments = projectIds.length
      ? await this.projectPaymentRepository.find({
          where: projectIds.map((projectId) => ({ projectId })),
        })
      : [];
    const detailByProjectId = new Map(details.map((detail) => [detail.projectId, detail]));
    const paymentByProjectId = new Map(payments.map((payment) => [payment.projectId, payment]));

    const ownerIds = allProjects.map((project) => project.createdByUserId);
    const owners = await this.usersService.getUsersByIds(ownerIds);
    const ownerById = new Map(owners.map((owner) => [owner.id, owner]));

    const counts = {
      saved: allProjects.filter((project) => project.status === "saved").length,
      submitted: allProjects.filter((project) => project.status === "submitted").length,
      approved: allProjects.filter(
        (project) => project.paymentStatus === "approved" || project.paymentStatus === "paid",
      ).length,
      rejected: allProjects.filter((project) => project.paymentStatus === "rejected").length,
    };

    const filtered = tab
      ? allProjects.filter((project) => {
          if (tab === "saved" || tab === "submitted") {
            return project.status === tab;
          }
          if (tab === "approved") {
            return project.paymentStatus === "approved" || project.paymentStatus === "paid";
          }
          return project.paymentStatus === tab;
        })
      : allProjects;

    return {
      counts,
      tab: tab ?? "all",
      total: filtered.length,
      items: filtered.map((project) => {
        const detail = detailByProjectId.get(project.id);
        const payment = paymentByProjectId.get(project.id);
        const owner = ownerById.get(project.createdByUserId);

        return {
          id: project.id,
          igbcProjectId: project.igbcProjectId ?? null,
          temporaryProjectId: project.temporaryProjectId,
          status: project.status,
          paymentStatus: project.paymentStatus,
          currentStep: project.currentStep,
          categoryId: project.categoryId,
          ratingSystem: project.ratingSystem,
          subRatingType: project.subRatingType,
          projectType: project.projectType,
          constructionType: project.constructionType,
          registrationFee: Number(project.registrationFee ?? 0),
          finalPayableAmount: Number(project.finalPayableAmount ?? 0),
          rejectRemark: project.rejectRemark ?? null,
          projectName: detail?.projectName ?? null,
          city: detail?.city ?? null,
          state: detail?.state ?? null,
          ownerName: owner?.displayName ?? null,
          ownerEmail: owner?.email ?? null,
          ownerMobile: owner?.mobile ?? owner?.telephone ?? null,
          paymentMethod: payment?.paymentMethod ?? null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      }),
    };
  }

  async getAdminProjectView(email: string, projectId: number) {
    await this.ensureAdminAccess(email);
    return this.getProjectViewById(projectId);
  }

  async approveProject(email: string, projectId: number) {
    await this.ensureAdminAccess(email);

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const detail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });
    const contact = await this.projectContactRepository.findOne({
      where: { projectId: project.id },
    });
    const owner = await this.usersService.getUsersByIds([project.createdByUserId]);
    const ownerEmail = owner[0]?.email;

    const igbcProjectId =
      project.igbcProjectId ??
      (await this.generateIgbcProjectId({
        ratingSystem: project.ratingSystem,
      }));

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        igbcProjectId,
        status: "approved",
        paymentStatus: "paid",
        currentStep: Math.max(project.currentStep, 5),
      }),
    );

    const contactEmails = this.extractEmailsFromObject(contact?.formData);
    const recipients = [...new Set([...contactEmails, ...(ownerEmail ? [ownerEmail] : [])])];

    await this.projectsEmailService.sendProjectApprovedEmail({
      to: recipients,
      projectId: updatedProject.igbcProjectId ?? updatedProject.temporaryProjectId,
      projectName: detail?.projectName ?? null,
      ratingSystem: updatedProject.ratingSystem,
    });

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId,
      status: updatedProject.status,
      paymentStatus: updatedProject.paymentStatus,
      notifiedEmails: recipients,
      message: "Project approved, payment marked as paid, and notification emails sent.",
    };
  }

  async rejectProject(email: string, projectId: number, remark: string) {
    await this.ensureAdminAccess(email);

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const detail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });
    const contact = await this.projectContactRepository.findOne({
      where: { projectId: project.id },
    });
    const owner = await this.usersService.getUsersByIds([project.createdByUserId]);
    const ownerEmail = owner[0]?.email;

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        status: "rejected",
        paymentStatus: "paid",
        rejectRemark: remark,
      }),
    );

    const contactEmails = this.extractEmailsFromObject(contact?.formData);
    const recipients = [...new Set([...contactEmails, ...(ownerEmail ? [ownerEmail] : [])])];

    await this.projectsEmailService.sendProjectRejectedEmail({
      to: recipients,
      projectId:
        updatedProject.igbcProjectId ??
        updatedProject.temporaryProjectId ??
        updatedProject.id.toString(),
      projectName: detail?.projectName ?? null,
      ratingSystem: updatedProject.ratingSystem,
      remark,
    });

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      status: updatedProject.status,
      paymentStatus: updatedProject.paymentStatus,
      rejectRemark: updatedProject.rejectRemark,
      notifiedEmails: recipients,
      message: "Project rejected, payment marked as paid, and rejection emails sent.",
    };
  }

  async getProjectFullDetails(email: string, projectId: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can view only your own project");
    }
    return this.getProjectViewById(projectId);
  }

  async getCertificationApplicationStepOnePrefill(email: string, projectId: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can view only your own project");
    }

    const isApprovedProject =
      project.status === "approved" &&
      (project.paymentStatus === "paid" || project.paymentStatus === "approved");
    if (!isApprovedProject) {
      throw new BadRequestException(
        "Certification application can be created only for approved projects",
      );
    }

    const projectDetail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });
    if (!projectDetail) {
      throw new NotFoundException("Project registration details not found");
    }

    return {
      projectId: project.id,
      igbcProjectId: project.igbcProjectId ?? null,
      temporaryProjectId: project.temporaryProjectId,
      certificationApplicationStatus: project.certificateAppliedStatus,
      status: project.status,
      paymentStatus: project.paymentStatus,
      stepOne: {
        category: project.categoryId,
        ratingSystem: project.ratingSystem,
        subRatingType: project.subRatingType ?? null,
        projectType: project.projectType,
        constructionType: project.constructionType,
        projectName: projectDetail.projectName,
        address: projectDetail.address,
        city: projectDetail.city,
        state: projectDetail.state,
        pincode: projectDetail.pincode,
        siteAreaSqm: Number(projectDetail.siteAreaSqm),
        siteAreaSqft: Number(projectDetail.siteAreaSqft),
        numberOfBuildings: projectDetail.numberOfBuildings,
        totalBuiltUpAreaSqft: Number(projectDetail.totalBuiltUpAreaSqft),
        totalBuiltUpAreaSqm: Number(projectDetail.totalBuiltUpAreaSqm),
        constructionStartDate: projectDetail.constructionStartDate ?? null,
        targetCertificationDate: projectDetail.targetCertificationDate ?? null,
      },
      message:
        "Step-1 prefill data fetched from project registration. Certification application is allowed only for approved projects.",
    };
  }

  async upsertStepTwo(email: string, projectId: number, dto: UpsertProjectStepTwoDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can update only your own project");
    }

    const existingDetail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });

    const savedDetail = await this.projectDetailRepository.save(
      this.projectDetailRepository.create({
        id: existingDetail?.id,
        projectId: project.id,
        projectName: dto.projectName,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        pincode: dto.pincode,
        siteAreaSqm: dto.siteAreaSqm.toFixed(2),
        siteAreaSqft: dto.siteAreaSqft.toFixed(2),
        numberOfBuildings: dto.numberOfBuildings,
        totalBuiltUpAreaSqft: dto.totalBuiltUpAreaSqft.toFixed(2),
        totalBuiltUpAreaSqm: dto.totalBuiltUpAreaSqm.toFixed(2),
        constructionStartDate: dto.constructionStartDate,
        targetCertificationDate: dto.targetCertificationDate,
      }),
    );

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        currentStep: Math.max(project.currentStep, 2),
      }),
    );

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      temporaryProjectId: updatedProject.temporaryProjectId,
      currentStep: updatedProject.currentStep,
      projectDetails: {
        id: savedDetail.id,
        projectName: savedDetail.projectName,
        address: savedDetail.address,
        city: savedDetail.city,
        state: savedDetail.state,
        pincode: savedDetail.pincode,
        siteAreaSqm: Number(savedDetail.siteAreaSqm),
        siteAreaSqft: Number(savedDetail.siteAreaSqft),
        numberOfBuildings: savedDetail.numberOfBuildings,
        totalBuiltUpAreaSqft: Number(savedDetail.totalBuiltUpAreaSqft),
        totalBuiltUpAreaSqm: Number(savedDetail.totalBuiltUpAreaSqm),
        constructionStartDate: savedDetail.constructionStartDate ?? null,
        targetCertificationDate: savedDetail.targetCertificationDate ?? null,
      },
    };
  }

  async upsertStepThree(email: string, projectId: number, dto: UpsertProjectStepThreeDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can update only your own project");
    }

    const existingContact = await this.projectContactRepository.findOne({
      where: { projectId: project.id },
    });

    const savedContact = await this.projectContactRepository.save(
      this.projectContactRepository.create({
        id: existingContact?.id,
        projectId: project.id,
        formData: dto.formData,
      }),
    );

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        currentStep: Math.max(project.currentStep, 3),
      }),
    );

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      temporaryProjectId: updatedProject.temporaryProjectId,
      currentStep: updatedProject.currentStep,
      contacts: savedContact.formData,
    };
  }

  async upsertStepFour(email: string, projectId: number, dto: UpsertProjectStepFourDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can update only your own project");
    }

    const existingInvoice = await this.projectInvoiceRepository.findOne({
      where: { projectId: project.id },
    });
    const registrationFee = this.getNonMemberFeeByRatingSystem(project.ratingSystem);
    const normalizedAddress = dto.address ?? dto.organizationAddress;
    const normalizedPinCode = dto.pinCode ?? dto.pincode;
    const normalizedHasGstNumber = dto.hasGstNumber ?? dto.hasGst ?? false;

    if (!normalizedAddress) {
      throw new BadRequestException("address is required");
    }
    if (!normalizedPinCode) {
      throw new BadRequestException("pinCode is required");
    }

    const gstRate = 18;
    const tdsRate = 10;
    const gstAmount = dto.sezSelected ? 0 : (registrationFee * gstRate) / 100;
    const tdsAmount = dto.tdsSelected ? (registrationFee * tdsRate) / 100 : 0;
    const totalPayable = registrationFee + gstAmount - tdsAmount;

    const savedInvoice = await this.projectInvoiceRepository.save(
      this.projectInvoiceRepository.create({
        id: existingInvoice?.id,
        projectId: project.id,
        organizationName: dto.organizationName,
        address: normalizedAddress,
        city: dto.city,
        state: dto.state,
        pinCode: normalizedPinCode,
        panNumber: dto.panNumber,
        hasGstNumber: normalizedHasGstNumber,
        gstNumber: normalizedHasGstNumber ? dto.gstNumber : undefined,
        sezSelected: dto.sezSelected,
        tdsSelected: dto.tdsSelected,
        couponCode: dto.couponCode,
        registrationFee: registrationFee.toFixed(2),
        gstRate: gstRate.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        tdsRate: tdsRate.toFixed(2),
        tdsAmount: tdsAmount.toFixed(2),
        totalPayable: totalPayable.toFixed(2),
        additionalData: dto.additionalData,
      }),
    );

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        currentStep: Math.max(project.currentStep, 4),
        registrationFee: registrationFee.toFixed(2),
        finalPayableAmount: totalPayable.toFixed(2),
      }),
    );

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      temporaryProjectId: updatedProject.temporaryProjectId,
      currentStep: updatedProject.currentStep,
      invoice: {
        organizationName: savedInvoice.organizationName,
        address: savedInvoice.address,
        city: savedInvoice.city,
        state: savedInvoice.state,
        pinCode: savedInvoice.pinCode,
        panNumber: savedInvoice.panNumber,
        hasGstNumber: savedInvoice.hasGstNumber,
        gstNumber: savedInvoice.gstNumber ?? null,
        sezSelected: savedInvoice.sezSelected,
        tdsSelected: savedInvoice.tdsSelected,
        couponCode: savedInvoice.couponCode ?? null,
        registrationFee: Number(savedInvoice.registrationFee),
        baseRegistrationFee: Number(updatedProject.registrationFee ?? savedInvoice.registrationFee),
        gstRate: Number(savedInvoice.gstRate),
        gstAmount: Number(savedInvoice.gstAmount),
        tdsRate: Number(savedInvoice.tdsRate),
        tdsAmount: Number(savedInvoice.tdsAmount),
        totalPayable: Number(savedInvoice.totalPayable),
        feeSource: "rating-systems.json (nonMember)",
        additionalData: savedInvoice.additionalData ?? null,
      },
      registrationFee: Number(updatedProject.registrationFee ?? 0),
      finalPayableAmount: Number(updatedProject.finalPayableAmount ?? 0),
    };
  }

  async upsertStepFive(email: string, projectId: number, dto: UpsertProjectStepFiveDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can update only your own project");
    }

    const existingPayment = await this.projectPaymentRepository.findOne({
      where: { projectId: project.id },
    });

    const savedPayment = await this.projectPaymentRepository.save(
      this.projectPaymentRepository.create({
        id: existingPayment?.id,
        projectId: project.id,
        paymentMethod: dto.paymentMethod,
        gatewayResponse: dto.paymentMethod === "online" ? dto.gatewayResponse : undefined,
        paymentType: dto.paymentMethod === "offline" ? dto.paymentType : undefined,
        transactionReference:
          dto.paymentMethod === "offline" ? dto.transactionReference : undefined,
        ifscCode: dto.paymentMethod === "offline" ? dto.ifscCode : undefined,
        bankName: dto.paymentMethod === "offline" ? dto.bankName : undefined,
        branch: dto.paymentMethod === "offline" ? dto.branch : undefined,
        amount: dto.paymentMethod === "offline" ? dto.amount?.toFixed(2) : undefined,
        paymentDate: dto.paymentMethod === "offline" ? dto.paymentDate : undefined,
        remarks: dto.remarks,
      }),
    );

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        currentStep: Math.max(project.currentStep, 5),
        status: "submitted",
      }),
    );

    return {
      projectId: updatedProject.id,
      igbcProjectId: updatedProject.igbcProjectId ?? null,
      temporaryProjectId: updatedProject.temporaryProjectId,
      currentStep: updatedProject.currentStep,
      status: updatedProject.status,
      payment: {
        paymentMethod: savedPayment.paymentMethod,
        gatewayResponse: savedPayment.gatewayResponse ?? null,
        paymentType: savedPayment.paymentType ?? null,
        transactionReference: savedPayment.transactionReference ?? null,
        ifscCode: savedPayment.ifscCode ?? null,
        bankName: savedPayment.bankName ?? null,
        branch: savedPayment.branch ?? null,
        amount: savedPayment.amount ? Number(savedPayment.amount) : null,
        paymentDate: savedPayment.paymentDate ?? null,
        remarks: savedPayment.remarks ?? null,
      },
      message:
        dto.paymentMethod === "online"
          ? "Online payment details saved and project submitted successfully."
          : "Offline payment details saved and project submitted successfully.",
    };
  }

  async resumeRegistration(email: string, projectId: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can view only your own project");
    }

    const detail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });
    const contact = await this.projectContactRepository.findOne({
      where: { projectId: project.id },
    });
    const invoice = await this.projectInvoiceRepository.findOne({
      where: { projectId: project.id },
    });
    const payment = await this.projectPaymentRepository.findOne({
      where: { projectId: project.id },
    });
    const baseRegistrationFee = Number(
      project.registrationFee ?? this.getNonMemberFeeByRatingSystem(project.ratingSystem),
    );

    const isStepTwoCompleted = Boolean(detail);
    const isStepThreeCompleted = Boolean(contact);
    const isStepFourCompleted = Boolean(invoice);
    const isStepFiveCompleted = Boolean(payment);
    const fallbackCompletedStep = isStepFiveCompleted
      ? 5
      : isStepFourCompleted
      ? 4
      : isStepThreeCompleted
        ? 3
        : isStepTwoCompleted
          ? 2
          : 1;
    const completedSteps = Math.max(
      1,
      Math.min(
        project.currentStep || fallbackCompletedStep,
        ProjectsService.TOTAL_REGISTRATION_STEPS,
      ),
    );
    const nextStep = Math.min(completedSteps + 1, ProjectsService.TOTAL_REGISTRATION_STEPS);
    const isRegistrationCompleted =
      completedSteps >= ProjectsService.TOTAL_REGISTRATION_STEPS;

    return {
      projectId: project.id,
      igbcProjectId: project.igbcProjectId ?? null,
      temporaryProjectId: project.temporaryProjectId,
      status: project.status,
      paymentStatus: project.paymentStatus,
      currentStep: project.currentStep,
      completedSteps,
      totalSteps: ProjectsService.TOTAL_REGISTRATION_STEPS,
      nextStep: isRegistrationCompleted ? null : nextStep,
      message: isRegistrationCompleted
        ? "All registration steps are already completed for this project."
        : `Resume registration from step ${nextStep}.`,
      stepOne: {
        category: project.categoryId,
        ratingSystem: project.ratingSystem,
        subRatingType: project.subRatingType,
        projectType: project.projectType,
        constructionType: project.constructionType,
        registrationFee: baseRegistrationFee,
      },
      stepTwo: detail
        ? {
            id: detail.id,
            projectName: detail.projectName,
            address: detail.address,
            city: detail.city,
            state: detail.state,
            pincode: detail.pincode,
            siteAreaSqm: Number(detail.siteAreaSqm),
            siteAreaSqft: Number(detail.siteAreaSqft),
            numberOfBuildings: detail.numberOfBuildings,
            totalBuiltUpAreaSqft: Number(detail.totalBuiltUpAreaSqft),
            totalBuiltUpAreaSqm: Number(detail.totalBuiltUpAreaSqm),
            constructionStartDate: detail.constructionStartDate ?? null,
            targetCertificationDate: detail.targetCertificationDate ?? null,
          }
        : null,
      stepThree: contact?.formData ?? null,
      stepFour: invoice
        ? {
            organizationName: invoice.organizationName,
            address: invoice.address,
            city: invoice.city,
            state: invoice.state,
            pinCode: invoice.pinCode,
            panNumber: invoice.panNumber,
            hasGstNumber: invoice.hasGstNumber,
            gstNumber: invoice.gstNumber ?? null,
            sezSelected: invoice.sezSelected,
            tdsSelected: invoice.tdsSelected,
            couponCode: invoice.couponCode ?? null,
            registrationFee: Number(invoice.registrationFee),
            baseRegistrationFee,
            gstRate: Number(invoice.gstRate),
            gstAmount: Number(invoice.gstAmount),
            tdsRate: Number(invoice.tdsRate),
            tdsAmount: Number(invoice.tdsAmount),
            totalPayable: Number(invoice.totalPayable),
            additionalData: invoice.additionalData ?? null,
          }
        : {
            registrationFee: baseRegistrationFee,
            baseRegistrationFee,
            gstRate: 18,
            gstAmount: 0,
            tdsRate: 10,
            tdsAmount: 0,
            totalPayable: baseRegistrationFee,
            isDraft: true,
          },
      baseRegistrationFee,
      finalPayableAmount: Number(project.finalPayableAmount ?? 0),
      stepFive: payment
        ? {
            paymentMethod: payment.paymentMethod,
            gatewayResponse: payment.gatewayResponse ?? null,
            paymentType: payment.paymentType ?? null,
            transactionReference: payment.transactionReference ?? null,
            ifscCode: payment.ifscCode ?? null,
            bankName: payment.bankName ?? null,
            branch: payment.branch ?? null,
            amount: payment.amount ? Number(payment.amount) : null,
            paymentDate: payment.paymentDate ?? null,
            remarks: payment.remarks ?? null,
          }
        : null,
    };
  }

  private async recalculateStepFourAmountsIfExists(projectId: number, registrationFee: number) {
    const invoice = await this.projectInvoiceRepository.findOne({
      where: { projectId },
    });
    if (!invoice) {
      return null;
    }

    const gstRate = Number(invoice.gstRate);
    const tdsRate = Number(invoice.tdsRate);
    const gstAmount = invoice.sezSelected ? 0 : (registrationFee * gstRate) / 100;
    const tdsAmount = invoice.tdsSelected ? (registrationFee * tdsRate) / 100 : 0;
    const totalPayable = registrationFee + gstAmount - tdsAmount;

    const updatedInvoice = await this.projectInvoiceRepository.save(
      this.projectInvoiceRepository.merge(invoice, {
        registrationFee: registrationFee.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        tdsAmount: tdsAmount.toFixed(2),
        totalPayable: totalPayable.toFixed(2),
      }),
    );

    await this.projectRepository.save({
      id: projectId,
      registrationFee: registrationFee.toFixed(2),
      finalPayableAmount: totalPayable.toFixed(2),
    });

    return updatedInvoice;
  }

  private getNonMemberFeeByRatingSystem(ratingSystemName: string) {
    const ratingSystems = this.readRatingSystems();
    const selected = ratingSystems.find((item) => item.ratingName === ratingSystemName);
    if (!selected) {
      throw new BadRequestException(
        `No rating system fee configuration found for "${ratingSystemName}"`,
      );
    }
    return selected.fees.nonMember;
>>>>>>> 1a65c5fd1385100852a1babe840f1fbe50e22a05
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
<<<<<<< HEAD
      throw new ForbiddenException("Admin access only");
    }
  }

  private async findProjectWithAccess(id: string, userId: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ["ratingType"],
    });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    const demoUserId = "00000000-0000-0000-0000-000000000001";
    if (project.userId !== userId && project.userId !== demoUserId) {
      throw new ForbiddenException("You do not have access to this project");
    }
    return project;
  }

  private async generateProjectCode(abbreviation: string): Promise<string> {
    const prefix = `IGBC${abbreviation.replace(/[^A-Za-z]/g, "").toUpperCase()}`;
    const year = new Date().getFullYear().toString().slice(-2);
    for (let attempt = 0; attempt < 20; attempt++) {
      const suffix = String(Math.floor(100000 + Math.random() * 900000)).slice(0, 6);
      const code = `${prefix}${year}${suffix}`;
      const exists = await this.projectRepo.findOne({ where: { projectCode: code } });
      if (!exists) return code;
    }
    return `${prefix}${year}${Date.now().toString().slice(-6)}`;
  }

  isCertificationUnlocked(status: string): boolean {
    return status === "approved" || status === "accepted";
  }

  private resolveVersionType(ratingType: RatingType): string {
    return resolveAutoVersionType({
      ratingTypeId: ratingType.id,
      configKey: ratingType.configKey,
    });
  }

  private toResponse(project: Project): ProjectResponse {
    const rt = project.ratingType;
    return {
      id: project.id,
      projectCode: project.projectCode,
      projectName: project.projectName,
      category: project.category,
      constructionType: project.constructionType,
      city: project.city,
      ownerName: project.ownerName,
      ownerMobile: project.ownerMobile,
      ownerEmail: project.ownerEmail,
      ownerOrg: project.ownerOrg,
      paymentMode: project.paymentMode,
      registrationStatus: project.registrationStatus,
      certificationStatus: project.certificationStatus,
      invoiceNo: project.invoiceNo,
      area: project.area,
      ratingTypeId: project.ratingTypeId,
      ratingTypeName: rt?.name ?? "",
      ratingAbbreviation: rt?.abbreviation ?? "",
      configKey: rt?.configKey ?? null,
      hasConfig: rt?.configKey
        ? this.ratingConfigService.hasConfig(
            rt.configKey,
            project.versionType ?? defaultVersionFromList(rt.versionTypes),
          )
        : false,
      versionTypes: rt?.versionTypes ?? ["3"],
      versionType: project.versionType ?? defaultVersionFromList(rt?.versionTypes),
      createdAt: project.createdAt.toISOString(),
    };
  }
=======
      throw new ForbiddenException("Admin access is required");
    }
  }

  private async getProjectViewById(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const [detail, contact, invoice, payment, owner] = await Promise.all([
      this.projectDetailRepository.findOne({ where: { projectId: project.id } }),
      this.projectContactRepository.findOne({ where: { projectId: project.id } }),
      this.projectInvoiceRepository.findOne({ where: { projectId: project.id } }),
      this.projectPaymentRepository.findOne({ where: { projectId: project.id } }),
      this.usersService.getUsersByIds([project.createdByUserId]),
    ]);

    const ownerUser = owner[0];

    return {
      projectId: project.id,
      igbcProjectId: project.igbcProjectId ?? null,
      temporaryProjectId: project.temporaryProjectId,
      status: project.status,
      paymentStatus: project.paymentStatus,
      currentStep: project.currentStep,
      registrationFee: Number(project.registrationFee ?? 0),
      finalPayableAmount: Number(project.finalPayableAmount ?? 0),
      rejectRemark: project.rejectRemark ?? null,
      owner: ownerUser
        ? {
            id: ownerUser.id,
            name: ownerUser.displayName,
            email: ownerUser.email,
            mobile: ownerUser.mobile ?? ownerUser.telephone ?? null,
          }
        : null,
      stepOne: {
        category: project.categoryId,
        ratingSystem: project.ratingSystem,
        subRatingType: project.subRatingType ?? null,
        projectType: project.projectType,
        constructionType: project.constructionType,
      },
      stepTwo: detail
        ? {
            id: detail.id,
            projectName: detail.projectName,
            address: detail.address,
            city: detail.city,
            state: detail.state,
            pincode: detail.pincode,
            siteAreaSqm: Number(detail.siteAreaSqm),
            siteAreaSqft: Number(detail.siteAreaSqft),
            numberOfBuildings: detail.numberOfBuildings,
            totalBuiltUpAreaSqft: Number(detail.totalBuiltUpAreaSqft),
            totalBuiltUpAreaSqm: Number(detail.totalBuiltUpAreaSqm),
            constructionStartDate: detail.constructionStartDate ?? null,
            targetCertificationDate: detail.targetCertificationDate ?? null,
          }
        : null,
      stepThree: contact?.formData ?? null,
      stepFour: invoice
        ? {
            organizationName: invoice.organizationName,
            address: invoice.address,
            city: invoice.city,
            state: invoice.state,
            pinCode: invoice.pinCode,
            panNumber: invoice.panNumber,
            hasGstNumber: invoice.hasGstNumber,
            gstNumber: invoice.gstNumber ?? null,
            sezSelected: invoice.sezSelected,
            tdsSelected: invoice.tdsSelected,
            couponCode: invoice.couponCode ?? null,
            registrationFee: Number(invoice.registrationFee),
            gstRate: Number(invoice.gstRate),
            gstAmount: Number(invoice.gstAmount),
            tdsRate: Number(invoice.tdsRate),
            tdsAmount: Number(invoice.tdsAmount),
            totalPayable: Number(invoice.totalPayable),
            additionalData: invoice.additionalData ?? null,
          }
        : null,
      stepFive: payment
        ? {
            paymentMethod: payment.paymentMethod,
            gatewayResponse: payment.gatewayResponse ?? null,
            paymentType: payment.paymentType ?? null,
            transactionReference: payment.transactionReference ?? null,
            ifscCode: payment.ifscCode ?? null,
            bankName: payment.bankName ?? null,
            branch: payment.branch ?? null,
            amount: payment.amount ? Number(payment.amount) : null,
            paymentDate: payment.paymentDate ?? null,
            remarks: payment.remarks ?? null,
          }
        : null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private readRatingSystems() {
    const content = readFileSync(this.resolveRatingSystemsJsonPath(), "utf8");
    return JSON.parse(content) as RatingSystemFeeItem[];
  }

  private resolveRatingSystemsJsonPath() {
    const sourcePath = join(
      process.cwd(),
      "src",
      "project-category",
      "data",
      "rating-systems.json",
    );
    const distPath = join(
      process.cwd(),
      "dist",
      "project-category",
      "data",
      "rating-systems.json",
    );
    return existsSync(sourcePath) ? sourcePath : distPath;
  }

  private async generateIgbcProjectId(payload: { ratingSystem: string }) {
    const ratingSystems = this.readRatingSystems();
    const rating = ratingSystems.find((item) => item.ratingName === payload.ratingSystem);
    if (!rating) {
      throw new BadRequestException(
        `No rating system shortcode configuration found for "${payload.ratingSystem}"`,
      );
    }

    const year = new Date().getFullYear().toString();
    const prefix = `IGBC${rating.shortRatingName}${year}`;
    const existingCount = await this.projectRepository.count({
      where: {
        igbcProjectId: Like(`${prefix}%`),
      },
    });
    const sequence = String(existingCount + 1).padStart(4, "0");
    return `${prefix}${sequence}`;
  }

  private extractEmailsFromObject(value: unknown): string[] {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
    const emails = new Set<string>();

    const walk = (node: unknown) => {
      if (!node) {
        return;
      }
      if (typeof node === "string") {
        const candidate = node.trim();
        if (emailRegex.test(candidate)) {
          emails.add(candidate.toLowerCase());
        }
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node === "object") {
        Object.values(node as Record<string, unknown>).forEach(walk);
      }
    };

    walk(value);
    return [...emails];
  }
>>>>>>> 1a65c5fd1385100852a1babe840f1fbe50e22a05
}
