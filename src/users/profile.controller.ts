import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersService } from "./users.service";

@ApiTags("profile")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Get current user profile" })
  @Get("me")
  me(@Req() request: { user: { email: string } }) {
    return this.usersService.getPublicProfileByEmail(request.user.email);
  }

  @ApiOperation({ summary: "Update current user profile" })
  @Patch("update")
  updateMe(
    @Req() request: { user: { email: string }; body?: UpdateProfileDto },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const payload =
      updateProfileDto && Object.keys(updateProfileDto).length > 0
        ? updateProfileDto
        : (request.body ?? {});
    console.log("updateProfileDto(resolved)", payload);
    return this.usersService.updateProfileByEmail(request.user.email, payload);
  }
}
