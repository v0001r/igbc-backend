import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { RoleName } from "./role.enum";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "role_name", type: "varchar", length: 32, unique: true })
  roleName!: RoleName;
}
