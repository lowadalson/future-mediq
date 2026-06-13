import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from "typeorm";
import { SpecialistProfile } from "./SpecialistProfile";
import { ContentItem } from "./ContentItem";

export type VoteType = "approve" | "reject";

@Entity("curation_votes")
@Unique(["specialist", "content"])
export class CurationVote {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => SpecialistProfile, (s) => s.curationVotes)
  specialist!: SpecialistProfile;

  @ManyToOne(() => ContentItem, (c) => c.curationVotes)
  content!: ContentItem;

  @Column({ type: "varchar" })
  vote!: VoteType;

  @Column({ nullable: true, type: "text" })
  commentary!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
