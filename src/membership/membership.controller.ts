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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateMembershipPaymentDto } from "./dto/update-membership-payment.dto";
import { UpsertInvoiceDto } from "./dto/upsert-invoice.dto";
import { UpsertMembershipContactDto } from "./dto/upsert-membership-contact.dto";
import { UpsertMembershipDetailsDto } from "./dto/upsert-membership-details.dto";
import { MembershipService } from "./membership.service";

@ApiTags("membership")
@Controller("membership/applications")
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin: get membership applications list" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/list")
  getAdminMembershipList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("status") status?: string,
    @Query("search") search?: string,
  ) {
    return this.membershipService.getAdminMembershipList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      status,
      search,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin Tab: saved membership applications (draft only)" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/saved")
  getAdminSavedMembershipList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("name") name?: string,
    @Query("email") email?: string,
    @Query("organization") organization?: string,
    @Query("membershipType") membershipType?: string,
    @Query("verificationStatus") verificationStatus?: string,
    @Query("search") search?: string,
  ) {
    return this.membershipService.getAdminSavedMembershipList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      name,
      email,
      organization,
      membershipType,
      verificationStatus,
      search,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin Tab: manage membership (paid + payment approval pending)" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/manage-membership")
  getAdminManageMembershipList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.membershipService.getAdminManageMembershipList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin Tab: manage certificates (payment approved records)" })
  @UseGuards(JwtAuthGuard)
  @Get("admin/tabs/manage-certificate")
  getAdminManageCertificateList(
    @Req() request: { user: { email: string } },
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("search") search?: string,
  ) {
    return this.membershipService.getAdminCertifiedMembershipList(request.user.email, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin action: approve membership payment" })
  @UseGuards(JwtAuthGuard)
  @Post("admin/:id/approve-payment")
  approveMembershipPayment(@Param("id") id: string, @Req() request: { user: { email: string } }) {
    return this.membershipService.approveMembershipPayment(id, request.user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Admin action: certify membership application" })
  @UseGuards(JwtAuthGuard)
  @Post("admin/:id/certify")
  certifyMembership(@Param("id") id: string, @Req() request: { user: { email: string } }) {
    return this.membershipService.certifyMembership(id, request.user.email);
  }

  @ApiOperation({ summary: "Get active membership type/category/plan masters for UI radios" })
  @Get("masters")
  getMasters(@Query("membershipTypeId") membershipTypeId?: string) {
    const parsedMembershipTypeId = membershipTypeId ? Number(membershipTypeId) : undefined;
    if (membershipTypeId && Number.isNaN(parsedMembershipTypeId)) {
      throw new BadRequestException("membershipTypeId must be a number");
    }
    return this.membershipService.getMembershipMasters(parsedMembershipTypeId);
  }

  @ApiOperation({ summary: "Create membership application with membership details (step 1)" })
  @ApiBody({
    schema: {
      oneOf: [
        {
          example: {
            userId: "93f43ca7-f24b-4bc9-a4f5-a6cc89567f16",
            membershipTypeId: 3,
            membershipCategoryId: 8,
            membershipPlanId: 1,
          },
        },
        {
          example: {
            userId: "93f43ca7-f24b-4bc9-a4f5-a6cc89567f16",
            membershipTypeId: 1,
            membershipCategoryId: 2,
          },
        },
      ],
    },
  })
  @Post()
  createMembershipDetails(@Body() dto: UpsertMembershipDetailsDto) {
    return this.membershipService.createMembershipDetails(dto);
  }

  @ApiOperation({ summary: "Update membership details (step 1)" })
  @ApiBody({
    schema: {
      oneOf: [
        {
          example: {
            userId: "93f43ca7-f24b-4bc9-a4f5-a6cc89567f16",
            membershipTypeId: 3,
            membershipCategoryId: 8,
            membershipPlanId: 2,
          },
        },
        {
          example: {
            membershipTypeId: 2,
            membershipCategoryId: 5,
          },
        },
      ],
    },
  })
  @Patch(":id/details")
  updateMembershipDetails(@Param("id") id: string, @Body() dto: UpsertMembershipDetailsDto) {
    return this.membershipService.updateMembershipDetails(id, dto);
  }

  @ApiOperation({ summary: "Save membership primary contact and organization details (step 2)" })
  @Patch(":id/contact")
  upsertContact(@Param("id") id: string, @Body() dto: UpsertMembershipContactDto) {
    return this.membershipService.upsertContact(id, dto);
  }

  @ApiOperation({ summary: "Review complete membership application (step 3)" })
  @Get(":id/review")
  getReview(@Param("id") id: string) {
    return this.membershipService.getReviewData(id);
  }

  @ApiOperation({ summary: "Save invoice details (step 4)" })
  @Patch(":id/invoice")
  upsertInvoice(@Param("id") id: string, @Body() dto: UpsertInvoiceDto) {
    return this.membershipService.upsertInvoice(id, dto);
  }

  @ApiOperation({ summary: "Generate proforma invoice summary (step 4)" })
  @Post(":id/invoice/proforma")
  generateProformaInvoice(@Param("id") id: string) {
    return this.membershipService.generateProformaInvoice(id);
  }

  @ApiOperation({ summary: "Capture payment result and finalize status (step 5)" })
  @Post(":id/payment")
  updatePayment(@Param("id") id: string, @Body() dto: UpdateMembershipPaymentDto) {
    return this.membershipService.updatePayment(id, dto);
  }

  @ApiOperation({ summary: "Get membership application by id" })
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.membershipService.getById(id);
  }
}
