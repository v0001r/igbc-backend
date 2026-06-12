import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, In, Repository } from "typeorm";
import { ProjectDetail } from "../projects/project-detail.entity";
import { Project } from "../projects/project.entity";
import { User } from "../users/user.entity";
import { getActivityLogContext } from "./activity-log-context";
import type { LogActivityDto } from "./dto/log-activity.dto";
import type { QueryActivityLogDto } from "./dto/query-activity-log.dto";
import { ProjectActivityLog } from "./project-activity-log.entity";

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ProjectActivityLog)
    private readonly logRepository: Repository<ProjectActivityLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
  ) {}

  /**
   * Central entry point for all project activity logging.
   * Failures are swallowed so business logic is never interrupted.
   */
  async log(dto: LogActivityDto, manager?: EntityManager): Promise<void> {
    try {
      const ctx = getActivityLogContext();
      const repo = manager ? manager.getRepository(ProjectActivityLog) : this.logRepository;

      const row = repo.create({
        projectId: dto.projectId ?? null,
        certificationApplicationId: dto.certificationApplicationId ?? null,
        userId: dto.userId ?? null,
        userRole: dto.userRole ?? null,
        activityType: dto.activityType,
        module: dto.module ?? null,
        tabName: dto.tabName ?? null,
        subtabName: dto.subtabName ?? null,
        activityTitle: dto.activityTitle,
        activityDescription: dto.activityDescription ?? null,
        oldValue: dto.oldValue ?? null,
        newValue: dto.newValue ?? null,
        pointsAwarded: dto.pointsAwarded != null ? String(dto.pointsAwarded) : null,
        pointsDeducted: dto.pointsDeducted != null ? String(dto.pointsDeducted) : null,
        documentName: dto.documentName ?? null,
        documentCount: dto.documentCount ?? null,
        submissionCount: dto.submissionCount ?? null,
        ipAddress: dto.ipAddress ?? ctx?.ipAddress ?? null,
        userAgent: dto.userAgent ?? ctx?.userAgent ?? null,
      });

      await repo.save(row);
    } catch (err) {
      console.error("[ActivityLogService] Failed to write activity log:", err);
    }
  }

  async query(dto: QueryActivityLogDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 25;
    const skip = (page - 1) * limit;

    const qb = this.logRepository
      .createQueryBuilder("log")
      .orderBy("log.created_at", "DESC")
      .skip(skip)
      .take(limit);

    if (dto.projectId != null) {
      qb.andWhere("log.project_id = :projectId", { projectId: dto.projectId });
    }
    if (dto.userId) {
      qb.andWhere("log.user_id = :userId", { userId: dto.userId });
    }
    if (dto.activityType) {
      qb.andWhere("log.activity_type = :activityType", { activityType: dto.activityType });
    }
    if (dto.module) {
      qb.andWhere("log.module = :module", { module: dto.module });
    }
    if (dto.userRole) {
      qb.andWhere("log.user_role = :userRole", { userRole: dto.userRole });
    }
    if (dto.from) {
      qb.andWhere("log.created_at >= :from", { from: dto.from });
    }
    if (dto.to) {
      qb.andWhere("log.created_at <= :to", { to: dto.to });
    }
    if (dto.search?.trim()) {
      qb.andWhere(
        "(log.activity_title ILIKE :search OR log.activity_description ILIKE :search)",
        { search: `%${dto.search.trim()}%` },
      );
    }

    const [items, total] = await qb.getManyAndCount();
    const enriched = await this.enrichRows(items);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = await this.logRepository
      .createQueryBuilder("log")
      .where("log.created_at >= :todayStart", { todayStart: todayStart.toISOString() })
      .getCount();

    return {
      items: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      summary: {
        totalAll: await this.logRepository.count(),
        todayCount,
      },
    };
  }

  async getTimelineForProject(projectId: number) {
    const rows = await this.logRepository.find({
      where: { projectId },
      order: { createdAt: "ASC" },
    });
    const enriched = await this.enrichRows(rows);
    return enriched.map((r) => this.toTimelineEntry(r));
  }

  toTimelineEntry(r: ReturnType<ActivityLogService["toResponse"]>) {
    return {
      id: r.id,
      action: r.activityType,
      actorUserId: r.userId ?? null,
      metadata: {
        ...(r.oldValue ?? {}),
        ...(r.newValue ?? {}),
        activityTitle: r.activityTitle,
        activityDescription: r.activityDescription,
        module: r.module,
        tabName: r.tabName,
        subtabName: r.subtabName,
        userDisplayName: r.userDisplayName,
        userEmail: r.userEmail,
      },
      createdAt: r.createdAt,
    };
  }

  private async enrichRows(rows: ProjectActivityLog[]) {
    const userIds = [...new Set(rows.map((r) => r.userId).filter((id): id is string => !!id))];
    const projectIds = [
      ...new Set(rows.map((r) => r.projectId).filter((id): id is number => id != null)),
    ];

    const [users, projects, details] = await Promise.all([
      userIds.length
        ? this.userRepository.find({ where: { id: In(userIds) } })
        : Promise.resolve([] as User[]),
      projectIds.length
        ? this.projectRepository.find({ where: { id: In(projectIds) } })
        : Promise.resolve([] as Project[]),
      projectIds.length
        ? this.projectDetailRepository.find({ where: { projectId: In(projectIds) } })
        : Promise.resolve([] as ProjectDetail[]),
    ]);

    const userMap = new Map(users.map((u) => [u.id, u]));
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const detailMap = new Map(details.map((d) => [d.projectId, d]));

    return rows.map((r) => this.toResponse(r, userMap, projectMap, detailMap));
  }

  private toResponse(
    r: ProjectActivityLog,
    userMap?: Map<string, User>,
    projectMap?: Map<number, Project>,
    detailMap?: Map<number, ProjectDetail>,
  ) {
    const user = r.userId && userMap ? userMap.get(r.userId) : undefined;
    const project = r.projectId != null && projectMap ? projectMap.get(r.projectId) : undefined;
    const detail =
      r.projectId != null && detailMap ? detailMap.get(r.projectId) : undefined;

    const projectLabel = project
      ? project.igbcProjectId ?? project.temporaryProjectId ?? `Project #${project.id}`
      : null;

    return {
      id: r.id,
      projectId: r.projectId,
      projectLabel,
      projectName: detail?.projectName ?? null,
      certificationApplicationId: r.certificationApplicationId,
      userId: r.userId,
      userDisplayName: user?.displayName ?? null,
      userEmail: user?.email ?? null,
      userRole: r.userRole,
      userRoleLabel: this.roleLabel(r.userRole),
      activityType: r.activityType,
      activityTypeLabel: this.activityTypeLabel(r.activityType),
      module: r.module,
      tabName: r.tabName,
      subtabName: r.subtabName,
      activityTitle: r.activityTitle,
      activityDescription: r.activityDescription,
      oldValue: r.oldValue,
      newValue: r.newValue,
      pointsAwarded: r.pointsAwarded,
      pointsDeducted: r.pointsDeducted,
      documentName: r.documentName,
      documentCount: r.documentCount,
      submissionCount: r.submissionCount,
      ipAddress: r.ipAddress,
      userAgent: r.userAgent,
      createdAt: r.createdAt.toISOString(),
    };
  }

  private roleLabel(role?: string | null): string | null {
    if (!role) return null;
    const map: Record<string, string> = {
      m: "Client",
      a: "Admin",
      s: "Staff",
      T: "TPA",
    };
    return map[role] ?? role;
  }

  private activityTypeLabel(type: string): string {
    return type
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
