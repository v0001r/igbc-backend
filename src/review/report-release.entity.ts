import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { ReportReleasePhase } from "./review.enums";

@Entity("report_releases")
export class ReportRelease {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "review_cycle_id" })
  reviewCycleId!: string;

  @Column({ type: "varchar", length: 32, name: "release_phase" })
  releasePhase!: ReportReleasePhase;

  @Column({ type: "varchar", length: 512, name: "report_doc_key", nullable: true })
  reportDocKey?: string | null;

  @Column({ type: "varchar", length: 500, name: "tpa_remark", nullable: true })
  tpaRemark?: string | null;

  @Column({ type: "varchar", length: 500, name: "staff_remark", nullable: true })
  staffRemark?: string | null;

  @Column({ type: "uuid", name: "released_by" })
  releasedBy!: string;

  @Column({ type: "timestamptz", name: "released_at", default: () => "NOW()" })
  releasedAt!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
