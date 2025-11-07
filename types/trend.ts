import type { YouTubeTrendVideo } from "@/lib/youtube";

export type TrendInsight = {
  summary: string;
  growthDrivers: string[];
  riskFactors: string[];
  audienceNotes: string[];
};

export type TrendAgentReport = {
  generatedAt: string;
  primarySignals: {
    category: string;
    freshness: string;
    keyword?: string;
  };
  spotlightVideos: YouTubeTrendVideo[];
  insights?: TrendInsight;
};
