# BharatTube Pulse – YouTube Trend Research Agent

Agentic dashboard tailored for analysing the fastest growing YouTube narratives across India. Sweep trending feeds, focus on categories or keywords, and generate AI-backed insight reports ready for creator strategy, brand monitoring, or newsroom intelligence.

## Features

- Interactive control centre to focus scans by category, keyword, freshness window, and language.
- Live trend fetcher using the YouTube Data API (region locked to India).
- Spotlight cards highlighting metadata, engagement velocity, and direct watch links.
- Emerging signal detector that clusters recurring hashtags/topics.
- Insight panel with optional GPT-powered summaries (falls back to heuristic narratives).
- Responsive interface built with Next.js 14, Tailwind CSS, SWR, and Framer Motion animations.

## Prerequisites

- Node.js 18 or later.
- YouTube Data API v3 key (`YOUTUBE_API_KEY`).
- Optional: OpenAI API key (`OPENAI_API_KEY`) for richer insight generation.

## Environment Variables

Create a `.env.local` file in the project root:

```bash
YOUTUBE_API_KEY=your-google-api-key
# Optional – enables GPT insight synthesis
OPENAI_API_KEY=your-openai-api-key
```

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Testing & Quality

```bash
npm run lint
npm test
```

## Deployment

Build for production:

```bash
npm run build
```

Deploy easily to Vercel (recommended) or any Node-compatible host.

---

Crafted for rapid intelligence gathering on India’s dynamic YouTube landscape. Plug in your API keys and start scanning signals.
