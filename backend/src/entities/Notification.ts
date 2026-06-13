import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User)
  user!: User;

  @Column()
  type!: string;

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  message!: string | null;

  @Column({ default: false })
  read!: boolean;

  @Column({ type: "simple-json", nullable: true })
  metadata!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
