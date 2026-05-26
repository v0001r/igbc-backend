import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("project_invoices")
export class ProjectInvoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", unique: true })
  projectId!: number;

  @Column({ type: "varchar" })
  organizationName!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "varchar" })
  city!: string;

  @Column({ type: "varchar" })
  state!: string;

  @Column({ type: "varchar" })
  pinCode!: string;

  @Column({ type: "varchar" })
  panNumber!: string;

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

  @Column({ type: "numeric", precision: 12, scale: 2 })
  registrationFee!: string;

  @Column({ type: "numeric", precision: 5, scale: 2, default: "18.00" })
  gstRate!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  gstAmount!: string;

  @Column({ type: "numeric", precision: 5, scale: 2, default: "10.00" })
  tdsRate!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  tdsAmount!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  totalPayable!: string;

  @Column({ type: "jsonb", nullable: true })
  additionalData?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
