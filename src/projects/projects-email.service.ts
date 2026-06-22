import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer from "nodemailer";

@Injectable()
export class ProjectsEmailService {
  private readonly logger = new Logger(ProjectsEmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendProjectApprovedEmail(payload: {
    to: string[];
    projectId: string;
    projectName?: string | null;
    ratingSystem: string;
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
      this.logger.warn("SMTP/MAIL config missing. Skipping project approval email.");
      return { status: "skipped" as const };
    }
    if (!payload.to.length) {
      this.logger.warn("No recipient emails found for project approval email.");
      return { status: "skipped" as const };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = `Project Approved: ${payload.projectId}`;
    const text = `Dear Applicant,

Your IGBC project has been approved successfully.

Project ID: ${payload.projectId}
Project Name: ${payload.projectName ?? "N/A"}
Rating System: ${payload.ratingSystem}

Regards,
IGBC Team`;

    await transporter.sendMail({
      from,
      to: payload.to.join(","),
      subject,
      text,
    });

    return { status: "sent" as const };
  }

  async sendProjectRejectedEmail(payload: {
    to: string[];
    projectId: string;
    projectName?: string | null;
    ratingSystem: string;
    remark: string;
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

    if (!host || !user || !pass || !payload.to.length) {
      this.logger.warn("SMTP config/recipients missing. Skipping project rejection email.");
      return { status: "skipped" as const };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from,
      to: payload.to.join(","),
      subject: `Project Rejected: ${payload.projectId}`,
      text: `Dear Applicant,

Your IGBC project has been rejected.

Project ID: ${payload.projectId}
Project Name: ${payload.projectName ?? "N/A"}
Rating System: ${payload.ratingSystem}
Remark: ${payload.remark}

Regards,
IGBC Team`,
    });

    return { status: "sent" as const };
  }

  async sendProjectAssignmentEmail(payload: {
    to: string;
    recipientName: string;
    roleLabel: string;
    projectId: string;
    projectName?: string | null;
    ratingSystem: string;
    fee: number;
    count: number;
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

    if (!host || !user || !pass || !payload.to?.trim()) {
      this.logger.warn("SMTP config/recipient missing. Skipping assignment email.");
      return { status: "skipped" as const };
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const subject = `Project assigned: ${payload.projectId}`;
    const text = `Dear ${payload.recipientName},

You have been assigned as ${payload.roleLabel} for the following IGBC project.

Project ID: ${payload.projectId}
Project Name: ${payload.projectName ?? "N/A"}
Rating System: ${payload.ratingSystem}
Fee: ${payload.fee}
Count: ${payload.count}

Please log in to the IGBC portal to review the project.

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
