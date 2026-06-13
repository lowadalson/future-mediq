import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";
import { StudentProfile } from "./StudentProfile";

export type UserRole = "student" | "specialist" | "admin";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ nullable: true, type: "varchar" })
  displayName!: string | null;

  @Column({ type: "varchar", default: "student" })
  role!: UserRole;

  @Column({ nullable: true, type: "varchar" })
  avatarUrl!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => SpecialistProfile, (sp) => sp.user, { nullable: true })
  specialistProfile!: SpecialistProfile | null;

  @OneToOne(() => StudentProfile, (sp) => sp.user, { nullable: true })
  studentProfile!: StudentProfile | null;
}
