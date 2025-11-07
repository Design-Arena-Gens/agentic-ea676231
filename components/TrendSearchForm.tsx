"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { TREND_CATEGORIES } from "@/lib/categories";

export type TrendSearchState = {
  categoryId: string;
  maxResults: number;
  query?: string;
  freshness: "24h" | "7d" | "30d";
  language?: string;
};

type Props = {
  state: TrendSearchState;
  onSubmit: (nextState: TrendSearchState) => void;
  isLoading?: boolean;
};

const freshnessOptions: { value: TrendSearchState["freshness"]; label: string }[] =
  [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" }
  ];

const languages = [
  { value: "hi", label: "Hindi" },
  { value: "en", label: "English" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "ml", label: "Malayalam" },
  { value: "mr", label: "Marathi" },
  { value: "pa", label: "Punjabi" },
  { value: "gu", label: "Gujarati" }
];

export default function TrendSearchForm({
  state,
  onSubmit,
  isLoading
}: Props) {
  const [draft, setDraft] = useState<TrendSearchState>(state);

  useEffect(() => {
    setDraft(state);
  }, [state]);

  const applyChanges = () => {
    onSubmit(draft);
  };

  const isDirty =
    draft.categoryId !== state.categoryId ||
    draft.maxResults !== state.maxResults ||
    draft.query !== state.query ||
    draft.freshness !== state.freshness ||
    draft.language !== state.language;

  return (
    <div className="rounded-3xl bg-slate-900/80 p-6 shadow-lg ring-1 ring-white/5 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            Configure Agent Sweep
          </h2>
          <p className="text-sm text-slate-400">
            Select a category, optional focus keyword, and timeframe to surface
            India-specific YouTube trend signals.
          </p>
        </div>
        <button
          type="button"
          className={clsx(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            isDirty
              ? "bg-brand text-white hover:bg-brand-light"
              : "pointer-events-none bg-slate-800/60 text-slate-500"
          )}
          onClick={applyChanges}
          disabled={isLoading || !isDirty}
        >
          {isLoading ? "Scanning…" : "Run Agent"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm text-slate-400">
          Category
          <select
            className="rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand"
            value={draft.categoryId}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                categoryId: event.target.value
              }))
            }
          >
            {TREND_CATEGORIES.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-400">
          Focus keyword
          <input
            className="rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand"
            placeholder="e.g. Lok Sabha, IPL finals"
            value={draft.query ?? ""}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                query: event.target.value
              }))
            }
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-400">
          Freshness window
          <div className="flex gap-2">
            {freshnessOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={clsx(
                  "flex-1 rounded-2xl border px-3 py-2 text-xs font-semibold transition",
                  draft.freshness === option.value
                    ? "border-brand bg-brand/20 text-brand-light"
                    : "border-white/5 bg-slate-950/70 text-slate-400 hover:border-brand/40 hover:text-slate-200"
                )}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    freshness: option.value
                  }))
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm text-slate-400">
          Language focus
          <select
            className="rounded-2xl border border-white/5 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-brand"
            value={draft.language ?? "multi"}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                language: event.target.value === "multi" ? undefined : event.target.value
              }))
            }
          >
            <option value="multi">Multi-lingual sweep</option>
            {languages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="flex flex-col gap-1 text-sm text-slate-400 md:max-w-xs">
          Result volume
          <input
            type="range"
            min={6}
            max={30}
            step={2}
            value={draft.maxResults}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                maxResults: Number(event.target.value)
              }))
            }
            className="accent-brand"
          />
          <span className="text-xs text-slate-500">
            Surfacing {draft.maxResults} signals per sweep.
          </span>
        </label>

        <div className="text-xs text-slate-500">
          Agent strategy: fetch in-country trending feed, apply keyword focus,
          then rank by engagement velocity.
        </div>
      </div>
    </div>
  );
}
