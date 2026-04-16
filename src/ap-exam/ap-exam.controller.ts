import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ApExamService } from "./ap-exam.service";
import { PaymentUpdateDto } from "./dto/payment-update.dto";
import { RegisterApExamDto } from "./dto/register-ap-exam.dto";
import { RescheduleExamDto } from "./dto/reschedule-exam.dto";
import { UpdateExamResultDto } from "./dto/update-exam-result.dto";
import { UploadExamReportDto } from "./dto/upload-exam-report.dto";

@ApiTags("ap-exam")
@Controller("ap-exam")
export class ApExamController {
  constructor(private readonly apExamService: ApExamService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: get AP exam registrations list" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/list")
  getAdminExamList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.apExamService.getAdminExamList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin Tab: manage certificate list (passed AP exams)" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/manage-certificate")
  getAdminManageCertificateList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.apExamService.getAdminManageCertificateList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @ApiOperation({ summary: "Register for AP exam" })
  @Post("register")
  register(@Body() registerApExamDto: RegisterApExamDto) {
    return this.apExamService.createRegistration(registerApExamDto);
  }

  @ApiOperation({ summary: "Update AP exam registration details" })
  @Patch(":id/register")
  updateRegistration(@Param("id") id: string, @Body() registerApExamDto: RegisterApExamDto) {
    return this.apExamService.updateRegistration(id, registerApExamDto);
  }

  @ApiOperation({ summary: "Get AP exam registration by email" })
  @Get("by-email")
  getByEmail(@Query("email") email: string) {
    return this.apExamService.getRegistrationByEmail(email);
  }

  @ApiOperation({ summary: "Get AP exam list for user with available actions" })
  @Get("user-exams")
  getUserExams(@Query("email") email: string) {
    return this.apExamService.getUserExamList(email);
  }

  @ApiOperation({ summary: "Get review data for AP exam registration" })
  @Get(":id/review")
  getReview(@Param("id") id: string) {
    return this.apExamService.getReviewData(id);
  }

  @ApiOperation({ summary: "View AP exam details including report and result" })
  @Get(":id/view")
  getExamView(@Param("id") id: string) {
    return this.apExamService.getExamView(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: upload AP exam report and score" })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("report"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["report", "score"],
      properties: {
        report: {
          type: "string",
          format: "binary",
        },
        score: {
          type: "number",
          example: 78,
        },
      },
    },
  })
  @Post(":id/report")
  uploadReport(
    @Param("id") id: string,
    @Req() request: { user: { email: string } },
    @UploadedFile() report: { originalname: string; mimetype: string; buffer: Buffer } | undefined,
    @Body() dto: UploadExamReportDto,
  ) {
    return this.apExamService.uploadExamReportAndScore(id, request.user.email, report, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: mark AP exam result as pass/fail (after report upload)" })
  @UseGuards(JwtAuthGuard)
  @Patch(":id/result")
  updateResult(
    @Param("id") id: string,
    @Req() request: { user: { email: string } },
    @Body() dto: UpdateExamResultDto,
  ) {
    return this.apExamService.updateExamResult(id, request.user.email, dto);
  }

  @ApiOperation({ summary: "Update payment status for AP exam registration" })
  @Post(":id/payment")
  updatePaymentStatus(@Param("id") id: string, @Body() paymentUpdateDto: PaymentUpdateDto) {
    return this.apExamService.updatePaymentStatus(id, paymentUpdateDto);
  }

  @ApiOperation({ summary: "Reschedule AP exam (allowed only once)" })
  @Post(":id/reschedule")
  rescheduleExam(@Param("id") id: string, @Body() rescheduleExamDto: RescheduleExamDto) {
    return this.apExamService.rescheduleExam(id, rescheduleExamDto);
  }

  @ApiOperation({ summary: "Get selectable AP exam dates for month (1st and 3rd Saturday)" })
  @Get("slots/validate/date")
  validateDate(@Query("examDate") examDate: string) {
    return this.apExamService.validateExamDate(examDate);
  }

  @ApiOperation({ summary: "Get selectable AP exam dates for month (1st and 3rd Saturday)" })
  @Get("slots/:year/:month")
  getSelectableSlots(
    @Param("year", ParseIntPipe) year: number,
    @Param("month", ParseIntPipe) month: number,
  ) {
    return this.apExamService.getSelectableSaturdays(year, month);
  }
}
