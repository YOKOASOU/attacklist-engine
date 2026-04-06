import { GlassCard } from "@/components/ui/GlassCard";
import { scheduledPosts, characters } from "@/lib/dummy-data";
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

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SchedulePreview() {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold neon-text">予約投稿</h3>
        <CalendarClock className="w-5 h-5 text-neon-purple" />
      </div>
      <div className="space-y-3">
        {scheduledPosts.map((item) => {
          const PlatformIcon = platformIcon[item.platform];
          const char = characters.find((c) => c.id === item.characterId);
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/[0.02] border border-glass-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlatformIcon className={`w-4 h-4 ${platformColor[item.platform]}`} />
                <span className="text-xs text-foreground/50">{char?.name}</span>
                <span className="text-xs text-neon-blue ml-auto">
                  {formatDate(item.scheduledAt)}
                </span>
              </div>
              <p className="text-sm text-foreground/70 line-clamp-2">{item.content}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
