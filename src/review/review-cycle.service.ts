import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";
import { ProjectStaffAssignment } from "../projects/project-staff-assignment.entity";
import { ProjectTpaAssignment } from "../projects/project-tpa-assignment.entity";
import { Project } from "../projects/project.entity";
import { CreditReview } from "./credit-review.entity";
import { ReportRelease } from "./report-release.entity";
import { ReviewCycle } from "./review-cycle.entity";
import type { ReviewCycleStatus } from "./review.enums";

@Injectable()
export class ReviewCycleService {
  constructor(
    @InjectRepository(ReviewCycle)
    private readonly reviewCycleRepository: Repository<ReviewCycle>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectStaffAssignment)
    private readonly staffAssignmentRepository: Repository<ProjectStaffAssignment>,
    @InjectRepository(ProjectTpaAssignment)
    private readonly tpaAssignmentRepository: Repository<ProjectTpaAssignment>,
    @InjectRepository(CertificationApplication)
    private readonly certificationRepository: Repository<CertificationApplication>,
    @InjectRepository(ReportRelease)
    private readonly reportReleaseRepository: Repository<ReportRelease>,
  ) {}

  async ensureCycleFromCertApp(projectId: number): Promise<ReviewCycle | null> {
    const certApp = await this.certificationRepository.findOne({ where: { projectId } });
    if (!certApp?.isSubmitted) {
      return null;
    }

    let submissionCount = certApp.submissionCount ?? 0;
    if (submissionCount < 1) {
      submissionCount = 1;
      certApp.submissionCount = submissionCount;
      if (!certApp.submittedAt) {
        certApp.submittedAt = new Date();
      }
      await this.certificationRepository.save(certApp);
    }

    return this.openCycle(projectId, submissionCount);
  }

  async openCycle(
    projectId: number,
    submissionCount: number,
    manager?: EntityManager,
  ): Promise<ReviewCycle> {
    const repo = manager ? manager.getRepository(ReviewCycle) : this.reviewCycleRepository;
    const existing = await repo.findOne({ where: { projectId, submissionCount } });
    if (existing) return existing;

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException("Project not found");

    const staffAssignment = await this.staffAssignmentRepository.findOne({ where: { projectId } });
    const tpaAssignment = await this.tpaAssignmentRepository.findOne({ where: { projectId } });

    const cycle = repo.create({
      projectId,
      submissionCount,
      ratingTypeId: project.ratingTypeId ?? null,
      versionType: project.versionType ?? "3",
      tpaId: tpaAssignment?.tpaId ?? null,
      coordinatorId: staffAssignment?.staffId ?? null,
      cycleStatus: "open",
      totalPendingPoints: "0",
      certificateEligible: false,
      openedAt: new Date(),
    });

    return repo.save(cycle);
  }

  async syncAssignments(projectId: number, staffId: string, tpaId: string) {
    let cycle = await this.getCurrentCycle(projectId);
    if (!cycle) {
      cycle = await this.ensureCycleFromCertApp(projectId);
    }
    if (!cycle) return;
    if (cycle.cycleStatus !== "open") return;

    cycle.coordinatorId = staffId;
    cycle.tpaId = tpaId;
    await this.reviewCycleRepository.save(cycle);
  }

  async getCurrentCycle(projectId: number, submissionCount?: number): Promise<ReviewCycle | null> {
    if (submissionCount != null) {
      return this.reviewCycleRepository.findOne({ where: { projectId, submissionCount } });
    }
    const cycles = await this.reviewCycleRepository.find({
      where: { projectId },
      order: { submissionCount: "DESC" },
      take: 1,
    });
    return cycles[0] ?? null;
  }

  async requireCurrentCycle(projectId: number, submissionCount?: number): Promise<ReviewCycle> {
    let cycle = await this.getCurrentCycle(projectId, submissionCount);
    if (!cycle && submissionCount == null) {
      cycle = await this.ensureCycleFromCertApp(projectId);
    }
    if (!cycle) {
      throw new NotFoundException(
        "Review cycle not found. The project must be final submitted before TPA review can begin.",
      );
    }
    return cycle;
  }

  async updateCycleStatus(cycle: ReviewCycle, status: ReviewCycleStatus, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(ReviewCycle) : this.reviewCycleRepository;
    cycle.cycleStatus = status;
    if (status === "accepted" || status === "rejected" || status === "closed") {
      cycle.closedAt = new Date();
    }
    return repo.save(cycle);
  }

  async recomputePendingPoints(cycle: ReviewCycle, manager?: EntityManager) {
    const creditRepo = manager
      ? manager.getRepository(CreditReview)
      : this.reviewCycleRepository.manager.getRepository(CreditReview);

    const locked = await creditRepo.find({
      where: {
        reviewCycleId: cycle.id,
        rowStatus: "locked",
      },
    });

    const tpaByKey = new Map<string, CreditReview>();
    const coordinatorByKey = new Map<string, CreditReview>();
    for (const row of locked) {
      const key = `${row.tab}/${row.subtab}`;
      if (row.reviewerRole === "tpa") {
        tpaByKey.set(key, row);
      } else if (row.reviewerRole === "coordinator") {
        coordinatorByKey.set(key, row);
      }
    }

    const keys = new Set([...tpaByKey.keys(), ...coordinatorByKey.keys()]);
    const total = [...keys].reduce((sum, key) => {
      const effective = coordinatorByKey.get(key) ?? tpaByKey.get(key);
      return sum + parseFloat(effective?.pendingPoints ?? "0");
    }, 0);

    cycle.totalPendingPoints = total.toFixed(2);
    cycle.certificateEligible = cycle.cycleStatus === "accepted" && total === 0;

    const repo = manager ? manager.getRepository(ReviewCycle) : this.reviewCycleRepository;
    return repo.save(cycle);
  }

  async ensureCoordinatorPhase(cycle: ReviewCycle): Promise<ReviewCycle> {
    if (cycle.cycleStatus === "tpa_locked" || cycle.cycleStatus === "client_pending") {
      return cycle;
    }

    if (cycle.cycleStatus === "open") {
      const tpaReleased = await this.reportReleaseRepository.findOne({
        where: { reviewCycleId: cycle.id, releasePhase: "tpa_released" },
        order: { releasedAt: "DESC" },
      });
      if (tpaReleased) {
        cycle.cycleStatus = "tpa_locked";
        cycle.tpaLockedAt = cycle.tpaLockedAt ?? tpaReleased.releasedAt;
        return this.reviewCycleRepository.save(cycle);
      }
    }

    return cycle;
  }

  getCycleSummary(cycle: ReviewCycle | null) {
    if (!cycle) return null;
    return {
      id: cycle.id,
      submissionCount: cycle.submissionCount,
      cycleStatus: cycle.cycleStatus,
      tpaLockedAt: cycle.tpaLockedAt?.toISOString() ?? null,
      coordinatorLockedAt: cycle.coordinatorLockedAt?.toISOString() ?? null,
      totalPendingPoints: parseFloat(cycle.totalPendingPoints ?? "0"),
      certificateEligible: cycle.certificateEligible,
      openedAt: cycle.openedAt.toISOString(),
      closedAt: cycle.closedAt?.toISOString() ?? null,
    };
  }
}
