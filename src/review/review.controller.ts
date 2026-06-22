import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {
  CertificateEligibilityService,
  ClientReportService,
} from "./client-report.service";
import { CreditReviewService } from "./credit-review.service";
import {
  AcceptRejectReportDto,
  InitiateReappealDto,
  ReleaseReportDto,
  SaveCreditReviewDto,
} from "./dto/review.dto";
import { ReappealService } from "./reappeal.service";
import { ReportReleaseService } from "./report-release.service";
import { ReviewAccessService } from "./review-access.service";
import { ReviewCycleService } from "./review-cycle.service";
import { CertificateService } from "./certificate.service";
import {
  CertificateEditDto,
  CertificateAcceptDto,
  CertificateRejectDto,
} from "./dto/review.dto";

@ApiTags("reviews")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("projects/:projectId")
export class ReviewController {
  constructor(
    private readonly creditReviewService: CreditReviewService,
    private readonly reportReleaseService: ReportReleaseService,
    private readonly clientReportService: ClientReportService,
    private readonly certificateEligibilityService: CertificateEligibilityService,
    private readonly reappealService: ReappealService,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly reviewAccessService: ReviewAccessService,
    private readonly certificateService: CertificateService,
  ) {}

  private parseProjectId(projectIdParam: string) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return projectId;
  }

  @ApiOperation({ summary: "TPA: list credits for review" })
  @Get("reviews/credits")
  listTpaCredits(@Req() req: { user: { email: string } }, @Param("projectId") projectIdParam: string) {
    return this.creditReviewService.listCredits(req.user.email, this.parseProjectId(projectIdParam), "tpa");
  }

  @ApiOperation({ summary: "Coordinator: list credits for review" })
  @Get("reviews/coordinator/credits")
  listCoordinatorCredits(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.creditReviewService.listCredits(
      req.user.email,
      this.parseProjectId(projectIdParam),
      "coordinator",
    );
  }

  @ApiOperation({ summary: "TPA: save credit review draft" })
  @Put("reviews/credits/:tab/:subtab")
  saveTpaCredit(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Param("tab") tab: string,
    @Param("subtab") subtab: string,
    @Body() dto: SaveCreditReviewDto,
  ) {
    return this.creditReviewService.saveDraft(
      req.user.email,
      this.parseProjectId(projectIdParam),
      tab,
      subtab,
      "tpa",
      dto,
    );
  }

  @ApiOperation({ summary: "Coordinator: save credit review override" })
  @Put("reviews/coordinator/credits/:tab/:subtab")
  saveCoordinatorCredit(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Param("tab") tab: string,
    @Param("subtab") subtab: string,
    @Body() dto: SaveCreditReviewDto,
  ) {
    return this.creditReviewService.saveDraft(
      req.user.email,
      this.parseProjectId(projectIdParam),
      tab,
      subtab,
      "coordinator",
      dto,
    );
  }

  @ApiOperation({ summary: "TPA: review completeness" })
  @Get("reviews/completeness")
  tpaCompleteness(@Req() req: { user: { email: string } }, @Param("projectId") projectIdParam: string) {
    return this.creditReviewService.getCompleteness(
      req.user.email,
      this.parseProjectId(projectIdParam),
      "tpa",
    );
  }

  @ApiOperation({ summary: "Coordinator: review completeness" })
  @Get("reviews/coordinator/completeness")
  coordinatorCompleteness(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.creditReviewService.getCompleteness(
      req.user.email,
      this.parseProjectId(projectIdParam),
      "coordinator",
    );
  }

  @ApiOperation({ summary: "TPA: preview report" })
  @Post("reviews/preview-report")
  tpaPreview(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: ReleaseReportDto,
  ) {
    return this.reportReleaseService.previewReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      "tpa",
      dto,
    );
  }

  @ApiOperation({ summary: "Coordinator: preview report" })
  @Post("reviews/coordinator/preview-report")
  coordinatorPreview(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: ReleaseReportDto,
  ) {
    return this.reportReleaseService.previewReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      "coordinator",
      dto,
    );
  }

  @ApiOperation({ summary: "TPA: release report" })
  @Post("reviews/release-report")
  tpaRelease(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: ReleaseReportDto,
  ) {
    return this.reportReleaseService.releaseTpaReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto,
    );
  }

  @ApiOperation({ summary: "Coordinator: re-release report to client" })
  @Post("reviews/rerelease-report")
  coordinatorRerelease(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: ReleaseReportDto,
  ) {
    return this.reportReleaseService.rereleaseCoordinatorReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto,
    );
  }

  @ApiOperation({ summary: "Get current released report" })
  @Get("reviews/current/report")
  currentReport(@Req() req: { user: { email: string } }, @Param("projectId") projectIdParam: string) {
    return this.reportReleaseService.getCurrentReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
    );
  }

  @ApiOperation({ summary: "Client: accept report" })
  @Post("reviews/current/accept")
  acceptReport(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: AcceptRejectReportDto,
  ) {
    return this.clientReportService.acceptReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto,
    );
  }

  @ApiOperation({ summary: "Client: reject report" })
  @Post("reviews/current/reject")
  rejectReport(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: AcceptRejectReportDto,
  ) {
    return this.clientReportService.rejectReport(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto,
    );
  }

  @ApiOperation({ summary: "Certificate eligibility check" })
  @Get("certificate/eligibility")
  certificateEligibility(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.reviewAccessService
      .assertProjectRead(req.user.email, this.parseProjectId(projectIdParam))
      .then(() =>
        this.certificateEligibilityService.getEligibility(this.parseProjectId(projectIdParam)),
      );
  }

  @ApiOperation({ summary: "Client: generate certificate" })
  @Post("certificate/generate")
  generateCertificate(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.clientReportService.generateCertificate(
      req.user.email,
      this.parseProjectId(projectIdParam),
    );
  }

  @ApiOperation({ summary: "Certificate details and visibility flags" })
  @Get("certificate/details")
  certificateDetails(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.certificateService.getDetails(req.user.email, this.parseProjectId(projectIdParam));
  }

  @ApiOperation({ summary: "Certificate action logs" })
  @Get("certificate/logs")
  certificateLogs(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.certificateService.getLogs(req.user.email, this.parseProjectId(projectIdParam));
  }

  @ApiOperation({ summary: "Preview certificate" })
  @Get("certificate/preview")
  certificatePreview(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.certificateService.preview(req.user.email, this.parseProjectId(projectIdParam));
  }

  @ApiOperation({ summary: "Accept certificate" })
  @Post("certificate/accept")
  certificateAccept(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: CertificateAcceptDto,
  ) {
    return this.certificateService.accept(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto.remark,
    );
  }

  @ApiOperation({ summary: "Reject certificate" })
  @Post("certificate/reject")
  certificateReject(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: CertificateRejectDto,
  ) {
    return this.certificateService.reject(
      req.user.email,
      this.parseProjectId(projectIdParam),
      dto,
    );
  }

  @ApiOperation({ summary: "Edit certificate display fields" })
  @Post("certificate/edit")
  certificateEdit(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: CertificateEditDto,
  ) {
    return this.certificateService.edit(req.user.email, this.parseProjectId(projectIdParam), dto);
  }

  @ApiOperation({ summary: "Download certificate" })
  @Post("certificate/download")
  certificateDownload(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    return this.certificateService.download(req.user.email, this.parseProjectId(projectIdParam));
  }

  @ApiOperation({ summary: "Client: initiate reappeal" })
  @Post("reappeals")
  initiateReappeal(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: InitiateReappealDto,
  ) {
    return this.reappealService.initiate(req.user.email, this.parseProjectId(projectIdParam), dto);
  }

  @ApiOperation({ summary: "Client: mark reappeal paid" })
  @Post("reappeals/:reappealId/pay")
  payReappeal(
    @Req() req: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Param("reappealId") reappealId: string,
  ) {
    return this.reappealService.markPaid(reappealId, req.user.email);
  }

  @ApiOperation({ summary: "Review cycle summary" })
  @Get("reviews/cycle")
  cycleSummary(@Req() req: { user: { email: string } }, @Param("projectId") projectIdParam: string) {
    const projectId = this.parseProjectId(projectIdParam);
    return this.reviewAccessService.assertProjectRead(req.user.email, projectId).then(async () => {
      const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
      return { cycle: this.reviewCycleService.getCycleSummary(cycle) };
    });
  }
}
