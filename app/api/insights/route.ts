import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { TrendInsight } from "@/types/trend";
import type { YouTubeTrendVideo } from "@/lib/youtube";

type InsightRequest = {
  videos: YouTubeTrendVideo[];
  signals?: {
    category: string;
    freshness: string;
    keyword?: string;
  };
};

const buildPrompt = (payload: InsightRequest) => {
  const headline = `You are an insights analyst for India's YouTube ecosystem. Provide a concise digest. Category: ${payload.signals?.category ?? "All"}, Freshness: ${payload.signals?.freshness ?? "Last 24 hours"}, Keyword focus: ${payload.signals?.keyword ?? "None"}.`;

  const videoLines = payload.videos
    .map(
      (video, index) =>
        `${index + 1}. "${video.title}" by ${video.channelTitle} (${video.viewCount.toLocaleString(
          "en-IN"
        )} views, published ${video.publishedAt}). Description: ${video.description.slice(0, 220)}`
    )
    .join("\n");

  return `${headline}

Top videos:
${videoLines}

Produce a JSON object with keys summary, growthDrivers (array), riskFactors (array), audienceNotes (array). Keep each bullet under 18 words.`;
};

const computeHeuristicInsight = (payload: InsightRequest): TrendInsight => {
  const topVideo = payload.videos[0];
  const averageViews =
    payload.videos.reduce((sum, video) => sum + video.viewCount, 0) /
    (payload.videos.length || 1);

  const summaryParts: string[] = [];
  if (payload.signals?.keyword) {
    summaryParts.push(
      `Keyword focus "${payload.signals.keyword}" is driving ${
        payload.videos.length
      } high-velocity uploads`
    );
  } else {
    summaryParts.push(
      `Category ${payload.signals?.category ?? "All"} shows ${
        payload.videos.length
      } uplifts`
    );
  }
  if (topVideo) {
    summaryParts.push(
      `Top creator ${topVideo.channelTitle} is leading with ${topVideo.viewCount.toLocaleString(
        "en-IN"
      )} views`
    );
  }
  summaryParts.push(
    `Average view velocity is ${averageViews.toLocaleString("en-IN")} views`
  );

  return {
    summary: summaryParts.join(". ") + ".",
    growthDrivers: [
      "Organic traction via YouTube home feed and Shorts crossover",
      "Narratives shaped by regional language creators with national reach",
      "Seasonal spike from ongoing events referenced in multiple uploads"
    ],
    riskFactors: [
      "Storyline saturation if creators reuse identical talking points",
      "Discovery dependent on continued algorithmic push within India",
      "Potential demonetisation if news commentary skirts policy lines"
    ],
    audienceNotes: [
      "Core viewers skew mobile-first from tier 2/3 cities",
      "Strong overlap with live conversation on X and Instagram Reels",
      "Expect higher retention when narratives tie into daily headlines"
    ]
  };
};

export async function POST(request: Request) {
  const payload = (await request.json()) as InsightRequest;

  if (!payload?.videos?.length) {
    return NextResponse.json(
      { error: "No videos supplied for insight generation." },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      insights: computeHeuristicInsight(payload),
      meta: { provider: "heuristic" }
    });
  }

  try {
    const client = new OpenAI({ apiKey });
    const prompt = buildPrompt(payload);
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "youtube_trend_insight",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              growthDrivers: {
                type: "array",
                items: { type: "string" }
              },
              riskFactors: {
                type: "array",
                items: { type: "string" }
              },
              audienceNotes: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["summary", "growthDrivers", "riskFactors", "audienceNotes"],
            additionalProperties: false
          }
        }
      }
    } as any);

    const text = (response as any)?.output?.[0]?.content?.[0]?.text;
    if (!text) {
      throw new Error("Insight generation returned empty response.");
    }
    const parsed = JSON.parse(text) as TrendInsight;

    return NextResponse.json({
      insights: parsed,
      meta: { provider: "openai" }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        insights: computeHeuristicInsight(payload),
        meta: {
          provider: "heuristic",
          error:
            error instanceof Error ? error.message : "Unknown insight provider error"
        }
      },
      { status: 200 }
    );
  }
}
