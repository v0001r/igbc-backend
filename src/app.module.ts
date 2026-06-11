import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApExamModule } from "./ap-exam/ap-exam.module";
import { ApExamRegistration } from "./ap-exam/ap-exam-registration.entity";
import { AuthModule } from "./auth/auth.module";
import { CertificationApplicationModule } from "./certification-application/certification-application.module";
import { CertificationApplication } from "./certification-application/certification-application.entity";
import { Event } from "./events/event.entity";
import { EventsModule } from "./events/events.module";
import { MembershipApplication } from "./membership/membership-application.entity";
import { MembershipCategoryMaster } from "./membership/membership-category.entity";
import { MembershipModule } from "./membership/membership.module";
import { MembershipPlanMaster } from "./membership/membership-plan.entity";
import { MembershipTypeMaster } from "./membership/membership-type.entity";
import { ProjectCategoryModule } from "./project-category/project-category.module";
import { ProjectContact } from "./projects/project-contact.entity";
import { ProjectDetail } from "./projects/project-detail.entity";
import { ProjectInvoice } from "./projects/project-invoice.entity";
import { ProjectPayment } from "./projects/project-payment.entity";
import { ProjectAuditLog } from "./projects/project-audit-log.entity";
import { ProjectStaffAssignment } from "./projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "./projects/project-tpa-assignment.entity";
import { Project } from "./projects/project.entity";
import { ProjectsModule } from "./projects/projects.module";
import { RatingTypesModule } from "./projects/rating-types.module";
import { RatingData } from "./projects/rating-data.entity";
import { SupportEntry } from "./support/support.entity";
import { SupportModule } from "./support/support.module";
import { RatingDocument } from "./projects/rating-document.entity";
import { RatingType } from "./projects/rating-type.entity";
import { Client } from "./users/client.entity";
import { Organization } from "./users/organization.entity";
import { Role } from "./rbac/role.entity";
import { RbacModule } from "./rbac/rbac.module";
import { AuditLog } from "./users/audit-log.entity";
import { UserProjectAssignment } from "./users/user-project-assignment.entity";
import { UserRatingType } from "./users/user-rating-type.entity";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 900000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DATABASE_HOST", "localhost"),
        port: configService.get<number>("DATABASE_PORT", 5432),
        username: configService.get<string>("DATABASE_USER", "postgres"),
        password: configService.get<string>("DATABASE_PASSWORD", "postgres"),
        database: configService.get<string>("DATABASE_NAME", "igbc"),
        entities: [
          User,
          Client,
          Organization,
          ApExamRegistration,
          MembershipApplication,
          MembershipTypeMaster,
          MembershipCategoryMaster,
          MembershipPlanMaster,
          Project,
          ProjectDetail,
          ProjectContact,
          ProjectInvoice,
          ProjectPayment,
          CertificationApplication,
          Event,
          SupportEntry,
          RatingType,
          RatingData,
          RatingDocument,
          Role,
          UserRatingType,
          UserProjectAssignment,
          AuditLog,
          ProjectStaffAssignment,
          ProjectTpaAssignment,
          ProjectAuditLog,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    RbacModule,
    DashboardModule,
    AuthModule,
    ApExamModule,
    MembershipModule,
    ProjectCategoryModule,
    ProjectsModule,
    RatingTypesModule,
    CertificationApplicationModule,
    EventsModule,
    SupportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
