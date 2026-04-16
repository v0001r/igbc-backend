import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { ListEventsQueryDto } from "./dto/list-events-query.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { Event } from "./event.entity";
import { EventsStorageService } from "./events-storage.service";

type UploadedImageFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly usersService: UsersService,
    private readonly eventsStorageService: EventsStorageService,
  ) {}

  async createEvent(requesterEmail: string, dto: CreateEventDto, image?: UploadedImageFile) {
    await this.ensureAdminAccess(requesterEmail);
    this.validateDateRange(dto.startDateTime, dto.endDateTime);
    this.validateImage(image);

    const saved = await this.eventsRepository.save(
      this.eventsRepository.create({
        title: dto.title,
        description: dto.description,
        startDateTime: new Date(dto.startDateTime),
        endDateTime: new Date(dto.endDateTime),
        location: dto.location,
        organizerName: dto.organizerName,
        ticketPrice: dto.ticketPrice,
        maxAttendees: dto.maxAttendees,
        status: dto.status ?? "draft",
      }),
    );

    if (image) {
      saved.bannerUrl = await this.eventsStorageService.uploadBanner(image, saved.id);
      await this.eventsRepository.save(saved);
    }

    return this.toEventResponse(saved);
  }

  async listEvents(requesterEmail: string, query: ListEventsQueryDto) {
    await this.ensureAdminAccess(requesterEmail);
    const page = Math.max(query.page ?? 1, 1);
    const limit = Math.min(Math.max(query.limit ?? 10, 1), 100);
    const sortBy = query.sortBy ?? "createdAt";
    const sortOrder = (query.sortOrder ?? "DESC").toUpperCase() as "ASC" | "DESC";

    const qb = this.eventsRepository.createQueryBuilder("event");

    if (query.search?.trim()) {
      const search = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere("LOWER(event.title) LIKE :search OR LOWER(event.location) LIKE :search", { search });
    }

    if (query.status) {
      qb.andWhere("event.status = :status", { status: query.status });
    }

    if (query.dateFrom) {
      qb.andWhere("event.startDateTime >= :dateFrom", { dateFrom: new Date(query.dateFrom) });
    }

    if (query.dateTo) {
      qb.andWhere("event.endDateTime <= :dateTo", { dateTo: new Date(query.dateTo) });
    }

    qb.orderBy(`event.${sortBy}`, sortOrder)
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
        title: record.title,
        startDateTime: record.startDateTime,
        endDateTime: record.endDateTime,
        location: record.location,
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

  async listUpcomingEvents(limit?: number) {
    const normalizedLimit =
      typeof limit === "number" && Number.isFinite(limit)
        ? Math.min(Math.max(Math.trunc(limit), 1), 100)
        : 50;
    const now = new Date();

    const events = await this.eventsRepository
      .createQueryBuilder("event")
      .where("event.status = :status", { status: "active" })
      .andWhere("event.startDateTime >= :now", { now })
      .orderBy("event.startDateTime", "ASC")
      .addOrderBy("event.createdAt", "DESC")
      .take(normalizedLimit)
      .getMany();

    return {
      total: events.length,
      items: events.map((event) => this.toEventResponse(event)),
    };
  }

  async getEventById(requesterEmail: string, eventId: string) {
    await this.ensureAdminAccess(requesterEmail);
    const event = await this.findByIdOrThrow(eventId);
    return this.toEventResponse(event);
  }

  async updateEvent(requesterEmail: string, eventId: string, dto: UpdateEventDto, image?: UploadedImageFile) {
    await this.ensureAdminAccess(requesterEmail);
    const event = await this.findByIdOrThrow(eventId);

    const startDateTime = dto.startDateTime ? new Date(dto.startDateTime) : event.startDateTime;
    const endDateTime = dto.endDateTime ? new Date(dto.endDateTime) : event.endDateTime;
    this.validateDateRange(startDateTime.toISOString(), endDateTime.toISOString());
    this.validateImage(image);

    const updated = await this.eventsRepository.save(
      this.eventsRepository.merge(event, {
        title: dto.title ?? event.title,
        description: dto.description ?? event.description,
        startDateTime,
        endDateTime,
        location: dto.location ?? event.location,
        organizerName: dto.organizerName ?? event.organizerName,
        ticketPrice: dto.ticketPrice ?? event.ticketPrice,
        maxAttendees: dto.maxAttendees ?? event.maxAttendees,
        status: dto.status ?? event.status,
      }),
    );

    if (image) {
      updated.bannerUrl = await this.eventsStorageService.uploadBanner(image, updated.id);
      await this.eventsRepository.save(updated);
    }

    return this.toEventResponse(updated);
  }

  async deleteEvent(requesterEmail: string, eventId: string) {
    await this.ensureAdminAccess(requesterEmail);
    await this.findByIdOrThrow(eventId);
    await this.eventsRepository.softDelete({ id: eventId });
    return {
      eventId,
      message: "Event deleted successfully",
    };
  }

  private validateDateRange(startDateTime: string, endDateTime: string) {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException("Invalid start or end date");
    }
    if (end <= start) {
      throw new BadRequestException("End date and time must be after start date and time");
    }
  }

  private validateImage(image?: UploadedImageFile) {
    if (!image) {
      return;
    }
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(image.mimetype)) {
      throw new BadRequestException("Invalid image type. Allowed types: jpeg, png, webp");
    }
    const maxSizeBytes = 5 * 1024 * 1024;
    if (image.size > maxSizeBytes) {
      throw new BadRequestException("Image size must be 5MB or less");
    }
  }

  private async findByIdOrThrow(eventId: string) {
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException("Event not found");
    }
    return event;
  }

  private toEventResponse(event: Event) {
    return {
      id: event.id,
      title: event.title,
      description: event.description ?? "",
      bannerUrl: event.bannerUrl ?? null,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      location: event.location,
      organizerName: event.organizerName ?? "",
      ticketPrice: event.ticketPrice ?? null,
      maxAttendees: event.maxAttendees ?? null,
      status: event.status,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }

  private async ensureAdminAccess(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.userType !== "a") {
      throw new ForbiddenException("Admin access only");
    }
  }
}
