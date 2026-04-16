import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("membership_plans")
export class MembershipPlanMaster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "double precision" })
  fees!: number;

  @Column({ type: "varchar", nullable: true })
  feeType?: string;

  @Column({ type: "int", default: 1 })
  status!: number;
}
