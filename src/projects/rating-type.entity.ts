import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity("rating_types")
export class RatingType {
  @PrimaryColumn({ type: "int" })
  id!: number;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "varchar", length: 16 })
  abbreviation!: string;

  /** Matches frontend registry key when a JSON config exists; null = UI not available yet */
  @Column({ type: "varchar", length: 64, nullable: true })
  configKey?: string | null;

  /** Supported config versions for this rating, e.g. ["3"] or ["3","4"] */
  @Column({ name: "version_type", type: "jsonb", default: () => '\'["3"]\'' })
  versionTypes!: string[];

  @OneToMany(() => Project, (project) => project.ratingType)
  projects?: Project[];
}
