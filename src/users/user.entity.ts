import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

export type UserType = "m" | "s" | "a" | "T";

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

  @OneToOne(() => Client, (client) => client.user)
  client?: Client;
}
