import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export type AuditAction =
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_ACTIVATED"
  | "USER_DEACTIVATED"
  | "PASSWORD_RESET"
  | "FORGOT_PASSWORD_REQUESTED"
  | "PASSWORD_RESET_COMPLETED"
  | "PROJECT_ASSIGNED"
  | "PROJECT_UNASSIGNED";

@Entity("audit_logs")
export class AuditLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "actor_user_id", type: "uuid", nullable: true })
  actorUserId?: string | null;

  @Column({ type: "varchar", length: 64 })
  action!: AuditAction;

  @Column({ name: "target_user_id", type: "uuid", nullable: true })
  targetUserId?: string | null;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
