import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SupportService } from "./support.service";

@ApiTags("support-public")
@Controller("support")
export class SupportPublicController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: "Public: list active support contacts" })
  @Get()
  listPublicSupportEntries(
    @Query("search") search?: string,
    @Query("department") department?: string,
    @Query("limit") limit?: string,
  ) {
    return this.supportService.listPublicSupportEntries({
      search,
      department,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @ApiOperation({ summary: "Public: view active support contact details" })
  @Get(":id")
  getPublicSupportEntry(@Param("id") id: string) {
    return this.supportService.getPublicSupportEntryById(id);
  }
}
