import { FastifyInstance } from "fastify";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { RankingScore } from "../entities/RankingScore";
import { User } from "../entities/User";
import { recalculateRanking } from "../lib/rankingCalc";
import { enrichSpecialist, runSpecialistEnrichment } from "../lib/specialistEnrich";

export default async function specialistRoutes(fastify: FastifyInstance) {
  const profileRepo = fastify.db.getRepository(SpecialistProfile);
  const rankingRepo = fastify.db.getRepository(RankingScore);
  const userRepo = fastify.db.getRepository(User);

  // Enrich every specialist with web data (Google rating/reviews, LinkedIn) via
  // the Bright Data SERP. Restricted to specialists/admins since each call costs.
  fastify.post("/enrich", { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = request.user as { id: string };
    const user = await userRepo.findOneBy({ id });
    if (!user || (user.role !== "admin" && user.role !== "specialist")) {
      return reply.status(403).send({ error: "Specialist or admin only" });
    }
    try {
      const summary = await runSpecialistEnrichment(fastify);
      if (summary.updated === 0 && summary.errors.length > 0) {
        return reply.status(502).send({ error: summary.errors[0], ...summary });
      }
      return summary;
    } catch (e) {
      return reply.status(500).send({ error: e instanceof Error ? e.message : "Enrichment failed" });
    }
  });

  // Enrich a single specialist.
  fastify.post<{ Params: { id: string } }>(
    "/:id/enrich",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const profile = await profileRepo.findOneBy({ id: request.params.id });
      if (!profile) return reply.status(404).send({ error: "Not found" });
      try {
        const { changed } = await enrichSpecialist(fastify, profile);
        const fresh = await profileRepo.findOne({
          where: { id: profile.id },
          relations: ["rankingScore"],
        });
        return { profile: fresh, changed };
      } catch (e) {
        return reply.status(502).send({ error: e instanceof Error ? e.message : "Enrichment failed" });
      }
    }
  );

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
