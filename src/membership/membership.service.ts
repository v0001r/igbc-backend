import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { MembershipApplication } from "./membership-application.entity";
import { UpdateMembershipPaymentDto } from "./dto/update-membership-payment.dto";
import { UpsertInvoiceDto } from "./dto/upsert-invoice.dto";
import { UpsertMembershipContactDto } from "./dto/upsert-membership-contact.dto";
import { UpsertMembershipDetailsDto } from "./dto/upsert-membership-details.dto";
import { MembershipCategoryMaster } from "./membership-category.entity";
import { MembershipPlanMaster } from "./membership-plan.entity";
import { MembershipTypeMaster } from "./membership-type.entity";

@Injectable()
export class MembershipService {
  constructor(
    @InjectRepository(MembershipApplication)
    private readonly membershipRepository: Repository<MembershipApplication>,
    @InjectRepository(MembershipTypeMaster)
    private readonly membershipTypeRepository: Repository<MembershipTypeMaster>,
    @InjectRepository(MembershipCategoryMaster)
    private readonly membershipCategoryRepository: Repository<MembershipCategoryMaster>,
    @InjectRepository(MembershipPlanMaster)
    private readonly membershipPlanRepository: Repository<MembershipPlanMaster>,
    private readonly usersService: UsersService,
  ) {}

  async getAdminMembershipList(
    requesterEmail: string,
    query?: { page?: number; limit?: number; status?: string; search?: string },
  ) {
    await this.ensureAdminAccess(requesterEmail);

    const page = Math.max(query?.page ?? 1, 1);
    const limit = Math.min(Math.max(query?.limit ?? 10, 1), 100);
    const qb = this.membershipRepository.createQueryBuilder("membership");

    if (query?.status?.trim()) {
      qb.andWhere("membership.status = :status", { status: query.status.trim() });
    }

    if (query?.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(membership.membershipTypeName) LIKE :search OR LOWER(membership.membershipCategoryName) LIKE :search OR LOWER(COALESCE(membership.membershipPlanName, '')) LIKE :search OR LOWER(CAST(membership.userId AS TEXT)) LIKE :search OR LOWER(COALESCE(membership.membershipId, '')) LIKE :search",
        { search },
      );
    }

    qb.orderBy("membership.updatedAt", "DESC")
      .addOrderBy("membership.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [records, total] = await qb.getManyAndCount();
    return this.toAdminMembershipListResponse(records, total, page, limit);
  }

  async getAdminSavedMembershipList(
    requesterEmail: string,
    query?: {
      page?: number;
      limit?: number;
      name?: string;
      email?: string;
      organization?: string;
      membershipType?: string;
      verificationStatus?: string;
      search?: string;
    },
  ) {
    await this.ensureAdminAccess(requesterEmail);
    return this.getAdminMembershipListByTab("saved", query);
  }

  async getAdminManageMembershipList(
    requesterEmail: string,
    query?: { page?: number; limit?: number; search?: string },
  ) {
    await this.ensureAdminAccess(requesterEmail);
    return this.getAdminMembershipListByTab("manage", query);
  }

  async getAdminCertifiedMembershipList(
    requesterEmail: string,
    query?: { page?: number; limit?: number; search?: string },
  ) {
    await this.ensureAdminAccess(requesterEmail);
    return this.getAdminMembershipListByTab("certified", query);
  }

  async certifyMembership(applicationId: string, requesterEmail: string) {
    await this.ensureAdminAccess(requesterEmail);
    const application = await this.findByIdOrThrow(applicationId);
    if (application.isCertified) {
      return {
        applicationId: application.id,
        isCertified: true,
        certificateNumber: application.certificateNumber,
        certifiedAt: application.certifiedAt,
        message: "Membership already certified",
      };
    }

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        isCertified: true,
        certificateNumber: this.generateCertificateNumber(),
        certifiedAt: new Date(),
      }),
    );

    return {
      applicationId: updated.id,
      isCertified: updated.isCertified,
      certificateNumber: updated.certificateNumber,
      certifiedAt: updated.certifiedAt,
      message: "Membership certified successfully",
    };
  }

  async approveMembershipPayment(applicationId: string, requesterEmail: string) {
    await this.ensureAdminAccess(requesterEmail);
    const application = await this.findByIdOrThrow(applicationId);

    if (application.status !== "paid" || application.paymentStatus !== "success") {
      throw new BadRequestException("Only paid memberships can be approved");
    }

    if (application.paymentApprovalStatus === "approved") {
      return {
        applicationId: application.id,
        membershipId: application.membershipId ?? null,
        paymentApprovalStatus: "approved",
        paymentApprovedAt: application.paymentApprovedAt,
        message: "Payment already approved",
      };
    }

    const membershipId = application.membershipId ?? (await this.generateMembershipId(application));

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        membershipId,
        paymentApprovalStatus: "approved",
        paymentApprovedAt: new Date(),
      }),
    );

    return {
      applicationId: updated.id,
      membershipId: updated.membershipId ?? null,
      paymentApprovalStatus: updated.paymentApprovalStatus,
      paymentApprovedAt: updated.paymentApprovedAt,
      message: "Payment approved successfully",
    };
  }

  private async getAdminMembershipListByTab(
    tab: "saved" | "manage" | "certified",
    query?: {
      page?: number;
      limit?: number;
      name?: string;
      email?: string;
      organization?: string;
      membershipType?: string;
      verificationStatus?: string;
      search?: string;
    },
  ) {
    const page = Math.max(query?.page ?? 1, 1);
    const limit = Math.min(Math.max(query?.limit ?? 10, 1), 100);
    const qb = this.membershipRepository.createQueryBuilder("membership");

    if (tab === "saved") {
      qb.where("membership.status = :status", { status: "draft" });
    } else if (tab === "manage") {
      qb.where("membership.status = :status", { status: "paid" });
      qb.andWhere("membership.paymentStatus = :paymentStatus", { paymentStatus: "success" });
      qb.andWhere("membership.paymentApprovalStatus = :approval", { approval: "pending" });
    } else if (tab === "certified") {
      qb.where("membership.paymentApprovalStatus = :approval", { approval: "approved" });
    }

    if (query?.name?.trim()) {
      const nameSearch = `%${query.name.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(COALESCE(membership.contact->>'first_name', '')) LIKE :nameSearch OR LOWER(COALESCE(membership.contact->>'last_name', '')) LIKE :nameSearch",
        { nameSearch },
      );
    }

    if (query?.email?.trim()) {
      const emailSearch = `%${query.email.trim().toLowerCase()}%`;
      qb.andWhere("LOWER(COALESCE(membership.contact->>'email', '')) LIKE :emailSearch", {
        emailSearch,
      });
    }

    if (query?.organization?.trim()) {
      const orgSearch = `%${query.organization.trim().toLowerCase()}%`;
      qb.andWhere("LOWER(COALESCE(membership.contact->>'organization', '')) LIKE :orgSearch", {
        orgSearch,
      });
    }

    if (query?.membershipType?.trim() && query.membershipType.toLowerCase() !== "all") {
      const membershipTypeSearch = `%${query.membershipType.trim().toLowerCase()}%`;
      qb.andWhere("LOWER(membership.membershipTypeName) LIKE :membershipTypeSearch", {
        membershipTypeSearch,
      });
    }

    if (query?.verificationStatus?.trim() && query.verificationStatus.toLowerCase() !== "all") {
      const verificationStatus = query.verificationStatus.trim().toLowerCase();
      if (verificationStatus === "approved" || verificationStatus === "pending") {
        qb.andWhere("membership.paymentApprovalStatus = :verificationStatus", {
          verificationStatus,
        });
      }
    }

    if (query?.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(membership.membershipTypeName) LIKE :search OR LOWER(membership.membershipCategoryName) LIKE :search OR LOWER(COALESCE(membership.membershipPlanName, '')) LIKE :search OR LOWER(CAST(membership.userId AS TEXT)) LIKE :search OR LOWER(COALESCE(membership.membershipId, '')) LIKE :search",
        { search },
      );
    }

    qb.orderBy("membership.updatedAt", "DESC")
      .addOrderBy("membership.id", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [records, total] = await qb.getManyAndCount();
    return this.toAdminMembershipListResponse(records, total, page, limit);
  }

  private async toAdminMembershipListResponse(
    records: MembershipApplication[],
    total: number,
    page: number,
    limit: number,
  ) {
    const userIds = records.map((item) => item.userId);
    const users = await this.usersService.getUsersByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items: records.map((item) => ({
        submittedBy: (() => {
          const user = userMap.get(item.userId);
          if (!user) {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            mobile: user.mobile ?? null,
            telephone: user.telephone ?? null,
          };
        })(),
        applicationId: item.id,
        membershipId: item.membershipId ?? null,
        userId: item.userId,
        membershipType: item.membershipTypeName,
        membershipCategory: item.membershipCategoryName,
        membershipPlan: item.membershipPlanName ?? null,
        membershipFee: item.membershipFee,
        status: item.status,
        paymentStatus: item.paymentStatus ?? null,
        paymentApprovalStatus: item.paymentApprovalStatus ?? "pending",
        paymentApprovedAt: item.paymentApprovedAt ?? null,
        isCertified: item.isCertified,
        certificateNumber: item.certificateNumber ?? null,
        certifiedAt: item.certifiedAt ?? null,
        actions: {
          approvePayment:
            item.status === "paid" &&
            item.paymentStatus === "success" &&
            item.paymentApprovalStatus === "pending",
          viewCertificate: item.paymentApprovalStatus === "approved",
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  }

  async getMembershipMasters(membershipTypeId?: number) {
    const [types, categories, plans] = await Promise.all([
      this.membershipTypeRepository.find({
        where: { status: 1 },
        order: { id: "ASC" },
      }),
      this.membershipCategoryRepository.find({
        where: { status: 1 },
        order: { id: "ASC" },
      }),
      this.membershipPlanRepository.find({
        where: { status: 1 },
        order: { id: "ASC" },
      }),
    ]);

    const filteredCategories =
      membershipTypeId === undefined
        ? categories
        : categories.filter(
            (item) =>
              item.membershipTypeId === membershipTypeId ||
              item.membershipTypeId === null ||
              item.membershipTypeId === undefined,
          );

    return {
      membershipTypes: types.map((item) => ({
        id: item.id,
        name: item.name,
      })),
      membershipCategories: filteredCategories.map((item) => ({
        id: item.id,
        membershipTypeId: item.membershipTypeId ?? null,
        name: item.name,
        shortName: item.shortName ?? null,
      })),
      membershipPlans: plans.map((item) => ({
        id: item.id,
        name: item.name,
        fees: Number(item.fees),
        feeType: item.feeType ?? null,
      })),
    };
  }

  async createMembershipDetails(dto: UpsertMembershipDetailsDto) {
    if (!dto.userId) {
      throw new BadRequestException("userId is required in step 1");
    }
    const { membershipType, membershipCategory, membershipPlan, resolvedFee } =
      await this.resolveAndValidateMembershipSelection(dto);
    if (dto.membershipFee !== undefined && dto.membershipFee !== resolvedFee) {
      throw new BadRequestException("Membership fee does not match selected plan");
    }

    const saved = await this.membershipRepository.save(
      this.membershipRepository.create({
        userId: dto.userId,
        membershipTypeId: membershipType.id,
        membershipTypeName: membershipType.name,
        membershipCategoryId: membershipCategory.id,
        membershipCategoryName: membershipCategory.name,
        membershipPlanId: membershipPlan?.id,
        membershipPlanName: membershipPlan?.name,
        membershipFee: resolvedFee,
        status: "draft",
      }),
    );
    return this.toMembershipDetailsResponse(saved);
  }

  async updateMembershipDetails(applicationId: string, dto: UpsertMembershipDetailsDto) {
    const application = await this.findByIdOrThrow(applicationId);
    const { membershipType, membershipCategory, membershipPlan, resolvedFee } =
      await this.resolveAndValidateMembershipSelection(dto);
    if (dto.membershipFee !== undefined && dto.membershipFee !== resolvedFee) {
      throw new BadRequestException("Membership fee does not match selected plan");
    }

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        membershipTypeId: membershipType.id,
        membershipTypeName: membershipType.name,
        membershipCategoryId: membershipCategory.id,
        membershipCategoryName: membershipCategory.name,
        membershipPlanId: membershipPlan?.id,
        membershipPlanName: membershipPlan?.name,
        membershipFee: resolvedFee,
      }),
    );
    return this.toMembershipDetailsResponse(updated);
  }

  async upsertContact(applicationId: string, dto: UpsertMembershipContactDto) {
    const application = await this.findByIdOrThrow(applicationId);
    if (!dto.showInDirectory) {
      throw new BadRequestException(
        "At least one contact must be accepted for directory visibility",
      );
    }

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        contact: {
          show_in_directory: dto.showInDirectory,
          salutation: dto.salutation,
          first_name: dto.firstName,
          middle_name: dto.middleName ?? "",
          last_name: dto.lastName,
          organization: dto.organization,
          designation: dto.designation,
          department: dto.department,
          country: dto.country,
          state: dto.state,
          city: dto.city,
          address_line_1: dto.addressLine1,
          address_line_2: dto.addressLine2 ?? "",
          pincode: dto.pincode,
          mobile: dto.mobile,
          telephone: dto.telephone ?? "",
          email: dto.email.toLowerCase(),
          pan: dto.pan,
          gst: dto.gst ?? "",
        },
      }),
    );

    return {
      applicationId: updated.id,
      status: updated.status,
      contact: updated.contact,
    };
  }

  async getReviewData(applicationId: string) {
    const application = await this.findByIdOrThrow(applicationId);
    return {
      applicationId: application.id,
      membershipId: application.membershipId ?? null,
      userId: application.userId,
      status: application.status,
      membershipDetails: this.toMembershipDetailsResponse(application).membershipDetails,
      contactDetails: application.contact ?? null,
      invoiceDetails: application.invoice ?? null,
      payment: {
        mode: application.paymentMode ?? null,
        gateway: application.paymentGateway ?? null,
        transactionId: application.paymentTransactionId ?? null,
        paymentMethod: application.paymentMethod ?? null,
        paymentStatus: application.paymentStatus ?? null,
        details: application.paymentMeta ?? null,
      },
    };
  }

  async upsertInvoice(applicationId: string, dto: UpsertInvoiceDto) {
    const application = await this.findByIdOrThrow(applicationId);
    const invoicePayload = {
      organization: dto.organization,
      country: dto.country,
      state: dto.state,
      city: dto.city,
      address_line_1: dto.addressLine1,
      address_line_2: dto.addressLine2 ?? "",
      pincode: dto.pincode,
      is_sez: dto.isSez,
      advance_tax_invoice: dto.advanceTaxInvoice,
    };

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        invoice: invoicePayload,
        status: "submitted",
      }),
    );

    return {
      applicationId: updated.id,
      status: updated.status,
      invoice: updated.invoice,
    };
  }

  async generateProformaInvoice(applicationId: string) {
    const application = await this.findByIdOrThrow(applicationId);
    const isSez = Boolean((application.invoice as { is_sez?: boolean }).is_sez);
    const amount = application.membershipFee;
    const gst = isSez ? 0 : Math.round((amount * 18) / 100);
    const total = amount + gst;
    const invoiceNumber = application.invoiceNumber ?? this.generateInvoiceNumber();

    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        invoiceNumber,
        invoiceAmount: amount,
        gstAmount: gst,
        totalAmount: total,
        status: "invoice_generated",
      }),
    );

    return {
      applicationId: updated.id,
      membershipId: updated.membershipId ?? null,
      invoiceNumber: updated.invoiceNumber,
      membershipFee: updated.invoiceAmount,
      gst: updated.gstAmount,
      totalPayable: updated.totalAmount,
      currency: "INR",
      note: isSez ? "SEZ selected: GST exemption applied" : "GST @ 18% included",
      status: updated.status,
    };
  }

  async updatePayment(applicationId: string, dto: UpdateMembershipPaymentDto) {
    const application = await this.findByIdOrThrow(applicationId);

    const paymentMeta =
      dto.paymentMode === "offline"
        ? {
            dd_cheque_utr_number: dto.ddChequeUtrNumber,
            ifsc_code: dto.ifscCode,
            bank_name: dto.bankName,
            branch: dto.branch,
            amount: dto.amount,
            payment_date: dto.paymentDate,
            remarks: dto.remarks ?? "",
          }
        : {
            remarks: dto.remarks ?? "",
          };

    const nextStatus = dto.status === "success" ? "paid" : "failed";
    const updated = await this.membershipRepository.save(
      this.membershipRepository.merge(application, {
        paymentMode: dto.paymentMode,
        paymentGateway: dto.paymentMode === "online" ? dto.gateway : "offline",
        paymentTransactionId:
          dto.paymentMode === "online" ? dto.transactionId : dto.ddChequeUtrNumber,
        paymentMethod: dto.paymentMode === "online" ? dto.paymentMethod : "offline",
        paymentStatus: dto.status,
        paymentApprovalStatus: "pending",
        paymentApprovedAt: undefined,
        paymentMeta,
        status: nextStatus,
      }),
    );

    return {
      applicationId: updated.id,
      invoiceNumber: updated.invoiceNumber,
      transactionId: updated.paymentTransactionId,
      paymentStatus: updated.paymentStatus,
      paymentApprovalStatus: updated.paymentApprovalStatus,
      paymentMode: updated.paymentMode,
      paymentDetails: updated.paymentMeta,
      membershipStatus: updated.status,
      message:
        updated.status === "paid"
          ? "Payment successful. Membership activated."
          : "Payment failed. Please retry.",
    };
  }

  async getById(applicationId: string) {
    const application = await this.findByIdOrThrow(applicationId);
    return {
      applicationId: application.id,
      membershipId: application.membershipId ?? null,
      userId: application.userId,
      membershipDetails: this.toMembershipDetailsResponse(application).membershipDetails,
      contact: application.contact ?? null,
      invoice: application.invoice ?? null,
      invoiceNumber: application.invoiceNumber ?? null,
      amounts: {
        membershipFee: application.invoiceAmount ?? application.membershipFee,
        gst: application.gstAmount ?? null,
        total: application.totalAmount ?? null,
      },
      payment: {
        mode: application.paymentMode ?? null,
        gateway: application.paymentGateway ?? null,
        transactionId: application.paymentTransactionId ?? null,
        paymentMethod: application.paymentMethod ?? null,
        status: application.paymentStatus ?? null,
        details: application.paymentMeta ?? null,
      },
      status: application.status,
    };
  }

  private toMembershipDetailsResponse(application: MembershipApplication) {
    return {
      applicationId: application.id,
      membershipId: application.membershipId ?? null,
      userId: application.userId,
      status: application.status,
      membershipDetails: {
        membership_type_id: application.membershipTypeId,
        membership_type: application.membershipTypeName,
        membership_category_id: application.membershipCategoryId,
        membership_category: application.membershipCategoryName,
        membership_plan_id: application.membershipPlanId,
        membership_plan: application.membershipPlanName,
        membership_fee: application.membershipFee,
        note: "Membership fee is inclusive of GST unless SEZ exemption applies at invoice stage.",
      },
    };
  }

  private async findByIdOrThrow(applicationId: string) {
    const application = await this.membershipRepository.findOne({ where: { id: applicationId } });
    if (!application) {
      throw new NotFoundException("Membership application not found");
    }
    return application;
  }

  private generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const suffix = Math.floor(10000 + Math.random() * 90000);
    return `IGBC-MEM-${year}-${suffix}`;
  }

  private generateCertificateNumber() {
    const year = new Date().getFullYear();
    const suffix = Math.floor(10000 + Math.random() * 90000);
    return `IGBC-CERT-${year}-${suffix}`;
  }

  private async generateMembershipId(application: MembershipApplication) {
    const planCode = this.derivePlanCode(application.membershipPlanName, application.membershipTypeName);
    const prefix = `IGBC/${planCode}/`;
    const usedCount = await this.membershipRepository
      .createQueryBuilder("membership")
      .where("membership.membershipId LIKE :prefix", { prefix: `${prefix}%` })
      .getCount();
    const serial = `${usedCount + 1}`.padStart(4, "0");
    return `${prefix}${serial}`;
  }

  private derivePlanCode(planName?: string, membershipTypeName?: string) {
    const source = planName?.trim() ? planName : membershipTypeName ?? "membership";
    const tokens = source
      .toUpperCase()
      .replace(/[^A-Z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length === 0) {
      return "MEM";
    }

    const code = tokens.map((token) => token[0]).join("").slice(0, 4);
    return code || "MEM";
  }

  private async resolveAndValidateMembershipSelection(dto: UpsertMembershipDetailsDto) {
    const [membershipType, membershipCategory] = await Promise.all([
      this.membershipTypeRepository.findOne({
        where: { id: dto.membershipTypeId, status: 1 },
      }),
      this.membershipCategoryRepository.findOne({
        where: { id: dto.membershipCategoryId, status: 1 },
      }),
    ]);

    if (!membershipType) {
      throw new BadRequestException("Invalid or inactive membership type");
    }
    if (!membershipCategory) {
      throw new BadRequestException("Invalid or inactive membership category");
    }
    if (
      membershipCategory.membershipTypeId !== null &&
      membershipCategory.membershipTypeId !== undefined &&
      membershipCategory.membershipTypeId !== membershipType.id
    ) {
      throw new BadRequestException(
        "Selected membership category does not belong to selected membership type",
      );
    }

    const isIndividualMembership = membershipType.name.toLowerCase().includes("individual");

    if (isIndividualMembership && !dto.membershipPlanId) {
      throw new BadRequestException("Membership plan is required for Individual Membership");
    }

    if (!isIndividualMembership && dto.membershipPlanId) {
      throw new BadRequestException(
        "Membership plan is applicable only for Individual Membership type",
      );
    }

    if (isIndividualMembership) {
      const membershipPlan = await this.membershipPlanRepository.findOne({
        where: { id: dto.membershipPlanId, status: 1 },
      });
      if (!membershipPlan) {
        throw new BadRequestException("Invalid or inactive membership plan");
      }
      return {
        membershipType,
        membershipCategory,
        membershipPlan,
        resolvedFee: Number(membershipPlan.fees),
      };
    }

    if (membershipCategory.fee === null || membershipCategory.fee === undefined) {
      throw new BadRequestException(
        "Membership fee is not configured for selected non-individual category",
      );
    }

    return {
      membershipType,
      membershipCategory,
      membershipPlan: null,
      resolvedFee: Number(membershipCategory.fee),
    };
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access only");
    }
  }
}
