import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { User } from "../entities/User";
import { StudentProfile } from "../entities/StudentProfile";

export default async function authRoutes(fastify: FastifyInstance) {
  const userRepo = fastify.db.getRepository(User);
  const studentProfileRepo = fastify.db.getRepository(StudentProfile);

  fastify.post<{
    Body: { email: string; password: string; displayName: string; role: string; age?: number };
  }>("/register", async (request, reply) => {
    const { email, password, displayName, role, age } = request.body;

    const existing = await userRepo.findOneBy({ email });
    if (existing) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      email,
      displayName,
      passwordHash,
      role: (role as User["role"]) || "student",
    });
    await userRepo.save(user);

    if (user.role === "student") {
      const sp = studentProfileRepo.create({ user, age: age ?? null, interests: [], progressData: {} });
      await studentProfileRepo.save(sp);
    }

    const token = fastify.jwt.sign({ id: user.id, role: user.role });
    return reply.status(201).send({ token, user: sanitize(user) });
  });

  fastify.post<{ Body: { email: string; password: string } }>(
    "/login",
    async (request, reply) => {
      const { email, password } = request.body;

      const user = await userRepo.findOne({
        where: { email },
        relations: ["specialistProfile", "specialistProfile.rankingScore", "studentProfile"],
      });
      if (!user) return reply.status(401).send({ error: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return reply.status(401).send({ error: "Invalid credentials" });

      const token = fastify.jwt.sign({ id: user.id, role: user.role });
      return { token, user: sanitize(user) };
    }
  );

  fastify.get("/me", {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      const { id } = request.user as { id: string };
      const user = await userRepo.findOne({
        where: { id },
        relations: ["specialistProfile", "specialistProfile.rankingScore", "studentProfile"],
      });
      if (!user) return reply.status(404).send({ error: "Not found" });
      return sanitize(user);
    },
  });
}

function sanitize(user: User) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...rest } = user;
  return rest;
}
