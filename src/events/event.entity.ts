import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type EventStatus = "active" | "draft" | "inactive";

@Entity("events")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "varchar", nullable: true })
  bannerUrl?: string;

  @Column({ type: "timestamp" })
  startDateTime!: Date;

  @Column({ type: "timestamp" })
  endDateTime!: Date;

  @Column({ type: "varchar" })
  location!: string;

  @Column({ type: "varchar", nullable: true })
  organizerName?: string;

  @Column({ type: "double precision", nullable: true })
  ticketPrice?: number;

  @Column({ type: "int", nullable: true })
  maxAttendees?: number;

  @Column({ type: "varchar", default: "draft" })
  status!: EventStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
