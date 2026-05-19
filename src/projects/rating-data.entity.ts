import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./project.entity";

@Entity("rating_data")
@Index(["projectId", "tab", "subtab", "paramName"], { unique: true })
@Index(["projectId", "ratingType", "versionType"])
export class RatingData {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", name: "project_id" })
  projectId!: string;

  @ManyToOne(() => Project, { onDelete: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @Column({ type: "varchar", length: 64, name: "rating_type" })
  ratingType!: string;

  @Column({ type: "varchar", length: 16, name: "version_type" })
  versionType!: string;

  @Column({ type: "varchar", length: 128 })
  tab!: string;

  @Column({ type: "varchar", length: 128 })
  subtab!: string;

  @Column({ type: "varchar", length: 255, name: "param_name" })
  paramName!: string;

  @Column({ type: "text", nullable: true })
  value!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
