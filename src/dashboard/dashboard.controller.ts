import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Permission } from "../rbac/permissions.enum";
import { RequirePermissions } from "../rbac/permissions.decorator";
import { PermissionsGuard } from "../rbac/permissions.guard";
import { RoleName } from "../rbac/role.enum";
import { Roles } from "../rbac/roles.decorator";
import { RolesGuard } from "../rbac/roles.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: "Admin dashboard statistics" })
  @Get("admin")
  @Roles(RoleName.ADMIN)
  @RequirePermissions(Permission.DASHBOARD_ADMIN)
  adminStats() {
    return this.dashboardService.getAdminStats();
  }

  @ApiOperation({ summary: "Lead staff dashboard statistics" })
  @Get("lead")
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.DASHBOARD_STAFF)
  leadStats(@Req() request: { user: { email: string } }) {
    return this.dashboardService.getLeadStats(request.user.email);
  }

  @ApiOperation({ summary: "IGBC Staff dashboard statistics" })
  @Get("staff")
  @Roles(RoleName.IGBC_STAFF)
  @RequirePermissions(Permission.DASHBOARD_STAFF)
  staffStats(@Req() request: { user: { email: string } }) {
    return this.dashboardService.getStaffStats(request.user.email);
  }

  @ApiOperation({ summary: "TPA dashboard statistics" })
  @Get("tpa")
  @Roles(RoleName.TPA)
  @RequirePermissions(Permission.DASHBOARD_TPA)
  tpaStats(@Req() request: { user: { email: string } }) {
    return this.dashboardService.getTpaStats(request.user.email);
  }
}
