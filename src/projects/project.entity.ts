import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  temporaryProjectId!: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  igbcProjectId?: string;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @Column({ type: "int" })
  categoryId!: number;

  @Column({ type: "varchar" })
  ratingSystem!: string;

  @Column({ name: "rating_type_id", type: "int", nullable: true })
  ratingTypeId?: number | null;

  @Column({ name: "version_type", type: "varchar", length: 16, default: "3" })
  versionType!: string;

  @Column({ type: "varchar", nullable: true })
  subRatingType?: string;

  @Column({ type: "varchar" })
  projectType!: string;

  @Column({ type: "varchar" })
  constructionType!: string;

  @Column({ type: "varchar", default: "saved" })
  status!: string;

  @Column({ type: "varchar", default: "pending" })
  paymentStatus!: "approved" | "rejected" | "pending" | "paid";

  @Column({ type: "int", default: 1 })
  currentStep!: number;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  registrationFee?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  finalPayableAmount?: string;

  @Column({ type: "text", nullable: true })
  rejectRemark?: string;

  @Column({ type: "varchar", default: "no" })
  certificateAppliedStatus!: "yes" | "no";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
