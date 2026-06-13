import { FastifyInstance } from "fastify";
import { SpecialtyField } from "../entities/SpecialtyField";

export default async function specialtyRoutes(fastify: FastifyInstance) {
  const repo = fastify.db.getRepository(SpecialtyField);

  fastify.get("/", async (_req, _reply) => {
    return repo.find({ order: { sortOrder: "ASC" } });
  });

  fastify.get<{ Params: { slug: string } }>("/:slug", async (request, reply) => {
    const sf = await repo.findOneBy({ slug: request.params.slug });
    if (!sf) return reply.status(404).send({ error: "Not found" });
    return sf;
  });
}
