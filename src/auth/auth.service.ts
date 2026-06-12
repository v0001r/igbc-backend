import { ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { RegisterDto } from "../users/dto/register.dto";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const publicUser = await this.usersService.getPublicProfileByEmail(user.email);

    // ACTIVITY_LOG: Add CLIENT_REGISTERED log via activityLogService when client registration audit is required.

    return this.buildAuthResponse(user.id, user.email, publicUser);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.status === "inactive") {
      throw new ForbiddenException("Your account is inactive. Contact administrator.");
    }

    const publicUser = await this.usersService.getPublicProfileByEmail(user.email);

    await this.activityLogService.log({
      userId: user.id,
      userRole: user.userType,
      activityType: ActivityType.CLIENT_LOGIN,
      module: "auth",
      activityTitle: "User login",
      activityDescription: `${user.displayName ?? user.email} logged in`,
      newValue: { email: user.email, userType: user.userType },
    });

    return {
      ...this.buildAuthResponse(user.id, user.email, publicUser),
      mustChangePassword: false,
    };
  }

  async changePassword(
    userEmail: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.changePasswordByEmail(
      userEmail,
      currentPassword,
      newPassword,
    );
    return {
      message: "Password changed successfully",
      user,
    };
  }

  async getProfile(userEmail: string) {
    return this.usersService.getPublicProfileByEmail(userEmail);
  }

  private buildAuthResponse(userId: string, userEmail: string, publicUser: unknown) {
    const user = publicUser as { userType?: string; roleName?: string };
    const payload = {
      sub: userId,
      email: userEmail,
      userType: user.userType,
      roleName: user.roleName,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: publicUser,
    };
  }
}
