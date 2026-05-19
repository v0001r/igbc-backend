import {
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
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CertificationFormResponse } from "./certification-form.types";
import type { CertificationWorkspaceResponse } from "../rating-config/rating-config.types";
import { CreateProjectDto } from "./dto/create-project.dto";
import { SaveCertificationSectionDto } from "./dto/save-certification-section.dto";
import { UploadCertificationDocumentsDto } from "./dto/upload-certification-documents.dto";
import { UpdateProjectStatusDto } from "./dto/update-project-status.dto";
import { ProjectsService } from "./projects.service";
import type { UploadedFile } from "./uploaded-file.type";

type AuthRequest = { user: { sub: string; email: string } };

@ApiTags("projects")
@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get("rating-types")
  listRatingTypes() {
    return this.projectsService.listRatingTypes();
  }

  @Get("projects")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  listProjects(@Req() req: AuthRequest) {
    return this.projectsService.listForUser(req.user.sub);
  }

  @Get("projects/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProject(@Param("id") id: string, @Req() req: AuthRequest) {
    return this.projectsService.getByIdForUser(id, req.user.sub);
  }

  @Get("projects/:id/certification-form")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getCertificationForm(
    @Param("id") id: string,
    @Req() req: AuthRequest,
  ): Promise<CertificationFormResponse> {
    return this.projectsService.getCertificationForm(id, req.user.sub);
  }

  @Get("projects/:id/certification-workspace")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getCertificationWorkspace(
    @Param("id") id: string,
    @Req() req: AuthRequest,
  ): Promise<CertificationWorkspaceResponse> {
    return this.projectsService.getCertificationWorkspace(id, req.user.sub);
  }

  @Post("projects")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createProject(@Body() dto: CreateProjectDto, @Req() req: AuthRequest) {
    return this.projectsService.create(req.user.sub, dto);
  }

  @Patch("projects/:id/certification-form")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  saveCertificationSection(
    @Param("id") id: string,
    @Body() dto: SaveCertificationSectionDto,
    @Req() req: AuthRequest,
  ): Promise<CertificationFormResponse> {
    return this.projectsService.saveCertificationSection(id, req.user.sub, dto);
  }

  @Post("projects/:id/certification-form/upload")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("files", 20))
  uploadCertificationDocuments(
    @Param("id") id: string,
    @Body() dto: UploadCertificationDocumentsDto,
    @UploadedFiles() files: UploadedFile[],
    @Req() req: AuthRequest,
  ): Promise<CertificationFormResponse> {
    const replace = dto.replaceExisting !== "false";
    return this.projectsService.uploadCertificationDocuments(
      id,
      req.user.sub,
      dto,
      files ?? [],
      replace,
    );
  }

  @Get("admin/projects")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  listProjectsForAdmin(
    @Req() req: AuthRequest,
    @Query("registrationStatus") registrationStatus?: string,
    @Query("certificationStatus") certificationStatus?: string,
  ) {
    return this.projectsService.listForAdmin(req.user.email, {
      registrationStatus,
      certificationStatus,
    });
  }

  @Get("admin/projects/:id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProjectForAdmin(@Param("id") id: string, @Req() req: AuthRequest) {
    return this.projectsService.getByIdForAdmin(id, req.user.email);
  }

  @Patch("admin/projects/:id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProjectStatusForAdmin(
    @Param("id") id: string,
    @Body() dto: UpdateProjectStatusDto,
    @Req() req: AuthRequest,
  ) {
    return this.projectsService.updateStatusForAdmin(id, req.user.email, dto);
  }

  @Post("admin/projects/:id/approve-registration")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  approveProjectRegistration(@Param("id") id: string, @Req() req: AuthRequest) {
    return this.projectsService.approveRegistrationForAdmin(id, req.user.email);
  }

  @Post("admin/projects/:id/reject-registration")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  rejectProjectRegistration(@Param("id") id: string, @Req() req: AuthRequest) {
    return this.projectsService.rejectRegistrationForAdmin(id, req.user.email);
  }

  @Post("admin/projects/:id/approve-certification")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  approveProjectCertification(@Param("id") id: string, @Req() req: AuthRequest) {
    return this.projectsService.approveCertificationForAdmin(id, req.user.email);
  }
}
