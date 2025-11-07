"use client";

import type { YouTubeTrendVideo } from "@/lib/youtube";

type Props = {
  videos: YouTubeTrendVideo[];
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);

export default function StatsDigest({ videos }: Props) {
  if (!videos.length) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-slate-500">
        Run the agent to populate the dashboard with live signals.
      </div>
    );
  }

  const totalViews = videos.reduce((sum, video) => sum + video.viewCount, 0);
  const avgViews = totalViews / videos.length;
  const topVideo = videos[0];

  return (
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-slate-950/60 p-4">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Aggregate Views
        </span>
        <p className="mt-2 text-2xl font-semibold text-slate-100">
          {formatNumber(totalViews)}
        </p>
        <p className="text-xs text-slate-500">
          Across {videos.length} surfaced signals
        </p>
      </div>

      <div className="rounded-2xl bg-slate-950/60 p-4">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Average Views
        </span>
        <p className="mt-2 text-2xl font-semibold text-slate-100">
          {formatNumber(avgViews)}
        </p>
        <p className="text-xs text-slate-500">
          Engagement velocity for this cohort
        </p>
      </div>

      <div className="rounded-2xl bg-slate-950/60 p-4">
        <span className="text-xs uppercase tracking-wide text-slate-400">
          Top Signal
        </span>
        <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-100">
          {topVideo.title}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formatNumber(topVideo.viewCount)} views · {topVideo.channelTitle}
        </p>
      </div>
    </div>
  );
}
