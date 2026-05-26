import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("project_contacts")
export class ProjectContact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int", unique: true })
  projectId!: number;

  @Column({ type: "jsonb" })
  formData!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
