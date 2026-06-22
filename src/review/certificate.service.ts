import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import {
  CertificationAccessService,
  CertificateLevelService,
} from "../certification-application/certification-access.service";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectAccessService } from "../projects/project-access.service";
import { Project } from "../projects/project.entity";
import { RatingTypeService } from "../projects/rating-type.service";
import { ReviewCycleService } from "./review-cycle.service";
import { CreditReviewService } from "./credit-review.service";
import { CertificateActionLog } from "./certificate-action-log.entity";
import { CertificateCustomization } from "./certificate-customization.entity";
import { CertificatePdfService } from "./certificate-pdf.service";
import type { CertificateEditDto, CertificateRejectDto } from "./dto/review.dto";

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(CertificateCustomization)
    private readonly customizationRepository: Repository<CertificateCustomization>,
    @InjectRepository(CertificateActionLog)
    private readonly actionLogRepository: Repository<CertificateActionLog>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly projectAccessService: ProjectAccessService,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly creditReviewService: CreditReviewService,
    private readonly certificationAccessService: CertificationAccessService,
    private readonly certificateLevelService: CertificateLevelService,
    private readonly certificatePdfService: CertificatePdfService,
    private readonly ratingTypeService: RatingTypeService,
    private readonly activityLogService: ActivityLogService,
    private readonly dataSource: DataSource,
  ) {}

  async getDetails(email: string, projectId: number) {
    await this.projectAccessService.resolveAccess(email, projectId, "read");
    const certApp = await this.requireCertApp(projectId);
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    const customization = await this.customizationRepository.findOne({
      where: { applicationId: certApp.id },
    });
    const totalAwarded = await this.creditReviewService.sumAwardedPointsForProject(projectId);
    const resolved = project
      ? await this.ratingTypeService.resolveForProject({
          ratingTypeId: project.ratingTypeId,
          ratingSystemName: project.ratingSystem,
          versionTypeOverride: project.versionType,
        })
      : null;
    const stage = this.resolveCertificateStage(certApp);
    const { level, unrated } = this.certificateLevelService.resolveLevel(
      resolved?.ratingTypeId ?? project?.ratingTypeId,
      stage,
      totalAwarded,
    );

    return {
      projectId,
      isSubmitted: certApp.isSubmitted,
      isPending: certApp.isPending,
      certificateStatus: certApp.certificateStatus,
      clientReportStatus: certApp.clientReportStatus,
      canViewCertificateTab: this.certificationAccessService.canViewCertificateTab(certApp, cycle),
      canAcceptCertificate:
        this.certificationAccessService.canViewCertificateTab(certApp, cycle) &&
        this.certificationAccessService.canAcceptCertificate(certApp),
      canDownloadCertificate: this.certificationAccessService.canDownloadCertificate(certApp),
      totalAwardedPoints: totalAwarded,
      level,
      unrated,
      ratingSystemName: resolved?.ratingTypeName ?? certApp.ratingSystem,
      versionLabel: this.formatVersionLabel(certApp, project?.versionType),
      registrationNo: certApp.igbcProjectId ?? certApp.temporaryProjectId ?? "",
      projectName: customization?.projectName ?? certApp.projectName,
      address: customization?.address ?? certApp.address,
      certificateAcceptedAt: certApp.certificateAcceptedAt?.toISOString() ?? null,
    };
  }

  async getLogs(email: string, projectId: number) {
    await this.projectAccessService.resolveAccess(email, projectId, "read");
    const certApp = await this.requireCertApp(projectId);
    const logs = await this.actionLogRepository.find({
      where: { applicationId: certApp.id },
      order: { createdAt: "DESC" },
      take: 50,
    });
    return { logs };
  }

  async preview(email: string, projectId: number) {
    await this.assertCanPreview(email, projectId);
    const html = await this.buildCertificateHtml(projectId, { watermark: true });
    const stored = await this.certificatePdfService.storeCertificate(projectId, html, "preview");
    return {
      downloadUrl: stored.downloadUrl,
      fileName: "certificate-preview.pdf",
      fileContentBase64: stored.pdfBuffer.toString("base64"),
    };
  }

  async accept(email: string, projectId: number, remark?: string) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can accept the certificate");
    }
    const certApp = await this.requireCertApp(projectId);
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!this.certificationAccessService.canViewCertificateTab(certApp, cycle)) {
      throw new BadRequestException("Certificate is not available for acceptance");
    }
    if (certApp.certificateStatus === "accepted") {
      throw new BadRequestException("Certificate has already been accepted");
    }
    if (certApp.certificateStatus === "rejected") {
      throw new BadRequestException("Certificate was rejected");
    }

    return this.dataSource.transaction(async (manager) => {
      certApp.certificateStatus = "accepted";
      certApp.certificateAcceptedAt = new Date();
      certApp.certificateAcceptedBy = access.user.id;
      certApp.workflowStatus = "completed";
      await manager.getRepository(CertificationApplication).save(certApp);

      await this.logAction(manager, certApp.id, "accepted", remark ?? null, access.user.id);
      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.CERTIFICATE_ACCEPTED,
          module: "certificate",
          activityTitle: "Certificate accepted",
          newValue: { certificateStatus: "accepted" },
        },
        manager,
      );

      return { message: "Certificate accepted", certificateStatus: certApp.certificateStatus };
    });
  }

  async reject(email: string, projectId: number, dto: CertificateRejectDto) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can reject the certificate");
    }
    const certApp = await this.requireCertApp(projectId);
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!this.certificationAccessService.canViewCertificateTab(certApp, cycle)) {
      throw new BadRequestException("Certificate is not available for rejection");
    }
    if (certApp.certificateStatus !== "pending") {
      throw new BadRequestException("Certificate cannot be rejected in its current state");
    }

    return this.dataSource.transaction(async (manager) => {
      certApp.certificateStatus = "rejected";
      certApp.certificateRejectedAt = new Date();
      certApp.certificateRejectedBy = access.user.id;
      certApp.certificateRejectRemarks = dto.remarks;
      await manager.getRepository(CertificationApplication).save(certApp);

      await this.logAction(manager, certApp.id, "rejected", dto.remarks, access.user.id);
      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.CERTIFICATE_REJECTED,
          module: "certificate",
          activityTitle: "Certificate rejected",
          newValue: { certificateStatus: "rejected", remarks: dto.remarks },
        },
        manager,
      );

      return { message: "Certificate rejected", certificateStatus: certApp.certificateStatus };
    });
  }

  async edit(email: string, projectId: number, dto: CertificateEditDto) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can edit certificate details");
    }
    const certApp = await this.requireCertApp(projectId);
    if (certApp.certificateStatus !== "accepted") {
      throw new BadRequestException("Certificate must be accepted before editing");
    }

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(CertificateCustomization);
      let row = await repo.findOne({ where: { applicationId: certApp.id } });
      if (row) {
        row.projectName = dto.projectName;
        row.address = dto.address;
      } else {
        row = repo.create({
          applicationId: certApp.id,
          projectName: dto.projectName,
          address: dto.address,
        });
      }
      await repo.save(row);

      await this.logAction(
        manager,
        certApp.id,
        "edited",
        `Updated project name and address`,
        access.user.id,
      );
      await this.activityLogService.log(
        {
          projectId,
          userId: access.user.id,
          userRole: access.user.userType,
          activityType: ActivityType.CERTIFICATE_EDITED,
          module: "certificate",
          activityTitle: "Certificate details edited",
          newValue: { projectName: dto.projectName },
        },
        manager,
      );

      return { message: "Certificate details updated", customization: row };
    });
  }

  async download(email: string, projectId: number) {
    const access = await this.projectAccessService.resolveAccess(email, projectId, "read");
    if (access.role !== "admin" && access.project.createdByUserId !== access.user.id) {
      throw new ForbiddenException("Only the project owner can download the certificate");
    }
    const certApp = await this.requireCertApp(projectId);
    if (!this.certificationAccessService.canDownloadCertificate(certApp)) {
      throw new BadRequestException("Certificate must be accepted before download");
    }

    const html = await this.buildCertificateHtml(projectId, {
      watermark: false,
      issueDate: certApp.certificateAcceptedAt ?? new Date(),
    });
    const stored = await this.certificatePdfService.storeCertificate(projectId, html, "final");

    await this.logAction(
      this.dataSource.manager,
      certApp.id,
      "downloaded",
      null,
      access.user.id,
    );
    await this.activityLogService.log({
      projectId,
      userId: access.user.id,
      userRole: access.user.userType,
      activityType: ActivityType.CERTIFICATE_DOWNLOADED,
      module: "certificate",
      activityTitle: "Certificate downloaded",
    });

    return {
      message: "Certificate ready",
      downloadUrl: stored.downloadUrl,
      fileName: this.buildCertificateFileName(certApp),
      fileContentBase64: stored.pdfBuffer.toString("base64"),
    };
  }

  private buildCertificateFileName(certApp: CertificationApplication) {
    const reg = (certApp.igbcProjectId ?? certApp.temporaryProjectId ?? "certificate").replace(
      /[^\w.-]+/g,
      "_",
    );
    return `IGBC-Certificate-${reg}.pdf`;
  }

  private async assertCanPreview(email: string, projectId: number) {
    await this.projectAccessService.resolveAccess(email, projectId, "read");
    const certApp = await this.requireCertApp(projectId);
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!this.certificationAccessService.canViewCertificateTab(certApp, cycle)) {
      throw new BadRequestException("Certificate preview is not available yet");
    }
  }

  private async buildCertificateHtml(
    projectId: number,
    opts: { watermark?: boolean; issueDate?: Date },
  ) {
    const certApp = await this.requireCertApp(projectId);
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    const customization = await this.customizationRepository.findOne({
      where: { applicationId: certApp.id },
    });
    const totalAwarded = await this.creditReviewService.sumAwardedPointsForProject(projectId);
    const resolved = project
      ? await this.ratingTypeService.resolveForProject({
          ratingTypeId: project.ratingTypeId,
          ratingSystemName: project.ratingSystem,
          versionTypeOverride: project.versionType,
        })
      : null;
    const stage = this.resolveCertificateStage(certApp);
    const { level } = this.certificateLevelService.resolveLevel(
      resolved?.ratingTypeId ?? project?.ratingTypeId,
      stage,
      totalAwarded,
    );
    const issueDate = opts.issueDate ?? new Date();
    const issueMonthYear = issueDate.toLocaleString("en-US", { month: "long", year: "numeric" });

    return this.certificatePdfService.generateHtml({
      projectId,
      projectName: customization?.projectName ?? certApp.projectName,
      address: customization?.address ?? certApp.address,
      registrationNo: certApp.igbcProjectId ?? certApp.temporaryProjectId ?? "",
      ratingSystemName: resolved?.ratingTypeName ?? certApp.ratingSystem,
      versionLabel: this.formatVersionLabel(certApp, project?.versionType),
      level,
      issueMonthYear,
      certificateStage: stage,
      watermark: opts.watermark,
    });
  }

  private resolveCertificateStage(certApp: CertificationApplication): "final" | "precert" {
    return certApp.certificationType === 1 ? "precert" : "final";
  }

  private formatVersionLabel(certApp: CertificationApplication, versionType?: string | null) {
    if (certApp.subRatingType?.trim()) return certApp.subRatingType.trim();
    if (versionType?.trim()) return `Version ${versionType.trim()}`;
    return "Existing Interiors";
  }

  private async requireCertApp(projectId: number) {
    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (!certApp) throw new NotFoundException("Certification application not found");
    return certApp;
  }

  private async logAction(
    manager: DataSource["manager"],
    applicationId: number,
    action: CertificateActionLog["action"],
    remarks: string | null,
    userId: string,
  ) {
    const repo = manager.getRepository(CertificateActionLog);
    await repo.save(
      repo.create({
        applicationId,
        action,
        remarks,
        createdBy: userId,
      }),
    );
  }
}
