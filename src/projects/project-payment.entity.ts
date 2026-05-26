import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("project_payments")
export class ProjectPayment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", unique: true })
  projectId!: number;

  @Column({ type: "varchar" })
  paymentMethod!: "online" | "offline";

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
  amount?: string;

  @Column({ type: "date", nullable: true })
  paymentDate?: string;

  @Column({ type: "text", nullable: true })
  remarks?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
