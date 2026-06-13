// Thin client for Bright Data's SERP API (direct API access).
// Docs: https://docs.brightdata.com/scraping-automation/serp-api/send-your-first-request
const BRIGHTDATA_ENDPOINT = "https://api.brightdata.com/request";

export type OrganicResult = {
  title: string;
  link: string;
  description: string | null;
  image: string | null;
};

// Run a single Google search through the SERP API and return organic results.
// Appending `brd_json=1` makes Bright Data return parsed JSON instead of HTML.
export async function serpSearch(
  query: string,
  opts: { num?: number; country?: string } = {}
): Promise<OrganicResult[]> {
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
  let data: { organic?: unknown[]; results?: unknown[] };
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error("Bright Data returned a non-JSON response (is brd_json supported on this zone?)");
  }

  const organic = (data.organic ?? data.results ?? []) as Array<{
    title?: string;
    link?: string;
    url?: string;
    description?: string;
    snippet?: string;
    image?: string;
  }>;

  return organic
    .map((o) => ({
      title: (o.title ?? "").trim(),
      link: (o.link ?? o.url ?? "").trim(),
      description: (o.description ?? o.snippet ?? "").trim() || null,
      image: o.image ?? null,
    }))
    .filter((o) => o.title && o.link);
}
