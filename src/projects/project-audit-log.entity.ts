import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export type ProjectAuditAction =
  | "FINAL_SUBMITTED"
  | "STAFF_ASSIGNED"
  | "STAFF_REASSIGNED"
  | "TPA_ASSIGNED"
  | "TPA_REASSIGNED"
  | "WORKFLOW_STATUS_CHANGED";

@Entity("project_audit_logs")
export class ProjectAuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "project_id", type: "int" })
  projectId!: number;

  @Column({ name: "actor_user_id", type: "uuid", nullable: true })
  actorUserId?: string | null;

  @Column({ type: "varchar", length: 64 })
  action!: ProjectAuditAction;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
