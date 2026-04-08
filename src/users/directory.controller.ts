import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsersService } from "./users.service";

@ApiTags("membership-directory")
@Controller("membership-directory")
export class DirectoryController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "List public membership directory entries" })
  @Get()
  list() {
    return this.usersService.getMembershipDirectoryEntries();
  }
}
