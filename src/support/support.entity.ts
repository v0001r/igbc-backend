import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type SupportStatus = "active" | "inactive";

@Entity("support_entries")
export class SupportEntry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar" })
  designation!: string;

  @Column({ type: "varchar" })
  department!: string;

  @Column({ type: "varchar", unique: true })
  phone!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar", default: "active" })
  status!: SupportStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
