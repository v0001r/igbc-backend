import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CertificationApplicationService } from "./certification-application.service";
import { CreateCertificationStepOneDto } from "./dto/create-certification-step-one.dto";
import { RejectCertificationApplicationDto } from "./dto/reject-certification-application.dto";
import { UpsertCertificationStepThreePaymentDto } from "./dto/upsert-certification-step-three-payment.dto";
import { UpsertCertificationStepTwoDto } from "./dto/upsert-certification-step-two.dto";

@ApiTags("certification-application")
@Controller("certification-application")
export class CertificationApplicationController {
  constructor(
    private readonly certificationApplicationService: CertificationApplicationService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: get certification applications by tab (submitted/approved/rejected)",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/list")
  getAdminCertificationApplications(
    @Req() request: { user: { email: string } },
    @Query("tab") tab?: string,
  ) {
    if (tab && tab !== "submitted" && tab !== "approved" && tab !== "rejected") {
      throw new BadRequestException("tab must be one of submitted, approved, rejected");
    }
    return this.certificationApplicationService.getAdminCertificationApplications(
      request.user.email,
      tab as "submitted" | "approved" | "rejected" | undefined,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: get submitted certification applications",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/submitted")
  getAdminSubmittedCertificationApplications(@Req() request: { user: { email: string } }) {
    return this.certificationApplicationService.getAdminCertificationApplications(
      request.user.email,
      "submitted",
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: get approved certification applications (submitted + payment paid)",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/approved")
  getAdminApprovedCertificationApplications(@Req() request: { user: { email: string } }) {
    return this.certificationApplicationService.getAdminCertificationApplications(
      request.user.email,
      "approved",
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: get rejected certification applications (submitted + payment rejected)",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/rejected")
  getAdminRejectedCertificationApplications(@Req() request: { user: { email: string } }) {
    return this.certificationApplicationService.getAdminCertificationApplications(
      request.user.email,
      "rejected",
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: full certification application detail for review (approve/reject when payment pending)",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/application/:applicationId/view")
  getAdminCertificationApplicationView(
    @Req() request: { user: { email: string } },
    @Param("applicationId") applicationIdParam: string,
  ) {
    const applicationId = Number(applicationIdParam);
    if (Number.isNaN(applicationId)) {
      throw new BadRequestException("applicationId must be a number");
    }
    return this.certificationApplicationService.getAdminCertificationApplicationView(
      request.user.email,
      applicationId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Admin: approve certification payment (sets certification_applications.paymentStatus to paid)",
  })
  @UseGuards(JwtAuthGuard)
  @Patch("admin/application/:applicationId/approve")
  approveAdminCertificationApplication(
    @Req() request: { user: { email: string } },
    @Param("applicationId") applicationIdParam: string,
  ) {
    const applicationId = Number(applicationIdParam);
    if (Number.isNaN(applicationId)) {
      throw new BadRequestException("applicationId must be a number");
    }
    return this.certificationApplicationService.approveAdminCertificationApplication(
      request.user.email,
      applicationId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Admin: reject certification payment (sets certification_applications.paymentStatus to rejected)",
  })
  @UseGuards(JwtAuthGuard)
  @Patch("admin/application/:applicationId/reject")
  rejectAdminCertificationApplication(
    @Req() request: { user: { email: string } },
    @Param("applicationId") applicationIdParam: string,
    @Body() dto: RejectCertificationApplicationDto,
  ) {
    const applicationId = Number(applicationIdParam);
    if (Number.isNaN(applicationId)) {
      throw new BadRequestException("applicationId must be a number");
    }
    return this.certificationApplicationService.rejectAdminCertificationApplication(
      request.user.email,
      applicationId,
      dto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Create certification application step-1 for approved project and auto-copy registration fields",
  })
  @UseGuards(JwtAuthGuard)
  @Post("step-one")
  createStepOne(
    @Req() request: { user: { email: string } },
    @Body() dto: CreateCertificationStepOneDto,
  ) {
    return this.certificationApplicationService.createStepOne(request.user.email, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get certification application step-2 invoice prefill from project invoice data",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/step-two/prefill")
  getStepTwoPrefill(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.certificationApplicationService.getStepTwoPrefill(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Save certification application step-2 invoice details, calculate GST/TDS totals, and save final price",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/step-two")
  upsertStepTwo(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertCertificationStepTwoDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.certificationApplicationService.upsertStepTwo(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Save certification application payment step, mark application submitted, and set project application-submitted flag",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/step-three/payment")
  upsertStepThreePayment(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertCertificationStepThreePaymentDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.certificationApplicationService.upsertStepThreePayment(
      request.user.email,
      projectId,
      dto,
    );
  }
}
