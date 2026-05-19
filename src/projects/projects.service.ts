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
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
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
}
