import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permission } from "../rbac/permissions.enum";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { PermissionsGuard } from "../rbac/permissions.guard";
import { RoleName } from "../rbac/role.enum";
import { Roles } from "../rbac/roles.decorator";
import { RolesGuard } from "../rbac/roles.guard";
import { AdminUsersService } from "./admin-users.service";
import { BulkStatusDto } from "./dto/bulk-status.dto";
import { CreateAdminUserDto } from "./dto/create-admin-user.dto";
import { ListUsersQueryDto } from "./dto/list-users-query.dto";
import { UpdateAdminUserDto } from "./dto/update-admin-user.dto";
import { UpdateUserStatusDto } from "./dto/update-user-status.dto";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(RoleName.ADMIN)
@RequirePermissions(Permission.USERS_MANAGE)
@Controller("users")
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @ApiOperation({ summary: "Create IGBC Staff or TPA user" })
  @Post()
  create(@Req() request: { user: { email: string } }, @Body() dto: CreateAdminUserDto) {
    return this.adminUsersService.create(request.user.email, dto);
  }

  @ApiOperation({ summary: "Paginated user list with filters" })
  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.adminUsersService.list(query);
  }

  @ApiOperation({ summary: "Export users as CSV" })
  @Get("export")
  @Header("Content-Type", "text/csv")
  async export(
    @Query() query: ListUsersQueryDto & { format?: "csv" | "xlsx" },
    @Res() res: Response,
  ) {
    const result = await this.adminUsersService.exportUsers(query, query.format ?? "csv");
    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    res.send(result.data);
  }

  @ApiOperation({ summary: "Bulk activate/deactivate users" })
  @Patch("bulk/status")
  bulkStatus(@Req() request: { user: { email: string } }, @Body() dto: BulkStatusDto) {
    return this.adminUsersService.bulkUpdateStatus(request.user.email, dto.userIds, dto.status);
  }

  @ApiOperation({ summary: "Get user details" })
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.adminUsersService.getById(id);
  }

  @ApiOperation({ summary: "Update user" })
  @Put(":id")
  update(
    @Req() request: { user: { email: string } },
    @Param("id") id: string,
    @Body() dto: UpdateAdminUserDto,
  ) {
    return this.adminUsersService.update(request.user.email, id, dto);
  }

  @ApiOperation({ summary: "Activate or deactivate user" })
  @Patch(":id/status")
  updateStatus(
    @Req() request: { user: { email: string } },
    @Param("id") id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminUsersService.updateStatus(request.user.email, id, dto.status);
  }

  @ApiOperation({ summary: "Reset user password to default" })
  @Patch(":id/reset-password")
  resetPassword(@Req() request: { user: { email: string } }, @Param("id") id: string) {
    return this.adminUsersService.resetPassword(request.user.email, id);
  }
}
