import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { In, Like, Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { RatingConfigService } from "../rating-config/rating-config.service";
import { RatingTypeService } from "./rating-type.service";
import { UsersService } from "../users/users.service";
import { CreateProjectStepOneDto } from "./dto/create-project-step-one.dto";
import { SaveCertificationSectionDto } from "./dto/save-certification-section.dto";
import { UpsertProjectStepFourDto } from "./dto/upsert-project-step-four.dto";
import { UpsertProjectStepFiveDto } from "./dto/upsert-project-step-five.dto";
import { UpsertProjectStepTwoDto } from "./dto/upsert-project-step-two.dto";
import { UpsertProjectStepThreeDto } from "./dto/upsert-project-step-three.dto";
import { ProjectContact } from "./project-contact.entity";
import { ProjectDetail } from "./project-detail.entity";
import { ProjectInvoice } from "./project-invoice.entity";
import { ProjectPayment } from "./project-payment.entity";
import { CertificationWorkflowService } from "../certification-application/certification-workflow.service";
import { CertificationCompletionService } from "./certification-completion.service";
import { ProjectAccessService } from "./project-access.service";
import { ProjectsEmailService } from "./projects-email.service";
import { Project } from "./project.entity";
import { RatingFormService, type RegistrationRatingContext } from "./rating-form.service";
import type { UploadedFile } from "./uploaded-file.type";

interface RatingSystemFeeItem {
  ratingName: string;
  shortRatingName: string;
  fees: {
    nonMember: number;
  };
}

interface ProjectCategoryItem {
  id: number;
  name: string;
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
    @InjectRepository(CertificationApplication)
    private readonly certificationApplicationRepository: Repository<CertificationApplication>,
    private readonly usersService: UsersService,
    private readonly projectsEmailService: ProjectsEmailService,
    private readonly ratingConfigService: RatingConfigService,
    private readonly ratingFormService: RatingFormService,
    private readonly ratingTypeService: RatingTypeService,
    private readonly projectAccessService: ProjectAccessService,
    private readonly certificationWorkflowService: CertificationWorkflowService,
    private readonly certificationCompletionService: CertificationCompletionService,
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
      await this.assertClientCanModifyProject(email, project.id);

      return this.upsertStepOne(email, project.id, dto);
    }

    const registrationFee = this.getNonMemberFeeByRatingSystem(dto.ratingSystem);
    const rating = await this.ratingTypeService.resolveForProject({
      ratingTypeId: dto.ratingTypeId ?? null,
      ratingSystemName: dto.ratingSystem,
    }).catch(() => null);

    const saved = await this.projectRepository.save(
      this.projectRepository.create({
        createdByUserId: user.id,
        categoryId: dto.category,
        ratingSystem: rating?.ratingTypeName ?? dto.ratingSystem,
        ratingTypeId: rating?.ratingTypeId ?? dto.ratingTypeId ?? null,
        versionType: rating?.versionType ?? "3",
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
    await this.assertClientCanModifyProject(email, projectId);

    const registrationFee = this.getNonMemberFeeByRatingSystem(dto.ratingSystem);
    const rating = await this.ratingTypeService.resolveForProject({
      ratingTypeId: dto.ratingTypeId ?? project.ratingTypeId ?? null,
      ratingSystemName: dto.ratingSystem,
    }).catch(() => null);

    const updatedProject = await this.projectRepository.save(
      this.projectRepository.merge(project, {
        categoryId: dto.category,
        ratingSystem: rating?.ratingTypeName ?? dto.ratingSystem,
        ratingTypeId: rating?.ratingTypeId ?? dto.ratingTypeId ?? project.ratingTypeId ?? null,
        versionType: rating?.versionType ?? project.versionType ?? "3",
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
    const [details, certifications] = await Promise.all([
      projectIds.length
        ? this.projectDetailRepository.find({
            where: projectIds.map((projectId) => ({ projectId })),
          })
        : Promise.resolve([]),
      projectIds.length
        ? this.certificationApplicationRepository.find({
            where: { projectId: In(projectIds) },
          })
        : Promise.resolve([]),
    ]);
    const detailByProjectId = new Map(details.map((detail) => [detail.projectId, detail]));
    const certByProjectId = new Map(
      certifications.map((application) => [application.projectId, application]),
    );

    const counts = {
      saved: allProjects.filter((project) => project.status === "saved").length,
      submitted: allProjects.filter((project) => project.status === "submitted").length,
      approved: allProjects.filter((project) =>
        this.matchesMyProjectsApprovedTab(project, certByProjectId.get(project.id)),
      ).length,
      rejected: allProjects.filter((project) =>
        this.matchesMyProjectsRejectedTab(project, certByProjectId.get(project.id)),
      ).length,
    };

    const filtered = tab
      ? allProjects.filter((project) => {
          const cert = certByProjectId.get(project.id);
          if (tab === "saved" || tab === "submitted") {
            return project.status === tab;
          }
          if (tab === "approved") {
            return this.matchesMyProjectsApprovedTab(project, cert);
          }
          return this.matchesMyProjectsRejectedTab(project, cert);
        })
      : allProjects;

    return {
      counts,
      tab: tab ?? "all",
      total: filtered.length,
      items: filtered.map((project) => {
        const detail = detailByProjectId.get(project.id);
        const cert = certByProjectId.get(project.id);
        return this.mapMyProjectListItem(project, detail, cert);
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

    const [projectDetail, certificationApplication] = await Promise.all([
      this.projectDetailRepository.findOne({
        where: { projectId: project.id },
      }),
      this.certificationApplicationRepository.findOne({
        where: { projectId: project.id },
      }),
    ]);
    if (!projectDetail) {
      throw new NotFoundException("Project registration details not found");
    }

    return {
      projectId: project.id,
      igbcProjectId: project.igbcProjectId ?? null,
      temporaryProjectId: project.temporaryProjectId,
      certificationApplicationStatus: project.certificateAppliedStatus,
      certificationApplicationId: certificationApplication?.id ?? null,
      certificationStatus: certificationApplication?.status ?? null,
      certificationPaymentStatus: certificationApplication?.paymentStatus ?? null,
      certificationRejectRemark: certificationApplication?.paymentRemarks ?? null,
      certificationCurrentStep: certificationApplication?.currentStep ?? null,
      certificationType: certificationApplication?.certificationType ?? null,
      canReapplyCertification:
        certificationApplication?.paymentStatus?.toLowerCase() === "rejected",
      isCertificationWorkspaceReady: this.isCertificationWorkspaceReady(
        project,
        certificationApplication ?? undefined,
      ),
      status: project.status,
      paymentStatus: project.paymentStatus,
      stepOne: {
        category: project.categoryId,
        ratingSystem: project.ratingSystem,
        subRatingType: project.subRatingType ?? null,
        projectType: project.projectType,
        constructionType: project.constructionType,
        certificationType: certificationApplication?.certificationType ?? null,
        expediteReview: certificationApplication?.expediteReview ?? null,
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
    await this.assertClientCanModifyProject(email, projectId);

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
    await this.assertClientCanModifyProject(email, projectId);

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
    await this.assertClientCanModifyProject(email, projectId);

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
    await this.assertClientCanModifyProject(email, projectId);

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
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access is required");
    }
  }

  private async getProjectViewById(projectId: number) {
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    const [detail, contact, invoice, payment, owner, certificationApplication] =
      await Promise.all([
        this.projectDetailRepository.findOne({ where: { projectId: project.id } }),
        this.projectContactRepository.findOne({ where: { projectId: project.id } }),
        this.projectInvoiceRepository.findOne({ where: { projectId: project.id } }),
        this.projectPaymentRepository.findOne({ where: { projectId: project.id } }),
        this.usersService.getUsersByIds([project.createdByUserId]),
        this.certificationApplicationRepository.findOne({ where: { projectId: project.id } }),
      ]);

    const ownerUser = owner[0];

    let ratingTypeId = project.ratingTypeId ?? null;
    let versionType = project.versionType ?? "3";
    let hasCertificationConfig = false;
    const ratingRow =
      (ratingTypeId != null ? await this.ratingTypeService.findById(ratingTypeId) : null) ??
      (await this.ratingTypeService.findByRatingName(project.ratingSystem));
    if (ratingRow) {
      ratingTypeId = ratingRow.id;
      versionType =
        this.ratingTypeService.resolveVersionForRow(
          ratingRow,
          this.ratingTypeService.resolveConfigKeyForRow(ratingRow) ?? "",
          project.versionType,
        ) ?? versionType;
      hasCertificationConfig = this.ratingTypeService.hasCertificationConfig(ratingRow);
    }

    const categoryName =
      this.readProjectCategories().find((item) => item.id === project.categoryId)?.name ?? null;

    const certificationTypeLabel = certificationApplication
      ? certificationApplication.certificationType === 1
        ? "Pre-certification"
        : certificationApplication.certificationType === 2
          ? "Certification"
          : null
      : null;

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
      certificateAppliedStatus: project.certificateAppliedStatus,
      categoryName,
      certificationApplication: certificationApplication
        ? {
            id: certificationApplication.id,
            status: certificationApplication.status,
            paymentStatus: certificationApplication.paymentStatus,
            paymentRemarks: certificationApplication.paymentRemarks ?? null,
            currentStep: certificationApplication.currentStep,
            certificationType: certificationApplication.certificationType ?? null,
            certificationTypeLabel,
            certificationFee: Number(certificationApplication.certificationFee ?? 0),
            finalPayableAmount: Number(
              certificationApplication.finalPayableAmount ??
                certificationApplication.certificationFee ??
                0,
            ),
            paymentMethod: certificationApplication.paymentMethod ?? null,
            paymentType: certificationApplication.paymentType ?? null,
            transactionReference: certificationApplication.transactionReference ?? null,
            ifscCode: certificationApplication.ifscCode ?? null,
            bankName: certificationApplication.bankName ?? null,
            branch: certificationApplication.branch ?? null,
            paymentAmount: certificationApplication.paymentAmount
              ? Number(certificationApplication.paymentAmount)
              : null,
            paymentDate: certificationApplication.paymentDate ?? null,
            organizationName: certificationApplication.organizationName ?? null,
            address: certificationApplication.address,
            city: certificationApplication.city,
            state: certificationApplication.state,
            pincode: certificationApplication.pincode,
            siteAreaSqm: Number(certificationApplication.siteAreaSqm),
            siteAreaSqft: Number(certificationApplication.siteAreaSqft),
            numberOfBuildings: certificationApplication.numberOfBuildings,
            totalBuiltUpAreaSqm: Number(certificationApplication.totalBuiltUpAreaSqm),
            totalBuiltUpAreaSqft: Number(certificationApplication.totalBuiltUpAreaSqft),
          }
        : null,
      canReapplyCertification:
        certificationApplication?.paymentStatus?.toLowerCase() === "rejected",
      isCertificationWorkspaceReady: this.isCertificationWorkspaceReady(
        project,
        certificationApplication ?? undefined,
      ),
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
        categoryName,
        ratingSystem: project.ratingSystem,
        ratingTypeId,
        versionType,
        hasCertificationConfig,
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

  async getCertificationWorkspace(email: string, projectId: number) {
    const { project, detail, ctx, resolved, access } = await this.assertWorkspaceContext(
      email,
      projectId,
      "read",
    );

    const form = await this.ratingFormService.getForm(ctx);
    const workflow = await this.certificationWorkflowService.getWorkflowSummary(projectId);
    const completion = this.certificationCompletionService.validateCompletion(ctx, form);

    const payload = this.ratingConfigService.buildWorkspacePayload({
      projectId: String(project.id),
      projectCode:
        project.igbcProjectId ?? project.temporaryProjectId ?? `P00${project.id}`,
      projectName: detail?.projectName ?? project.ratingSystem,
      ratingTypeId: resolved.ratingTypeId,
      ratingTypeName: resolved.ratingTypeName,
      configKey: ctx.ratingType,
      versionType: ctx.versionType,
      form,
    });

    return {
      ...payload,
      isSubmitted: access.isSubmitted,
      workflowStatus: access.workflowStatus,
      readOnly: !access.canWrite,
      canFinalSubmit: access.canWrite && !access.isSubmitted,
      completion: {
        complete: completion.complete,
        missingCount: completion.missing.length,
        missing: completion.missing,
      },
      assignedStaff: workflow.assignedStaff,
      assignedTpa: workflow.assignedTpa,
    };
  }

  async getCertificationForm(email: string, projectId: number) {
    const { ctx } = await this.assertWorkspaceContext(email, projectId, "read");
    return this.ratingFormService.getForm(ctx);
  }

  async saveCertificationSection(
    email: string,
    projectId: number,
    dto: SaveCertificationSectionDto,
  ) {
    const { ctx } = await this.assertWorkspaceContext(email, projectId, "write");
    return this.ratingFormService.saveSection(ctx, dto);
  }

  async uploadCertificationDocuments(
    email: string,
    projectId: number,
    tab: string,
    subtab: string,
    paramName: string,
    files: UploadedFile[],
    replaceExisting = true,
  ) {
    const { ctx } = await this.assertWorkspaceContext(email, projectId, "write");
    return this.ratingFormService.uploadDocuments(
      ctx,
      tab,
      subtab,
      paramName,
      files,
      replaceExisting,
    );
  }

  async finalSubmitCertification(email: string, projectId: number) {
    const { ctx } = await this.assertWorkspaceContext(email, projectId, "write");
    return this.certificationWorkflowService.finalSubmit(email, projectId, ctx);
  }

  async getProjectWorkflow(email: string, projectId: number) {
    await this.assertWorkspaceContext(email, projectId, "read");
    return this.certificationWorkflowService.getWorkflowSummary(projectId);
  }

  private async assertClientCanModifyProject(email: string, projectId: number) {
    await this.projectAccessService.assertClientRegistrationWritable(email, projectId);
  }

  private async assertWorkspaceContext(
    email: string,
    projectId: number,
    mode: "read" | "write",
  ) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, mode);
    const { project } = access;

    if (!this.isRegistrationApprovedAndPaid(project)) {
      throw new ForbiddenException(
        "Certification workspace is available after your project registration is approved",
      );
    }

    const certificationApplication = await this.certificationApplicationRepository.findOne({
      where: { projectId: project.id },
    });
    if (!this.isCertificationWorkspaceReady(project, certificationApplication ?? undefined)) {
      throw new ForbiddenException(
        "Certification workspace is available after your certification application is approved by admin",
      );
    }

    const resolved = await this.ratingTypeService.resolveForProject({
      ratingTypeId: project.ratingTypeId,
      ratingSystemName: project.ratingSystem,
      versionTypeOverride: project.versionType,
    });

    if (
      project.ratingTypeId !== resolved.ratingTypeId ||
      project.versionType !== resolved.versionType ||
      project.ratingSystem !== resolved.ratingTypeName
    ) {
      await this.projectRepository.save(
        this.projectRepository.merge(project, {
          ratingTypeId: resolved.ratingTypeId,
          versionType: resolved.versionType,
          ratingSystem: resolved.ratingTypeName,
        }),
      );
    }

    const detail = await this.projectDetailRepository.findOne({
      where: { projectId: project.id },
    });

    const ctx: RegistrationRatingContext = {
      projectId: project.id,
      ratingType: resolved.configKey,
      versionType: resolved.versionType,
      ratingTypeId: resolved.ratingTypeId,
    };

    return { project, detail, ctx, resolved, access };
  }

  private readRatingSystems() {
    const content = readFileSync(this.resolveRatingSystemsJsonPath(), "utf8");
    return JSON.parse(content) as RatingSystemFeeItem[];
  }

  private readProjectCategories() {
    const content = readFileSync(this.resolveProjectCategoriesJsonPath(), "utf8");
    return JSON.parse(content) as ProjectCategoryItem[];
  }

  private resolveProjectCategoriesJsonPath() {
    const sourcePath = join(
      process.cwd(),
      "src",
      "project-category",
      "data",
      "project-categories.json",
    );
    const distPath = join(
      process.cwd(),
      "dist",
      "project-category",
      "data",
      "project-categories.json",
    );
    return existsSync(sourcePath) ? sourcePath : distPath;
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

  private isRegistrationApprovedAndPaid(project: Project): boolean {
    return (
      project.status === "approved" &&
      (project.paymentStatus === "paid" || project.paymentStatus === "approved")
    );
  }

  private isCertificationPaymentApproved(paymentStatus: string): boolean {
    const normalized = paymentStatus.toLowerCase();
    return normalized === "paid" || normalized === "approved" || normalized === "success";
  }

  private isCertificationWorkspaceReady(
    project: Project,
    certificationApplication?: CertificationApplication,
  ): boolean {
    if (!this.isRegistrationApprovedAndPaid(project)) {
      return false;
    }
    if (!certificationApplication) {
      return false;
    }
    const paymentApproved = this.isCertificationPaymentApproved(
      certificationApplication.paymentStatus,
    );
    if (!paymentApproved) {
      return false;
    }
    return (
      certificationApplication.status === "approved" ||
      certificationApplication.status === "submitted"
    );
  }

  private matchesMyProjectsRejectedTab(
    project: Project,
    certificationApplication?: CertificationApplication,
  ): boolean {
    if (project.status === "rejected") {
      return true;
    }
    if (project.paymentStatus === "rejected") {
      return true;
    }
    return certificationApplication?.paymentStatus?.toLowerCase() === "rejected";
  }

  private matchesMyProjectsApprovedTab(
    project: Project,
    certificationApplication?: CertificationApplication,
  ): boolean {
    if (!this.isRegistrationApprovedAndPaid(project)) {
      return false;
    }
    if (certificationApplication?.paymentStatus?.toLowerCase() === "rejected") {
      return false;
    }
    return true;
  }

  private mapMyProjectListItem(
    project: Project,
    detail: ProjectDetail | undefined,
    certificationApplication?: CertificationApplication,
  ) {
    const certPayment = certificationApplication?.paymentStatus?.toLowerCase() ?? null;
    const registrationRejected =
      project.status === "rejected" || project.paymentStatus === "rejected";
    const certificationRejected = certPayment === "rejected";

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
      certificationApplicationId: certificationApplication?.id ?? null,
      certificationStatus: certificationApplication?.status ?? null,
      certificationPaymentStatus: certificationApplication?.paymentStatus ?? null,
      certificationRejectRemark: certificationApplication?.paymentRemarks ?? null,
      canReapplyCertification: certificationRejected,
      isCertificationWorkspaceReady: this.isCertificationWorkspaceReady(
        project,
        certificationApplication,
      ),
      isSubmitted: certificationApplication?.isSubmitted ?? false,
      workflowStatus: certificationApplication?.workflowStatus ?? "draft",
      submittedAt: certificationApplication?.submittedAt?.toISOString?.() ?? null,
      rejectionType: certificationRejected
        ? "certification"
        : registrationRejected
          ? "registration"
          : null,
      projectName: detail?.projectName ?? null,
      city: detail?.city ?? null,
      state: detail?.state ?? null,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }
}
