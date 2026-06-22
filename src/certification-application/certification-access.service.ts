import { Injectable } from "@nestjs/common";
import { readFileSync } from "fs";
import { join } from "path";
import type { CertificationApplication } from "./certification-application.entity";

export type PendingCreditRef = { tab: string; subtab: string; pendingPoints: number };

type LevelBand = { level: string; min: number; max: number };

@Injectable()
export class CertificationAccessService {
  canEditApplication(app: CertificationApplication | null | undefined): boolean {
    if (!app) return true;
    return !app.isSubmitted;
  }

  canEditSection(
    app: CertificationApplication | null | undefined,
    tab: string,
    subtab: string,
    pendingCredits: PendingCreditRef[],
  ): boolean {
    if (!app) return true;
    if (!app.isSubmitted) return true;
    if (!app.isPending) return false;
    return pendingCredits.some(
      (c) => c.tab === tab && c.subtab === subtab && c.pendingPoints > 0,
    );
  }

  canViewCertificateTab(
    app: CertificationApplication | null | undefined,
    cycle: { cycleStatus?: string } | null | undefined,
  ): boolean {
    if (!app?.isSubmitted) return false;
    if (app.isPending) return false;
    const reportAccepted =
      app.clientReportStatus === "accepted" ||
      cycle?.cycleStatus === "accepted";
    return reportAccepted;
  }

  canAcceptCertificate(app: CertificationApplication | null | undefined): boolean {
    if (!app) return false;
    return app.certificateStatus === "pending";
  }

  canDownloadCertificate(app: CertificationApplication | null | undefined): boolean {
    return app?.certificateStatus === "accepted";
  }
}

@Injectable()
export class CertificateLevelService {
  private readonly bandsByRating: Record<string, Record<string, LevelBand[]>>;

  constructor() {
    const path = join(process.cwd(), "src", "rating-config", "certificate-levels.json");
    this.bandsByRating = JSON.parse(readFileSync(path, "utf8")) as Record<
      string,
      Record<string, LevelBand[]>
    >;
  }

  resolveLevel(
    ratingTypeId: number | null | undefined,
    stage: "final" | "precert",
    totalAwardedPoints: number,
  ): { level: string; unrated: boolean } {
    const key = ratingTypeId === 5 ? "5" : "default";
    const bands = this.bandsByRating[key]?.[stage] ?? this.bandsByRating.default.final;
    const match = bands.find(
      (b) => totalAwardedPoints >= b.min && totalAwardedPoints <= b.max,
    );
    if (match) return { level: match.level, unrated: false };
    const fallbackLabel = ratingTypeId === 5 ? "Unrated" : "Not Rated";
    return { level: fallbackLabel, unrated: true };
  }
}
