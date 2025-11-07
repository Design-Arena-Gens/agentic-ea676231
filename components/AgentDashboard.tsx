"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import { TREND_CATEGORIES } from "@/lib/categories";
import type { TrendAgentReport, TrendInsight } from "@/types/trend";
import type { YouTubeTrendVideo } from "@/lib/youtube";
import TrendCard from "./TrendCard";
import InsightPanel from "./InsightPanel";
import TrendSearchForm, { TrendSearchState } from "./TrendSearchForm";
import StatsDigest from "./StatsDigest";
import TrendingSignals from "./TrendingSignals";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  return response.json() as Promise<TrendAgentReport>;
};

const buildQueryString = (state: TrendSearchState) => {
  const params = new URLSearchParams();
  params.set("categoryId", state.categoryId);
  params.set("maxResults", String(state.maxResults));
  params.set("freshness", state.freshness);
  if (state.language) {
    params.set("language", state.language);
  }
  if (state.query) {
    params.set("query", state.query);
  }
  return params.toString();
};

export default function AgentDashboard() {
  const [formState, setFormState] = useState<TrendSearchState>({
    categoryId: "0",
    maxResults: 18,
    freshness: "24h",
    query: "",
    language: "hi"
  });
  const [insights, setInsights] = useState<TrendInsight | undefined>();
  const { data, error, isLoading } = useSWR(
    () => `/api/trends?${buildQueryString(formState)}`,
    fetcher,
    {
      revalidateOnFocus: false
    }
  );

  const categoryDescription = useMemo(() => {
    const selected = TREND_CATEGORIES.find(
      (category) => category.id === formState.categoryId
    );
    return selected?.description ?? TREND_CATEGORIES[0]?.description ?? "";
  }, [formState.categoryId]);

  const refreshData = (state: TrendSearchState) => {
    setFormState(state);
    setInsights(undefined);
  };

  const videos = data?.spotlightVideos ?? [];

  const handleInsights = (nextInsights: TrendInsight | undefined) => {
    setInsights(nextInsights);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <header className="flex flex-col gap-2">
        <span className="text-sm uppercase tracking-[0.4em] text-brand-light">
          BharatTube Pulse
        </span>
        <h1 className="text-4xl font-bold text-slate-100 md:text-5xl">
          Agentic Explorer for India&apos;s YouTube Trends
        </h1>
        <p className="max-w-3xl text-slate-300">
          Track the fastest-moving narratives shaping Indian YouTube. Use the
          research agent to pivot between categories, filter by recency, and
          surface actionable insight summaries powered by LLM analysis.
        </p>
      </header>

      <TrendSearchForm
        state={formState}
        onSubmit={refreshData}
        isLoading={isLoading}
      />

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-3xl bg-slate-900/70 p-6 shadow-xl ring-1 ring-white/5 backdrop-blur">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-slate-100">
                {data?.primarySignals.category ?? "All categories"} ·{" "}
                {data?.primarySignals.freshness ?? "24 hour pulse"}
              </h2>
              <p className="text-sm text-slate-400">{categoryDescription}</p>
            </div>
            <StatsDigest videos={videos} />
          </div>

          <TrendingSignals
            videos={videos}
            loading={isLoading}
            errorMessage={error ? error.message : undefined}
          />
        </div>

        <InsightPanel
          insights={insights}
          isLoading={isLoading}
          videos={videos}
          signals={data?.primarySignals}
          onInsightsGenerated={handleInsights}
        />
      </section>

      <section className="rounded-3xl bg-slate-900/60 p-6 shadow-inner ring-1 ring-white/5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Spotlight Videos
          </h2>
          <span className="text-sm text-slate-400">
            {videos.length} surfaced · refreshed{" "}
            {new Date(data?.generatedAt ?? Date.now()).toLocaleTimeString()}
          </span>
        </div>
        <AnimatePresence mode="popLayout">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-xl border border-red-500/40 bg-red-900/30 p-4 text-sm text-red-200"
            >
              {error.message}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="grid gap-4 md:grid-cols-2">
          {videos.map((video) => (
            <TrendCard key={video.id} video={video} />
          ))}
        </div>
      </section>
    </div>
  );
}
