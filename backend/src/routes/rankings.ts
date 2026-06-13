import { FastifyInstance } from "fastify";
import { RankingScore } from "../entities/RankingScore";

export default async function rankingRoutes(fastify: FastifyInstance) {
  const rankingRepo = fastify.db.getRepository(RankingScore);

  fastify.get("/leaderboard", async (_request, _reply) => {
    return rankingRepo
      .createQueryBuilder("rs")
      .leftJoinAndSelect("rs.specialist", "sp")
      .leftJoinAndSelect("sp.user", "user")
      .where("sp.verified = TRUE")
      .orderBy("rs.totalScore", "DESC")
      .take(50)
      .getMany();
  });

  fastify.get<{ Params: { specialistId: string } }>(
    "/specialist/:specialistId",
    async (request, reply) => {
      const rs = await rankingRepo.findOne({
        where: { specialist: { id: request.params.specialistId } },
        relations: ["specialist", "specialist.user"],
      });
      if (!rs) return reply.status(404).send({ error: "Not found" });
      return rs;
    }
  );
}
