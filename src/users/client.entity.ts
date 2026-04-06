import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "./organization.entity";
import { User } from "./user.entity";

@Entity("clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (user) => user.client, { onDelete: "CASCADE" })
  @JoinColumn()
  user!: User;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  pincode?: string;

  @Column({ nullable: true })
  addressLine1?: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @OneToOne(() => Organization, (organization) => organization.client)
  organization?: Organization;
}
