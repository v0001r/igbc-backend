import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { ClientReportResponseType } from "./review.enums";

@Entity("client_report_responses")
export class ClientReportResponse {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "review_cycle_id" })
  reviewCycleId!: string;

  @Column({ type: "varchar", length: 16 })
  response!: ClientReportResponseType;

  @Column({ type: "text", name: "client_remark", nullable: true })
  clientRemark?: string | null;

  @Column({ type: "uuid", name: "responded_by" })
  respondedBy!: string;

  @Column({ type: "timestamptz", name: "responded_at", default: () => "NOW()" })
  respondedAt!: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
