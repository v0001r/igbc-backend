import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class AuthEmailService {
  private readonly logger = new Logger(AuthEmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(payload: {
    to: string;
    displayName: string;
    resetUrl: string;
  }) {
    const host =
      this.configService.get<string>("SMTP_HOST") ||
      this.configService.get<string>("MAIL_HOST");
    const port = Number(
      this.configService.get<string>("SMTP_PORT") ||
        this.configService.get<string>("MAIL_PORT", "587"),
    );
    const encryption =
      this.configService.get<string>("MAIL_ENCRYPTION") ||
      this.configService.get<string>("SMTP_ENCRYPTION", "");
    const secure =
      `${this.configService.get<string>("SMTP_SECURE", "false")}`.toLowerCase() === "true" ||
      `${encryption}`.toLowerCase() === "ssl";
    const user =
      this.configService.get<string>("SMTP_USER") ||
      this.configService.get<string>("MAIL_USERNAME");
    const pass =
      this.configService.get<string>("SMTP_PASS") ||
      this.configService.get<string>("MAIL_PASSWORD");
    const appName = this.configService.get<string>("APP_NAME", "IGBC");
    const fromAddress =
      this.configService.get<string>("SMTP_FROM") ||
      this.configService.get<string>("MAIL_FROM_ADDRESS") ||
      "no-reply@igbc.local";
    const from = `${appName} <${fromAddress}>`;

    if (!host || !user || !pass) {
      this.logger.warn("SMTP/MAIL config missing. Skipping password reset email.");
      return { status: "skipped" as const };
    }

    const subject = "Password Reset Request";
    const text = `Hello ${payload.displayName},

We received a request to reset your password.

Click the link below to reset your password:
${payload.resetUrl}

This link will expire in 30 minutes.

If you did not request this change, please ignore this email.

Regards,
${appName} Team`;

    const html = `<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Hello ${payload.displayName},</p>
  <p>We received a request to reset your password.</p>
  <p>Click the button below to reset your password.</p>
  <p style="margin: 24px 0;">
    <a href="${payload.resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
  </p>
  <p style="font-size: 14px; color: #666;">This link will expire in 30 minutes.</p>
  <p style="font-size: 14px; color: #666;">If you did not request this change, please ignore this email.</p>
  <p>Regards,<br/>${appName} Team</p>
</body>
</html>`;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: payload.to,
      subject,
      text,
      html,
    });

    return { status: "sent" as const };
  }
}
