import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApExamModule } from "./ap-exam/ap-exam.module";
import { ApExamRegistration } from "./ap-exam/ap-exam-registration.entity";
import { AuthModule } from "./auth/auth.module";
import { MembershipDirectoryModule } from "./membership-directory/membership-directory.module";
import { MembershipDirectoryMember } from "./membership-directory/membership-directory.entity";
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
        entities: [User, Client, Organization, ApExamRegistration, MembershipDirectoryMember],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    ApExamModule,
    MembershipDirectoryModule,
  ],
})
export class AppModule {}
