import { GlassCard } from "@/components/ui/GlassCard";
import { ScheduledPost, Post, Character } from "@/lib/types";
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

interface SchedulePreviewProps {
  items: ScheduledPost[];
  posts: Post[];
  characters: Character[];
}

export function SchedulePreview({ items, posts, characters }: SchedulePreviewProps) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold neon-text">予約投稿</h3>
        <CalendarClock className="w-5 h-5 text-neon-purple" />
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const PlatformIcon = platformIcon[item.platform];
          const post = posts.find((p) => p.id === item.generated_post_id);
          const char = post ? characters.find((c) => c.id === post.characterId) : undefined;
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-white/[0.02] border border-glass-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <PlatformIcon className={`w-4 h-4 ${platformColor[item.platform]}`} />
                <span className="text-xs text-foreground/50">{char?.name ?? "不明"}</span>
                <span className="text-xs text-neon-blue ml-auto">
                  {formatDate(item.scheduledAt)}
                </span>
              </div>
              <p className="text-sm text-foreground/70 line-clamp-2">
                {post?.content ?? "(投稿データなし)"}
              </p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
