import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "../rbac/role.entity";
import { Client } from "./client.entity";

export type UserType = "m" | "s" | "a" | "T";
export type UserStatus = "active" | "inactive";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  lastName!: string;

  @Column()
  displayName!: string;

  @Column()
  salutation!: string;

  @Column()
  state!: string;

  @Column({ default: "India" })
  country!: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ nullable: true })
  telephone?: string;

  @Column({ default: true })
  prefEmailNotifications!: boolean;

  @Column({ default: true })
  prefSmsAlerts!: boolean;

  @Column({ default: true })
  prefNewsletter!: boolean;

  @Column({ default: "English" })
  preferredLanguage!: string;

  @Column({ default: true })
  prefShowProfilePublicly!: boolean;

  @Column({ default: true })
  prefShowEmailToMembers!: boolean;

  @Column({ type: "char", length: 1, default: "m" })
  userType!: UserType;

  @Column({ name: "role_id", type: "int", nullable: true })
  roleId?: number | null;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: "role_id" })
  role?: Role | null;

  @Column({ type: "varchar", length: 16, default: "active" })
  status!: UserStatus;

  @Column({ name: "is_first_login", type: "boolean", default: false })
  isFirstLogin!: boolean;

  @Column({ name: "is_lead", type: "boolean", default: false })
  isLead!: boolean;

  @Column({ name: "password_reset_token", type: "varchar", length: 64, nullable: true })
  passwordResetToken?: string | null;

  @Column({ name: "password_reset_expiry", type: "timestamptz", nullable: true })
  passwordResetExpiry?: Date | null;

  @Column({ name: "created_by", type: "uuid", nullable: true })
  createdBy?: string | null;

  @Column({ type: "text", nullable: true })
  address?: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  organization?: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @OneToOne(() => Client, (client) => client.user)
  client?: Client;
}
