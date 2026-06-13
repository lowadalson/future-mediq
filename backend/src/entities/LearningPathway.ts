import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";
import { StudentProfile } from "./StudentProfile";

@Entity("learning_pathways")
export class LearningPathway {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => StudentProfile, (s) => s.learningPathways)
  student!: StudentProfile;

  @Column()
  specialty!: string;

  @Column({ default: 0 })
  currentModule!: number;

  @Column("simple-array", { default: "" })
  modulesCompleted!: string[];

  @Column({ type: "simple-json", nullable: true })
  aiRecommendation!: Record<string, unknown> | null;

  @Column({ nullable: true, type: "text" })
  nextAction!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
