import { FastifyInstance } from "fastify";
import { SpecialistProfile } from "../entities/SpecialistProfile";
import { serpSearch, serpKnowledge } from "./brightdata";
import { recalculateRanking } from "./rankingCalc";

// Web-sourced facts we try to pull for a specialist. Any field may be null when
// Google didn't surface that signal.
export type SpecialistEnrichment = {
  googleRating: number | null;
  googleReviewCount: number | null;
  linkedinUrl: string | null;
  linkedinConnections: number | null;
};

// Pulls "N connections" / "500+ connections" out of a LinkedIn result snippet.
function parseConnections(description: string | null): number | null {
  if (!description) return null;
  const m = description.match(/([\d,]+)\s*\+?\s*connections/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

// Runs the SERP queries for one specialist and returns whatever web data was found.
export async function fetchSpecialistEnrichment(
  profile: SpecialistProfile
): Promise<SpecialistEnrichment> {
  const result: SpecialistEnrichment = {
    googleRating: null,
    googleReviewCount: null,
    linkedinUrl: null,
    linkedinConnections: null,
  };

  // 1) Google rating / reviews via the knowledge panel. Anchoring on the
  // institution makes Google far more likely to return a rated place card.
  const ratingQuery = [profile.fullName, profile.institution, profile.location]
    .filter(Boolean)
    .join(" ");
  const knowledge = await serpKnowledge(ratingQuery);
  if (knowledge) {
    if (knowledge.rating != null && knowledge.rating > 0) result.googleRating = knowledge.rating;
    if (knowledge.reviewsCount != null && knowledge.reviewsCount > 0) {
      result.googleReviewCount = knowledge.reviewsCount;
    }
  }

  // 2) LinkedIn profile + connection count from the organic results.
  const linkedinQuery = [profile.fullName, profile.specialty, profile.location, "linkedin"]
    .filter(Boolean)
    .join(" ");
  const organic = await serpSearch(linkedinQuery, { num: 10 });
  const li = organic.find((o) => /linkedin\.com\/in\//i.test(o.link));
  if (li) {
    result.linkedinUrl = li.link;
    const conns = parseConnections(li.description);
    if (conns != null) result.linkedinConnections = conns;
  }

  return result;
}

// Enriches one specialist: fetches web data, applies only the fields we found,
// persists, and recalculates the ranking (external score depends on these).
export async function enrichSpecialist(
  fastify: FastifyInstance,
  profile: SpecialistProfile
): Promise<{ changed: Partial<SpecialistEnrichment & { linkedinUrl: string }> }> {
  const data = await fetchSpecialistEnrichment(profile);
  const changed: Partial<SpecialistEnrichment & { linkedinUrl: string }> = {};

  if (data.googleRating != null) {
    profile.googleRating = data.googleRating;
    changed.googleRating = data.googleRating;
  }
  if (data.googleReviewCount != null) {
    profile.googleReviewCount = data.googleReviewCount;
    changed.googleReviewCount = data.googleReviewCount;
  }
  if (data.linkedinConnections != null) {
    profile.linkedinConnections = data.linkedinConnections;
    changed.linkedinConnections = data.linkedinConnections;
  }
  // Only fill in a LinkedIn URL if we don't already have one (avoid clobbering
  // a curated link with a fuzzy search match).
  if (data.linkedinUrl != null && !profile.linkedinUrl) {
    profile.linkedinUrl = data.linkedinUrl;
    changed.linkedinUrl = data.linkedinUrl;
  }

  await fastify.db.getRepository(SpecialistProfile).save(profile);
  await recalculateRanking(fastify.db, profile.id);

  return { changed };
}

// Enriches every specialist in the directory. Returns a summary that mirrors the
// shape of the gut-search summary so the frontend can treat them similarly.
export async function runSpecialistEnrichment(fastify: FastifyInstance) {
  const repo = fastify.db.getRepository(SpecialistProfile);
  const specialists = await repo.find();

  let updated = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const profile of specialists) {
    try {
      const { changed } = await enrichSpecialist(fastify, profile);
      if (Object.keys(changed).length > 0) updated++;
      else skipped++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      fastify.log.error({ specialist: profile.fullName, err: msg }, "specialist enrichment failed");
      errors.push(`${profile.fullName}: ${msg}`);
    }
  }

  return { updated, skipped, total: specialists.length, errors };
}
