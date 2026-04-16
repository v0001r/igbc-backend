import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export type MembershipStatus = "draft" | "submitted" | "invoice_generated" | "paid" | "failed";

@Entity("membership_applications")
export class MembershipApplication {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  userId!: string;

  @Column({ type: "int" })
  membershipTypeId!: number;

  @Column({ type: "varchar" })
  membershipTypeName!: string;

  @Column({ type: "int" })
  membershipCategoryId!: number;

  @Column({ type: "varchar" })
  membershipCategoryName!: string;

  @Column({ type: "int", nullable: true })
  membershipPlanId?: number;

  @Column({ type: "varchar", nullable: true })
  membershipPlanName?: string;

  @Column({ type: "int" })
  membershipFee!: number;

  @Column({ type: "varchar", default: "draft" })
  status!: MembershipStatus;

  @Column({ type: "jsonb", nullable: true })
  contact?: Record<string, unknown>;

  @Column({ type: "jsonb", nullable: true })
  invoice?: Record<string, unknown>;

  @Column({ type: "varchar", nullable: true, unique: true })
  invoiceNumber?: string;

  @Column({ type: "varchar", nullable: true, unique: true })
  membershipId?: string;

  @Column({ type: "int", nullable: true })
  invoiceAmount?: number;

  @Column({ type: "int", nullable: true })
  gstAmount?: number;

  @Column({ type: "int", nullable: true })
  totalAmount?: number;

  @Column({ type: "varchar", nullable: true })
  paymentGateway?: string;

  @Column({ type: "varchar", nullable: true })
  paymentMode?: "online" | "offline";

  @Column({ type: "varchar", nullable: true })
  paymentTransactionId?: string;

  @Column({ type: "varchar", nullable: true })
  paymentMethod?: string;

  @Column({ type: "varchar", nullable: true })
  paymentStatus?: "success" | "failure";

  @Column({ type: "varchar", default: "pending" })
  paymentApprovalStatus!: "pending" | "approved";

  @Column({ type: "jsonb", nullable: true })
  paymentMeta?: Record<string, unknown>;

  @Column({ type: "boolean", default: false })
  isCertified!: boolean;

  @Column({ type: "varchar", nullable: true, unique: true })
  certificateNumber?: string;

  @Column({ type: "timestamp", nullable: true })
  certifiedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  paymentApprovedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
