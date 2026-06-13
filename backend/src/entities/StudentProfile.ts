import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { LearningPathway } from "./LearningPathway";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

@Entity("student_profiles")
export class StudentProfile {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToOne(() => User, (u) => u.studentProfile)
  @JoinColumn()
  user!: User;

  @Column({ nullable: true, type: "smallint" })
  age!: number | null;

  @Column("simple-array", { default: "" })
  interests!: string[];

  @Column({ type: "varchar", default: "beginner" })
  learningLevel!: DifficultyLevel;

  @Column({ type: "simple-json", nullable: true })
  progressData!: Record<string, unknown>;

  @OneToMany(() => LearningPathway, (lp) => lp.student, { cascade: true })
  learningPathways!: LearningPathway[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
