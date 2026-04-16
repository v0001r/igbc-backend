import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { ListEventsQueryDto } from "./dto/list-events-query.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { EventsService } from "./events.service";

@ApiTags("events")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("admin/events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: "Create event" })
  @UseInterceptors(FileInterceptor("banner"))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      required: ["title", "startDateTime", "endDateTime", "location"],
      properties: {
        title: { type: "string", example: "Green Building Conference 2026" },
        description: { type: "string", example: "<p>Rich text description</p>" },
        banner: { type: "string", format: "binary" },
        startDateTime: { type: "string", example: "2026-06-20T10:00:00Z" },
        endDateTime: { type: "string", example: "2026-06-20T18:00:00Z" },
        location: { type: "string", example: "Hyderabad Convention Centre" },
        organizerName: { type: "string", example: "IGBC Team" },
        ticketPrice: { type: "number", example: 499 },
        maxAttendees: { type: "number", example: 500 },
        status: { type: "string", enum: ["active", "draft", "inactive"] },
      },
    },
  })
  @Post()
  createEvent(
    @Req() request: { user: { email: string } },
    @UploadedFile() banner?: { originalname: string; mimetype: string; buffer: Buffer; size: number },
    @Body() dto?: CreateEventDto,
  ) {
    return this.eventsService.createEvent(request.user.email, dto ?? ({} as CreateEventDto), banner);
  }

  @ApiOperation({ summary: "List events with search/filter/sort/pagination" })
  @Get()
  listEvents(@Req() request: { user: { email: string } }, @Query() query: ListEventsQueryDto) {
    return this.eventsService.listEvents(request.user.email, query);
  }

  @ApiOperation({ summary: "View event details" })
  @Get(":id")
  getEvent(@Req() request: { user: { email: string } }, @Param("id") id: string) {
    return this.eventsService.getEventById(request.user.email, id);
  }

  @ApiOperation({ summary: "Update event details" })
  @UseInterceptors(FileInterceptor("banner"))
  @ApiConsumes("multipart/form-data")
  @Patch(":id")
  updateEvent(
    @Req() request: { user: { email: string } },
    @Param("id") id: string,
    @UploadedFile() banner?: { originalname: string; mimetype: string; buffer: Buffer; size: number },
    @Body() dto?: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(request.user.email, id, dto ?? {}, banner);
  }

  @ApiOperation({ summary: "Delete event (soft delete)" })
  @Delete(":id")
  deleteEvent(@Req() request: { user: { email: string } }, @Param("id") id: string) {
    return this.eventsService.deleteEvent(request.user.email, id);
  }
}
