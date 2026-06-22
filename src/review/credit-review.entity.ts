import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { CreditReviewRowStatus, ReviewerRole } from "./review.enums";

@Entity("credit_reviews")
@Index(["reviewCycleId", "tab", "subtab", "reviewerRole", "rowStatus"])
export class CreditReview {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "review_cycle_id" })
  reviewCycleId!: string;

  @Column({ type: "int", name: "project_id" })
  projectId!: number;

  @Column({ type: "int", name: "submission_count" })
  submissionCount!: number;

  @Column({ type: "varchar", length: 128 })
  tab!: string;

  @Column({ type: "varchar", length: 128 })
  subtab!: string;

  @Column({ type: "varchar", length: 16, name: "reviewer_role" })
  reviewerRole!: ReviewerRole;

  @Column({ type: "uuid", name: "reviewer_user_id" })
  reviewerUserId!: string;

  @Column({ type: "numeric", precision: 8, scale: 2, name: "awarded_points", default: 0 })
  awardedPoints!: string;

  @Column({ type: "numeric", precision: 8, scale: 2, name: "pending_points", default: 0 })
  pendingPoints!: string;

  @Column({ type: "numeric", precision: 8, scale: 2, name: "denied_points", default: 0 })
  deniedPoints!: string;

  @Column({ type: "text", name: "technical_advice", nullable: true })
  technicalAdvice?: string | null;

  @Column({ type: "text", name: "review_remarks", nullable: true })
  reviewRemarks?: string | null;

  @Column({ type: "varchar", length: 16, name: "row_status", default: "draft" })
  rowStatus!: CreditReviewRowStatus;

  @Column({ type: "uuid", name: "supersedes_review_id", nullable: true })
  supersedesReviewId?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
