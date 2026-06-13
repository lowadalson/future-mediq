import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { CurationVote } from "./CurationVote";

export type ContentSource = "youtube" | "tiktok" | "vimeo" | "other";
export type ContentStatus = "pending" | "approved" | "rejected" | "flagged";
export type AgeSuitability = "7-10" | "11-14" | "15-18" | "all";

@Entity("content_items")
export class ContentItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  source!: ContentSource;

  @Column({ nullable: true, type: "varchar" })
  externalId!: string | null;

  @Column()
  title!: string;

  @Column({ nullable: true, type: "text" })
  description!: string | null;

  @Column()
  url!: string;

  @Column({ nullable: true, type: "varchar" })
  thumbnailUrl!: string | null;

  @Column({ nullable: true, type: "varchar" })
  channelName!: string | null;

  @Column({ nullable: true, type: "datetime" })
  publishedAt!: Date | null;

  @Column({ nullable: true, type: "int" })
  durationSeconds!: number | null;

  @Column({ type: "int", default: 0 })
  viewCount!: number;

  @Column({ type: "int", default: 0 })
  likeCount!: number;

  @Column("simple-array", { default: "" })
  specialtyTags!: string[];

  @Column({ type: "varchar", default: "all" })
  ageSuitability!: AgeSuitability;

  @Column({ type: "float", default: 0 })
  aiQualityScore!: number;

  @Column({ type: "varchar", default: "pending" })
  status!: ContentStatus;

  @Column({ default: 0 })
  approveCount!: number;

  @Column({ default: 0 })
  rejectCount!: number;

  @OneToMany(() => CurationVote, (v) => v.content, { cascade: true })
  curationVotes!: CurationVote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
