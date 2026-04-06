"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Filter } from "lucide-react";

const statusOptions = ["すべて", "公開済み", "予約済み", "下書き", "失敗"] as const;
const platformOptions = ["すべて", "X (Twitter)", "Instagram", "Threads"] as const;

export function HistoryFilter() {
  const [status, setStatus] = useState<string>("すべて");
  const [platform, setPlatform] = useState<string>("すべて");

  return (
    <GlassCard hover={false} className="p-5">
      <div className="flex flex-wrap items-center gap-4">
        <Filter className="w-4 h-4 text-foreground/40" />

        <div className="flex gap-2">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                status === s
                  ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/30"
                  : "text-foreground/40 border border-glass-border hover:bg-white/[0.04]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="hidden md:flex gap-2 ml-auto">
          {platformOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                platform === p
                  ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/30"
                  : "text-foreground/40 border border-glass-border hover:bg-white/[0.04]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
