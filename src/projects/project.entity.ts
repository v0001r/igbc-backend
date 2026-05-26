<<<<<<< HEAD
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { RatingType } from "./rating-type.entity";

export type ProjectRegistrationStatus =
  | "draft"
  | "pending"
  | "in-review"
  | "approved"
  | "rejected"; 

export type ProjectCertificationStatus =
  | "not_started"
  | "pending"
  | "approved"
  | "accepted";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 32, unique: true })
  projectCode!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "int" })
  ratingTypeId!: number;

  @ManyToOne(() => RatingType, (ratingType) => ratingType.projects, { eager: true })
  @JoinColumn({ name: "ratingTypeId" })
  ratingType!: RatingType;

  @Column({ type: "varchar", length: 500 })
  projectName!: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  category?: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  constructionType?: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  city?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ownerName?: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  ownerMobile?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ownerEmail?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  ownerOrg?: string;

  @Column({ type: "varchar", length: 32, default: "offline" })
  paymentMode!: string;

  @Column({ type: "varchar", length: 32, default: "pending" })
  registrationStatus!: ProjectRegistrationStatus;

  @Column({ type: "varchar", length: 32, default: "not_started" })
  certificationStatus!: ProjectCertificationStatus;

  @Column({ type: "varchar", length: 64, nullable: true })
  invoiceNo?: string;

  @Column({ type: "varchar", length: 64, nullable: true })
  area?: string;

  /** IGBC form schema version for this project (must be in rating_type.version_type) */
  @Column({ name: "version_type", type: "varchar", length: 16, default: "3" })
  versionType!: string;

  @Column({ type: "varchar", length: 128, nullable: true })
  certificationCurrentTab?: string | null;

  @Column({ type: "varchar", length: 128, nullable: true })
  certificationCurrentSubtab?: string | null;
=======
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
>>>>>>> 1a65c5fd1385100852a1babe840f1fbe50e22a05

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
