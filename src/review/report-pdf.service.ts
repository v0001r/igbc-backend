import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProjectDetail } from "../projects/project-detail.entity";
import { Project } from "../projects/project.entity";
import { CreditReview } from "./credit-review.entity";
import { ReportPdfVersion } from "./report-pdf-version.entity";
import type { ReportReleasePhase } from "./review.enums";
import { ReviewCycle } from "./review-cycle.entity";

@Injectable()
export class ReportPdfService {
  private readonly uploadRoot = join(process.cwd(), "uploads");

  constructor(
    @InjectRepository(ReportPdfVersion)
    private readonly pdfVersionRepository: Repository<ReportPdfVersion>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectDetail)
    private readonly projectDetailRepository: Repository<ProjectDetail>,
  ) {}

  async generateReport(params: {
    cycle: ReviewCycle;
    reviews: CreditReview[];
    phase: ReportReleasePhase;
    generatedBy: string;
    releaseId?: string;
    watermark?: boolean;
    tpaRemark?: string;
    staffRemark?: string;
  }) {
    const project = await this.projectRepository.findOne({ where: { id: params.cycle.projectId } });
    const detail = await this.projectDetailRepository.findOne({
      where: { projectId: params.cycle.projectId },
    });

    const lastVersion = await this.pdfVersionRepository.findOne({
      where: { reviewCycleId: params.cycle.id },
      order: { versionNo: "DESC" },
    });
    const versionNo = (lastVersion?.versionNo ?? 0) + 1;

    const html = this.buildHtml({
      projectName: detail?.projectName ?? project?.ratingSystem ?? "Project",
      igbcProjectId: project?.igbcProjectId ?? project?.temporaryProjectId ?? "",
      submissionCount: params.cycle.submissionCount,
      phase: params.phase,
      reviews: params.reviews,
      watermark: params.watermark ?? false,
      tpaRemark: params.tpaRemark,
      staffRemark: params.staffRemark,
    });

    const relativeKey = `/uploads/projects/${params.cycle.projectId}/cycles/${params.cycle.submissionCount}/v${versionNo}_${params.phase}.html`;
    const absolutePath = join(process.cwd(), relativeKey.replace(/^\//, ""));
    mkdirSync(join(absolutePath, ".."), { recursive: true });
    writeFileSync(absolutePath, html, "utf8");

    const sha256 = createHash("sha256").update(html).digest("hex");

    const pdfVersion = await this.pdfVersionRepository.save(
      this.pdfVersionRepository.create({
        reviewCycleId: params.cycle.id,
        releaseId: params.releaseId ?? null,
        versionNo,
        phase: params.phase,
        storageKey: relativeKey,
        sha256,
        generatedBy: params.generatedBy,
        generatedAt: new Date(),
      }),
    );

    return {
      pdfVersion,
      downloadUrl: relativeKey,
    };
  }

  async getLatestDeliveredReport(cycleId: string) {
    return this.pdfVersionRepository.findOne({
      where: { reviewCycleId: cycleId, phase: "coordinator_released" },
      order: { versionNo: "DESC" },
    });
  }

  private buildHtml(input: {
    projectName: string;
    igbcProjectId: string;
    submissionCount: number;
    phase: ReportReleasePhase;
    reviews: CreditReview[];
    watermark: boolean;
    tpaRemark?: string;
    staffRemark?: string;
  }) {
    const rows = input.reviews
      .map(
        (r) => `<tr>
          <td>${r.tab}</td>
          <td>${r.subtab}</td>
          <td>${r.awardedPoints}</td>
          <td>${r.pendingPoints}</td>
          <td>${r.deniedPoints}</td>
          <td>${(r.reviewRemarks ?? "").replace(/</g, "&lt;")}</td>
        </tr>`,
      )
      .join("");

    const watermarkStyle = input.watermark
      ? `<div style="position:fixed;top:40%;left:20%;font-size:48px;color:rgba(200,0,0,0.2);transform:rotate(-30deg)">PREVIEW</div>`
      : "";

    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>IGBC Review Report</title>
<style>
body{font-family:Arial,sans-serif;margin:40px}
table{border-collapse:collapse;width:100%;margin-top:24px}
th,td{border:1px solid #ccc;padding:8px;text-align:left}
th{background:#f5f5f5}
</style></head><body>
${watermarkStyle}
<h1>IGBC Certification Review Report</h1>
<p><strong>Project:</strong> ${input.projectName} (${input.igbcProjectId})</p>
<p><strong>Submission #:</strong> ${input.submissionCount}</p>
<p><strong>Phase:</strong> ${input.phase}</p>
${input.tpaRemark ? `<p><strong>TPA Remark:</strong> ${input.tpaRemark}</p>` : ""}
${input.staffRemark ? `<p><strong>Coordinator Remark:</strong> ${input.staffRemark}</p>` : ""}
<table>
<thead><tr><th>Tab</th><th>Subtab</th><th>Awarded</th><th>Pending</th><th>Denied</th><th>Remarks</th></tr></thead>
<tbody>${rows || "<tr><td colspan='6'>No credit reviews</td></tr>"}</tbody>
</table>
</body></html>`;
  }
}
