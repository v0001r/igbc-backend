import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../users/users.service";
import { RoleName, USER_TYPE_ROLE_MAP } from "./role.enum";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleName[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles?.length) {
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
    if (!requiredRoles.includes(roleName)) {
      throw new ForbiddenException("Insufficient role");
    }

    return true;
  }
}
