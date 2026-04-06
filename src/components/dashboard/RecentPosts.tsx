import { GlassCard } from "@/components/ui/GlassCard";
import { Post, Character } from "@/lib/types";
import {
  AtSign,
  Camera,
  MessageCircle,
  Flame,
  Heart,
  Repeat2,
  MessageSquare,
  Inbox,
} from "lucide-react";

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
  published: "bg-neon-green/10 text-neon-green border-neon-green/20",
  scheduled: "bg-neon-blue/10 text-neon-blue border-neon-blue/20",
  draft: "bg-foreground/10 text-foreground/50 border-foreground/10",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusLabel = {
  published: "公開済み",
  scheduled: "予約済み",
  draft: "下書き",
  failed: "失敗",
};

interface RecentPostsProps {
  posts: Post[];
  characters: Character[];
}

export function RecentPosts({ posts, characters }: RecentPostsProps) {
  const buzzPosts = posts
    .filter((p) => p.engagement)
    .sort((a, b) => (b.engagement?.likes ?? 0) - (a.engagement?.likes ?? 0))
    .slice(0, 5);

  return (
    <GlassCard hover={false} glow>
      <div className="flex items-center gap-2.5 mb-6">
        <Flame className="w-5 h-5 text-neon-pink" />
        <h3 className="text-lg font-bold neon-text">最近のバズ投稿</h3>
      </div>

      {buzzPosts.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-glass-border flex items-center justify-center mb-5">
            <Inbox className="w-8 h-8 text-foreground/20" />
          </div>
          <p className="text-base font-semibold text-foreground/50 mb-2">
            まだ投稿がありません
          </p>
          <p className="text-sm text-foreground/30 max-w-[260px] leading-relaxed">
            AI投稿生成からコンテンツを作成すると、ここにバズった投稿が表示されます
          </p>
        </div>
      ) : (
        /* Post List */
        <div className="space-y-3">
          {buzzPosts.map((post) => {
            const PlatformIcon = platformIcon[post.platform];
            const char = characters.find((c) => c.id === post.characterId);
            return (
              <div
                key={post.id}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-glass-border hover:bg-white/[0.05] hover:border-neon-blue/15 transition-all duration-200"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-[0_0_12px_rgba(0,212,255,0.2)]">
                  {char?.avatar ?? "?"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <PlatformIcon
                        className={`w-3.5 h-3.5 ${platformColor[post.platform]}`}
                      />
                      <span className="text-xs text-foreground/40">
                        {char?.name}
                      </span>
                    </div>
                    {post.engagement && (
                      <div className="flex items-center gap-3 text-xs text-foreground/35">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-neon-pink/60" />
                          {post.engagement.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Repeat2 className="w-3 h-3 text-neon-green/60" />
                          {post.engagement.retweets}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-neon-blue/60" />
                          {post.engagement.replies}
                        </span>
                      </div>
                    )}
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full border ml-auto shrink-0 ${statusBadge[post.status]}`}
                    >
                      {statusLabel[post.status]}
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
