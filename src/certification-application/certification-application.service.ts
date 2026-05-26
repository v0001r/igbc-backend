import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectDetail } from "../projects/project-detail.entity";
import { ProjectInvoice } from "../projects/project-invoice.entity";
import { Project } from "../projects/project.entity";
import { UsersService } from "../users/users.service";
import { CertificationApplication } from "./certification-application.entity";
import { CreateCertificationStepOneDto } from "./dto/create-certification-step-one.dto";
import { UpsertCertificationStepThreePaymentDto } from "./dto/upsert-certification-step-three-payment.dto";
import { UpsertCertificationStepTwoDto } from "./dto/upsert-certification-step-two.dto";

type FeeBreakup = { fee: number; additional: number; total: number };

@Injectable()
export class CertificationApplicationService {
  constructor(
    @InjectRepository(CertificationApplication)
    private readonly certificationApplicationRepository: Repository<CertificationApplication>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
    @InjectRepository(ProjectInvoice)
    private readonly projectInvoiceRepository: Repository<ProjectInvoice>,
    private readonly usersService: UsersService,
  ) {}

  async createStepOne(email: string, dto: CreateCertificationStepOneDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const project = await this.projectRepository.findOne({ where: { id: dto.projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can create certification application only for your own project");
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

    const existingApplication = await this.certificationApplicationRepository.findOne({
      where: { projectId: project.id },
    });

    const feeBreakup = this.calculateCertificationFee(project, projectDetail, dto);

    const saved = await this.certificationApplicationRepository.save(
      this.certificationApplicationRepository.create({
        id: existingApplication?.id,
        projectId: project.id,
        createdByUserId: user.id,
        igbcProjectId: project.igbcProjectId,
        temporaryProjectId: project.temporaryProjectId,
        categoryId: project.categoryId,
        ratingSystem: project.ratingSystem,
        subRatingType: project.subRatingType,
        projectType: project.projectType,
        constructionType: project.constructionType,
        projectName: projectDetail.projectName,
        address: projectDetail.address,
        city: projectDetail.city,
        state: projectDetail.state,
        pincode: projectDetail.pincode,
        siteAreaSqm: Number(projectDetail.siteAreaSqm).toFixed(2),
        siteAreaSqft: Number(projectDetail.siteAreaSqft).toFixed(2),
        numberOfBuildings: projectDetail.numberOfBuildings,
        totalBuiltUpAreaSqft: Number(projectDetail.totalBuiltUpAreaSqft).toFixed(2),
        totalBuiltUpAreaSqm: Number(projectDetail.totalBuiltUpAreaSqm).toFixed(2),
        constructionStartDate: projectDetail.constructionStartDate,
        targetCertificationDate: projectDetail.targetCertificationDate,
        certificationFee: feeBreakup.total.toFixed(2),
        certificationType: dto.certificationType,
        expediteReview: dto.expediteReview ?? false,
        status: "saved",
        currentStep: existingApplication?.currentStep ?? 1,
      }),
    );

    return {
      certificationApplicationId: saved.id,
      projectId: saved.projectId,
      igbcProjectId: saved.igbcProjectId ?? null,
      status: saved.status,
      currentStep: saved.currentStep,
      certificationFee: Number(saved.certificationFee),
      feeBreakup,
      stepOne: {
        category: saved.categoryId,
        ratingSystem: saved.ratingSystem,
        subRatingType: saved.subRatingType ?? null,
        projectType: saved.projectType,
        constructionType: saved.constructionType,
        certificationType: saved.certificationType ?? null,
        expediteReview: saved.expediteReview,
        projectName: saved.projectName,
        address: saved.address,
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
        siteAreaSqm: Number(saved.siteAreaSqm),
        siteAreaSqft: Number(saved.siteAreaSqft),
        numberOfBuildings: saved.numberOfBuildings,
        totalBuiltUpAreaSqft: Number(saved.totalBuiltUpAreaSqft),
        totalBuiltUpAreaSqm: Number(saved.totalBuiltUpAreaSqm),
        constructionStartDate: saved.constructionStartDate ?? null,
        targetCertificationDate: saved.targetCertificationDate ?? null,
      },
      message: existingApplication
        ? "Certification application step-1 updated and registration fields synced successfully."
        : "Certification application step-1 saved and registration fields copied successfully.",
    };
  }

  async getAdminCertificationApplications(
    email: string,
    tab?: "submitted" | "approved" | "rejected",
  ) {
    await this.ensureAdminAccess(email);
    const applications = await this.certificationApplicationRepository.find({
      order: { updatedAt: "DESC", id: "DESC" },
    });

    const projectIds = applications.map((application) => application.projectId);
    const projects = projectIds.length
      ? await this.projectRepository.find({
          where: projectIds.map((id) => ({ id })),
        })
      : [];
    const projectById = new Map(projects.map((project) => [project.id, project]));

    const filtered = applications.filter((application) => {
      if (!tab) {
        return true;
      }
      const isSubmitted = application.status === "submitted";
      if (tab === "submitted") {
        return isSubmitted;
      }
      if (tab === "approved") {
        return isSubmitted && application.paymentStatus === "paid";
      }
      return isSubmitted && application.paymentStatus === "rejected";
    });

    const counts = {
      submitted: applications.filter((application) => application.status === "submitted").length,
      approved: applications.filter(
        (application) =>
          application.status === "submitted" && application.paymentStatus === "paid",
      ).length,
      rejected: applications.filter(
        (application) =>
          application.status === "submitted" && application.paymentStatus === "rejected",
      ).length,
    };

    return {
      counts,
      tab: tab ?? "all",
      total: filtered.length,
      items: filtered.map((application) => {
        const project = projectById.get(application.projectId);
        return {
          certificationApplication: {
            id: application.id,
            projectId: application.projectId,
            igbcProjectId: application.igbcProjectId ?? null,
            temporaryProjectId: application.temporaryProjectId,
            status: application.status,
            paymentStatus: application.paymentStatus,
            currentStep: application.currentStep,
            certificationFee: Number(application.certificationFee ?? 0),
            finalPayableAmount: Number(
              application.finalPayableAmount ?? application.certificationFee ?? 0,
            ),
            ratingSystem: application.ratingSystem,
            projectType: application.projectType,
            constructionType: application.constructionType,
            certificationType: application.certificationType ?? null,
            certificationTypeLabel:
              application.certificationType === 1
                ? "precertificate"
                : application.certificationType === 2
                ? "certification"
                : null,
            expediteReview: application.expediteReview,
            projectName: application.projectName,
            city: application.city,
            state: application.state,
            paymentMethod: application.paymentMethod ?? null,
            paymentType: application.paymentType ?? null,
            transactionReference: application.transactionReference ?? null,
            paymentDate: application.paymentDate ?? null,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
          },
          project: project
            ? {
                id: project.id,
                createdByUserId: project.createdByUserId,
                temporaryProjectId: project.temporaryProjectId,
                igbcProjectId: project.igbcProjectId ?? null,
                status: project.status,
                paymentStatus: project.paymentStatus,
                certificateAppliedStatus: project.certificateAppliedStatus,
                currentStep: project.currentStep,
                registrationFee: Number(project.registrationFee ?? 0),
                finalPayableAmount: Number(project.finalPayableAmount ?? 0),
                rejectRemark: project.rejectRemark ?? null,
                categoryId: project.categoryId,
                ratingSystem: project.ratingSystem,
                subRatingType: project.subRatingType ?? null,
                projectType: project.projectType,
                constructionType: project.constructionType,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
              }
            : null,
        };
      }),
    };
  }

  async getStepTwoPrefill(email: string, projectId: number) {
    const { application, project } = await this.getOwnedCertificationApplication(email, projectId);
    const projectInvoice = await this.projectInvoiceRepository.findOne({
      where: { projectId: project.id },
    });

    return {
      certificationApplicationId: application.id,
      projectId: application.projectId,
      igbcProjectId: application.igbcProjectId ?? null,
      currentStep: application.currentStep,
      status: application.status,
      stepTwo: {
        organizationName:
          application.organizationName ?? projectInvoice?.organizationName ?? null,
        address: application.organizationAddress ?? projectInvoice?.address ?? null,
        city: application.organizationCity ?? projectInvoice?.city ?? null,
        state: application.organizationState ?? projectInvoice?.state ?? null,
        pinCode: application.organizationPinCode ?? projectInvoice?.pinCode ?? null,
        panNumber: application.panNumber ?? projectInvoice?.panNumber ?? null,
        hasGstNumber: application.hasGstNumber || projectInvoice?.hasGstNumber || false,
        gstNumber: application.gstNumber ?? projectInvoice?.gstNumber ?? null,
        sezSelected: application.sezSelected || projectInvoice?.sezSelected || false,
        tdsSelected: application.tdsSelected || projectInvoice?.tdsSelected || false,
        couponCode: application.couponCode ?? projectInvoice?.couponCode ?? null,
        certificationFee: Number(application.certificationFee ?? 0),
        gstRate: Number(application.gstRate ?? 18),
        gstAmount: Number(application.gstAmount ?? 0),
        tdsRate: Number(application.tdsRate ?? 10),
        tdsAmount: Number(application.tdsAmount ?? 0),
        finalPayableAmount: Number(application.finalPayableAmount ?? application.certificationFee ?? 0),
        additionalData:
          application.invoiceAdditionalData ?? projectInvoice?.additionalData ?? null,
      },
    };
  }

  async upsertStepTwo(email: string, projectId: number, dto: UpsertCertificationStepTwoDto) {
    const { application } = await this.getOwnedCertificationApplication(email, projectId);
    const normalizedAddress = dto.address ?? dto.organizationAddress;
    const normalizedCity = dto.city ?? dto.organizationCity;
    const normalizedState = dto.state ?? dto.organizationState;
    const normalizedPinCode = dto.pinCode ?? dto.organizationPinCode;

    if (!normalizedAddress) {
      throw new BadRequestException("address is required");
    }
    if (!normalizedCity) {
      throw new BadRequestException("city is required");
    }
    if (!normalizedState) {
      throw new BadRequestException("state is required");
    }
    if (!normalizedPinCode) {
      throw new BadRequestException("pinCode is required");
    }

    const certificationFee = Number(application.certificationFee ?? 0);
    const gstRate = 18;
    const tdsRate = 10;
    const gstAmount = dto.sezSelected ? 0 : (certificationFee * gstRate) / 100;
    const tdsAmount = dto.tdsSelected ? (certificationFee * tdsRate) / 100 : 0;
    const finalPayableAmount = certificationFee + gstAmount - tdsAmount;

    const saved = await this.certificationApplicationRepository.save(
      this.certificationApplicationRepository.merge(application, {
        organizationName: dto.organizationName,
        organizationAddress: normalizedAddress,
        organizationCity: normalizedCity,
        organizationState: normalizedState,
        organizationPinCode: normalizedPinCode,
        panNumber: dto.panNumber,
        hasGstNumber: dto.hasGstNumber,
        gstNumber: dto.hasGstNumber ? dto.gstNumber : undefined,
        sezSelected: dto.sezSelected,
        tdsSelected: dto.tdsSelected,
        couponCode: dto.couponCode,
        gstRate: gstRate.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        tdsRate: tdsRate.toFixed(2),
        tdsAmount: tdsAmount.toFixed(2),
        finalPayableAmount: finalPayableAmount.toFixed(2),
        invoiceAdditionalData: dto.additionalData,
        currentStep: Math.max(application.currentStep, 2),
        status: "saved",
      }),
    );

    return {
      certificationApplicationId: saved.id,
      projectId: saved.projectId,
      currentStep: saved.currentStep,
      status: saved.status,
      stepTwo: {
        organizationName: saved.organizationName,
        address: saved.organizationAddress,
        city: saved.organizationCity,
        state: saved.organizationState,
        pinCode: saved.organizationPinCode,
        panNumber: saved.panNumber,
        hasGstNumber: saved.hasGstNumber,
        gstNumber: saved.gstNumber ?? null,
        sezSelected: saved.sezSelected,
        tdsSelected: saved.tdsSelected,
        couponCode: saved.couponCode ?? null,
        certificationFee: Number(saved.certificationFee ?? 0),
        gstRate: Number(saved.gstRate ?? 0),
        gstAmount: Number(saved.gstAmount ?? 0),
        tdsRate: Number(saved.tdsRate ?? 0),
        tdsAmount: Number(saved.tdsAmount ?? 0),
        finalPayableAmount: Number(saved.finalPayableAmount ?? 0),
        additionalData: saved.invoiceAdditionalData ?? null,
      },
      message:
        "Certification application step-2 saved and invoice totals calculated successfully.",
    };
  }

  async upsertStepThreePayment(
    email: string,
    projectId: number,
    dto: UpsertCertificationStepThreePaymentDto,
  ) {
    const { application, project } = await this.getOwnedCertificationApplication(email, projectId);
    const normalizedAmount = dto.amount ?? dto.paymentAmount;
    const normalizedRemarks = dto.remarks ?? dto.paymentRemarks;
    const normalizedPaymentDate = dto.paymentDate
      ? this.normalizePaymentDate(dto.paymentDate)
      : undefined;

    const saved = await this.certificationApplicationRepository.save(
      this.certificationApplicationRepository.merge(application, {
        paymentMethod: dto.paymentMethod,
        gatewayResponse: dto.paymentMethod === "online" ? dto.gatewayResponse : undefined,
        paymentType: dto.paymentMethod === "offline" ? dto.paymentType : undefined,
        transactionReference:
          dto.paymentMethod === "offline" ? dto.transactionReference : undefined,
        ifscCode: dto.paymentMethod === "offline" ? dto.ifscCode : undefined,
        bankName: dto.paymentMethod === "offline" ? dto.bankName : undefined,
        branch: dto.paymentMethod === "offline" ? dto.branch : undefined,
        paymentAmount:
          dto.paymentMethod === "offline" ? normalizedAmount?.toFixed(2) : undefined,
        paymentDate: dto.paymentMethod === "offline" ? normalizedPaymentDate : undefined,
        paymentRemarks: normalizedRemarks,
        paymentStatus: "pending",
        status: "submitted",
        currentStep: Math.max(application.currentStep, 3),
      }),
    );

    await this.projectRepository.save(
      this.projectRepository.merge(project, {
        certificateAppliedStatus: "yes",
      }),
    );

    return {
      certificationApplicationId: saved.id,
      projectId: saved.projectId,
      status: saved.status,
      paymentStatus: saved.paymentStatus,
      currentStep: saved.currentStep,
      payment: {
        paymentMethod: saved.paymentMethod,
        gatewayResponse: saved.gatewayResponse ?? null,
        paymentType: saved.paymentType ?? null,
        transactionReference: saved.transactionReference ?? null,
        ifscCode: saved.ifscCode ?? null,
        bankName: saved.bankName ?? null,
        branch: saved.branch ?? null,
        amount: saved.paymentAmount ? Number(saved.paymentAmount) : null,
        paymentDate: saved.paymentDate ?? null,
        remarks: saved.paymentRemarks ?? null,
      },
      message:
        dto.paymentMethod === "online"
          ? "Payment step saved. Certification application submitted successfully."
          : "Offline payment details saved. Certification application submitted successfully.",
    };
  }

  private calculateCertificationFee(
    project: Project,
    projectDetail: ProjectDetail,
    dto: CreateCertificationStepOneDto,
  ): FeeBreakup {
    const ratingSystem = project.ratingSystem;
    const isMember = dto.isMember ?? false;
    const memberType = dto.memberType ?? 0;
    const certificateType = dto.certificateType ?? 1;
    const builtUpArea = Number(projectDetail.totalBuiltUpAreaSqm ?? 0);
    const area = dto.area ?? builtUpArea;
    const additional = dto.additional ?? [];
    const subtype = dto.subtype ?? 0;
    const dwelling = dto.dwelling ?? 0;
    const units = dto.units ?? 0;
    const load = dto.load ?? 0;
    const keys = dto.keys ?? 0;
    const isAfter2025FeeRevision = new Date() >= new Date("2025-02-01");

    const params = {
      isMember,
      memberType,
      certificateType,
      area,
      additional,
      subtype,
      dwelling,
      units,
      load,
      keys,
      isAfter2025FeeRevision,
    };

    switch (ratingSystem) {
      case "IGBC Green New Buildings":
      case "IGBC Green Factory Buildings":
        return this.calculateGreenBuildingLike(params);
      case "IGBC Green Existing Buildings":
        return this.calculateExistingBuilding(params);
      case "IGBC Green Homes":
        return this.calculateGreenHomes(params);
      case "IGBC Green Affordable Housing":
        return this.calculateAffordableHousing(params);
      case "IGBC Green Residential Societies":
        return this.requireUnitsAndCalculate(units, (value) =>
          value <= 100 ? 85000 : value <= 500 ? 130000 : value <= 1000 ? 175000 : 220000,
        );
      case "IGBC Green Data Centers":
      case "Green Data Centers":
        return this.calculateDataCenter(params);
      case "IGBC Green Hotels":
        return this.calculateHotels(params);
      default:
        return {
          fee: Number(project.registrationFee ?? 0),
          additional: 0,
          total: Number(project.registrationFee ?? 0),
        };
    }
  }

  private calculateGreenBuildingLike(params: {
    isMember: boolean;
    memberType: number;
    certificateType: number;
    area: number;
    additional: number[];
    isAfter2025FeeRevision: boolean;
  }): FeeBreakup {
    this.requireArea(params.area);
    let fee = 0;
    if (params.isAfter2025FeeRevision) {
      if (params.isMember && params.memberType === 1) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 220000, 250000, 5, 620000, 270000, 12, 1200000);
      } else if (params.isMember && params.memberType === 2) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 240000, 270000, 5, 640000, 290000, 12, 1220000);
      } else {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 260000, 290000, 5, 660000, 310000, 12, 1240000);
      }
      const additional = this.calculateAdditional(params.additional, 5001);
      return { fee, additional, total: fee + additional };
    }
    return { fee: 0, additional: 0, total: 0 };
  }

  private calculateExistingBuilding(params: {
    isMember: boolean;
    memberType: number;
    area: number;
    additional: number[];
    isAfter2025FeeRevision: boolean;
  }): FeeBreakup {
    this.requireArea(params.area);
    let fee = 0;
    if (params.isAfter2025FeeRevision) {
      if (params.isMember && params.memberType === 1) {
        fee = params.area <= 5000 ? 220000 : params.area <= 75000 ? 250000 + (params.area - 5000) * 8 : 850000;
      } else if (params.isMember && params.memberType === 2) {
        fee = params.area <= 5000 ? 240000 : params.area <= 75000 ? 270000 + (params.area - 5000) * 8 : 870000;
      } else {
        fee = params.area <= 5000 ? 260000 : params.area <= 75000 ? 290000 + (params.area - 5000) * 8 : 890000;
      }
      const additional = this.calculateAdditional(params.additional, 5001);
      return { fee, additional, total: fee + additional };
    }
    return { fee: 0, additional: 0, total: 0 };
  }

  private calculateGreenHomes(params: {
    isMember: boolean;
    memberType: number;
    certificateType: number;
    area: number;
    additional: number[];
    dwelling: number;
    isAfter2025FeeRevision: boolean;
  }): FeeBreakup {
    this.requireArea(params.area);
    let fee = 0;
    if (params.isAfter2025FeeRevision) {
      if (params.dwelling === 1) {
        fee = params.area <= 300 ? 15000 : params.area <= 1500 ? 15000 + (params.area - 300) * 50 : 75000;
      } else if (params.isMember && params.memberType === 1) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 220000, 250000, 5, 620000, 270000, 12, 1200000);
      } else if (params.isMember && params.memberType === 2) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 240000, 270000, 5, 640000, 290000, 12, 1220000);
      } else {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 260000, 290000, 5, 660000, 310000, 12, 1240000);
      }
      const additional = this.calculateAdditional(params.additional, 10001);
      return { fee, additional, total: fee + additional };
    }
    return { fee: 0, additional: 0, total: 0 };
  }

  private calculateAffordableHousing(params: {
    isMember: boolean;
    memberType: number;
    certificateType: number;
    area: number;
    additional: number[];
    isAfter2025FeeRevision: boolean;
  }): FeeBreakup {
    this.requireArea(params.area);
    let fee = 0;
    if (params.isAfter2025FeeRevision) {
      if (params.isMember && params.memberType === 1) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 185000, 215000, 2.5, 400000, 215000, 5, 570000);
      } else if (params.isMember && params.memberType === 2) {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 195000, 225000, 2.5, 410000, 225000, 5, 580000);
      } else {
        fee = this.getPreOrFinalFeeByArea(params.area, params.certificateType, 205000, 235000, 2.5, 420000, 235000, 5, 590000);
      }
      const additional = this.calculateAdditional(params.additional, 10001);
      return { fee, additional, total: fee + additional };
    }
    return { fee: 0, additional: 0, total: 0 };
  }

  private calculateDataCenter(params: {
    isMember: boolean;
    memberType: number;
    certificateType: number;
    load: number;
  }): FeeBreakup {
    if (!params.load) {
      throw new BadRequestException("load is required for Green Data Centers fee calculation");
    }
    let fee = 0;
    if (params.isMember && params.memberType === 1) {
      fee = params.certificateType === 1
        ? params.load <= 5 ? 200000 : params.load <= 10 ? 250000 : 300000
        : params.load <= 5 ? 550000 : params.load <= 10 ? 650000 : 700000;
    } else if (params.isMember && params.memberType === 2) {
      fee = params.certificateType === 1
        ? params.load <= 5 ? 225000 : params.load <= 10 ? 275000 : 325000
        : params.load <= 5 ? 590000 : params.load <= 10 ? 690000 : 790000;
    } else {
      fee = params.certificateType === 1
        ? params.load <= 5 ? 250000 : params.load <= 10 ? 300000 : 350000
        : params.load <= 5 ? 630000 : params.load <= 10 ? 730000 : 830000;
    }
    return { fee, additional: 0, total: fee };
  }

  private calculateHotels(params: {
    isMember: boolean;
    memberType: number;
    certificateType: number;
    keys: number;
  }): FeeBreakup {
    if (!params.keys) {
      throw new BadRequestException("keys is required for Green Hotels fee calculation");
    }
    let fee = 0;
    if (params.isMember && params.memberType === 1) {
      fee = params.certificateType === 1
        ? params.keys <= 100 ? 200000 : params.keys <= 300 ? 230000 + (params.keys - 100) * 500 : 360000
        : params.keys <= 100 ? 250000 : params.keys <= 300 ? 300000 + (params.keys - 100) * 500 : 550000;
    } else if (params.isMember && params.memberType === 2) {
      fee = params.certificateType === 1
        ? params.keys <= 100 ? 220000 : params.keys <= 300 ? 250000 + (params.keys - 100) * 500 : 380000
        : params.keys <= 100 ? 270000 : params.keys <= 300 ? 320000 + (params.keys - 100) * 500 : 570000;
    } else {
      fee = params.certificateType === 1
        ? params.keys <= 100 ? 240000 : params.keys <= 300 ? 270000 + (params.keys - 100) * 500 : 400000
        : params.keys <= 100 ? 290000 : params.keys <= 300 ? 340000 + (params.keys - 100) * 500 : 590000;
    }
    return { fee, additional: 0, total: fee };
  }

  private calculateAdditional(additional: number[], threshold: number) {
    if (!additional.length) {
      return 0;
    }
    const maxArea = Math.max(...additional);
    const maxIndex = additional.findIndex((value) => value === maxArea);
    return additional.reduce((sum, value, index) => {
      if (index !== maxIndex && Number(value) >= threshold) {
        return sum + 50000;
      }
      return sum;
    }, 0);
  }

  private requireArea(area: number) {
    if (!area || area <= 0) {
      throw new BadRequestException("Built-up area is missing. Please complete project details.");
    }
  }

  private requireUnitsAndCalculate(units: number, calc: (units: number) => number): FeeBreakup {
    if (!units) {
      throw new BadRequestException("units is required for fee calculation");
    }
    const fee = calc(units);
    return { fee, additional: 0, total: fee };
  }

  private getPreOrFinalFeeByArea(
    area: number,
    certificateType: number,
    preBase: number,
    preVariableBase: number,
    prePerSqm: number,
    preMax: number,
    finalVariableBase: number,
    finalPerSqm: number,
    finalMax: number,
  ) {
    if (certificateType === 1) {
      return area <= 5000 ? preBase : area <= 75000 ? preVariableBase + (area - 5000) * prePerSqm : preMax;
    }
    return area <= 5000
      ? preBase
      : area <= 75000
      ? finalVariableBase + (area - 5000) * finalPerSqm
      : finalMax;
  }

  private normalizePaymentDate(paymentDate: string) {
    if (paymentDate.includes("/")) {
      const [day, month, year] = paymentDate.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return paymentDate;
  }

  private async getOwnedCertificationApplication(email: string, projectId: number) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    if (project.createdByUserId !== user.id) {
      throw new ForbiddenException("You can access only your own project");
    }
    const application = await this.certificationApplicationRepository.findOne({
      where: { projectId },
    });
    if (!application) {
      throw new NotFoundException(
        "Certification application not found. Complete step-1 before step-2.",
      );
    }
    return { user, project, application };
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access is required");
    }
  }
}
