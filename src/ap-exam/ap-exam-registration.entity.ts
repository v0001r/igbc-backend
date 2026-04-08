import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type PaymentStatus = "pending" | "success" | "failure";

@Entity("ap_exam_registrations")
export class ApExamRegistration {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ length: 10 })
  mobileNumber!: string;

  @Column()
  addressLine1!: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column({ length: 6 })
  pincode!: string;

  @Column()
  highestQualification!: string;

  @Column({ type: "int" })
  yearsOfExperience!: number;

  @Column({ nullable: true })
  organizationName?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ type: "date" })
  examDate!: string;

  @Column({ default: "11:00 AM" })
  examTime!: string;

  @Column({ type: "date" })
  validUntil!: string;

  @Column({ type: "int", default: 3000 })
  feeAmount!: number;

  @Column({ type: "varchar", default: "pending" })
  paymentStatus!: PaymentStatus;

  @Column({ nullable: true, unique: true })
  examId?: string;

  @Column({ nullable: true })
  paymentTransactionId?: string;

  @Column({ type: "int", default: 0 })
  rescheduleCount!: number;

  @Column({ type: "date", nullable: true })
  previousExamDate?: string;

  @Column({ type: "timestamp", nullable: true })
  lastRescheduledAt?: Date;
}
