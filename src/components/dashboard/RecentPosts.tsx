import { GlassCard } from "@/components/ui/GlassCard";
import { posts, characters } from "@/lib/dummy-data";
import { AtSign, Camera, MessageCircle } from "lucide-react";

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

export function RecentPosts() {
  const recentPosts = posts.slice(0, 5);

  return (
    <GlassCard hover={false} className="col-span-2">
      <h3 className="text-lg font-semibold mb-4 neon-text">最近の投稿</h3>
      <div className="space-y-3">
        {recentPosts.map((post) => {
          const PlatformIcon = platformIcon[post.platform];
          const char = characters.find((c) => c.id === post.characterId);
          return (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-glass-border hover:bg-white/[0.05] transition-colors"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-sm font-bold text-white shrink-0">
                {char?.avatar ?? "?"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 truncate">{post.content}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PlatformIcon className={`w-3.5 h-3.5 ${platformColor[post.platform]}`} />
                  <span className="text-xs text-foreground/40">{char?.name}</span>
                  {post.engagement && (
                    <span className="text-xs text-foreground/30">
                      {post.engagement.likes} likes
                    </span>
                  )}
                </div>
              </div>

              {/* Status */}
              <span
                className={`text-xs px-2.5 py-1 rounded-full border shrink-0 ${statusBadge[post.status]}`}
              >
                {statusLabel[post.status]}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
