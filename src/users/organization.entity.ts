import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client.entity";

@Entity("organizations")
export class Organization {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => Client, (client) => client.organization, { onDelete: "CASCADE" })
  @JoinColumn()
  client!: Client;

  @Column({ nullable: true })
  organizationName?: string;

  @Column({ nullable: true })
  designation?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  yearsOfExperience?: string;

  @Column({ nullable: true })
  employeeId?: string;

  @Column({ nullable: true })
  organizationType?: string;
}
