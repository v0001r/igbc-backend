import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../users/dto/register.dto";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const publicUser = await this.usersService.getPublicProfileByEmail(user.email);
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

    const publicUser = await this.usersService.getPublicProfileByEmail(user.email);
    return this.buildAuthResponse(user.id, user.email, publicUser);
  }

  async getProfile(userEmail: string) {
    return this.usersService.getPublicProfileByEmail(userEmail);
  }

  private buildAuthResponse(userId: string, userEmail: string, publicUser: unknown) {
    const payload = {
      sub: userId,
      email: userEmail,
    };

    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      user: publicUser,
    };
  }
}
