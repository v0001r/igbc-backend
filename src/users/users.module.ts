import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingTypesModule } from "../projects/rating-types.module";
import { RbacModule } from "../rbac/rbac.module";
import { AdminUsersController } from "./admin-users.controller";
import { AdminUsersService } from "./admin-users.service";
import { AuditLog } from "./audit-log.entity";
import { Client } from "./client.entity";
import { DirectoryController } from "./directory.controller";
import { Organization } from "./organization.entity";
import { ProfileController } from "./profile.controller";
import { UserProjectAssignment } from "./user-project-assignment.entity";
import { UserRatingType } from "./user-rating-type.entity";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Client,
      Organization,
      UserRatingType,
      UserProjectAssignment,
      AuditLog,
    ]),
    RatingTypesModule,
    forwardRef(() => RbacModule),
  ],
  controllers: [ProfileController, DirectoryController, AdminUsersController],
  providers: [UsersService, AdminUsersService],
  exports: [UsersService, AdminUsersService],
})
export class UsersModule {}
