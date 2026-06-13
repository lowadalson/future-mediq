import { FastifyInstance } from "fastify";
import crypto from "crypto";

const MOONSHOT_BASE = "https://api.moonshot.ai/v1";
const DEFAULT_MODEL = "kimi-latest";

const SENSENOVA_URL = "https://api.sensenova.cn/v1/llm/chat-completions";
const SENSENOVA_DEFAULT_MODEL = "SenseChat-5";

const TOKENROUTER_BASE = "https://api.tokenrouter.com/v1";
const MINIMAX_DEFAULT_MODEL = "MiniMax-M3";
const SEED_DEFAULT_MODEL = "seed-2-0-mini-260428";

const KIMI_PERSONA =
  "You are Dr. Kimi, the 'Knowledge Navigation Expert' on MEDIQ Live — a competitive panel of AI doctors " +
  "answering gut-health questions. You are powered by Moonshot AI's Kimi model. Your distinctive voice blends " +
  "Traditional Chinese Medicine concepts (脾胃, 肝, 湿热, etc.) and East Asian clinical research with modern, " +
  "evidence-based microbiome and gastroenterology science. Cite specific studies, institutions, or quantitative " +
  "findings where credible. Write a single confident, information-dense paragraph of 3-5 sentences (no lists, no " +
  "headings, no preamble like 'As Dr. Kimi'). This is an educational simulation, not medical advice.";

const NOVA_PERSONA =
  "You are Dr. Nova, the 'Analytical Data Pathologist' on MEDIQ Live — a competitive panel of AI doctors " +
  "answering gut-health questions. You are powered by SenseTime's SenseNova model. Your distinctive voice is " +
  "precise, quantitative, and data-driven, emphasising AI-powered diagnostics, multi-omics analysis, biosensor " +
  "fusion, and population-scale predictive modelling for gut health. Cite specific metrics, cohort sizes, AUC/accuracy " +
  "figures, or model performance where credible. Write a single confident, information-dense paragraph of 3-5 sentences " +
  "(no lists, no headings, no preamble like 'As Dr. Nova'). This is an educational simulation, not medical advice.";

const MINIMAX_PERSONA =
  "You are Dr. Minimax, the 'Long-Context Reasoning Virtuoso' on MEDIQ Live — a competitive panel of AI doctors " +
  "answering gut-health questions. You are powered by MiniMax's M3 model, accessed via TokenRouter. Your distinctive " +
  "voice integrates very large bodies of evidence at once — synthesising across multi-omics, longitudinal cohorts, " +
  "and conflicting trials — and reasons explicitly about trade-offs, optimisation, and cost-effectiveness of " +
  "interventions. Cite specific studies, effect sizes, or quantitative trade-offs where credible. Write a single " +
  "confident, information-dense paragraph of 3-5 sentences (no lists, no headings, no preamble like 'As Dr. Minimax'). " +
  "This is an educational simulation, not medical advice.";

const SEED_PERSONA =
  "You are Dr. Seed, the 'Generative Research Strategist' on MEDIQ Live — a competitive panel of AI doctors " +
  "answering gut-health questions. You are powered by ByteDance's Seed model (seed-2-0-mini), accessed via TokenRouter. " +
  "Your distinctive voice is research-forward and forward-looking, emphasising emerging science, generative and " +
  "computational modelling of the microbiome, large-scale population data, and personalised, precision approaches to " +
  "gut health. Cite specific studies, cohort sizes, or emerging findings where credible. Write a single confident, " +
  "information-dense paragraph of 3-5 sentences (no lists, no headings, no preamble like 'As Dr. Seed'). This is an " +
  "educational simulation, not medical advice.";

type ChatResponse = {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string } | string;
};

// SenseNova non-streaming response: data.choices[].message is a string
type SenseNovaResponse = {
  data?: {
    choices?: { message?: string; finish_reason?: string }[];
  };
  status?: { code?: number; message?: string };
  error?: { message?: string };
};

type Body = { question?: string };

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Generates a short-lived HS256 JWT from SenseNova Access Key ID + Secret Access Key.
function generateSenseNovaToken(accessKeyId: string, secretAccessKey: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: accessKeyId, exp: now + 1800, nbf: now - 5 };
  const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signature = crypto.createHmac("sha256", secretAccessKey).update(signingInput).digest();
  return `${signingInput}.${base64url(signature)}`;
}

// Calls a TokenRouter (OpenAI-compatible) chat model and returns the answer text.
async function callTokenRouter(apiKey: string, model: string, persona: string, question: string): Promise<string> {
  const res = await fetch(`${TOKENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.6,
      messages: [
        { role: "system", content: persona },
        { role: "user", content: question },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = (await res.json()) as ChatResponse;
  const answer = data.choices?.[0]?.message?.content?.trim();
  if (!answer) {
    const msg =
      typeof data.error === "string"
        ? data.error
        : data.error?.message ?? "TokenRouter returned no answer";
    throw new Error(msg);
  }
  return answer;
}

export default async function gutPanelRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: Body }>("/kimi", async (request, reply) => {
    const apiKey = process.env.KIMI_API_KEY;
    if (!apiKey || apiKey === "your_moonshot_kimi_key_here") {
      return reply.status(500).send({ error: "KIMI_API_KEY not configured" });
    }

    const question = (request.body?.question ?? "").trim();
    if (!question) {
      return reply.status(400).send({ error: "question is required" });
    }

    try {
      const res = await fetch(`${MOONSHOT_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.KIMI_MODEL || DEFAULT_MODEL,
          temperature: 0.6,
          messages: [
            { role: "system", content: KIMI_PERSONA },
            { role: "user", content: question },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as ChatResponse;
      const answer = data.choices?.[0]?.message?.content?.trim();
      if (!answer) {
        const msg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message ?? "Kimi returned no answer";
        throw new Error(msg);
      }

      return reply.send({ answer });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      fastify.log.error({ err: message.slice(0, 300) }, "Kimi panel request failed");
      return reply.status(500).send({ error: message.slice(0, 300) });
    }
  });

  fastify.post<{ Body: Body }>("/sensenova", async (request, reply) => {
    // Auth can be provided either as a single API key (used directly as a Bearer
    // token) or as an Access Key ID + Secret Key pair (signed into a short-lived JWT).
    const apiKey = process.env.SENSENOVA_API_KEY;
    const accessKeyId = process.env.SENSENOVA_ACCESS_KEY_ID;
    const secretAccessKey = process.env.SENSENOVA_SECRET_ACCESS_KEY;
    const hasApiKey = !!apiKey && apiKey !== "your_sensenova_api_key_here";
    const hasKeyPair =
      !!accessKeyId &&
      !!secretAccessKey &&
      accessKeyId !== "your_sensenova_access_key_id_here" &&
      secretAccessKey !== "your_sensenova_secret_access_key_here";
    if (!hasApiKey && !hasKeyPair) {
      return reply
        .status(500)
        .send({ error: "SENSENOVA_API_KEY (or SENSENOVA_ACCESS_KEY_ID / SENSENOVA_SECRET_ACCESS_KEY) not configured" });
    }

    const question = (request.body?.question ?? "").trim();
    if (!question) {
      return reply.status(400).send({ error: "question is required" });
    }

    try {
      const token = hasApiKey ? (apiKey as string) : generateSenseNovaToken(accessKeyId as string, secretAccessKey as string);
      const res = await fetch(SENSENOVA_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.SENSENOVA_MODEL || SENSENOVA_DEFAULT_MODEL,
          stream: false,
          temperature: 0.6,
          max_new_tokens: 1024,
          messages: [
            { role: "system", content: NOVA_PERSONA },
            { role: "user", content: question },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as SenseNovaResponse;
      const answer = data.data?.choices?.[0]?.message?.trim();
      if (!answer) {
        const msg =
          data.status?.message ?? data.error?.message ?? "SenseNova returned no answer";
        throw new Error(msg);
      }

      return reply.send({ answer });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      fastify.log.error({ err: message.slice(0, 300) }, "SenseNova panel request failed");
      return reply.status(500).send({ error: message.slice(0, 300) });
    }
  });

  fastify.post<{ Body: Body }>("/minimax", async (request, reply) => {
    const apiKey = process.env.TOKENROUTER_API_KEY;
    if (!apiKey || apiKey === "your_tokenrouter_key_here") {
      return reply.status(500).send({ error: "TOKENROUTER_API_KEY not configured" });
    }

    const question = (request.body?.question ?? "").trim();
    if (!question) {
      return reply.status(400).send({ error: "question is required" });
    }

    try {
      const answer = await callTokenRouter(
        apiKey,
        process.env.MINIMAX_MODEL || MINIMAX_DEFAULT_MODEL,
        MINIMAX_PERSONA,
        question
      );
      return reply.send({ answer });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      fastify.log.error({ err: message.slice(0, 300) }, "MiniMax panel request failed");
      return reply.status(500).send({ error: message.slice(0, 300) });
    }
  });

  fastify.post<{ Body: Body }>("/seed", async (request, reply) => {
    const apiKey = process.env.TOKENROUTER_API_KEY;
    if (!apiKey || apiKey === "your_tokenrouter_key_here") {
      return reply.status(500).send({ error: "TOKENROUTER_API_KEY not configured" });
    }

    const question = (request.body?.question ?? "").trim();
    if (!question) {
      return reply.status(400).send({ error: "question is required" });
    }

    try {
      const answer = await callTokenRouter(
        apiKey,
        process.env.SEED_MODEL || SEED_DEFAULT_MODEL,
        SEED_PERSONA,
        question
      );
      return reply.send({ answer });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      fastify.log.error({ err: message.slice(0, 300) }, "Seed panel request failed");
      return reply.status(500).send({ error: message.slice(0, 300) });
    }
  });
}
