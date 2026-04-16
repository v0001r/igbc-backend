import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("membership_categories")
export class MembershipCategoryMaster {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", nullable: true })
  membershipTypeId?: number;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "varchar", nullable: true })
  shortName?: string;

  @Column({ type: "double precision", nullable: true })
  fee?: number;

  @Column({ type: "varchar", nullable: true })
  feeType?: string;

  @Column({ type: "int", default: 1 })
  status!: number;
}
