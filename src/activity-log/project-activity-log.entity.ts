import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("project_activity_log")
export class ProjectActivityLog {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "project_id", type: "int", nullable: true })
  projectId?: number | null;

  @Column({ name: "certification_application_id", type: "int", nullable: true })
  certificationApplicationId?: number | null;

  @Column({ name: "user_id", type: "uuid", nullable: true })
  userId?: string | null;

  @Column({ name: "user_role", type: "varchar", length: 32, nullable: true })
  userRole?: string | null;

  @Column({ name: "activity_type", type: "varchar", length: 64 })
  activityType!: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  module?: string | null;

  @Column({ name: "tab_name", type: "varchar", length: 128, nullable: true })
  tabName?: string | null;

  @Column({ name: "subtab_name", type: "varchar", length: 128, nullable: true })
  subtabName?: string | null;

  @Column({ name: "activity_title", type: "varchar", length: 255 })
  activityTitle!: string;

  @Column({ name: "activity_description", type: "text", nullable: true })
  activityDescription?: string | null;

  @Column({ name: "old_value", type: "jsonb", nullable: true })
  oldValue?: Record<string, unknown> | null;

  @Column({ name: "new_value", type: "jsonb", nullable: true })
  newValue?: Record<string, unknown> | null;

  @Column({ name: "points_awarded", type: "numeric", precision: 10, scale: 2, nullable: true })
  pointsAwarded?: string | null;

  @Column({ name: "points_deducted", type: "numeric", precision: 10, scale: 2, nullable: true })
  pointsDeducted?: string | null;

  @Column({ name: "document_name", type: "varchar", length: 255, nullable: true })
  documentName?: string | null;

  @Column({ name: "document_count", type: "int", nullable: true })
  documentCount?: number | null;

  @Column({ name: "submission_count", type: "int", nullable: true })
  submissionCount?: number | null;

  @Column({ name: "ip_address", type: "varchar", length: 45, nullable: true })
  ipAddress?: string | null;

  @Column({ name: "user_agent", type: "text", nullable: true })
  userAgent?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
