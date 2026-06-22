import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CertificationApplication } from "../certification-application/certification-application.entity";

@Entity("certificate_customizations")
export class CertificateCustomization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "application_id", type: "int", unique: true })
  applicationId!: number;

  @OneToOne(() => CertificationApplication)
  @JoinColumn({ name: "application_id" })
  application!: CertificationApplication;

  @Column({ name: "project_name", type: "varchar", length: 500 })
  projectName!: string;

  @Column({ type: "text" })
  address!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
