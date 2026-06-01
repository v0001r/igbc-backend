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
import { CreateProjectStepOneDto } from "./dto/create-project-step-one.dto";
import { RejectProjectDto } from "./dto/reject-project.dto";
import { UpsertProjectStepFourDto } from "./dto/upsert-project-step-four.dto";
import { UpsertProjectStepFiveDto } from "./dto/upsert-project-step-five.dto";
import { UpsertProjectStepThreeDto } from "./dto/upsert-project-step-three.dto";
import { UpsertProjectStepTwoDto } from "./dto/upsert-project-step-two.dto";
import { ProjectsService } from "./projects.service";

@ApiTags("projects")
@Controller("projects")
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

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
