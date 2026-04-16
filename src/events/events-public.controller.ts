import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { EventsService } from "./events.service";

@ApiTags("events-public")
@Controller("events")
export class EventsPublicController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: "Get all upcoming active events (public)" })
  @Get("upcoming")
  getUpcomingEvents(@Query("limit") limit?: string) {
    return this.eventsService.listUpcomingEvents(limit ? Number(limit) : undefined);
  }
}
