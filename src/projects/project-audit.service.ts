import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectAuditLog, type ProjectAuditAction } from "./project-audit-log.entity";

@Injectable()
export class ProjectAuditService {
  constructor(
    @InjectRepository(ProjectAuditLog)
    private readonly auditRepository: Repository<ProjectAuditLog>,
  ) {}

  async log(
    projectId: number,
    action: ProjectAuditAction,
    actorUserId: string | null,
    metadata?: Record<string, unknown>,
  ) {
    await this.auditRepository.save(
      this.auditRepository.create({
        projectId,
        action,
        actorUserId,
        metadata: metadata ?? null,
      }),
    );
  }

  async getTimeline(projectId: number) {
    const rows = await this.auditRepository.find({
      where: { projectId },
      order: { createdAt: "ASC" },
    });
    return rows.map((r) => ({
      id: r.id,
      action: r.action,
      actorUserId: r.actorUserId,
      metadata: r.metadata,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}
