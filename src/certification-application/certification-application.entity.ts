import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("certification_applications")
export class CertificationApplication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", unique: true })
  projectId!: number;

  @Column({ type: "uuid" })
  createdByUserId!: string;

  @Column({ type: "varchar", nullable: true })
  igbcProjectId?: string;

  @Column({ type: "varchar" })
  temporaryProjectId!: string;

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

  @Column({ type: "varchar" })
  projectName!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "varchar" })
  city!: string;

  @Column({ type: "varchar" })
  state!: string;

  @Column({ type: "varchar" })
  pincode!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  siteAreaSqm!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  siteAreaSqft!: string;

  @Column({ type: "int" })
  numberOfBuildings!: number;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  totalBuiltUpAreaSqft!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  totalBuiltUpAreaSqm!: string;

  @Column({ type: "date", nullable: true })
  constructionStartDate?: string;

  @Column({ type: "date", nullable: true })
  targetCertificationDate?: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  certificationFee!: string;

  @Column({ type: "int", nullable: true })
  certificationType?: number;

  @Column({ type: "boolean", default: false })
  expediteReview!: boolean;

  @Column({ type: "varchar", nullable: true })
  organizationName?: string;

  @Column({ type: "text", nullable: true })
  organizationAddress?: string;

  @Column({ type: "varchar", nullable: true })
  organizationCity?: string;

  @Column({ type: "varchar", nullable: true })
  organizationState?: string;

  @Column({ type: "varchar", nullable: true })
  organizationPinCode?: string;

  @Column({ type: "varchar", nullable: true })
  panNumber?: string;

  @Column({ type: "boolean", default: false })
  hasGstNumber!: boolean;

  @Column({ type: "varchar", nullable: true })
  gstNumber?: string;

  @Column({ type: "boolean", default: false })
  sezSelected!: boolean;

  @Column({ type: "boolean", default: false })
  tdsSelected!: boolean;

  @Column({ type: "varchar", nullable: true })
  couponCode?: string;

  @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
  gstRate?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  gstAmount?: string;

  @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
  tdsRate?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  tdsAmount?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  finalPayableAmount?: string;

  @Column({ type: "jsonb", nullable: true })
  invoiceAdditionalData?: Record<string, unknown>;

  @Column({ type: "varchar", default: "pending" })
  paymentStatus!: "pending" | "success" | "failed" | "paid" | "rejected";

  @Column({ type: "varchar", nullable: true })
  paymentMethod?: "online" | "offline";

  @Column({ type: "jsonb", nullable: true })
  gatewayResponse?: Record<string, unknown>;

  @Column({ type: "varchar", nullable: true })
  paymentType?: string;

  @Column({ type: "varchar", nullable: true })
  transactionReference?: string;

  @Column({ type: "varchar", nullable: true })
  ifscCode?: string;

  @Column({ type: "varchar", nullable: true })
  bankName?: string;

  @Column({ type: "varchar", nullable: true })
  branch?: string;

  @Column({ type: "numeric", precision: 12, scale: 2, nullable: true })
  paymentAmount?: string;

  @Column({ type: "date", nullable: true })
  paymentDate?: string;

  @Column({ type: "text", nullable: true })
  paymentRemarks?: string;

  @Column({ type: "int", default: 1 })
  currentStep!: number;

  @Column({ type: "varchar", default: "saved" })
  status!: "saved" | "submitted";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
