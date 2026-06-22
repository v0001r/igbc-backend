import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { ReappealPaymentStatus } from "./review.enums";

@Entity("reappeal_requests")
export class ReappealRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "int", name: "project_id" })
  projectId!: number;

  @Column({ type: "uuid", name: "review_cycle_id" })
  reviewCycleId!: string;

  @Column({ type: "varchar", length: 16, name: "payment_status", default: "pending" })
  paymentStatus!: ReappealPaymentStatus;

  @Column({ type: "jsonb", name: "reappeal_checklist", default: () => "'[]'" })
  reappealChecklist!: string[];

  @Column({ type: "jsonb", name: "approved_tabs", default: () => "'[]'" })
  approvedTabs!: string[];

  @Column({ type: "numeric", precision: 12, scale: 2, name: "fee_amount", nullable: true })
  feeAmount?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
