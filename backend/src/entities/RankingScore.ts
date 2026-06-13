import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";

export type BadgeLevel = "standard" | "elevated" | "distinguished";

@Entity("ranking_scores")
export class RankingScore {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => SpecialistProfile, (s) => s.rankingScore)
  @JoinColumn()
  specialist!: SpecialistProfile;

  @Column({ default: 0 })
  curationPoints!: number;

  @Column({ default: 0 })
  activityPoints!: number;

  @Column({ type: "float", default: 0 })
  externalScore!: number;

  @Column({ type: "float", default: 0 })
  totalScore!: number;

  @Column({ nullable: true, type: "int" })
  rank!: number | null;

  @Column({ type: "varchar", default: "standard" })
  badge!: BadgeLevel;

  @UpdateDateColumn()
  updatedAt!: Date;
}
