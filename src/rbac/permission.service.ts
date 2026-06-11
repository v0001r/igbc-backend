import { Injectable } from "@nestjs/common";
import { Permission, ROLE_PERMISSIONS } from "./permissions.enum";
import { RoleName } from "./role.enum";

@Injectable()
export class PermissionService {
  getPermissionsForRole(roleName: RoleName | string): Permission[] {
    return ROLE_PERMISSIONS[roleName] ?? [];
  }

  hasPermission(roleName: RoleName | string, permission: Permission): boolean {
    return this.getPermissionsForRole(roleName).includes(permission);
  }

  hasAnyPermission(roleName: RoleName | string, permissions: Permission[]): boolean {
    const granted = this.getPermissionsForRole(roleName);
    return permissions.some((p) => granted.includes(p));
  }
}
