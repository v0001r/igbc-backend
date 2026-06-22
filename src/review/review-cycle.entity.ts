import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import type { ReviewCycleStatus } from "./review.enums";

@Entity("review_cycles")
@Index(["projectId", "submissionCount"], { unique: true })
export class ReviewCycle {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int", name: "project_id" })
  projectId!: number;

  @Column({ type: "int", name: "submission_count" })
  submissionCount!: number;

  @Column({ type: "int", name: "rating_type_id", nullable: true })
  ratingTypeId?: number | null;

  @Column({ type: "varchar", length: 16, name: "version_type", default: "3" })
  versionType!: string;

  @Column({ type: "uuid", name: "tpa_id", nullable: true })
  tpaId?: string | null;

  @Column({ type: "uuid", name: "coordinator_id", nullable: true })
  coordinatorId?: string | null;

  @Column({ type: "varchar", length: 32, name: "cycle_status", default: "open" })
  cycleStatus!: ReviewCycleStatus;

  @Column({ type: "timestamptz", name: "tpa_locked_at", nullable: true })
  tpaLockedAt?: Date | null;

  @Column({ type: "timestamptz", name: "coordinator_locked_at", nullable: true })
  coordinatorLockedAt?: Date | null;

  @Column({
    type: "numeric",
    precision: 10,
    scale: 2,
    name: "total_pending_points",
    default: 0,
  })
  totalPendingPoints!: string;

  @Column({ type: "boolean", name: "certificate_eligible", default: false })
  certificateEligible!: boolean;

  @Column({ type: "timestamptz", name: "opened_at", default: () => "NOW()" })
  openedAt!: Date;

  @Column({ type: "timestamptz", name: "closed_at", nullable: true })
  closedAt?: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
