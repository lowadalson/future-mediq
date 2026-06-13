# MEDIQ

MEDIQ is a healthcare career-discovery and knowledge platform that connects **students**, **specialists**, and **institutions**. Students explore medical careers and learn from curated content, specialists build their reputation and impact, and institutions inspire the next generation of healthcare professionals.

The platform combines a curated knowledge base with AI-powered exploration tools to make medical learning engaging and accessible.

## Features

- **Discovery AI** — AI-powered career exploration and personalized learning journeys.
- **Knowledge Universe** — Curated videos, podcasts, articles, and research organized by specialty.
- **GI Explorer / Gut Series** — Interactive, AI-generated educational illustrations and explainers of the human digestive system.
- **MEDIQ Live (Virtual Panel)** — A panel of distinct AI "doctors", each with its own persona and area of expertise, answering gut-health questions in real time.
- **Specialist Curator Network** — Verified specialists ensure content quality, relevance, and trustworthiness.
- **Specialist Impact Engine** — A transparent SIS™ score measuring impact across EQ, CQ, TQ, RQ, and IQ dimensions.
- **Specialist Universe** — Connect with specialists, institutions, communities, and opportunities.
- **Medical Discovery Workshops** — Real-world exposure experiences designed to inspire curiosity.

## Tech Stack

**Frontend**
- React 18 + TypeScript
- Vite (dev server & build)
- Material UI (MUI) + Emotion
- React Router
- Axios

**Backend**
- Fastify + TypeScript
- TypeORM
- SQLite (better-sqlite3)
- JWT authentication (`@fastify/jwt`) + bcrypt password hashing

**External APIs**

MEDIQ integrates several third-party APIs to power its AI and content features:

- **OpenRouter** — text and image generation for Discovery AI and the GI Explorer (Gemini and Seedream models).
- **Moonshot AI (Kimi)** — powers the "Dr. Kimi" panelist.
- **SenseNova (SenseTime)** — powers the "Dr. Nova" panelist.
- **TokenRouter (MiniMax & ByteDance Seed)** — powers the "Dr. Minimax" and "Dr. Seed" panelists.
- **Bright Data SERP API** — discovers and curates external knowledge-base content.

## Project Structure

```
future-mediq/
├── backend/          # Fastify + TypeORM API
│   ├── src/
│   │   ├── entities/   # TypeORM data models
│   │   ├── routes/     # API route handlers
│   │   ├── lib/        # Helpers (ranking calc, Bright Data client)
│   │   ├── plugins/    # Fastify plugins (database)
│   │   └── index.ts    # App bootstrap, route registration, seeding
│   └── .env.example
└── frontend/         # React + Vite client
    └── src/
        ├── pages/      # Route pages (Landing, Dashboard, etc.)
        ├── components/ # Shared UI components
        ├── contexts/   # Auth context
        └── api/        # Axios client & shared types
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The API runs on `http://localhost:3001`.

#### Environment variables (`backend/.env`)

```
DATABASE_URL=postgres://postgres:password@localhost:5432/mediq
JWT_SECRET=change-in-production
PORT=3001

# AI / content APIs
OPENROUTER_API_KEY=your_openrouter_key_here
BRIGHTDATA_API_KEY=your_brightdata_key_here
BRIGHTDATA_SERP_ZONE=serp_api1
KIMI_API_KEY=your_moonshot_kimi_key_here
KIMI_MODEL=kimi-latest
SENSENOVA_API_KEY=your_sensenova_api_key_here
SENSENOVA_ACCESS_KEY_ID=your_sensenova_access_key_id_here
SENSENOVA_SECRET_ACCESS_KEY=your_sensenova_secret_access_key_here
SENSENOVA_MODEL=SenseChat-5
TOKENROUTER_API_KEY=your_tokenrouter_key_here
MINIMAX_MODEL=MiniMax-M3
SEED_MODEL=seed-2-0-mini-260428
```

> **Note:** Never commit your real `.env` file. API keys should be kept secret and configured per environment.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on `http://localhost:3000` and proxies `/api` requests to the backend at `http://127.0.0.1:3001`.

## Available Scripts

**Backend**
- `npm run dev` — start the API in watch mode
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run the compiled server

**Frontend**
- `npm run dev` — start the Vite dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build

## API Overview

All routes are prefixed with `/api`:

| Prefix                 | Description                                  |
|------------------------|----------------------------------------------|
| `/api/auth`            | Register, login, current user                |
| `/api/specialists`     | Specialist profiles                          |
| `/api/content`         | Knowledge-base content items                 |
| `/api/activities`      | Specialist activities                        |
| `/api/rankings`        | Ranking scores                               |
| `/api/specialties`     | Specialty fields                             |
| `/api/notifications`   | User notifications                           |
| `/api/gut-explorer`    | AI-generated GI illustrations & explainers   |
| `/api/knowledge`       | Knowledge search & curation                  |
| `/api/gut-panel`       | MEDIQ Live multi-model AI panel              |

A health check is available at `GET /health`.

## Authentication

MEDIQ uses JWT-based authentication. On login or registration the API returns a token, which the frontend stores in `localStorage` and attaches to subsequent requests via an Axios interceptor. Three roles are supported: `student`, `specialist`, and `admin`.
