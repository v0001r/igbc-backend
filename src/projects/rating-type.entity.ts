import { Column, Entity, PrimaryColumn } from "typeorm";

/**
 * Laravel `rating_type` table (migrated). MERN adds `config_key`, `version_types`, `default_version`
 * for certification workspace resolution when `synchronize` is enabled.
 */
@Entity("rating_type")
export class RatingType {
  @PrimaryColumn({ type: "int" })
  id!: number;

  @Column({ name: "rating_name", type: "varchar", length: 255 })
  ratingName!: string;

  @Column({ name: "short_rating_name", type: "varchar", length: 16 })
  shortRatingName!: string;

  @Column({ type: "int" })
  category!: number;

  @Column({ type: "jsonb", nullable: true })
  type?: string[] | null;

  @Column({ type: "jsonb", nullable: true })
  specifics?: string[] | null;

  @Column({ name: "non_member_reg_fee", type: "numeric", precision: 12, scale: 2, nullable: true })
  nonMemberRegFee?: string | null;

  @Column({ name: "igbc_annual_reg_fee", type: "numeric", precision: 12, scale: 2, nullable: true })
  igbcAnnualRegFee?: string | null;

  @Column({ name: "igbc_founding_reg_fee", type: "numeric", precision: 12, scale: 2, nullable: true })
  igbcFoundingRegFee?: string | null;

  @Column({ name: "config_key", type: "varchar", length: 64, nullable: true })
  configKey?: string | null;

  /** Supported certification config versions, e.g. ["3"] or ["3","3.3.1"] */
  @Column({ name: "version_types", type: "jsonb", nullable: true })
  versionTypes?: string[] | null;

  /** Preferred version for workspace (must be listed in version_types) */
  @Column({ name: "default_version", type: "varchar", length: 16, nullable: true })
  defaultVersion?: string | null;
}
