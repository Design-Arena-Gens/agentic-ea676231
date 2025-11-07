"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, PlaySquare, Youtube, Clock } from "lucide-react";
import type { YouTubeTrendVideo } from "@/lib/youtube";
import { resolveCategoryLabel } from "@/lib/youtube";

type Props = {
  video: YouTubeTrendVideo;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
};

export default function TrendCard({ video }: Props) {
  const published = new Date(video.publishedAt).toLocaleString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    day: "2-digit",
    month: "short"
  });

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-slate-950/60 shadow-lg transition hover:border-brand/60 hover:shadow-brand/20"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={video.thumbnails.url}
          alt={video.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-slate-200">
          <Youtube className="h-4 w-4 text-brand-light" />
          {resolveCategoryLabel(video.categoryId)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-100">
          {video.title}
        </h3>
        <p className="text-sm text-slate-400">{video.channelTitle}</p>
        <p className="line-clamp-3 text-sm text-slate-400">
          {video.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <PlaySquare className="h-4 w-4" /> {formatNumber(video.viewCount)}{" "}
            views
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {published}
          </span>
        </div>
      </div>

      <div className="border-t border-white/5 bg-slate-900/60 p-3 text-right">
        <a
          href={`https://www.youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-light transition hover:text-brand"
        >
          Watch on YouTube <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </motion.article>
  );
}
