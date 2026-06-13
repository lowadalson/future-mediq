import "dotenv/config";
import "reflect-metadata";
import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import dbPlugin from "./plugins/db";
import authRoutes from "./routes/auth";
import specialistRoutes from "./routes/specialists";
import contentRoutes from "./routes/content";
import activityRoutes from "./routes/activities";
import rankingRoutes from "./routes/rankings";
import specialtyRoutes from "./routes/specialties";
import notificationRoutes from "./routes/notifications";
import gutExplorerRoutes from "./routes/gutExplorer";
import knowledgeSearchRoutes from "./routes/knowledgeSearch";
import gutPanelRoutes from "./routes/gutPanel";
import { SpecialtyField } from "./entities/SpecialtyField";
import { ContentItem } from "./entities/ContentItem";
import { User } from "./entities/User";
import { StudentProfile } from "./entities/StudentProfile";
import { SpecialistProfile } from "./entities/SpecialistProfile";
import { RankingScore } from "./entities/RankingScore";
import { Activity } from "./entities/Activity";
import bcrypt from "bcrypt";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const app = Fastify({ logger: true, bodyLimit: 25 * 1024 * 1024 });

const JWT_SECRET = process.env.JWT_SECRET || "mediq-dev-secret-2024";

async function bootstrap() {
  await app.register(cors, { origin: true });
  await app.register(jwt, { secret: JWT_SECRET });
  await app.register(dbPlugin);

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );

  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(specialistRoutes, { prefix: "/api/specialists" });
  await app.register(contentRoutes, { prefix: "/api/content" });
  await app.register(activityRoutes, { prefix: "/api/activities" });
  await app.register(rankingRoutes, { prefix: "/api/rankings" });
  await app.register(specialtyRoutes, { prefix: "/api/specialties" });
  await app.register(notificationRoutes, { prefix: "/api/notifications" });
  await app.register(gutExplorerRoutes, { prefix: "/api/gut-explorer" });
  await app.register(knowledgeSearchRoutes, { prefix: "/api/knowledge" });
  await app.register(gutPanelRoutes, { prefix: "/api/gut-panel" });

  app.get("/health", async () => ({ status: "ok" }));

  await seed(app);

  const port = Number(process.env.PORT) || 3001;
  await app.listen({ port, host: "0.0.0.0" });
  console.log(`MEDIQ API running on http://localhost:${port}`);
}

async function seed(app: typeof Fastify.prototype) {
  const specialtyRepo = app.db.getRepository(SpecialtyField);
  const count = await specialtyRepo.count();
  if (count > 0) return;

  const specialties = [
    { slug: "cardiology",    name: "Cardiology",        description: "Heart and cardiovascular system",    icon: "❤️",  color: "#E53935", sortOrder: 1 },
    { slug: "neurology",     name: "Neurology",          description: "Brain, spine and nervous system",    icon: "🧠",  color: "#8E24AA", sortOrder: 2 },
    { slug: "orthopaedics",  name: "Orthopaedics",       description: "Bones, joints and musculoskeletal",  icon: "🦴",  color: "#FB8C00", sortOrder: 3 },
    { slug: "oncology",      name: "Oncology",           description: "Cancer diagnosis and treatment",     icon: "🔬",  color: "#43A047", sortOrder: 4 },
    { slug: "paediatrics",   name: "Paediatrics",        description: "Medicine for infants and children",  icon: "👶",  color: "#00ACC1", sortOrder: 5 },
    { slug: "surgery",       name: "General Surgery",    description: "Surgical procedures and techniques", icon: "🏥",  color: "#3949AB", sortOrder: 6 },
    { slug: "radiology",     name: "Radiology",          description: "Medical imaging and diagnostics",    icon: "📷",  color: "#039BE5", sortOrder: 7 },
    { slug: "psychiatry",    name: "Psychiatry",         description: "Mental health and behaviour",        icon: "🧩",  color: "#7CB342", sortOrder: 8 },
    { slug: "dermatology",   name: "Dermatology",        description: "Skin, hair and nail conditions",     icon: "🩺",  color: "#F4511E", sortOrder: 9 },
    { slug: "emergency",     name: "Emergency Medicine", description: "Critical and urgent care",           icon: "🚨",  color: "#E53935", sortOrder: 10 },
  ];

  for (const s of specialties) {
    await specialtyRepo.save(specialtyRepo.create(s));
  }

  const userRepo = app.db.getRepository(User);
  const studentProfileRepo = app.db.getRepository(StudentProfile);
  const profileRepo = app.db.getRepository(SpecialistProfile);
  const rankingRepo = app.db.getRepository(RankingScore);
  const contentRepo = app.db.getRepository(ContentItem);
  const activityRepo = app.db.getRepository(Activity);

  const hash = await bcrypt.hash("password123", 10);

  const studentUser = userRepo.create({ email: "student@mediq.com", displayName: "Alex Chen", passwordHash: hash, role: "student" });
  await userRepo.save(studentUser);
  const sp = studentProfileRepo.create({ user: studentUser, age: 16, interests: ["cardiology", "neurology"], learningLevel: "beginner", progressData: {} });
  await studentProfileRepo.save(sp);

  const specUser1 = userRepo.create({ email: "sarah@mediq.com", displayName: "Dr. Sarah Lim", passwordHash: hash, role: "specialist" });
  await userRepo.save(specUser1);
  const profile1 = profileRepo.create({
    user: specUser1,
    fullName: "Dr. Sarah Lim",
    specialty: "Cardiology",
    credentials: "MBBS, MRCP (UK), FAMS",
    bio: "Senior Cardiologist at SGH with 15 years of experience in interventional cardiology.",
    institution: "Singapore General Hospital",
    location: "Singapore",
    linkedinConnections: 420,
    googleRating: 4.8,
    googleReviewCount: 89,
    verified: true,
    verifiedAt: new Date(),
  });
  await profileRepo.save(profile1);
  const rs1 = rankingRepo.create({ specialist: profile1, curationPoints: 24, activityPoints: 350, externalScore: 27.24, totalScore: 401.24, badge: "distinguished", rank: 1 });
  await rankingRepo.save(rs1);

  const specUser2 = userRepo.create({ email: "raj@mediq.com", displayName: "Dr. Raj Patel", passwordHash: hash, role: "specialist" });
  await userRepo.save(specUser2);
  const profile2 = profileRepo.create({
    user: specUser2,
    fullName: "Dr. Raj Patel",
    specialty: "Neurology",
    credentials: "MBBS, MD (Neurology), FRCP",
    bio: "Neurologist specializing in stroke management and neuro-critical care.",
    institution: "National Neuroscience Institute",
    location: "Singapore",
    linkedinConnections: 310,
    googleRating: 4.6,
    googleReviewCount: 54,
    verified: true,
    verifiedAt: new Date(),
  });
  await profileRepo.save(profile2);
  const rs2 = rankingRepo.create({ specialist: profile2, curationPoints: 18, activityPoints: 200, externalScore: 24.62, totalScore: 242.62, badge: "elevated", rank: 2 });
  await rankingRepo.save(rs2);

  const specUser3 = userRepo.create({ email: "priya@mediq.com", displayName: "Dr. Priya Nair", passwordHash: hash, role: "specialist" });
  await userRepo.save(specUser3);
  const profile3 = profileRepo.create({
    user: specUser3,
    fullName: "Dr. Priya Nair",
    specialty: "Paediatrics",
    credentials: "MBBS, MRCPCH, FAMS",
    bio: "Paediatrician with expertise in neonatology and child development.",
    institution: "KK Women's and Children's Hospital",
    location: "Singapore",
    linkedinConnections: 180,
    googleRating: 4.9,
    googleReviewCount: 120,
    verified: true,
    verifiedAt: new Date(),
  });
  await profileRepo.save(profile3);
  const rs3 = rankingRepo.create({ specialist: profile3, curationPoints: 12, activityPoints: 90, externalScore: 23.56, totalScore: 125.56, badge: "standard", rank: 3 });
  await rankingRepo.save(rs3);

  const contentItems = [
    {
      source: "youtube" as const,
      externalId: "Vf9fVXsXCFk",
      title: "How the Heart Works – Cardiac Physiology Explained",
      description: "A clear, animated explainer on how the heart pumps blood through the cardiovascular system. Perfect for students aged 11-18.",
      url: "https://www.youtube.com/watch?v=Vf9fVXsXCFk",
      thumbnailUrl: "https://img.youtube.com/vi/Vf9fVXsXCFk/hqdefault.jpg",
      channelName: "Osmosis",
      specialtyTags: ["cardiology"],
      ageSuitability: "11-14" as const,
      aiQualityScore: 4.7,
      status: "approved" as const,
      approveCount: 3,
      viewCount: 12400,
    },
    {
      source: "youtube" as const,
      externalId: "aR8d8GDXL8Y",
      title: "Stroke: Pathophysiology, Symptoms & Treatment",
      description: "Comprehensive overview of ischemic and hemorrhagic stroke for older students and pre-med learners.",
      url: "https://www.youtube.com/watch?v=aR8d8GDXL8Y",
      thumbnailUrl: "https://img.youtube.com/vi/aR8d8GDXL8Y/hqdefault.jpg",
      channelName: "Armando Hasudungan",
      specialtyTags: ["neurology"],
      ageSuitability: "15-18" as const,
      aiQualityScore: 4.5,
      status: "approved" as const,
      approveCount: 3,
      viewCount: 8900,
    },
    {
      source: "youtube" as const,
      externalId: "h9oDTMXbTAE",
      title: "What Does a Surgeon Actually Do?",
      description: "A day in the life of a general surgeon – operating theatres, patient rounds and decision making.",
      url: "https://www.youtube.com/watch?v=h9oDTMXbTAE",
      thumbnailUrl: "https://img.youtube.com/vi/h9oDTMXbTAE/hqdefault.jpg",
      channelName: "Medscape",
      specialtyTags: ["surgery"],
      ageSuitability: "all" as const,
      aiQualityScore: 4.2,
      status: "approved" as const,
      approveCount: 3,
      viewCount: 5600,
    },
    {
      source: "youtube" as const,
      externalId: "T0JlMFdnlro",
      title: "Cancer Immunotherapy Explained",
      description: "Pending review – recent video on CAR-T cell therapy breakthroughs. Awaiting specialist curation.",
      url: "https://www.youtube.com/watch?v=T0JlMFdnlro",
      thumbnailUrl: "https://img.youtube.com/vi/T0JlMFdnlro/hqdefault.jpg",
      channelName: "TED-Ed",
      specialtyTags: ["oncology"],
      ageSuitability: "15-18" as const,
      aiQualityScore: 4.8,
      status: "pending" as const,
      approveCount: 1,
      viewCount: 980,
    },
  ];

  for (const c of contentItems) {
    await contentRepo.save(contentRepo.create(c));
  }

  const activities = [
    {
      specialist: profile1,
      type: "workshop" as const,
      title: "Cardiac Auscultation Masterclass",
      description: "Hands-on workshop teaching medical students to identify heart murmurs using real patient recordings.",
      location: "SGH Auditorium, Block 4",
      activityDate: "2025-03-15",
      participantsCount: 38,
      verified: true,
    },
    {
      specialist: profile1,
      type: "school_visit" as const,
      title: "Raffles Junior College Career Talk",
      description: "Interactive talk with JC students on careers in cardiology and the medical journey.",
      location: "Raffles Junior College",
      activityDate: "2025-02-10",
      participantsCount: 90,
      verified: true,
    },
    {
      specialist: profile2,
      type: "webinar" as const,
      title: "Stroke Prevention for Young Adults",
      description: "Online webinar covering lifestyle risk factors and early warning signs of stroke.",
      location: "Online (Zoom)",
      activityDate: "2025-04-02",
      participantsCount: 65,
      verified: true,
    },
  ];

  for (const a of activities) {
    await activityRepo.save(activityRepo.create(a));
  }

  console.log("✅ MEDIQ seed data loaded.");
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
