import { FastifyInstance } from "fastify";
import { ContentItem } from "../entities/ContentItem";
import { CurationVote } from "../entities/CurationVote";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { Notification } from "../entities/Notification";
import { recalculateRanking } from "../lib/rankingCalc";

export default async function contentRoutes(fastify: FastifyInstance) {
  const contentRepo = fastify.db.getRepository(ContentItem);
  const voteRepo = fastify.db.getRepository(CurationVote);
  const specialistRepo = fastify.db.getRepository(SpecialistProfile);
  const notificationRepo = fastify.db.getRepository(Notification);

  fastify.get<{
    Querystring: {
      status?: string;
      specialty?: string;
      source?: string;
      age?: string;
      q?: string;
    };
  }>("/", async (request, _reply) => {
    const { status = "approved", specialty, source, age, q } = request.query;

    const qb = contentRepo
      .createQueryBuilder("c")
      .orderBy("c.createdAt", "DESC");

    qb.andWhere("c.status = :status", { status });

    if (specialty) qb.andWhere(":specialty = ANY(c.specialtyTags)", { specialty });
    if (source) qb.andWhere("c.source = :source", { source });
    if (age) qb.andWhere("c.ageSuitability = :age OR c.ageSuitability = 'all'", { age });
    if (q)
      qb.andWhere(
        "(c.title ILIKE :q OR c.description ILIKE :q)",
        { q: `%${q}%` }
      );

    return qb.getMany();
  });

  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const item = await contentRepo.findOne({
      where: { id: request.params.id },
      relations: ["curationVotes", "curationVotes.specialist", "curationVotes.specialist.user"],
    });
    if (!item) return reply.status(404).send({ error: "Not found" });
    item.viewCount = Number(item.viewCount) + 1;
    await contentRepo.save(item);
    return item;
  });

  fastify.post<{
    Body: {
      source: string;
      externalId?: string;
      title: string;
      description?: string;
      url: string;
      thumbnailUrl?: string;
      channelName?: string;
      durationSeconds?: number;
      specialtyTags: string[];
      ageSuitability?: string;
    };
  }>(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const item = contentRepo.create({
        source: request.body.source as ContentItem["source"],
        externalId: request.body.externalId ?? null,
        title: request.body.title,
        description: request.body.description ?? null,
        url: request.body.url,
        thumbnailUrl: request.body.thumbnailUrl ?? null,
        channelName: request.body.channelName ?? null,
        durationSeconds: request.body.durationSeconds ?? null,
        specialtyTags: request.body.specialtyTags,
        ageSuitability: (request.body.ageSuitability as ContentItem["ageSuitability"]) ?? "all",
        status: "pending",
      });
      await contentRepo.save(item);
      return reply.status(201).send(item);
    }
  );

  fastify.post<{
    Params: { id: string };
    Body: { vote: "approve" | "reject"; commentary?: string };
  }>(
    "/:id/vote",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const { id: userId } = request.user as { id: string };

      const specialist = await specialistRepo.findOne({
        where: { user: { id: userId } },
      });
      if (!specialist) {
        return reply.status(403).send({ error: "Specialists only" });
      }

      const content = await contentRepo.findOneBy({ id: request.params.id });
      if (!content) return reply.status(404).send({ error: "Not found" });

      const existing = await voteRepo.findOne({
        where: { specialist: { id: specialist.id }, content: { id: content.id } },
      });
      if (existing) return reply.status(409).send({ error: "Already voted" });

      const vote = voteRepo.create({
        specialist,
        content,
        vote: request.body.vote,
        commentary: request.body.commentary ?? null,
      });
      await voteRepo.save(vote);

      if (request.body.vote === "approve") {
        content.approveCount = (content.approveCount || 0) + 1;
      } else {
        content.rejectCount = (content.rejectCount || 0) + 1;
      }

      if (content.approveCount >= 3 && content.status === "pending") {
        content.status = "approved";
        const notification = notificationRepo.create({
          user: specialist.user,
          type: "content_approved",
          title: "Content approved!",
          message: `Your curated item "${content.title}" has been approved.`,
          metadata: { contentId: content.id },
        });
        await notificationRepo.save(notification);
      }
      if (content.rejectCount >= 3 && content.status === "pending") {
        content.status = "rejected";
      }
      await contentRepo.save(content);

      await recalculateRanking(fastify.db, specialist.id);

      return { message: "Vote recorded", status: content.status };
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id/votes",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const votes = await voteRepo.find({
        where: { content: { id: request.params.id } },
        relations: ["specialist", "specialist.user"],
      });
      return votes;
    }
  );
}
