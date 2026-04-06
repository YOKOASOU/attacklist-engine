import { GlassCard } from "@/components/ui/GlassCard";
import { ScheduledPost, Character } from "@/lib/types";
import { CalendarClock, AtSign, Camera, MessageCircle } from "lucide-react";

const platformIcon = {
  twitter: AtSign,
  instagram: Camera,
  threads: MessageCircle,
};

const platformColor = {
  twitter: "text-neon-blue",
  instagram: "text-neon-pink",
  threads: "text-neon-purple",
};

const statusBadge = {
  pending: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
  sent: "bg-neon-green/10 text-neon-green border-neon-green/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ScheduleCalendarProps {
  items: ScheduledPost[];
  characters: Character[];
}

export function ScheduleCalendar({ items, characters }: ScheduleCalendarProps) {
  return (
    <GlassCard hover={false} glow>
      <div className="flex items-center gap-2.5 mb-6">
        <CalendarClock className="w-5 h-5 text-neon-blue" />
        <h3 className="text-lg font-bold neon-text">予約一覧</h3>
        <span className="ml-auto text-xs text-foreground/35">{items.length} 件</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CalendarClock className="w-12 h-12 text-foreground/15 mb-4" />
          <p className="text-foreground/40 text-sm">予約投稿はまだありません</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const PlatformIcon = platformIcon[item.platform];
            const char = characters.find((c) => c.id === item.characterId);
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-glass-border hover:bg-white/[0.05] transition-all"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {char?.avatar ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/85 leading-relaxed">{item.content}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <PlatformIcon className={`w-3.5 h-3.5 ${platformColor[item.platform]}`} />
                      <span className="text-xs text-foreground/40">{char?.name}</span>
                    </div>
                    <span className="text-xs text-neon-blue">{formatDate(item.scheduledAt)}</span>
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ml-auto shrink-0 ${statusBadge[item.status]}`}>
                      {item.status === "pending" ? "待機中" : item.status === "sent" ? "送信済" : "失敗"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
