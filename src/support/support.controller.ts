import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreateSupportEntryDto } from "./dto/create-support-entry.dto";
import { ListSupportQueryDto } from "./dto/list-support-query.dto";
import { UpdateSupportEntryDto } from "./dto/update-support-entry.dto";
import { SupportService } from "./support.service";

@ApiTags("support")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("admin/support")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: "Create support entry" })
  @Post()
  createSupportEntry(@Req() request: { user: { email: string } }, @Body() dto: CreateSupportEntryDto) {
    return this.supportService.createSupportEntry(request.user.email, dto);
  }

  @ApiOperation({ summary: "List support entries with search/filter/sort/pagination" })
  @Get()
  listSupportEntries(@Req() request: { user: { email: string } }, @Query() query: ListSupportQueryDto) {
    return this.supportService.listSupportEntries(request.user.email, query);
  }

  @ApiOperation({ summary: "View support entry details" })
  @Get(":id")
  getSupportEntry(@Req() request: { user: { email: string } }, @Param("id") id: string) {
    return this.supportService.getSupportEntryById(request.user.email, id);
  }

  @ApiOperation({ summary: "Update support entry" })
  @Patch(":id")
  updateSupportEntry(
    @Req() request: { user: { email: string } },
    @Param("id") id: string,
    @Body() dto: UpdateSupportEntryDto,
  ) {
    return this.supportService.updateSupportEntry(request.user.email, id, dto);
  }

  @ApiOperation({ summary: "Delete support entry (soft delete)" })
  @Delete(":id")
  deleteSupportEntry(@Req() request: { user: { email: string } }, @Param("id") id: string) {
    return this.supportService.deleteSupportEntry(request.user.email, id);
  }
}
