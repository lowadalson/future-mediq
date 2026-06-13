import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("specialty_fields")
export class SpecialtyField {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  slug!: string;

  @Column()
  name!: string;

  @Column({ nullable: true, type: "text" })
  description!: string | null;

  @Column({ nullable: true, type: "varchar" })
  icon!: string | null;

  @Column({ nullable: true, type: "varchar" })
  color!: string | null;

  @Column({ default: 0, type: "smallint" })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
