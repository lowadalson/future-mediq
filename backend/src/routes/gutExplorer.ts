import { FastifyInstance } from "fastify";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const IMAGE_MODEL = "bytedance-seed/seedream-4.5";
const TEXT_MODEL = "google/gemini-2.5-flash";

const STYLE =
  "Isometric hand-drawn educational illustration, soft pastel colours, clean thin outlines, " +
  "subtle shading, labelled parts with small callout text, white background, friendly textbook style.";

type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type Payload = {
  model: string;
  messages: { role: string; content: string | ContentPart[] }[];
  modalities?: string[];
};

async function callOpenRouter(apiKey: string, payload: Payload) {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://mediq.app",
      "X-Title": "MEDIQ GI Explorer",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json();
}

type ORMessage = {
  content?: unknown;
  images?: { image_url?: { url?: string } }[];
};
type ORResponse = {
  choices?: { message?: ORMessage }[];
  error?: { message?: string } | string;
};

// Generate an image via the image model, retrying transient failures where the
// provider returns a 200 with no image (or throws). Returns the image URL and
// the raw message (so callers can also read any text/caption it produced).
async function generateImage(
  apiKey: string,
  prompt: string,
  log: FastifyInstance["log"],
  attempts = 3
): Promise<{ imageUrl: string; message: ORMessage }> {
  let lastErr = "model returned no image";
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const data = (await callOpenRouter(apiKey, {
        model: IMAGE_MODEL,
        modalities: ["image"],
        messages: [{ role: "user", content: prompt }],
      })) as ORResponse;
      const message = data.choices?.[0]?.message;
      const imageUrl =
        message && Array.isArray(message.images) && message.images.length > 0
          ? message.images[0]?.image_url?.url ?? null
          : null;
      if (imageUrl && message) return { imageUrl, message };
      lastErr =
        typeof data.error === "string"
          ? data.error
          : data.error?.message ?? "model returned no image";
    } catch (e) {
      lastErr = e instanceof Error ? e.message : String(e);
    }
    log.warn({ attempt, lastErr: lastErr.slice(0, 300) }, "image generation failed, retrying");
  }
  throw new Error(`Image model failed after ${attempts} attempts: ${lastErr.slice(0, 300)}`);
}

function extractText(message: { content?: unknown }): string {
  if (typeof message.content === "string") return message.content;
  if (Array.isArray(message.content)) {
    return message.content
      .filter((p: { type?: string }) => p.type === "text")
      .map((p: { text?: string }) => p.text ?? "")
      .join("");
  }
  return "";
}

function parseStructure(raw: string, fallbackLabel = "") {
  let label = fallbackLabel;
  const m = raw.match(/STRUCTURE:\s*(.+)/i);
  if (m) label = m[1].trim().split("\n")[0];
  const caption = raw.replace(/STRUCTURE:\s*.+/i, "").trim();
  return { label, caption };
}

type Body = {
  mode?: "base" | "drill";
  image?: string;
  x?: number;
  y?: number;
  parentLabel?: string;
};

export default async function gutExplorerRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Body }>("/", async (request, reply) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey || apiKey === "your_openrouter_key_here") {
      return reply.status(500).send({ error: "OPENROUTER_API_KEY not configured" });
    }

    const body = request.body ?? {};
    const mode: "base" | "drill" = body.mode === "drill" ? "drill" : "base";

    try {
      // ----- BASE MODE: single illustration of the whole GI system -----
      if (mode === "base") {
        const imageContent =
          `Generate a single educational illustration of the complete human gastrointestinal (digestive) system. ` +
          `Show and clearly label: oesophagus, stomach, liver, gallbladder, pancreas, small intestine, large intestine (colon), and rectum. ` +
          `${STYLE} ` +
          `Then, after the image, write one short paragraph (2-3 sentences) introducing the digestive system for a student.`;

        const { imageUrl, message } = await generateImage(apiKey, imageContent, fastify.log);
        const caption = extractText(message).replace(/```[\s\S]*?```/g, "").trim();
        return reply.send({
          imageUrl,
          label: "Gastrointestinal System",
          caption,
          parentLabel: "Gastrointestinal System",
        });
      }

      // ----- DRILL MODE: identify first, then generate from the explicit name -----
      const prevImage = body.image;
      const x: number = typeof body.x === "number" ? body.x : 0.5;
      const y: number = typeof body.y === "number" ? body.y : 0.5;
      const parentLabel: string = body.parentLabel || "Gastrointestinal System";

      if (!prevImage) {
        return reply.status(400).send({ error: "image is required for drill mode" });
      }

      const pctX = Math.round(x * 100);
      const pctY = Math.round(y * 100);

      // Step 1: identify the clicked structure. The client draws a bright red
      // crosshair/dot on the image at the click point — vision models read a
      // visible marker far more reliably than percentage coordinates.
      const identifyContent: ContentPart[] = [
        {
          type: "text",
          text:
            `This is an anatomy illustration of the "${parentLabel}". ` +
            `A bright red circular marker with a crosshair has been drawn on the image to indicate exactly where the user clicked ` +
            `(near ${pctX}% from the left, ${pctY}% from the top). ` +
            `Identify the single organ or anatomical structure that lies directly under the centre of the red marker. ` +
            `Ignore the red marker itself and any label text boxes — name the underlying drawn organ. ` +
            `Be precise: the pancreas, stomach, liver and small intestine sit close together. ` +
            `Respond with the organ name on the first line prefixed exactly with "STRUCTURE: ", ` +
            `then a short paragraph (2-3 sentences) explaining that organ for a student.`,
        },
        { type: "image_url", image_url: { url: prevImage } },
      ];

      const identified = await callOpenRouter(apiKey, {
        model: TEXT_MODEL,
        messages: [{ role: "user", content: identifyContent }],
      })
        .then((d) => parseStructure(extractText((d as ORResponse).choices?.[0]?.message ?? {})))
        .catch(() => ({ label: "", caption: "" }));

      const structureName = (identified.label || "the clicked structure")
        .replace(/^\*+|\*+$/g, "")
        .trim();

      // Step 2: generate a zoomed-in illustration of the IDENTIFIED structure by name,
      // so the image always matches the label.
      const imageContent =
        `Generate a detailed, zoomed-in educational illustration of the human ${structureName} ` +
        `(part of the ${parentLabel}). Show its internal anatomy and sub-parts, clearly labelled with callout text. ${STYLE}`;

      const { imageUrl } = await generateImage(apiKey, imageContent, fastify.log);

      const label = structureName.replace(/^\w/, (c) => c.toUpperCase());
      const caption = (identified.caption || "").replace(/```[\s\S]*?```/g, "").trim();

      return reply.send({ imageUrl, label, caption, parentLabel });
    } catch (e) {
      return reply
        .status(500)
        .send({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  });
}
