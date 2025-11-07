import { TREND_CATEGORIES } from "./categories";

export type YouTubeTrendVideo = {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  languageCode?: string;
  thumbnails: {
    url: string;
    width: number;
    height: number;
  };
  categoryId: string;
  tags?: string[];
  regionRestriction?: {
    allowed?: string[];
    blocked?: string[];
  };
};

export type TrendRequestPayload = {
  categoryId: string;
  maxResults: number;
  query?: string;
  freshness?: "24h" | "7d" | "30d";
  language?: string;
};

export type TrendResponse = {
  videos: YouTubeTrendVideo[];
  metadata: {
    generatedAt: string;
    categoryLabel: string;
  };
};

export const FALLBACK_VIDEOS: YouTubeTrendVideo[] = [
  {
    id: "fallback1",
    title: "Unable to fetch live data without YOUTUBE_API_KEY",
    channelTitle: "Configuration Required",
    description:
      "Set the YOUTUBE_API_KEY environment variable to enable live trend research.",
    publishedAt: new Date().toISOString(),
    viewCount: 0,
    thumbnails: {
      url: "https://dummyimage.com/480x270/1e293b/94a3b8&text=Configure+API+Key",
      width: 480,
      height: 270
    },
    categoryId: "0"
  }
];

export function resolveCategoryLabel(categoryId: string): string {
  return (
    TREND_CATEGORIES.find((category) => category.id === categoryId)?.label ??
    "All"
  );
}
