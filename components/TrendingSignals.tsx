"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { YouTubeTrendVideo } from "@/lib/youtube";

type Props = {
  videos: YouTubeTrendVideo[];
  loading?: boolean;
  errorMessage?: string;
};

const computeTopTags = (videos: YouTubeTrendVideo[]) => {
  const tagFrequency = new Map<string, number>();
  videos.forEach((video) => {
    video.tags?.slice(0, 10).forEach((tag) => {
      tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1);
    });
  });

  return [...tagFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
};

export default function TrendingSignals({
  videos,
  loading,
  errorMessage
}: Props) {
  const topTags = useMemo(() => computeTopTags(videos), [videos]);

  return (
    <div className="rounded-3xl bg-slate-900/70 p-6 shadow-lg ring-1 ring-white/5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">
          Emerging Signals
        </h2>
        {loading && (
          <span className="text-xs text-slate-400 animate-pulse">
            Updating…
          </span>
        )}
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-900/30 p-3 text-xs text-red-200">
          {errorMessage}
        </p>
      )}

      <div className="mt-4">
        <h3 className="text-xs uppercase tracking-widest text-slate-400">
          Conversation Clusters
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {topTags.length ? (
            topTags.map(([tag, frequency]) => (
              <motion.span
                layout
                key={tag}
                className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand-light"
              >
                #{tag} <span className="text-[10px] text-slate-300">×{frequency}</span>
              </motion.span>
            ))
          ) : (
            <span className="text-xs text-slate-500">
              Hashtag signals unavailable for this sweep.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
