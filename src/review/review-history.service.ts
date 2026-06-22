import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReviewCycle } from "./review-cycle.entity";
import { ReportRelease } from "./report-release.entity";
import { ClientReportResponse } from "./client-report-response.entity";
import { CreditReview } from "./credit-review.entity";
import { ReappealRequest } from "./reappeal-request.entity";
import { ReportPdfVersion } from "./report-pdf-version.entity";

@Injectable()
export class ReviewHistoryService {
  constructor(
    @InjectRepository(ReviewCycle)
    private readonly reviewCycleRepository: Repository<ReviewCycle>,
    @InjectRepository(CreditReview)
    private readonly creditReviewRepository: Repository<CreditReview>,
    @InjectRepository(ReportRelease)
    private readonly reportReleaseRepository: Repository<ReportRelease>,
    @InjectRepository(ReportPdfVersion)
    private readonly pdfVersionRepository: Repository<ReportPdfVersion>,
    @InjectRepository(ClientReportResponse)
    private readonly clientResponseRepository: Repository<ClientReportResponse>,
    @InjectRepository(ReappealRequest)
    private readonly reappealRepository: Repository<ReappealRequest>,
  ) {}

  async getProjectHistory(projectId: number) {
    const cycles = await this.reviewCycleRepository.find({
      where: { projectId },
      order: { submissionCount: "ASC" },
    });

    const result = [];
    for (const cycle of cycles) {
      const [credits, releases, pdfs, responses, reappeals] = await Promise.all([
        this.creditReviewRepository.find({ where: { reviewCycleId: cycle.id } }),
        this.reportReleaseRepository.find({ where: { reviewCycleId: cycle.id } }),
        this.pdfVersionRepository.find({ where: { reviewCycleId: cycle.id } }),
        this.clientResponseRepository.find({ where: { reviewCycleId: cycle.id } }),
        this.reappealRepository.find({ where: { reviewCycleId: cycle.id } }),
      ]);
      result.push({
        cycle,
        credits,
        releases,
        pdfs,
        responses,
        reappeals,
      });
    }
    return { cycles: result };
  }
}
