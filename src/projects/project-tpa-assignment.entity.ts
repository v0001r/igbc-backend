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

@Entity("project_tpa_assignments")
@Index(["projectId"], { unique: true })
export class ProjectTpaAssignment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "project_id", type: "int" })
  projectId!: number;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ name: "tpa_id", type: "uuid" })
  tpaId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tpa_id" })
  tpa!: User;

  @Column({ name: "assigned_by", type: "uuid", nullable: true })
  assignedBy?: string | null;

  @CreateDateColumn({ name: "assigned_at" })
  assignedAt!: Date;
}
