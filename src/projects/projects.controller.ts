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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DashboardService } from "../dashboard/dashboard.service";
import { Permission } from "../rbac/permissions.enum";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { PermissionsGuard } from "../rbac/permissions.guard";
import { RoleName } from "../rbac/role.enum";
import { Roles } from "../rbac/roles.decorator";
import { RolesGuard } from "../rbac/roles.guard";
import { CreateProjectStepOneDto } from "./dto/create-project-step-one.dto";
import { RejectProjectDto } from "./dto/reject-project.dto";
import { UpsertProjectStepFourDto } from "./dto/upsert-project-step-four.dto";
import { UpsertProjectStepFiveDto } from "./dto/upsert-project-step-five.dto";
import { UpsertProjectStepThreeDto } from "./dto/upsert-project-step-three.dto";
import { UpsertProjectStepTwoDto } from "./dto/upsert-project-step-two.dto";
import { AssignStaffDto } from "./dto/assign-staff.dto";
import { AssignTpaDto } from "./dto/assign-tpa.dto";
import { SaveCertificationSectionDto } from "./dto/save-certification-section.dto";
import { ProjectAssignmentService } from "./project-assignment.service";
import { ProjectsService } from "./projects.service";

@ApiTags("projects")
@Controller("projects")
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly dashboardService: DashboardService,
    private readonly projectAssignmentService: ProjectAssignmentService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: "Staff/TPA: list assigned projects" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF, RoleName.TPA)
  @RequirePermissions(Permission.PROJECTS_VIEW_ASSIGNED)
  @Get("assigned")
  getAssignedProjects(@Req() request: { user: { email: string } }) {
    return this.dashboardService.getAssignedProjects(request.user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Lead: list final-submitted projects by rating type" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.PROJECTS_ASSIGN_STAFF)
  @Get("lead/submitted")
  getLeadSubmittedProjects(@Req() request: { user: { email: string } }) {
    return this.projectAssignmentService.listLeadSubmittedProjects(request.user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: get project registrations by tab (submitted/saved/approved/rejected)",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/list")
  getAdminProjects(
    @Req() request: { user: { email: string } },
    @Query("tab") tab?: string,
  ) {
    if (
      tab &&
      tab !== "saved" &&
      tab !== "submitted" &&
      tab !== "approved" &&
      tab !== "rejected"
    ) {
      throw new BadRequestException("tab must be one of saved, submitted, approved, rejected");
    }
    return this.projectsService.getAdminProjects(
      request.user.email,
      tab as "saved" | "submitted" | "approved" | "rejected" | undefined,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: view full project registration details",
  })
  @UseGuards(JwtAuthGuard)
  @Get("admin/:projectId/view")
  getAdminProjectView(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getAdminProjectView(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin: approve project, mark payment paid, generate IGBC project id, and send emails",
  })
  @UseGuards(JwtAuthGuard)
  @Patch("admin/:projectId/approve")
  approveProject(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.approveProject(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Admin: reject project, mark payment paid, save reject remark, and send rejection emails",
  })
  @UseGuards(JwtAuthGuard)
  @Patch("admin/:projectId/reject")
  rejectProject(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: RejectProjectDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.rejectProject(request.user.email, projectId, dto.remark);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get my projects list with saved/submitted/approved/rejected counts",
  })
  @UseGuards(JwtAuthGuard)
  @Get("my/list")
  getMyProjects(
    @Req() request: { user: { email: string } },
    @Query("tab") tab?: string,
  ) {
    if (
      tab &&
      tab !== "saved" &&
      tab !== "submitted" &&
      tab !== "approved" &&
      tab !== "rejected"
    ) {
      throw new BadRequestException("tab must be one of saved, submitted, approved, rejected");
    }
    return this.projectsService.getMyProjects(
      request.user.email,
      tab as "saved" | "submitted" | "approved" | "rejected" | undefined,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get project registration fee rules by rating system",
  })
  @UseGuards(JwtAuthGuard)
  @Get("masters/fees")
  getRegistrationFeeMasters() {
    return this.projectsService.getRegistrationFeeMasters();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get all filled details of a particular project (step-1 to step-5)",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/full-details")
  getProjectFullDetails(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getProjectFullDetails(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Load certification workspace (tabs, subtabs, annexures, field rules) for an approved registration project",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/certification-workspace")
  getCertificationWorkspace(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getCertificationWorkspace(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get saved certification form values for an approved registration project",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/certification-form")
  getCertificationForm(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getCertificationForm(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save certification section field values for an approved registration project",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/certification-form")
  saveCertificationSection(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: SaveCertificationSectionDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.saveCertificationSection(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Upload certification documents for an approved registration project",
  })
  @ApiConsumes("multipart/form-data")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Client: final submit certification package" })
  @UseGuards(JwtAuthGuard)
  @Post(":projectId/certification/final-submit")
  finalSubmitCertification(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.finalSubmitCertification(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get project certification workflow timeline" })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/workflow")
  getProjectWorkflow(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getProjectWorkflow(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Lead: assign staff to project" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.PROJECTS_ASSIGN_STAFF)
  @Post(":projectId/assign-staff")
  assignStaff(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: AssignStaffDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectAssignmentService.assignStaff(
      request.user.email,
      projectId,
      dto.staffId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Staff: assign TPA to project" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.PROJECTS_ASSIGN_TPA)
  @Post(":projectId/assign-tpa")
  assignTpa(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: AssignTpaDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectAssignmentService.assignTpa(request.user.email, projectId, dto.tpaId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Lead: eligible staff for project rating type" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.PROJECTS_ASSIGN_STAFF)
  @Get(":projectId/eligible-staff")
  getEligibleStaff(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectAssignmentService.getEligibleStaff(projectId, request.user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Staff: eligible TPAs for project rating type" })
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.PROJECTS_ASSIGN_TPA)
  @Get(":projectId/eligible-tpas")
  getEligibleTpas(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectAssignmentService.getEligibleTpas(projectId, request.user.email);
  }

  @Post(":projectId/certification-form/upload")
  @UseInterceptors(FilesInterceptor("files"))
  uploadCertificationDocuments(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body("tab") tab: string,
    @Body("subtab") subtab: string,
    @Body("paramName") paramName: string,
    @Body("replaceExisting") replaceExisting: string | undefined,
    @UploadedFiles()
    files: Array<{ originalname: string; mimetype: string; buffer: Buffer }> | undefined,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    if (!tab?.trim() || !subtab?.trim() || !paramName?.trim()) {
      throw new BadRequestException("tab, subtab, and paramName are required");
    }
    return this.projectsService.uploadCertificationDocuments(
      request.user.email,
      projectId,
      tab,
      subtab,
      paramName,
      files ?? [],
      replaceExisting !== "false",
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Get certification application step-1 prefill from project registration for approved projects only",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/certification-application/step-one")
  getCertificationApplicationStepOnePrefill(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.getCertificationApplicationStepOnePrefill(
      request.user.email,
      projectId,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Create project registration step-1 (category, rating system, sub rating type, project type, construction type)",
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  createStepOne(
    @Req() request: { user: { email: string } },
    @Body() dto: CreateProjectStepOneDto,
  ) {
    return this.projectsService.createStepOne(request.user.email, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Update project step-1 and refresh fee based on selected rating system",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId")
  upsertStepOne(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: CreateProjectStepOneDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.upsertStepOne(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Resume project registration by fetching saved details and next pending step",
  })
  @UseGuards(JwtAuthGuard)
  @Get(":projectId/resume")
  resumeRegistration(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.resumeRegistration(request.user.email, projectId);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save step-2 project details in project_details and update projects.currentStep to 2",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/details")
  upsertStepTwo(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertProjectStepTwoDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.upsertStepTwo(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: "Save step-3 contacts in project_contacts and move project to step 3",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/contacts")
  upsertStepThree(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertProjectStepThreeDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.upsertStepThree(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Save step-4 invoice details, derive non-member fee from rating system, calculate GST/TDS/total, and move project to step 4",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/invoice")
  upsertStepFour(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertProjectStepFourDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.upsertStepFour(request.user.email, projectId, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary:
      "Save step-5 payment details (online/offline), move project to step 5, and mark status submitted",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":projectId/payment")
  upsertStepFive(
    @Req() request: { user: { email: string } },
    @Param("projectId") projectIdParam: string,
    @Body() dto: UpsertProjectStepFiveDto,
  ) {
    const projectId = Number(projectIdParam);
    if (Number.isNaN(projectId)) {
      throw new BadRequestException("projectId must be a number");
    }
    return this.projectsService.upsertStepFive(request.user.email, projectId, dto);
  }
}
