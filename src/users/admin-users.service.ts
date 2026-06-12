import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { In, Repository } from "typeorm";
import { RatingTypeService } from "../projects/rating-type.service";
import { DEFAULT_STAFF_PASSWORD, RoleName } from "../rbac/role.enum";
import { RoleSeedService } from "../rbac/role-seed.service";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { AuditLog, type AuditAction } from "./audit-log.entity";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { ListUsersQueryDto } from "./dto/list-users-query.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UserProjectAssignment } from "./user-project-assignment.entity";
import { UserRatingType } from "./user-rating-type.entity";
import { User } from "./user.entity";

function splitFullName(fullName: string): { firstName: string; lastName: string; displayName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] ?? trimmed;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : firstName;
  return { firstName, lastName, displayName: trimmed };
}

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRatingType)
    private readonly userRatingTypeRepository: Repository<UserRatingType>,
    @InjectRepository(UserProjectAssignment)
    private readonly userProjectAssignmentRepository: Repository<UserProjectAssignment>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly ratingTypeService: RatingTypeService,
    private readonly roleSeedService: RoleSeedService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async create(actorEmail: string, dto: CreateAdminUserDto) {
    if (dto.role !== RoleName.IGBC_STAFF && dto.role !== RoleName.TPA) {
      throw new BadRequestException("Only IGBC Staff or TPA users can be created");
    }

    const existing = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const ratingTypes = await this.validateRatingTypeIds(dto.ratingTypeIds);
    const role = await this.roleSeedService.findRoleByName(dto.role);
    if (!role) {
      throw new BadRequestException("Role not configured");
    }

    const actor = await this.userRepository.findOne({ where: { email: actorEmail.toLowerCase() } });
    const { firstName, lastName, displayName } = splitFullName(dto.fullName);
    const hashedPassword = await bcrypt.hash(DEFAULT_STAFF_PASSWORD, 10);

    const user = this.userRepository.create({
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      salutation: "Mr.",
      firstName,
      lastName,
      displayName,
      state: "Telangana",
      country: "India",
      mobile: dto.phone,
      userType: this.roleSeedService.getUserTypeForRole(dto.role),
      roleId: role.id,
      status: dto.status ?? "active",
      isFirstLogin: false,
      createdBy: actor?.id ?? null,
      address: dto.address ?? null,
      organization: dto.organization,
      isLead: dto.role === RoleName.IGBC_STAFF && Boolean(dto.isLead),
    });

    const saved = await this.userRepository.save(user);
    await this.replaceRatingTypes(saved.id, dto.ratingTypeIds);
    if (dto.projectIds?.length) {
      await this.replaceProjectAssignments(saved.id, dto.projectIds, actor?.id ?? null);
    }

    await this.writeAudit(actor?.id ?? null, "USER_CREATED", saved.id, {
      role: dto.role,
      ratingTypeIds: dto.ratingTypeIds,
    });

    return this.getById(saved.id);
  }

  async update(actorEmail: string, userId: string, dto: UpdateAdminUserDto) {
    const user = await this.findStaffOrTpaUser(userId);
    const actor = await this.userRepository.findOne({ where: { email: actorEmail.toLowerCase() } });

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const conflict = await this.userRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (conflict && conflict.id !== userId) {
        throw new ConflictException("Email already in use");
      }
      user.email = dto.email.toLowerCase();
    }

    if (dto.fullName) {
      const names = splitFullName(dto.fullName);
      user.firstName = names.firstName;
      user.lastName = names.lastName;
      user.displayName = names.displayName;
    }
    if (dto.phone !== undefined) user.mobile = dto.phone;
    if (dto.organization !== undefined) user.organization = dto.organization;
    if (dto.address !== undefined) user.address = dto.address;
    if (dto.status !== undefined) user.status = dto.status;

    if (dto.role) {
      const role = await this.roleSeedService.findRoleByName(dto.role);
      if (!role) throw new BadRequestException("Role not configured");
      user.roleId = role.id;
      user.userType = this.roleSeedService.getUserTypeForRole(dto.role);
      if (dto.role === RoleName.TPA) {
        user.isLead = false;
      }
    }

    if (dto.isLead !== undefined) {
      const effectiveRole = dto.role ?? user.role?.roleName;
      user.isLead = effectiveRole === RoleName.IGBC_STAFF && dto.isLead;
    }

    await this.userRepository.save(user);

    if (dto.ratingTypeIds) {
      await this.validateRatingTypeIds(dto.ratingTypeIds);
      await this.replaceRatingTypes(userId, dto.ratingTypeIds);
    }
    if (dto.projectIds !== undefined) {
      await this.replaceProjectAssignments(userId, dto.projectIds, actor?.id ?? null);
    }

    await this.writeAudit(actor?.id ?? null, "USER_UPDATED", userId, dto as Record<string, unknown>);
    return this.getById(userId);
  }

  async list(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const qb = this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.userType IN (:...types)", { types: ["s", "T"] });

    if (query.role) {
      qb.andWhere("role.roleName = :roleName", { roleName: query.role });
    }
    if (query.name?.trim()) {
      qb.andWhere("user.displayName ILIKE :name", { name: `%${query.name.trim()}%` });
    }
    if (query.email?.trim()) {
      qb.andWhere("user.email ILIKE :email", { email: `%${query.email.trim()}%` });
    }
    if (query.phone?.trim()) {
      qb.andWhere("user.mobile ILIKE :phone", { phone: `%${query.phone.trim()}%` });
    }
    if (query.organization?.trim()) {
      qb.andWhere("user.organization ILIKE :org", { org: `%${query.organization.trim()}%` });
    }
    if (query.status) {
      qb.andWhere("user.status = :status", { status: query.status });
    }
    if (query.ratingTypeId) {
      qb.andWhere(
        `EXISTS (SELECT 1 FROM user_rating_types urt2 WHERE urt2.user_id = user.id AND urt2.rating_type_id = :ratingTypeId)`,
        { ratingTypeId: query.ratingTypeId },
      );
    }
    if (query.dateFrom) {
      qb.andWhere("user.createdAt >= :dateFrom", { dateFrom: query.dateFrom });
    }
    if (query.dateTo) {
      qb.andWhere("user.createdAt <= :dateTo", { dateTo: `${query.dateTo}T23:59:59` });
    }

    const sortColumn = query.sortBy === "displayName" ? "user.displayName" : "user.createdAt";
    qb.orderBy(sortColumn, query.sortOrder ?? "DESC");

    const total = await qb.getCount();
    const rows = await qb.skip((page - 1) * limit).take(limit).getMany();
    const items = await Promise.all(rows.map((row) => this.toListItem(row.id)));

    return {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      items,
    };
  }

  async getById(userId: string) {
    const user = await this.findStaffOrTpaUser(userId);
    const ratingTypes = await this.getUserRatingTypes(userId);
    const projects = await this.getUserProjects(userId);
    return this.toDetail(user, ratingTypes, projects);
  }

  async updateStatus(actorEmail: string, userId: string, status: "active" | "inactive") {
    const user = await this.findStaffOrTpaUser(userId);
    const actor = await this.userRepository.findOne({ where: { email: actorEmail.toLowerCase() } });
    user.status = status;
    await this.userRepository.save(user);
    await this.writeAudit(
      actor?.id ?? null,
      status === "active" ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      userId,
    );
    return this.getById(userId);
  }

  async bulkUpdateStatus(actorEmail: string, userIds: string[], status: "active" | "inactive") {
    const results = [];
    for (const id of userIds) {
      results.push(await this.updateStatus(actorEmail, id, status));
    }
    return { updated: results.length, items: results };
  }

  async resetPassword(actorEmail: string, userId: string) {
    const user = await this.findStaffOrTpaUser(userId);
    const actor = await this.userRepository.findOne({ where: { email: actorEmail.toLowerCase() } });
    user.password = await bcrypt.hash(DEFAULT_STAFF_PASSWORD, 10);
    user.isFirstLogin = false;
    await this.userRepository.save(user);
    await this.writeAudit(actor?.id ?? null, "PASSWORD_RESET", userId);
    return { message: "Password reset successfully", userId };
  }

  async exportUsers(query: ListUsersQueryDto, format: "csv" | "xlsx" = "csv") {
    const all = await this.list({ ...query, page: 1, limit: 10000 });
    const headers = [
      "Name",
      "Phone",
      "Email",
      "Organization",
      "Role",
      "Lead",
      "Rating Types",
      "Status",
      "Created Date",
    ];
    const rows = all.items.map((item) => [
      item.displayName,
      item.phone ?? "",
      item.email,
      item.organization ?? "",
      item.roleName ?? "",
      item.isLead ? "Yes" : "No",
      item.assignedRatingTypes.map((r) => r.ratingName).join("; "),
      item.status,
      item.createdAt,
    ]);

    if (format === "csv") {
      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");
      return { contentType: "text/csv", filename: "users-export.csv", data: csv };
    }

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    return { contentType: "text/csv", filename: "users-export.csv", data: csv };
  }

  private async validateRatingTypeIds(ids: number[]) {
    const unique = [...new Set(ids)];
    const found = await Promise.all(unique.map((id) => this.ratingTypeService.findById(id)));
    const missing = unique.filter((id, index) => !found[index]);
    if (missing.length) {
      throw new BadRequestException(`Invalid rating type IDs: ${missing.join(", ")}`);
    }
    return found.filter(Boolean);
  }

  private async replaceRatingTypes(userId: string, ratingTypeIds: number[]) {
    await this.userRatingTypeRepository.delete({ userId });
    const unique = [...new Set(ratingTypeIds)];
    if (!unique.length) return;
    await this.userRatingTypeRepository.save(
      unique.map((ratingTypeId) =>
        this.userRatingTypeRepository.create({ userId, ratingTypeId }),
      ),
    );
  }

  private async replaceProjectAssignments(
    userId: string,
    projectIds: number[],
    assignedBy: string | null,
  ) {
    await this.userProjectAssignmentRepository.delete({ userId });
    const unique = [...new Set(projectIds)];
    if (!unique.length) return;
    await this.userProjectAssignmentRepository.save(
      unique.map((projectId) =>
        this.userProjectAssignmentRepository.create({ userId, projectId, assignedBy }),
      ),
    );
  }

  private async findStaffOrTpaUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user || (user.userType !== "s" && user.userType !== "T")) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async getUserRatingTypes(userId: string) {
    const rows = await this.userRatingTypeRepository.find({
      where: { userId },
      relations: { ratingType: true },
      order: { ratingTypeId: "ASC" },
    });
    return rows.map((r) => ({
      id: r.ratingTypeId,
      ratingName: r.ratingType.ratingName,
      shortRatingName: r.ratingType.shortRatingName,
    }));
  }

  private async getUserProjects(userId: string) {
    const rows = await this.userProjectAssignmentRepository.find({
      where: { userId },
      relations: { project: true },
      order: { projectId: "ASC" },
    });
    return rows.map((r) => ({
      projectId: r.projectId,
      igbcProjectId: r.project.igbcProjectId ?? r.project.temporaryProjectId,
      projectName: r.project.ratingSystem,
      status: r.project.status,
    }));
  }

  private async toListItem(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { role: true },
    });
    if (!user) throw new NotFoundException("User not found");
    const ratingTypes = await this.getUserRatingTypes(userId);
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      phone: user.mobile ?? user.telephone ?? null,
      organization: user.organization ?? null,
      roleName: user.role?.roleName ?? null,
      userType: user.userType,
      status: user.status,
      isLead: user.role?.roleName === RoleName.IGBC_STAFF && user.isLead,
      assignedRatingTypes: ratingTypes,
      createdAt: user.createdAt?.toISOString?.() ?? null,
    };
  }

  private toDetail(
    user: User,
    ratingTypes: Array<{ id: number; ratingName: string; shortRatingName: string }>,
    projects: Array<{
      projectId: number;
      igbcProjectId?: string | null;
      projectName: string;
      status: string;
    }>,
  ) {
    return {
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      phone: user.mobile ?? user.telephone ?? null,
      organization: user.organization ?? null,
      address: user.address ?? null,
      roleName: user.role?.roleName ?? null,
      userType: user.userType,
      status: user.status,
      isLead: user.role?.roleName === RoleName.IGBC_STAFF && user.isLead,
      isFirstLogin: user.isFirstLogin,
      assignedRatingTypes: ratingTypes,
      assignedProjects: projects,
      createdAt: user.createdAt?.toISOString?.() ?? null,
      updatedAt: user.updatedAt?.toISOString?.() ?? null,
    };
  }

  private async writeAudit(
    actorUserId: string | null,
    action: AuditAction,
    targetUserId: string,
    metadata?: Record<string, unknown>,
  ) {
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        actorUserId,
        action,
        targetUserId,
        metadata: metadata ?? null,
      }),
    );

    const activityTypeMap: Partial<Record<AuditAction, string>> = {
      USER_CREATED: ActivityType.USER_CREATED,
      USER_UPDATED: ActivityType.USER_UPDATED,
      USER_ACTIVATED: ActivityType.USER_ACTIVATED,
      USER_DEACTIVATED: ActivityType.USER_DEACTIVATED,
      PASSWORD_RESET: ActivityType.PASSWORD_RESET,
    };

    const activityType = activityTypeMap[action] ?? action;
    const actor = actorUserId
      ? await this.userRepository.findOne({ where: { id: actorUserId } })
      : null;

    await this.activityLogService.log({
      userId: actorUserId,
      userRole: actor?.userType ?? "a",
      activityType,
      module: "admin",
      activityTitle: action.replace(/_/g, " ").toLowerCase(),
      activityDescription: `Admin action: ${action} for user ${targetUserId}`,
      oldValue: metadata?.role ? { role: metadata.role } : null,
      newValue: { targetUserId, ...(metadata ?? {}) },
    });
  }
}
