import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { StringValue } from "ms";
import { AuditLog } from "../users/audit-log.entity";
import { User } from "../users/user.entity";
import { UsersModule } from "../users/users.module";
import { AuthEmailService } from "./auth-email.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { PasswordResetService } from "./password-reset.service";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([User, AuditLog]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET", "dev-secret"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "1d") as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PasswordResetService, AuthEmailService],
})
export class AuthModule {}
