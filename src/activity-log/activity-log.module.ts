import { Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProjectDetail } from "../projects/project-detail.entity";
import { Project } from "../projects/project.entity";
import { RbacModule } from "../rbac/rbac.module";
import { User } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { ActivityLogContextInterceptor } from "./activity-log-context.interceptor";
import { ActivityLogController } from "./activity-log.controller";
import { ActivityLogService } from "./activity-log.service";
import { ProjectActivityLog } from "./project-activity-log.entity";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectActivityLog, User, Project, ProjectDetail]),
    UsersModule,
    RbacModule,
  ],
  controllers: [ActivityLogController],
  providers: [
    ActivityLogService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogContextInterceptor,
    },
  ],
  exports: [ActivityLogService],
})
export class ActivityLogModule {}
