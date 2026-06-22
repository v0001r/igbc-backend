import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "./project.entity";
import { User } from "../users/user.entity";

@Entity("project_staff_assignments")
@Index(["projectId"], { unique: true })
export class ProjectStaffAssignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "project_id", type: "int" })
  projectId!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ name: "staff_id", type: "uuid" })
  staffId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "staff_id" })
  staff!: User;

  @Column({ name: "assigned_by", type: "uuid", nullable: true })
  assignedBy?: string | null;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  fee?: string | null;

  @Column({ type: "int", nullable: true })
  count?: number | null;

  @CreateDateColumn({ name: "assigned_at" })
  assignedAt!: Date;
}
