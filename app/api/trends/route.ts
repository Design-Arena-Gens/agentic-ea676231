import { NextResponse } from "next/server";
import {
  FALLBACK_VIDEOS,
  resolveCategoryLabel,
  type YouTubeTrendVideo
} from "@/lib/youtube";
import type { TrendAgentReport } from "@/types/trend";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

type RequestParams = {
  categoryId: string;
  maxResults: number;
  freshness: "24h" | "7d" | "30d";
  query?: string;
  language?: string;
};

const computePublishedAfter = (freshness: RequestParams["freshness"]) => {
  const now = new Date();
  switch (freshness) {
    case "24h":
      now.setDate(now.getDate() - 1);
      break;
    case "7d":
      now.setDate(now.getDate() - 7);
      break;
    case "30d":
      now.setDate(now.getDate() - 30);
      break;
  }
  return now.toISOString();
};

const normalizeVideo = (item: any): YouTubeTrendVideo => ({
  id: item.id,
  title: item.snippet?.title ?? "Untitled video",
  channelTitle: item.snippet?.channelTitle ?? "Unknown channel",
  description: item.snippet?.description ?? "",
  publishedAt: item.snippet?.publishedAt ?? new Date().toISOString(),
  viewCount: Number(item.statistics?.viewCount ?? 0),
  likeCount: item.statistics?.likeCount
    ? Number(item.statistics.likeCount)
    : undefined,
  commentCount: item.statistics?.commentCount
    ? Number(item.statistics.commentCount)
    : undefined,
  languageCode:
    item.snippet?.defaultAudioLanguage ??
    item.snippet?.defaultLanguage ??
    undefined,
  thumbnails:
    item.snippet?.thumbnails?.maxres ??
    item.snippet?.thumbnails?.standard ??
    item.snippet?.thumbnails?.high ??
    item.snippet?.thumbnails?.medium ?? {
      url: "https://dummyimage.com/480x270/1e293b/94a3b8&text=No+Image",
      width: 480,
      height: 270
    },
  categoryId: item.snippet?.categoryId ?? "0",
  tags: item.snippet?.tags,
  regionRestriction: item.contentDetails?.regionRestriction
});

const filterByLanguage = (videos: YouTubeTrendVideo[], language?: string) => {
  if (!language) return videos;
  return videos.filter((video) => {
    if (!video.languageCode) return true;
    return video.languageCode.startsWith(language);
  });
};

export async function GET(request: Request) {
  const envKey = process.env.YOUTUBE_API_KEY;
  const { searchParams } = new URL(request.url);

  const params: RequestParams = {
    categoryId: searchParams.get("categoryId") ?? "0",
    maxResults: Number(searchParams.get("maxResults") ?? 18),
    freshness: (searchParams.get("freshness") ?? "24h") as
      | "24h"
      | "7d"
      | "30d",
    query: searchParams.get("query") ?? undefined,
    language: searchParams.get("language") ?? undefined
  };

  params.maxResults = Math.min(Math.max(params.maxResults, 6), 50);

  if (!envKey) {
    const fallbackPayload: TrendAgentReport = {
      generatedAt: new Date().toISOString(),
      primarySignals: {
        category: resolveCategoryLabel(params.categoryId),
        freshness: params.freshness === "24h" ? "Last 24 hours" : params.freshness,
        keyword: params.query
      },
      spotlightVideos: FALLBACK_VIDEOS
    };
    return NextResponse.json(fallbackPayload);
  }

  const publishedAfter = computePublishedAfter(params.freshness);

  try {
    let videos: YouTubeTrendVideo[] = [];

    if (params.query) {
      const searchUrl = new URL(`${YOUTUBE_API_BASE}/search`);
      searchUrl.searchParams.set("part", "snippet");
      searchUrl.searchParams.set("regionCode", "IN");
      searchUrl.searchParams.set("type", "video");
      searchUrl.searchParams.set("maxResults", String(params.maxResults));
      searchUrl.searchParams.set("order", "viewCount");
      searchUrl.searchParams.set("q", params.query);
      searchUrl.searchParams.set("publishedAfter", publishedAfter);
      if (params.categoryId !== "0") {
        searchUrl.searchParams.set("videoCategoryId", params.categoryId);
      }
      if (params.language) {
        searchUrl.searchParams.set("relevanceLanguage", params.language);
      }
      searchUrl.searchParams.set("key", envKey);

      const searchResponse = await fetch(searchUrl.toString());
      if (!searchResponse.ok) {
        throw new Error(`YouTube search failed: ${searchResponse.statusText}`);
      }
      const searchJson = await searchResponse.json();
      const videoIds = searchJson.items.map((item: any) => item.id.videoId).join(",");

      if (videoIds) {
        const videoUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
        videoUrl.searchParams.set(
          "part",
          "snippet,statistics,contentDetails"
        );
        videoUrl.searchParams.set("id", videoIds);
        videoUrl.searchParams.set("key", envKey);

        const videoResponse = await fetch(videoUrl.toString());
        if (!videoResponse.ok) {
          throw new Error(`YouTube video details failed: ${videoResponse.statusText}`);
        }
        const videoJson = await videoResponse.json();
        videos = videoJson.items.map(normalizeVideo);
      }
    } else {
      const trendsUrl = new URL(`${YOUTUBE_API_BASE}/videos`);
      trendsUrl.searchParams.set(
        "part",
        "snippet,statistics,contentDetails"
      );
      trendsUrl.searchParams.set("chart", "mostPopular");
      trendsUrl.searchParams.set("regionCode", "IN");
      trendsUrl.searchParams.set("maxResults", String(params.maxResults));
      if (params.categoryId !== "0") {
        trendsUrl.searchParams.set("videoCategoryId", params.categoryId);
      }
      trendsUrl.searchParams.set("key", envKey);

      const trendsResponse = await fetch(trendsUrl.toString());
      if (!trendsResponse.ok) {
        throw new Error(`YouTube trending fetch failed: ${trendsResponse.statusText}`);
      }
      const trendsJson = await trendsResponse.json();
      const rawVideos = trendsJson.items ?? [];

      videos = rawVideos
        .map((item: any) => normalizeVideo(item))
        .filter(
          (video: YouTubeTrendVideo) =>
            new Date(video.publishedAt) >= new Date(publishedAfter)
        );
    }

    const filtered = filterByLanguage(videos, params.language);

    const sorted = filtered.sort((a, b) => b.viewCount - a.viewCount);

    const payload: TrendAgentReport = {
      generatedAt: new Date().toISOString(),
      primarySignals: {
        category: resolveCategoryLabel(params.categoryId),
        freshness:
          params.freshness === "24h"
            ? "Last 24 hours"
            : params.freshness === "7d"
              ? "Last 7 days"
              : "Last 30 days",
        keyword: params.query
      },
      spotlightVideos: sorted.slice(0, params.maxResults)
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        generatedAt: new Date().toISOString(),
        primarySignals: {
          category: resolveCategoryLabel(params.categoryId),
          freshness: params.freshness,
          keyword: params.query
        },
        spotlightVideos: FALLBACK_VIDEOS,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while retrieving trends."
      },
      { status: 500 }
    );
  }
}
