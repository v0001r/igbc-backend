import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("project_details")
export class ProjectDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", unique: true })
  projectId!: number;

  @Column({ type: "varchar" })
  projectName!: string;

  @Column({ type: "text" })
  address!: string;

  @Column({ type: "varchar" })
  city!: string;

  @Column({ type: "varchar" })
  state!: string;

  @Column({ type: "varchar" })
  pincode!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  siteAreaSqm!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  siteAreaSqft!: string;

  @Column({ type: "int" })
  numberOfBuildings!: number;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  totalBuiltUpAreaSqft!: string;

  @Column({ type: "numeric", precision: 12, scale: 2 })
  totalBuiltUpAreaSqm!: string;

  @Column({ type: "date", nullable: true })
  constructionStartDate?: string;

  @Column({ type: "date", nullable: true })
  targetCertificationDate?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
