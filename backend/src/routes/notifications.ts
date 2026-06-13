import { FastifyInstance } from "fastify";
import { Notification } from "../entities/Notification";

export default async function notificationRoutes(fastify: FastifyInstance) {
  const notifRepo = fastify.db.getRepository(Notification);

  fastify.get(
    "/",
    { preHandler: [fastify.authenticate] },
    async (request, _reply) => {
      const { id } = request.user as { id: string };
      return notifRepo.find({
        where: { user: { id } },
        order: { createdAt: "DESC" },
        take: 50,
      });
    }
  );

  fastify.patch<{ Params: { id: string } }>(
    "/:id/read",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      const notif = await notifRepo.findOneBy({ id: request.params.id });
      if (!notif) return reply.status(404).send({ error: "Not found" });
      notif.read = true;
      await notifRepo.save(notif);
      return notif;
    }
  );

  fastify.post(
    "/read-all",
    { preHandler: [fastify.authenticate] },
    async (request, _reply) => {
      const { id } = request.user as { id: string };
      await notifRepo
        .createQueryBuilder()
        .update()
        .set({ read: true })
        .where("userId = :id", { id })
        .execute();
      return { message: "All notifications marked as read" };
    }
  );
}
