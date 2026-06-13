import { FastifyInstance } from "fastify";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { RankingScore } from "../entities/RankingScore";
import { User } from "../entities/User";
import { recalculateRanking } from "../lib/rankingCalc";

export default async function specialistRoutes(fastify: FastifyInstance) {
  const profileRepo = fastify.db.getRepository(SpecialistProfile);
  const rankingRepo = fastify.db.getRepository(RankingScore);
  const userRepo = fastify.db.getRepository(User);

  fastify.get<{ Querystring: { specialty?: string; verified?: string } }>(
    "/",
    async (request, _reply) => {
      const qb = profileRepo
        .createQueryBuilder("sp")
        .leftJoinAndSelect("sp.user", "user")
        .leftJoinAndSelect("sp.rankingScore", "rs")
        .orderBy("COALESCE(rs.totalScore, 0)", "DESC");

      if (request.query.specialty) {
        qb.andWhere("sp.specialty = :specialty", { specialty: request.query.specialty });
      }
      if (request.query.verified === "true") {
        qb.andWhere("sp.verified = TRUE");
      }
      return qb.getMany();
    }
  );

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const profile = await profileRepo.findOne({
      where: { id: request.params.id },
      relations: ["user", "rankingScore", "activities"],
    });
    if (!profile) return reply.status(404).send({ error: "Not found" });
    return profile;
  });

  fastify.post<{
    Body: {
      fullName: string;
      specialty: string;
      subSpecialty?: string;
      credentials?: string;
      bio?: string;
      institution?: string;
      location?: string;
      linkedinUrl?: string;
      linkedinConnections?: number;
      googleRating?: number;
      googleReviewCount?: number;
    };
  }>(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id } = request.user as { id: string };
      const user = await userRepo.findOneBy({ id });
      if (!user) return reply.status(404).send({ error: "User not found" });

      const existing = await profileRepo.findOne({ where: { user: { id } } });
      if (existing) return reply.status(409).send({ error: "Profile already exists" });

      const profile = profileRepo.create({ user, ...request.body });
      await profileRepo.save(profile);

      user.role = "specialist";
      await userRepo.save(user);

      const rs = rankingRepo.create({ specialist: profile });
      await rankingRepo.save(rs);

      return reply.status(201).send(profile);
    }
  );

  fastify.patch<{
    Params: { id: string };
    Body: Partial<{
      googleRating: number;
      googleReviewCount: number;
      linkedinConnections: number;
      bio: string;
      location: string;
    }>;
  }>(
    "/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const profile = await profileRepo.findOneBy({ id: request.params.id });
      if (!profile) return reply.status(404).send({ error: "Not found" });
      Object.assign(profile, request.body);
      await profileRepo.save(profile);
      await recalculateRanking(fastify.db, profile.id);
      return profile;
    }
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/verify",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id: userId } = request.user as { id: string };
      const admin = await userRepo.findOneBy({ id: userId });
      if (!admin || admin.role !== "admin") {
        return reply.status(403).send({ error: "Admin only" });
      }
      const profile = await profileRepo.findOneBy({ id: request.params.id });
      if (!profile) return reply.status(404).send({ error: "Not found" });
      profile.verified = true;
      profile.verifiedAt = new Date();
      profile.verifiedBy = admin;
      await profileRepo.save(profile);
      return profile;
    }
  );
}
