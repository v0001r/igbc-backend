import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("membership_types")
export class MembershipTypeMaster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int", default: 1 })
  status!: number;
}
