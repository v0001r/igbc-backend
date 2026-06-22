import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export type CertificateActionType = "accepted" | "rejected" | "edited" | "downloaded";

@Entity("certificate_action_logs")
export class CertificateActionLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "application_id", type: "int" })
  applicationId!: number;

  @Column({ type: "varchar", length: 30 })
  action!: CertificateActionType;

  @Column({ type: "text", nullable: true })
  remarks!: string | null;

  @Column({ name: "created_by", type: "uuid" })
  createdBy!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
