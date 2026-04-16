import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateSupportEntryDto } from "./dto/create-support-entry.dto";
import { ListSupportQueryDto } from "./dto/list-support-query.dto";
import { UpdateSupportEntryDto } from "./dto/update-support-entry.dto";
import { SupportEntry } from "./support.entity";

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(SupportEntry)
    private readonly supportRepository: Repository<SupportEntry>,
    private readonly usersService: UsersService,
  ) {}

  async createSupportEntry(requesterEmail: string, dto: CreateSupportEntryDto) {
    await this.ensureAdminAccess(requesterEmail);
    await this.ensureNoDuplicates(dto.email, dto.phone);
    const saved = await this.supportRepository.save(
      this.supportRepository.create({
        name: dto.name,
        designation: dto.designation,
        department: dto.department,
        phone: dto.phone,
        email: dto.email.toLowerCase(),
        status: dto.status,
      }),
    );
    return this.toSupportResponse(saved);
  }

  async listSupportEntries(requesterEmail: string, query: ListSupportQueryDto) {
    await this.ensureAdminAccess(requesterEmail);
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(Math.max(query.limit ?? 10, 1), 100);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = (query.sortOrder ?? "DESC").toUpperCase() as "ASC" | "DESC";

    const qb = this.supportRepository.createQueryBuilder("support");
    if (query.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(support.name) LIKE :search OR LOWER(support.email) LIKE :search OR support.phone LIKE :searchRaw OR LOWER(support.department) LIKE :search",
        { search, searchRaw: `%${query.search.trim()}%` },
      );
    }
    if (query.department?.trim()) {
      qb.andWhere("LOWER(support.department) = :department", {
        department: query.department.trim().toLowerCase(),
      });
    }
    if (query.status) {
      qb.andWhere("support.status = :status", { status: query.status });
    }

    qb.orderBy(`support.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [records, total] = await qb.getManyAndCount();
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items: records.map((record) => ({
        id: record.id,
        name: record.name,
        designation: record.designation,
        department: record.department,
        phone: record.phone,
        email: record.email,
        status: record.status,
        createdAt: record.createdAt,
        actions: {
          edit: true,
          delete: true,
          view: true,
        },
      })),
    };
  }

  async getSupportEntryById(requesterEmail: string, supportId: string) {
    await this.ensureAdminAccess(requesterEmail);
    const support = await this.findByIdOrThrow(supportId);
    return this.toSupportResponse(support);
  }

  async updateSupportEntry(requesterEmail: string, supportId: string, dto: UpdateSupportEntryDto) {
    await this.ensureAdminAccess(requesterEmail);
    const existing = await this.findByIdOrThrow(supportId);
    const nextEmail = dto.email?.toLowerCase();
    const nextPhone = dto.phone;

    await this.ensureNoDuplicates(nextEmail, nextPhone, supportId);

    const updated = await this.supportRepository.save(
      this.supportRepository.merge(existing, {
        name: dto.name ?? existing.name,
        designation: dto.designation ?? existing.designation,
        department: dto.department ?? existing.department,
        phone: nextPhone ?? existing.phone,
        email: nextEmail ?? existing.email,
        status: dto.status ?? existing.status,
      }),
    );
    return this.toSupportResponse(updated);
  }

  async deleteSupportEntry(requesterEmail: string, supportId: string) {
    await this.ensureAdminAccess(requesterEmail);
    await this.findByIdOrThrow(supportId);
    await this.supportRepository.softDelete({ id: supportId });
    return {
      id: supportId,
      message: "Support entry deleted successfully",
    };
  }

  async listPublicSupportEntries(query?: { search?: string; department?: string; limit?: number }) {
    const limit =
      typeof query?.limit === "number" && Number.isFinite(query.limit)
        ? Math.min(Math.max(Math.trunc(query.limit), 1), 100)
        : 100;
    const qb = this.supportRepository.createQueryBuilder("support");
    qb.where("support.status = :status", { status: "active" });

    if (query?.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        "LOWER(support.name) LIKE :search OR LOWER(support.email) LIKE :search OR support.phone LIKE :searchRaw OR LOWER(support.department) LIKE :search OR LOWER(support.designation) LIKE :search",
        { search, searchRaw: `%${query.search.trim()}%` },
      );
    }

    if (query?.department?.trim()) {
      qb.andWhere("LOWER(support.department) = :department", {
        department: query.department.trim().toLowerCase(),
      });
    }

    qb.orderBy("support.name", "ASC").take(limit);
    const items = await qb.getMany();
    return {
      total: items.length,
      items: items.map((support) => this.toPublicSupportResponse(support)),
    };
  }

  async getPublicSupportEntryById(supportId: string) {
    const support = await this.supportRepository.findOne({
      where: { id: supportId, status: "active" },
    });
    if (!support) {
      throw new NotFoundException("Support entry not found");
    }
    return this.toPublicSupportResponse(support);
  }

  private async ensureNoDuplicates(email?: string, phone?: string, ignoreId?: string) {
    if (email) {
      const duplicateEmail = await this.supportRepository.findOne({ where: { email: email.toLowerCase() } });
      if (duplicateEmail && duplicateEmail.id !== ignoreId) {
        throw new ConflictException("Support entry with this email already exists");
      }
    }
    if (phone) {
      const duplicatePhone = await this.supportRepository.findOne({ where: { phone } });
      if (duplicatePhone && duplicatePhone.id !== ignoreId) {
        throw new ConflictException("Support entry with this phone already exists");
      }
    }
  }

  private async findByIdOrThrow(supportId: string) {
    const support = await this.supportRepository.findOne({ where: { id: supportId } });
    if (!support) {
      throw new NotFoundException("Support entry not found");
    }
    return support;
  }

  private toSupportResponse(support: SupportEntry) {
    return {
      id: support.id,
      name: support.name,
      designation: support.designation,
      department: support.department,
      phone: support.phone,
      email: support.email,
      status: support.status,
      createdAt: support.createdAt,
      updatedAt: support.updatedAt,
    };
  }

  private toPublicSupportResponse(support: SupportEntry) {
    return {
      id: support.id,
      name: support.name,
      designation: support.designation,
      department: support.department,
      phone: support.phone,
      email: support.email,
    };
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access only");
    }
  }
}
