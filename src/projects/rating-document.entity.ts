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

@Entity("rating_documents")
@Index(["projectId", "tab", "subtab", "paramName"])
@Index(["projectId", "ratingType", "versionType"])
export class RatingDocument {
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

  @Column({ type: "varchar", length: 512, name: "file_name" })
  fileName!: string;

  @Column({ type: "varchar", length: 1024, name: "file_path" })
  filePath!: string;

  @Column({ type: "varchar", length: 128, name: "file_type", nullable: true })
  fileType?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
