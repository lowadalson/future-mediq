// Thin client for Bright Data's SERP API (direct API access).
// Docs: https://docs.brightdata.com/scraping-automation/serp-api/send-your-first-request
const BRIGHTDATA_ENDPOINT = "https://api.brightdata.com/request";

export type OrganicResult = {
  title: string;
  link: string;
  description: string | null;
  image: string | null;
};

// A Google "knowledge panel" (the info card for a place/person/org), which is
// where Google surfaces ratings, review counts and contact details.
export type KnowledgePanel = {
  name: string | null;
  rating: number | null;
  reviewsCount: number | null;
  site: string | null;
};

// Parses a possibly-formatted numeric string (e.g. "4.8", "679", "1,234") to a number.
function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

// Runs a single Google search through the SERP API and returns the full parsed
// JSON response. Appending `brd_json=1` makes Bright Data return parsed JSON.
async function fetchSerpJson(
  query: string,
  opts: { num?: number; country?: string } = {}
): Promise<Record<string, unknown>> {
  const apiKey = process.env.BRIGHTDATA_API_KEY;
  const zone = process.env.BRIGHTDATA_SERP_ZONE || "serp_api1";
  if (!apiKey || apiKey === "your_brightdata_key_here") {
    throw new Error("BRIGHTDATA_API_KEY not configured");
  }

  const { num = 10, country = "sg" } = opts;
  const target =
    `https://www.google.com/search?q=${encodeURIComponent(query)}` +
    `&brd_json=1&num=${num}&hl=en&gl=${country}`;

  const res = await fetch(BRIGHTDATA_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ zone, url: target, format: "raw" }),
  });

  if (!res.ok) {
    throw new Error(`Bright Data SERP request failed (${res.status}): ${await res.text()}`);
  }

  const raw = await res.text();
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("Bright Data returned a non-JSON response (is brd_json supported on this zone?)");
  }
}

// Run a single Google search and return organic results.
export async function serpSearch(
  query: string,
  opts: { num?: number; country?: string } = {}
): Promise<OrganicResult[]> {
  const data = await fetchSerpJson(query, opts);

  const organic = ((data.organic ?? data.results ?? []) as Array<{
    title?: string;
    link?: string;
    url?: string;
    description?: string;
    snippet?: string;
    image?: string;
  }>);

  return organic
    .map((o) => ({
      title: (o.title ?? "").trim(),
      link: (o.link ?? o.url ?? "").trim(),
      description: (o.description ?? o.snippet ?? "").trim() || null,
      image: o.image ?? null,
    }))
    .filter((o) => o.title && o.link);
}

// Run a single Google search and return the knowledge-panel data (rating,
// review count, etc.) if Google surfaced one, otherwise null.
export async function serpKnowledge(
  query: string,
  opts: { num?: number; country?: string } = {}
): Promise<KnowledgePanel | null> {
  const data = await fetchSerpJson(query, opts);
  const k = data.knowledge as
    | { name?: string; rating?: unknown; reviews_cnt?: unknown; site?: string }
    | undefined;
  if (!k) return null;

  return {
    name: k.name ?? null,
    rating: toNumber(k.rating),
    reviewsCount: toNumber(k.reviews_cnt),
    site: k.site ?? null,
  };
}
