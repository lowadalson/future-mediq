import { FastifyInstance } from "fastify";
import { Activity, ActivityType } from "../entities/Activity";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { User } from "../entities/User";
import { recalculateRanking } from "../lib/rankingCalc";

export default async function activityRoutes(fastify: FastifyInstance) {
  const activityRepo = fastify.db.getRepository(Activity);
  const specialistRepo = fastify.db.getRepository(SpecialistProfile);
  const userRepo = fastify.db.getRepository(User);

  fastify.get<{ Querystring: { specialistId?: string; verified?: string } }>(
    "/",
    async (request, _reply) => {
      const qb = activityRepo
        .createQueryBuilder("a")
        .leftJoinAndSelect("a.specialist", "sp")
        .leftJoinAndSelect("sp.user", "user")
        .orderBy("a.activityDate", "DESC");

      if (request.query.specialistId) {
        qb.andWhere("a.specialist.id = :id", { id: request.query.specialistId });
      }
      if (request.query.verified === "true") {
        qb.andWhere("a.verified = TRUE");
      }
      return qb.getMany();
    }
  );

  fastify.post<{
    Body: {
      type: ActivityType;
      title: string;
      description?: string;
      location?: string;
      activityDate: string;
      participantsCount?: number;
      evidenceUrl?: string;
    };
  }>(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id: userId } = request.user as { id: string };
      const specialist = await specialistRepo.findOne({ where: { user: { id: userId } } });
      if (!specialist) return reply.status(403).send({ error: "Specialists only" });

      const activity = activityRepo.create({
        specialist,
        type: request.body.type,
        title: request.body.title,
        description: request.body.description ?? null,
        location: request.body.location ?? null,
        activityDate: request.body.activityDate,
        participantsCount: request.body.participantsCount ?? 0,
        evidenceUrl: request.body.evidenceUrl ?? null,
      });
      await activityRepo.save(activity);
      return reply.status(201).send(activity);
    }
  );

  fastify.post<{ Params: { id: string } }>(
    "/:id/verify",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id: userId } = request.user as { id: string };
      const verifier = await userRepo.findOneBy({ id: userId });
      if (!verifier || verifier.role !== "admin") {
        return reply.status(403).send({ error: "Admin only" });
      }

      const activity = await activityRepo.findOne({
        where: { id: request.params.id },
        relations: ["specialist"],
      });
      if (!activity) return reply.status(404).send({ error: "Not found" });

      activity.verified = true;
      activity.verifiedBy = verifier;
      await activityRepo.save(activity);

      await recalculateRanking(fastify.db, activity.specialist.id);

      return activity;
    }
  );
}
