import { Injectable } from "@nestjs/common";
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
import { RatingData } from "./rating-data.entity";
import { RatingDocument } from "./rating-document.entity";
import type { UploadedFile } from "./uploaded-file.type";

export type RegistrationRatingContext = {
  projectId: number;
  ratingType: string;
  versionType: string;
  ratingTypeId: number;
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

  async getForm(ctx: RegistrationRatingContext): Promise<CertificationFormResponse> {
    const [dataRows, docRows] = await Promise.all([
      this.ratingDataRepo.find({
        where: { projectId: ctx.projectId },
        order: { updatedAt: "ASC" },
      }),
      this.ratingDocumentRepo.find({
        where: { projectId: ctx.projectId },
        order: { createdAt: "ASC" },
      }),
    ]);

    return {
      projectId: String(ctx.projectId),
      ratingType: ctx.ratingType,
      versionType: ctx.versionType,
      currentTab: null,
      currentSubtab: null,
      data: dataRows.map((r) => this.toDataDto(r)),
      documents: docRows.map((r) => this.toDocumentDto(r)),
    };
  }

  async saveSection(
    ctx: RegistrationRatingContext,
    dto: SaveCertificationSectionDto,
  ): Promise<CertificationFormResponse> {
    for (const field of dto.fields) {
      if (!field.paramName?.trim()) continue;
      if (isFileFieldType(field.type)) continue;

      await this.upsertDataRow(ctx, dto.tab, dto.subtab, field.paramName, field.value ?? "");
    }

    return this.getForm(ctx);
  }

  async uploadDocuments(
    ctx: RegistrationRatingContext,
    tab: string,
    subtab: string,
    paramName: string,
    files: UploadedFile[],
    replaceExisting = true,
  ): Promise<CertificationFormResponse> {
    if (!files.length) {
      return this.getForm(ctx);
    }

    if (replaceExisting) {
      await this.ratingDocumentRepo.delete({
        projectId: ctx.projectId,
        tab,
        subtab,
        paramName,
      });
    }

    const dir = join(this.uploadRoot, String(ctx.projectId), tab, subtab, paramName);
    await mkdir(dir, { recursive: true });

    for (const file of files) {
      const safeName = this.safeFileName(file.originalname);
      const diskName = `${Date.now()}-${safeName}`;
      const absolutePath = join(dir, diskName);
      await writeFile(absolutePath, file.buffer);

      const relativePath = `/uploads/${ctx.projectId}/${tab}/${subtab}/${paramName}/${diskName}`;
      const row = this.ratingDocumentRepo.create({
        projectId: ctx.projectId,
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

    return this.getForm(ctx);
  }

  private async upsertDataRow(
    ctx: RegistrationRatingContext,
    tab: string,
    subtab: string,
    paramName: string,
    value: string,
  ): Promise<void> {
    const existing = await this.ratingDataRepo.findOne({
      where: {
        projectId: ctx.projectId,
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
      projectId: ctx.projectId,
      ratingType: ctx.ratingType,
      versionType: ctx.versionType,
      tab,
      subtab,
      paramName,
      value,
    });
    await this.ratingDataRepo.save(row);
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
      updatedAt: row.updatedAt?.toISOString(),
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
      updatedAt: row.updatedAt?.toISOString(),
    };
  }
}
