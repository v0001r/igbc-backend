import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RatingType } from "../projects/rating-type.entity";
import { User } from "./user.entity";

@Entity("user_rating_types")
@Index(["userId", "ratingTypeId"], { unique: true })
export class UserRatingType {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({ name: "rating_type_id", type: "int" })
  ratingTypeId!: number;

  @ManyToOne(() => RatingType, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rating_type_id" })
  ratingType!: RatingType;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
