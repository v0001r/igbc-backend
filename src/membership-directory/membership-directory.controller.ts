import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ListMembersDto } from "./dto/list-members.dto";
import { UpsertMemberDto } from "./dto/upsert-member.dto";
import { MembershipDirectoryService } from "./membership-directory.service";

@ApiTags("membership-directory")
@Controller("membership-directory")
export class MembershipDirectoryController {
  constructor(private readonly membershipDirectoryService: MembershipDirectoryService) {}

  @ApiOperation({ summary: "List membership directory entries with filters" })
  @Get()
  listMembers(@Query() query: ListMembersDto) {
    return this.membershipDirectoryService.listMembers(query);
  }

  @ApiOperation({ summary: "Create membership directory entry (admin)" })
  @Post()
  createMember(@Body() payload: UpsertMemberDto) {
    return this.membershipDirectoryService.createMember(payload);
  }

  @ApiOperation({ summary: "Update membership directory entry (admin)" })
  @Patch(":id")
  updateMember(@Param("id") id: string, @Body() payload: UpsertMemberDto) {
    return this.membershipDirectoryService.updateMember(id, payload);
  }

  @ApiOperation({ summary: "Delete membership directory entry (admin)" })
  @Delete(":id")
  deleteMember(@Param("id") id: string) {
    return this.membershipDirectoryService.deleteMember(id);
  }
}
