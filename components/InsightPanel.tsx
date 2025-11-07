"use client";

import { useState } from "react";
import clsx from "clsx";
import type { TrendInsight } from "@/types/trend";
import type { YouTubeTrendVideo } from "@/lib/youtube";

type Props = {
  insights?: TrendInsight;
  isLoading?: boolean;
  videos: YouTubeTrendVideo[];
  signals?: {
    category: string;
    freshness: string;
    keyword?: string;
  };
  onInsightsGenerated: (insights: TrendInsight | undefined) => void;
};

type AgentState = "idle" | "processing" | "ready" | "error";

export default function InsightPanel({
  insights,
  isLoading,
  videos,
  signals,
  onInsightsGenerated
}: Props) {
  const [state, setState] = useState<AgentState>("idle");
  const [error, setError] = useState<string | undefined>();

  const generateInsights = async () => {
    if (!videos.length) {
      setError("Run the agent first to populate spotlight videos.");
      return;
    }
    setState("processing");
    setError(undefined);

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          videos: videos.slice(0, 12),
          signals
        })
      });

      if (!response.ok) {
        throw new Error("Failed to analyse signals. Check server logs.");
      }

      const payload = (await response.json()) as { insights: TrendInsight };
      onInsightsGenerated(payload.insights);
      setState("ready");
    } catch (insightError) {
      console.error(insightError);
      setError(
        insightError instanceof Error
          ? insightError.message
          : "Unknown error while generating insights."
      );
      setState("error");
    }
  };

  return (
    <aside className="flex h-full flex-col gap-4 rounded-3xl bg-slate-900/80 p-6 shadow-xl ring-1 ring-white/5">
      <header className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-slate-100">
          Narrative Intelligence
        </h2>
        <p className="text-sm text-slate-400">
          Summaries powered by LLM analysis. Requires OPENAI_API_KEY. Without it,
          deterministic heuristics will be used.
        </p>
      </header>

      <button
        type="button"
        className={clsx(
          "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
          state === "processing"
            ? "bg-slate-800/60 text-slate-400"
            : "bg-emerald-500/90 text-emerald-50 hover:bg-emerald-500"
        )}
        disabled={isLoading || state === "processing"}
        onClick={generateInsights}
      >
        {state === "processing" ? "Analysing signals…" : "Generate insight report"}
      </button>

      {error && (
        <p className="rounded-xl border border-red-500/40 bg-red-900/30 p-3 text-xs text-red-200">
          {error}
        </p>
      )}

      <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-slate-950/50 p-4">
        {insights ? (
          <div className="flex flex-col gap-4 text-sm">
            <section>
              <h3 className="text-xs uppercase tracking-wide text-slate-400">
                Summary
              </h3>
              <p className="mt-1 text-slate-200">{insights.summary}</p>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-wide text-slate-400">
                Growth Drivers
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                {insights.growthDrivers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-wide text-slate-400">
                Risks & Saturation
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                {insights.riskFactors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-wide text-slate-400">
                Audience Intent
              </h3>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
                {insights.audienceNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-slate-500">
            <span>Run the agent and generate insights to populate this view.</span>
          </div>
        )}
      </div>

      <footer className="rounded-2xl border border-white/5 bg-slate-950/60 p-4 text-xs text-slate-400">
        {signals?.keyword ? (
          <p>
            Focused on keyword <strong>{signals.keyword}</strong> within{" "}
            <strong>{signals.category}</strong>.
          </p>
        ) : (
          <p>
            Multi-signal sweep across <strong>{signals?.category ?? "All"}</strong>.
          </p>
        )}
      </footer>
    </aside>
  );
}
