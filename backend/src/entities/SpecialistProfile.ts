import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { User } from "./User";
import { CurationVote } from "./CurationVote";
import { Activity } from "./Activity";
import { RankingScore } from "./RankingScore";

@Entity("specialist_profiles")
export class SpecialistProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (u) => u.specialistProfile)
  @JoinColumn()
  user!: User;

  @Column()
  fullName!: string;

  @Column()
  specialty!: string;

  @Column({ nullable: true, type: "varchar" })
  subSpecialty!: string | null;

  @Column({ nullable: true, type: "varchar" })
  credentials!: string | null;

  @Column({ nullable: true, type: "text" })
  bio!: string | null;

  @Column({ nullable: true, type: "varchar" })
  institution!: string | null;

  @Column({ nullable: true, type: "varchar" })
  location!: string | null;

  @Column({ nullable: true, type: "varchar" })
  linkedinUrl!: string | null;

  @Column({ default: 0 })
  linkedinConnections!: number;

  @Column({ type: "float", default: 0 })
  googleRating!: number;

  @Column({ default: 0 })
  googleReviewCount!: number;

  @Column({ nullable: true, type: "varchar" })
  profileImageUrl!: string | null;

  @Column({ default: false })
  verified!: boolean;

  @Column({ nullable: true, type: "datetime" })
  verifiedAt!: Date | null;

  @ManyToOne(() => User, { nullable: true })
  verifiedBy!: User | null;

  @OneToMany(() => CurationVote, (v) => v.specialist, { cascade: true })
  curationVotes!: CurationVote[];

  @OneToMany(() => Activity, (a) => a.specialist, { cascade: true })
  activities!: Activity[];

  @OneToOne(() => RankingScore, (r) => r.specialist, { cascade: true })
  rankingScore!: RankingScore | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
