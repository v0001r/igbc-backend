import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApExamService } from "./ap-exam.service";
import { PaymentUpdateDto } from "./dto/payment-update.dto";
import { RegisterApExamDto } from "./dto/register-ap-exam.dto";

@ApiTags("ap-exam")
@Controller("ap-exam")
export class ApExamController {
  constructor(private readonly apExamService: ApExamService) {}

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

  @ApiOperation({ summary: "Get review data for AP exam registration" })
  @Get(":id/review")
  getReview(@Param("id") id: string) {
    return this.apExamService.getReviewData(id);
  }

  @ApiOperation({ summary: "Update payment status for AP exam registration" })
  @Post(":id/payment")
  updatePaymentStatus(@Param("id") id: string, @Body() paymentUpdateDto: PaymentUpdateDto) {
    return this.apExamService.updatePaymentStatus(id, paymentUpdateDto);
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
