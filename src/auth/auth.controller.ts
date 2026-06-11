import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ChangePasswordDto } from "../users/dto/change-password.dto";
import { RegisterDto } from "../users/dto/register.dto";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { PasswordResetService } from "./password-reset.service";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @ApiOperation({ summary: "Register a new user" })
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: "Login with email and password" })
  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Get logged in user profile" })
  @UseGuards(JwtAuthGuard)
  @Get("me")
  me(@Req() request: { user: { email: string } }) {
    return this.authService.getProfile(request.user.email);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: "Change password for logged in user" })
  @UseGuards(JwtAuthGuard)
  @Patch("change-password")
  changePassword(
    @Req() request: { user: { email: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      request.user.email,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @ApiOperation({ summary: "Request a password reset email" })
  @Throttle({ default: { limit: 3, ttl: 900000 } })
  @Post("forgot-password")
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordResetService.requestReset(dto.email);
  }

  @ApiOperation({ summary: "Validate a password reset token" })
  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @Get("reset-password/:token")
  validateResetToken(@Param("token") token: string) {
    return this.passwordResetService.validateToken(token);
  }

  @ApiOperation({ summary: "Reset password using token" })
  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post("reset-password")
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(dto);
  }
}
