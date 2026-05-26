import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class ApExamEmailService {
  private readonly logger = new Logger(ApExamEmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendExamResultEmail(payload: {
    to: string;
    firstName: string;
    lastName: string;
    result: "pass" | "fail";
    score?: number | null;
    examId?: string | null;
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
    const configuredFromName = this.configService.get<string>("MAIL_FROM_NAME");
    const fromName =
      configuredFromName && configuredFromName.includes("${APP_NAME}")
        ? configuredFromName.replace("${APP_NAME}", appName)
        : configuredFromName || appName;
    const fromAddress =
      this.configService.get<string>("SMTP_FROM") ||
      this.configService.get<string>("MAIL_FROM_ADDRESS") ||
      "no-reply@igbc.local";
    const from = `${fromName} <${fromAddress}>`;

    if (!host || !user || !pass) {
      this.logger.warn("SMTP/MAIL config missing. Skipping AP exam result email.");
      return { status: "skipped" as const };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });

    const fullName = `${payload.firstName} ${payload.lastName}`.trim();
    const subject =
      payload.result === "pass"
        ? "IGBC AP Exam Result: Congratulations"
        : "IGBC AP Exam Result: Update";
    const scoreLine = payload.score !== undefined && payload.score !== null ? `Score: ${payload.score}\n` : "";
    const examIdLine = payload.examId ? `Exam ID: ${payload.examId}\n` : "";
    const text = `Dear ${fullName},

Your IGBC AP exam result has been declared.
Result: ${payload.result.toUpperCase()}
${scoreLine}${examIdLine}
Regards,
IGBC Team`;

    await transporter.sendMail({
      from,
      to: payload.to,
      subject,
      text,
    });

    return { status: "sent" as const };
  }
}
