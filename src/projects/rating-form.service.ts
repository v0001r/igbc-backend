import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { Repository } from "typeorm";
import {
  CertificationFormResponse,
  isFileFieldType,
  RatingDataRowDto,
  RatingDocumentDto,
} from "./certification-form.types";
import { SaveCertificationSectionDto } from "./dto/save-certification-section.dto";
import { Project } from "./project.entity";
import { RatingData } from "./rating-data.entity";
import { RatingDocument } from "./rating-document.entity";
import type { UploadedFile } from "./uploaded-file.type";

type ProjectContext = {
  project: Project;
  ratingType: string;
  versionType: string;
};

@Injectable()
export class RatingFormService {
  private readonly uploadRoot = join(process.cwd(), "uploads");

  constructor(
    @InjectRepository(RatingData)
    private readonly ratingDataRepo: Repository<RatingData>,
    @InjectRepository(RatingDocument)
    private readonly ratingDocumentRepo: Repository<RatingDocument>,
  ) {}

  async getForm(project: Project): Promise<CertificationFormResponse> {
    const ctx = this.contextFromProject(project);
    const [dataRows, docRows] = await Promise.all([
      this.ratingDataRepo.find({ where: { projectId: project.id }, order: { updatedAt: "ASC" } }),
      this.ratingDocumentRepo.find({ where: { projectId: project.id }, order: { createdAt: "ASC" } }),
    ]);

    return {
      projectId: project.id,
      ratingType: ctx.ratingType,
      versionType: ctx.versionType,
      currentTab: project.certificationCurrentTab ?? null,
      currentSubtab: project.certificationCurrentSubtab ?? null,
      data: dataRows.map((r) => this.toDataDto(r)),
      documents: docRows.map((r) => this.toDocumentDto(r)),
    };
  }

  async saveSection(
    project: Project,
    dto: SaveCertificationSectionDto,
  ): Promise<CertificationFormResponse> {
    const ctx = this.contextFromProject(project);

    for (const field of dto.fields) {
      if (!field.paramName?.trim()) continue;
      if (isFileFieldType(field.type)) continue;

      await this.upsertDataRow(ctx, dto.tab, dto.subtab, field.paramName, field.value ?? "");
    }

    return this.getForm(project);
  }

  async uploadDocuments(
    project: Project,
    tab: string,
    subtab: string,
    paramName: string,
    files: UploadedFile[],
    replaceExisting = true,
  ): Promise<CertificationFormResponse> {
    const ctx = this.contextFromProject(project);
    if (!files.length) {
      return this.getForm(project);
    }

    if (replaceExisting) {
      await this.ratingDocumentRepo.delete({
        projectId: project.id,
        tab,
        subtab,
        paramName,
      });
    }

    const dir = join(this.uploadRoot, project.id, tab, subtab, paramName);
    await mkdir(dir, { recursive: true });

    for (const file of files) {
      const safeName = this.safeFileName(file.originalname);
      const diskName = `${Date.now()}-${safeName}`;
      const absolutePath = join(dir, diskName);
      await writeFile(absolutePath, file.buffer);

      const relativePath = `/uploads/${project.id}/${tab}/${subtab}/${paramName}/${diskName}`;
      const row = this.ratingDocumentRepo.create({
        projectId: project.id,
        ratingType: ctx.ratingType,
        versionType: ctx.versionType,
        tab,
        subtab,
        paramName,
        fileName: safeName,
        filePath: relativePath,
        fileType: file.mimetype ?? null,
      });
      await this.ratingDocumentRepo.save(row);
    }

    return this.getForm(project);
  }

  private async upsertDataRow(
    ctx: ProjectContext,
    tab: string,
    subtab: string,
    paramName: string,
    value: string,
  ): Promise<void> {
    const existing = await this.ratingDataRepo.findOne({
      where: {
        projectId: ctx.project.id,
        tab,
        subtab,
        paramName,
      },
    });

    if (existing) {
      existing.value = value;
      existing.ratingType = ctx.ratingType;
      existing.versionType = ctx.versionType;
      await this.ratingDataRepo.save(existing);
      return;
    }

    const row = this.ratingDataRepo.create({
      projectId: ctx.project.id,
      ratingType: ctx.ratingType,
      versionType: ctx.versionType,
      tab,
      subtab,
      paramName,
      value,
    });
    await this.ratingDataRepo.save(row);
  }

  private contextFromProject(project: Project): ProjectContext {
    const ratingType = project.ratingType?.configKey;
    if (!ratingType) {
      throw new NotFoundException("Project rating type has no config key");
    }
    return {
      project,
      ratingType,
      versionType: project.versionType,
    };
  }

  private safeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200) || "file";
  }

  private toDataDto(row: RatingData): RatingDataRowDto {
    return {
      id: row.id,
      tab: row.tab,
      subtab: row.subtab,
      paramName: row.paramName,
      value: row.value,
    };
  }

  private toDocumentDto(row: RatingDocument): RatingDocumentDto {
    return {
      id: row.id,
      tab: row.tab,
      subtab: row.subtab,
      paramName: row.paramName,
      fileName: row.fileName,
      filePath: row.filePath,
      fileType: row.fileType ?? null,
    };
  }
}

export function certificationLocked(): ForbiddenException {
  return new ForbiddenException(
    "Certification workspace is available after admin approves the certification application",
  );
}
