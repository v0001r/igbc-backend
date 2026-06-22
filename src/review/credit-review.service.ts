import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ActivityType } from "../activity-log/activity-type.enum";
import { ActivityLogService } from "../activity-log/activity-log.service";
import { CreditReview } from "./credit-review.entity";
import { SaveCreditReviewDto } from "./dto/review.dto";
import type { ReviewerRole } from "./review.enums";
import { ReviewAccessService } from "./review-access.service";
import { ReviewCreditCatalogService } from "./review-credit-catalog.service";
import { ReviewCycle } from "./review-cycle.entity";
import { ReviewCycleService } from "./review-cycle.service";

@Injectable()
export class CreditReviewService {
  constructor(
    @InjectRepository(CreditReview)
    private readonly creditReviewRepository: Repository<CreditReview>,
    private readonly reviewCycleService: ReviewCycleService,
    private readonly reviewAccessService: ReviewAccessService,
    private readonly catalogService: ReviewCreditCatalogService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  async listCredits(email: string, projectId: number, role: ReviewerRole) {
    let cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    if (role === "coordinator") {
      cycle = await this.reviewCycleService.ensureCoordinatorPhase(cycle);
    }
    if (role === "tpa") {
      await this.reviewAccessService.assertTpaReviewer(email, projectId, cycle);
    } else {
      await this.reviewAccessService.assertCoordinator(email, projectId, cycle);
    }

    const catalog = await this.catalogService.listCreditsForProject(projectId);
    const reviews = await this.creditReviewRepository.find({
      where: { reviewCycleId: cycle.id },
      order: { updatedAt: "DESC" },
    });

    return {
      cycle: this.reviewCycleService.getCycleSummary(cycle),
      credits: catalog.map((item) => {
        const tpaDraft = this.findReview(reviews, item.tab, item.subtab, "tpa", "draft");
        const tpaLocked = this.findReview(reviews, item.tab, item.subtab, "tpa", "locked");
        const coordDraft = this.findReview(reviews, item.tab, item.subtab, "coordinator", "draft");
        const coordLocked = this.findReview(reviews, item.tab, item.subtab, "coordinator", "locked");

        const tpaEffective = tpaLocked ?? tpaDraft;
        const coordEffective = coordLocked ?? coordDraft;
        const editable =
          role === "tpa"
            ? cycle.cycleStatus === "open"
            : cycle.cycleStatus === "tpa_locked" || cycle.cycleStatus === "client_pending";

        return {
          ...item,
          tpaReview: tpaEffective ? this.toDto(tpaEffective) : null,
          coordinatorReview: coordEffective ? this.toDto(coordEffective) : null,
          editable,
          reviewed: Boolean(
            role === "tpa" ? tpaDraft ?? tpaLocked : coordDraft ?? coordLocked,
          ),
        };
      }),
    };
  }

  async saveDraft(
    email: string,
    projectId: number,
    tab: string,
    subtab: string,
    role: ReviewerRole,
    dto: SaveCreditReviewDto,
  ) {
    let cycle = await this.reviewCycleService.requireCurrentCycle(projectId);
    if (role === "coordinator") {
      cycle = await this.reviewCycleService.ensureCoordinatorPhase(cycle);
    }
    this.reviewAccessService.assertRoleCanEdit(role, cycle);

    const access =
      role === "tpa"
        ? await this.reviewAccessService.assertTpaReviewer(email, projectId, cycle)
        : await this.reviewAccessService.assertCoordinator(email, projectId, cycle);

    await this.catalogService.assertCreditExists(projectId, tab, subtab);
    const maxPoints = await this.catalogService.getMaxPoints(projectId, tab, subtab);
    this.validatePointValues(dto, maxPoints);

    let draft = await this.creditReviewRepository.findOne({
      where: {
        reviewCycleId: cycle.id,
        tab,
        subtab,
        reviewerRole: role,
        rowStatus: "draft",
      },
    });

    const payload = {
      awardedPoints: String(dto.awardedPoints ?? 0),
      pendingPoints: String(dto.pendingPoints ?? 0),
      deniedPoints: String(dto.deniedPoints ?? 0),
      technicalAdvice: dto.technicalAdvice ?? null,
      reviewRemarks: dto.reviewRemarks ?? null,
    };

    if (draft) {
      Object.assign(draft, payload);
    } else {
      draft = this.creditReviewRepository.create({
        reviewCycleId: cycle.id,
        projectId,
        submissionCount: cycle.submissionCount,
        tab,
        subtab,
        reviewerRole: role,
        reviewerUserId: access.user.id,
        rowStatus: "draft",
        ...payload,
      });
    }

    const saved = await this.creditReviewRepository.save(draft);

    await this.activityLogService.log({
      projectId,
      userId: access.user.id,
      userRole: access.user.userType,
      activityType:
        role === "tpa" ? ActivityType.TPA_CREDIT_REVIEWED : ActivityType.STAFF_CREDIT_REVIEW,
      module: "review",
      activityTitle: `${role.toUpperCase()} credit review saved`,
      activityDescription: `${tab}/${subtab}`,
      newValue: {
        tab,
        subtab,
        ...payload,
        submissionCount: cycle.submissionCount,
      },
      submissionCount: cycle.submissionCount,
    });

    if (role === "coordinator") {
      await this.reviewCycleService.recomputePendingPoints(cycle);
    }

    return this.toDto(saved);
  }

  async getCompleteness(email: string, projectId: number, role: ReviewerRole) {
    const result = await this.listCredits(email, projectId, role);
    const total = result.credits.length;
    const reviewed = result.credits.filter((c) => c.reviewed).length;
    return {
      total,
      reviewed,
      complete: reviewed > 0,
      optional: true,
      missing: result.credits.filter((c) => !c.reviewed).map((c) => ({ tab: c.tab, subtab: c.subtab })),
    };
  }

  private validatePointValues(dto: SaveCreditReviewDto, maxPoints: number) {
    const awarded = dto.awardedPoints ?? 0;
    const pending = dto.pendingPoints ?? 0;
    const denied = dto.deniedPoints ?? 0;

    for (const [label, value] of [
      ["Awarded", awarded],
      ["Pending", pending],
      ["Denied", denied],
    ] as const) {
      if (value < 0) {
        throw new BadRequestException(`${label} points cannot be negative`);
      }
    }

    const total = awarded + pending + denied;
    if (total > maxPoints) {
      throw new BadRequestException(`Max points is ${maxPoints}`);
    }
  }

  async getMergedReviewsForReport(cycleId: string, role: "tpa" | "coordinator") {
    const allReviews = await this.creditReviewRepository.find({
      where: { reviewCycleId: cycleId },
    });

    if (role === "tpa") {
      return this.pickEffectivePerCredit(allReviews, "tpa");
    }

    const tpaEffective = this.pickEffectivePerCredit(allReviews, "tpa");
    const coordinatorEffective = this.pickEffectivePerCredit(allReviews, "coordinator");
    const merged = new Map<string, CreditReview>();

    for (const review of tpaEffective) {
      merged.set(`${review.tab}/${review.subtab}`, review);
    }
    for (const review of coordinatorEffective) {
      merged.set(`${review.tab}/${review.subtab}`, review);
    }

    return Array.from(merged.values());
  }

  private pickEffectivePerCredit(reviews: CreditReview[], role: ReviewerRole) {
    const byKey = new Map<string, CreditReview>();
    for (const review of reviews.filter((r) => r.reviewerRole === role)) {
      const key = `${review.tab}/${review.subtab}`;
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, review);
        continue;
      }
      const rank = (status: CreditReview["rowStatus"]) =>
        status === "draft" ? 2 : status === "locked" ? 1 : 0;
      if (rank(review.rowStatus) > rank(existing.rowStatus)) {
        byKey.set(key, review);
      }
    }
    return Array.from(byKey.values());
  }

  async lockDraftsForRole(cycle: ReviewCycle, role: ReviewerRole, manager: EntityManager) {
    const repo = manager.getRepository(CreditReview);
    const drafts = await repo.find({
      where: { reviewCycleId: cycle.id, reviewerRole: role, rowStatus: "draft" },
    });

    for (const draft of drafts) {
      draft.rowStatus = "locked";
      await repo.save(draft);
    }
  }

  async getDraftReviews(cycleId: string, role: ReviewerRole) {
    return this.creditReviewRepository.find({
      where: { reviewCycleId: cycleId, reviewerRole: role, rowStatus: "draft" },
    });
  }

  async getEffectiveReviews(cycleId: string, role: ReviewerRole) {
    const locked = await this.getLockedReviews(cycleId, role);
    if (locked.length) return locked;
    return this.getDraftReviews(cycleId, role);
  }

  async getLockedReviews(cycleId: string, role: ReviewerRole) {
    return this.creditReviewRepository.find({
      where: { reviewCycleId: cycleId, reviewerRole: role, rowStatus: "locked" },
    });
  }

  async getPendingCreditsForProject(projectId: number) {
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!cycle) return [];
    const merged = await this.getMergedReviewsForReport(cycle.id, "coordinator");
    return merged
      .filter((r) => parseFloat(r.pendingPoints ?? "0") > 0)
      .map((r) => ({
        tab: r.tab,
        subtab: r.subtab,
        pendingPoints: parseFloat(r.pendingPoints ?? "0"),
      }));
  }

  async sumAwardedPointsForProject(projectId: number) {
    const cycle = await this.reviewCycleService.getCurrentCycle(projectId);
    if (!cycle) return 0;
    const merged = await this.getMergedReviewsForReport(cycle.id, "coordinator");
    return merged.reduce((sum, r) => sum + parseFloat(r.awardedPoints ?? "0"), 0);
  }

  private findReview(
    reviews: CreditReview[],
    tab: string,
    subtab: string,
    role: ReviewerRole,
    status: CreditReview["rowStatus"],
  ) {
    return reviews.find(
      (r) => r.tab === tab && r.subtab === subtab && r.reviewerRole === role && r.rowStatus === status,
    );
  }

  private toDto(row: CreditReview) {
    return {
      id: row.id,
      tab: row.tab,
      subtab: row.subtab,
      reviewerRole: row.reviewerRole,
      awardedPoints: parseFloat(row.awardedPoints ?? "0"),
      pendingPoints: parseFloat(row.pendingPoints ?? "0"),
      deniedPoints: parseFloat(row.deniedPoints ?? "0"),
      technicalAdvice: row.technicalAdvice ?? null,
      reviewRemarks: row.reviewRemarks ?? null,
      rowStatus: row.rowStatus,
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
