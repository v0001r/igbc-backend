import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permission } from "../rbac/permissions.enum";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { PermissionsGuard } from "../rbac/permissions.guard";
import { RoleName } from "../rbac/role.enum";
import { Roles } from "../rbac/roles.decorator";
import { RolesGuard } from "../rbac/roles.guard";
import { ActivityLogService } from "./activity-log.service";
import { QueryActivityLogDto } from "./dto/query-activity-log.dto";

@ApiTags("activity-logs")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Roles(RoleName.ADMIN)
@RequirePermissions(Permission.USERS_MANAGE)
@Controller("admin/activity-logs")
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @ApiOperation({ summary: "List project activity logs with filters (super admin)" })
  @Get()
  list(@Query() query: QueryActivityLogDto) {
    return this.activityLogService.query(query);
  }
}
