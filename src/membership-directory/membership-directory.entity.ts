import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type DirectoryMembershipType =
  | "Founding Membership"
  | "Annual Membership"
  | "Individual Membership";

@Entity("membership_directory")
export class MembershipDirectoryMember {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: "" })
  logo!: string;

  @Column()
  name!: string;

  @Column({ type: "varchar" })
  membershipType!: DirectoryMembershipType;

  @Column()
  website!: string;

  @Column()
  category!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;
}
