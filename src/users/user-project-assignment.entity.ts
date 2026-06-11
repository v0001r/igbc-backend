import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../projects/project.entity";
import { User } from "./user.entity";

@Entity("user_project_assignments")
@Index(["userId", "projectId"], { unique: true })
export class UserProjectAssignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "project_id", type: "int" })
  projectId!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ name: "assigned_by", type: "uuid", nullable: true })
  assignedBy?: string | null;

  @CreateDateColumn({ name: "assigned_at" })
  assignedAt!: Date;
}
