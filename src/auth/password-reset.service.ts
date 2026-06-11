import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { MoreThan, Repository } from "typeorm";
import { AuditLog, type AuditAction } from "../users/audit-log.entity";
import { ResetPasswordDto } from "../users/dto/reset-password.dto";
import { User, type UserType } from "../users/user.entity";
import { AuthEmailService } from "./auth-email.service";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const GENERIC_FORGOT_MESSAGE =
  "If an account exists with that email, password reset instructions have been sent.";

function hashResetToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function loginPathForUserType(userType: UserType): string {
  switch (userType) {
    case "a":
      return "/admin/login";
    case "s":
      return "/staff/login";
    case "T":
      return "/tpa/login";
    default:
      return "/login";
  }
}

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly authEmailService: AuthEmailService,
    private readonly configService: ConfigService,
  ) {}

  async requestReset(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (user && user.status === "active") {
      const rawToken = randomBytes(32).toString("base64url");
      const tokenHash = hashResetToken(rawToken);
      const expiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);

      user.passwordResetToken = tokenHash;
      user.passwordResetExpiry = expiry;
      await this.userRepository.save(user);

      const frontendUrl = this.configService
        .get<string>("FRONTEND_URL", "http://localhost:8080")
        .replace(/\/$/, "");
      const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;

      await this.authEmailService.sendPasswordResetEmail({
        to: user.email,
        displayName: user.displayName,
        resetUrl,
      });

      await this.writeAudit("FORGOT_PASSWORD_REQUESTED", user.id);
    }

    return { message: GENERIC_FORGOT_MESSAGE };
  }

  async validateToken(rawToken: string) {
    const tokenHash = hashResetToken(rawToken);
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiry: MoreThan(new Date()),
      },
    });
    return { valid: Boolean(user) };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = hashResetToken(dto.token);
    const user = await this.userRepository.findOne({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset link. Please request a new one.");
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    user.isFirstLogin = false;
    await this.userRepository.save(user);

    await this.writeAudit("PASSWORD_RESET_COMPLETED", user.id);

    return {
      message: "Password reset successfully. You can now sign in with your new password.",
      loginPath: loginPathForUserType(user.userType),
    };
  }

  private async writeAudit(action: AuditAction, targetUserId: string) {
    await this.auditLogRepository.save(
      this.auditLogRepository.create({
        actorUserId: targetUserId,
        action,
        targetUserId,
        metadata: null,
      }),
    );
  }
}
