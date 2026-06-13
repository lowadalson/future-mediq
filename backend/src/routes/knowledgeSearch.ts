import { FastifyInstance } from "fastify";
import { ContentItem } from "../entities/ContentItem";
import { serpSearch } from "../lib/brightdata";

// Search queries used to populate the Gut Series knowledge base.
const GUT_QUERIES = [
  "human digestive system explained for students",
  "gastrointestinal tract anatomy",
  "how the stomach digests food",
  "gut microbiome explained",
  "small intestine function and structure",
];

const RESULTS_PER_QUERY = 6;

function hostname(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

// Runs all gut queries through Bright Data, dedupes by URL against existing
// content, and inserts new results as approved ContentItems. Exported so it can
// be reused by a scheduler later.
export async function runGutSearch(fastify: FastifyInstance) {
  const contentRepo = fastify.db.getRepository(ContentItem);

  const existing = await contentRepo.find({ select: { url: true } });
  const seen = new Set(existing.map((e) => e.url));

  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const query of GUT_QUERIES) {
    try {
      const results = await serpSearch(query, { num: RESULTS_PER_QUERY });
      for (const r of results.slice(0, RESULTS_PER_QUERY)) {
        if (seen.has(r.link)) {
          skipped++;
          continue;
        }
        seen.add(r.link);
        const item = contentRepo.create({
          source: "other",
          externalId: null,
          title: r.title,
          description: r.description,
          url: r.link,
          thumbnailUrl: r.image,
          channelName: hostname(r.link),
          specialtyTags: ["gastroenterology", "gut"],
          ageSuitability: "all",
          aiQualityScore: 0,
          status: "approved",
        });
        await contentRepo.save(item);
        added++;
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      fastify.log.error({ query, err: msg }, "gut search query failed");
      errors.push(`${query}: ${msg}`);
    }
  }

  return { added, skipped, queries: GUT_QUERIES.length, errors };
}

export default async function knowledgeSearchRoutes(fastify: FastifyInstance) {
  // Manual trigger. Cron scheduling can call runGutSearch() directly later.
  fastify.post("/gut-search", { preHandler: [fastify.authenticate] }, async (_request, reply) => {
    try {
      const summary = await runGutSearch(fastify);
      if (summary.added === 0 && summary.errors.length > 0) {
        return reply.status(502).send({ error: summary.errors[0], ...summary });
      }
      return summary;
    } catch (e) {
      return reply.status(500).send({ error: e instanceof Error ? e.message : "Search failed" });
    }
  });
}
