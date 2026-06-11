import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { PermissionService } from "./permission.service";
import { PermissionsGuard } from "./permissions.guard";
import { Role } from "./role.entity";
import { RoleSeedService } from "./role-seed.service";
import { RolesGuard } from "./roles.guard";

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), forwardRef(() => UsersModule)],
  providers: [PermissionService, RolesGuard, PermissionsGuard, RoleSeedService],
  exports: [PermissionService, RolesGuard, PermissionsGuard, RoleSeedService, TypeOrmModule],
})
export class RbacModule {}
