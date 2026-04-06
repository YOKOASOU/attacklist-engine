"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import type { LocalScheduledPost, ScheduleStatus } from "@/lib/types";
import {
  CalendarClock,
  AtSign,
  Camera,
  MessageCircle,
  Pencil,
  Trash2,
  XCircle,
  Inbox,
} from "lucide-react";

const platformIcon = {
  twitter: AtSign,
  instagram: Camera,
  threads: MessageCircle,
};

const platformLabel = {
  twitter: "X",
  instagram: "Instagram",
  threads: "Threads",
};

const platformColor = {
  twitter: "text-neon-blue",
  instagram: "text-neon-pink",
  threads: "text-neon-purple",
};

const statusConfig: Record<ScheduleStatus, { label: string; badge: string }> = {
  pending: { label: "待機中", badge: "bg-neon-blue/10 text-neon-blue border-neon-blue/20" },
  sent: { label: "送信済", badge: "bg-neon-green/10 text-neon-green border-neon-green/20" },
  failed: { label: "失敗", badge: "bg-red-500/10 text-red-400 border-red-500/20" },
  cancelled: { label: "キャンセル", badge: "bg-foreground/10 text-foreground/50 border-foreground/10" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPast(dateStr: string) {
  return new Date(dateStr) < new Date();
}

interface ScheduleListProps {
  items: LocalScheduledPost[];
  onEdit: (item: LocalScheduledPost) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ScheduleStatus) => void;
}

export function ScheduleList({ items, onEdit, onDelete, onStatusChange }: ScheduleListProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  return (
    <GlassCard hover={false} glow>
      <div className="flex items-center gap-2.5 mb-6">
        <CalendarClock className="w-5 h-5 text-neon-blue" />
        <h3 className="text-lg font-bold neon-text">予約一覧</h3>
        <span className="ml-auto text-xs text-foreground/35">{items.length} 件</span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="w-12 h-12 text-foreground/15 mb-4" />
          <p className="text-foreground/40 text-sm">予約投稿はまだありません</p>
          <p className="text-foreground/25 text-xs mt-1">上のフォームから作成してください</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((item) => {
            const PlatformIcon = platformIcon[item.platform];
            const status = statusConfig[item.status];
            const past = isPast(item.scheduledAt) && item.status === "pending";
            return (
              <div
                key={item.id}
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                  past
                    ? "bg-red-500/[0.03] border-red-500/15"
                    : "bg-white/[0.02] border-glass-border hover:bg-white/[0.05]"
                }`}
              >
                {/* Platform icon */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center shrink-0">
                  <PlatformIcon className={`w-5 h-5 ${platformColor[item.platform]}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="text-xs text-foreground/40">{platformLabel[item.platform]}</span>
                    <span className={`text-xs ${past ? "text-red-400" : "text-neon-blue"}`}>
                      {formatDate(item.scheduledAt)}
                      {past && " (期限超過)"}
                    </span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${status.badge}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {item.status === "pending" && (
                    <>
                      <NeonButton variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </NeonButton>
                      <NeonButton variant="ghost" size="sm" onClick={() => onStatusChange(item.id, "cancelled")}>
                        <XCircle className="w-3.5 h-3.5" />
                      </NeonButton>
                    </>
                  )}
                  <NeonButton variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-red-400/60" />
                  </NeonButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
