import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";
import { User } from "./User";

export type ActivityType =
  | "clinic"
  | "school_visit"
  | "mentorship"
  | "webinar"
  | "workshop"
  | "other";

@Entity("activities")
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => SpecialistProfile, (s) => s.activities)
  specialist!: SpecialistProfile;

  @Column({ type: "varchar" })
  type!: ActivityType;

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  description!: string | null;

  @Column({ nullable: true, type: "varchar" })
  location!: string | null;

  @Column({ type: "date" })
  activityDate!: string;

  @Column({ default: 0 })
  participantsCount!: number;

  @Column({ default: false })
  verified!: boolean;

  @ManyToOne(() => User, { nullable: true })
  verifiedBy!: User | null;

  @Column({ nullable: true, type: "varchar" })
  evidenceUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
