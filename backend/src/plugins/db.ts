import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
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

export default fp(async (fastify: FastifyInstance) => {
  await AppDataSource.initialize();
  fastify.decorate("db", AppDataSource);

  fastify.addHook("onClose", async () => {
    await AppDataSource.destroy();
  });
});
