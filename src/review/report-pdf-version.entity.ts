import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import type { ReportReleasePhase } from "./review.enums";

@Entity("report_pdf_versions")
@Index(["reviewCycleId", "versionNo"], { unique: true })
export class ReportPdfVersion {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "review_cycle_id" })
  reviewCycleId!: string;

  @Column({ type: "uuid", name: "release_id", nullable: true })
  releaseId?: string | null;

  @Column({ type: "int", name: "version_no" })
  versionNo!: number;

  @Column({ type: "varchar", length: 32 })
  phase!: ReportReleasePhase;

  @Column({ type: "varchar", length: 512, name: "storage_key" })
  storageKey!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  sha256?: string | null;

  @Column({ type: "uuid", name: "generated_by" })
  generatedBy!: string;

  @Column({ type: "timestamptz", name: "generated_at", default: () => "NOW()" })
  generatedAt!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
