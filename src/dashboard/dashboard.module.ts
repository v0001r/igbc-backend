import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import { Project } from "../projects/project.entity";
import { RbacModule } from "../rbac/rbac.module";
import { UserProjectAssignment } from "../users/user-project-assignment.entity";
import { UserRatingType } from "../users/user-rating-type.entity";
import { User } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Project,
      UserProjectAssignment,
      UserRatingType,
      CertificationApplication,
      ProjectStaffAssignment,
      ProjectTpaAssignment,
    ]),
    forwardRef(() => UsersModule),
    RbacModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
