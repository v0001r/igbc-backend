import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { In, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
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

export type ActivityActorContext = {
  userId: string;
  userRole: string;
  userDisplayName?: string;
};

const MAX_DIFF_FIELDS = 50;

@Injectable()
export class RatingFormService {
  private readonly uploadRoot = join(process.cwd(), "uploads");

  constructor(
    @InjectRepository(RatingData)
    private readonly ratingDataRepo: Repository<RatingData>,
    @InjectRepository(RatingDocument)
    private readonly ratingDocumentRepo: Repository<RatingDocument>,
    private readonly activityLogService: ActivityLogService,
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
    actor?: ActivityActorContext,
  ): Promise<CertificationFormResponse> {
    const textFields = dto.fields.filter(
      (field) => field.paramName?.trim() && !isFileFieldType(field.type),
    );
    const paramNames = textFields.map((field) => field.paramName.trim());

    const existingRows =
      paramNames.length > 0
        ? await this.ratingDataRepo.find({
            where: {
              projectId: ctx.projectId,
              tab: dto.tab,
              subtab: dto.subtab,
              paramName: In(paramNames),
            },
          })
        : [];

    const existingMap = new Map(existingRows.map((row) => [row.paramName, row.value ?? ""]));
    const oldValues: Record<string, string> = {};
    const newValues: Record<string, string> = {};
    let fieldsChanged = 0;

    for (const field of textFields) {
      const paramName = field.paramName.trim();
      const nextValue = field.value ?? "";
      const prevValue = existingMap.get(paramName) ?? "";

      if (prevValue !== nextValue) {
        fieldsChanged += 1;
        if (fieldsChanged <= MAX_DIFF_FIELDS) {
          oldValues[paramName] = prevValue;
          newValues[paramName] = nextValue;
        }
      }

      await this.upsertDataRow(ctx, dto.tab, dto.subtab, paramName, nextValue);
    }

    if (actor && fieldsChanged > 0) {
      const roleLabel = actor.userDisplayName ?? actor.userRole;
      await this.activityLogService.log({
        projectId: ctx.projectId,
        userId: actor.userId,
        userRole: actor.userRole,
        activityType: ActivityType.FORM_DATA_SAVED,
        module: ctx.ratingType,
        tabName: dto.tab,
        subtabName: dto.subtab,
        activityTitle: "Form data saved",
        activityDescription: `${roleLabel} saved ${fieldsChanged} field(s) in ${dto.tab} > ${dto.subtab}`,
        oldValue: { fields: oldValues, fieldsChanged },
        newValue: { fields: newValues, fieldsChanged },
      });
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
    actor?: ActivityActorContext,
  ): Promise<CertificationFormResponse> {
    if (!files.length) {
      return this.getForm(ctx);
    }

    const existingDocs = await this.ratingDocumentRepo.find({
      where: { projectId: ctx.projectId, tab, subtab, paramName },
    });
    const hadExisting = existingDocs.length > 0;

    if (replaceExisting && hadExisting) {
      await this.ratingDocumentRepo.delete({
        projectId: ctx.projectId,
        tab,
        subtab,
        paramName,
      });
    }

    const dir = join(this.uploadRoot, String(ctx.projectId), tab, subtab, paramName);
    await mkdir(dir, { recursive: true });

    const savedNames: string[] = [];
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
      savedNames.push(safeName);
    }

    if (actor) {
      const activityType =
        replaceExisting && hadExisting
          ? ActivityType.DOCUMENT_REPLACED
          : ActivityType.DOCUMENT_UPLOADED;
      const roleLabel = actor.userDisplayName ?? actor.userRole;
      const documentName = savedNames.join(", ");
      const actionVerb = activityType === ActivityType.DOCUMENT_REPLACED ? "replaced" : "uploaded";

      await this.activityLogService.log({
        projectId: ctx.projectId,
        userId: actor.userId,
        userRole: actor.userRole,
        activityType,
        module: ctx.ratingType,
        tabName: tab,
        subtabName: subtab,
        activityTitle:
          activityType === ActivityType.DOCUMENT_REPLACED
            ? "Document replaced"
            : "Document uploaded",
        activityDescription: `${roleLabel} ${actionVerb} ${documentName}`,
        documentName,
        documentCount: files.length,
        oldValue: hadExisting
          ? {
              paramName,
              previousFiles: existingDocs.map((d) => d.fileName),
            }
          : null,
        newValue: { paramName, files: savedNames },
      });
    }

    // ACTIVITY_LOG: Add DOCUMENT_DELETED when a standalone document delete endpoint is implemented.
    // ACTIVITY_LOG: Add DOCUMENT_APPROVED / DOCUMENT_REJECTED when staff/TPA document review APIs exist.

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
