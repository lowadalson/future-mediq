import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { StudentProfile } from "../entities/StudentProfile";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { ContentItem } from "../entities/ContentItem";
import { CurationVote } from "../entities/CurationVote";
import { Activity } from "../entities/Activity";
import { RankingScore } from "../entities/RankingScore";
import { LearningPathway } from "../entities/LearningPathway";
import { SpecialtyField } from "../entities/SpecialtyField";
import { Notification } from "../entities/Notification";

declare module "fastify" {
  interface FastifyInstance {
    db: DataSource;
  }
}

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: process.env.NODE_ENV !== "production",
  logging: false,
  connectTimeoutMS: 10000,
  poolSize: 2,
  extra: { connectionTimeoutMillis: 10000, idleTimeoutMillis: 30000 },
  entities: [
    User,
    StudentProfile,
    SpecialistProfile,
    ContentItem,
    CurationVote,
    Activity,
    RankingScore,
    LearningPathway,
    SpecialtyField,
    Notification,
  ],
});

export { AppDataSource };

export async function connectDb(): Promise<DataSource> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
