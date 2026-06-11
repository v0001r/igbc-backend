import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users/users.service";
import { Permission } from "./permissions.enum";
import { PermissionService } from "./permission.service";
import { RoleName, USER_TYPE_ROLE_MAP } from "./role.enum";
import { PERMISSIONS_KEY } from "./permissions.decorator";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: { email?: string } }>();
    const email = request.user?.email;
    if (!email) {
      throw new ForbiddenException("Authentication required");
    }

    const user = await this.usersService.findByEmail(email);
    if (!user || user.status === "inactive") {
      throw new ForbiddenException("Access denied");
    }

    const roleName =
      user.role?.roleName ?? USER_TYPE_ROLE_MAP[user.userType] ?? RoleName.CLIENT;
    if (!this.permissionService.hasAnyPermission(roleName, requiredPermissions)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}
