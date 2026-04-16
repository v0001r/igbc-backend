import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApExamModule } from "./ap-exam/ap-exam.module";
import { ApExamRegistration } from "./ap-exam/ap-exam-registration.entity";
import { AuthModule } from "./auth/auth.module";
import { Event } from "./events/event.entity";
import { EventsModule } from "./events/events.module";
import { MembershipApplication } from "./membership/membership-application.entity";
import { MembershipCategoryMaster } from "./membership/membership-category.entity";
import { MembershipModule } from "./membership/membership.module";
import { MembershipPlanMaster } from "./membership/membership-plan.entity";
import { MembershipTypeMaster } from "./membership/membership-type.entity";
import { SupportEntry } from "./support/support.entity";
import { SupportModule } from "./support/support.module";
import { Client } from "./users/client.entity";
import { Organization } from "./users/organization.entity";
import { User } from "./users/user.entity";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
          Event,
          SupportEntry,
        ],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ApExamModule,
    MembershipModule,
    EventsModule,
    SupportModule,
  ],
})
export class AppModule {}
