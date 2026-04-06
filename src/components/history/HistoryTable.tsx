import { GlassCard } from "@/components/ui/GlassCard";
import { Post, Character } from "@/lib/types";
import { AtSign, Camera, MessageCircle, Heart, Repeat2, MessageSquare, Inbox } from "lucide-react";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryTableProps {
  posts: Post[];
  characters: Character[];
}

export function HistoryTable({ posts, characters }: HistoryTableProps) {
  if (posts.length === 0) {
    return (
      <GlassCard hover={false} glow>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Inbox className="w-12 h-12 text-foreground/15 mb-4" />
          <p className="text-foreground/40 text-sm">投稿履歴はまだありません</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard hover={false} glow>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border text-foreground/40 text-left">
              <th className="pb-4 font-medium">投稿内容</th>
              <th className="pb-4 font-medium w-24">プラットフォーム</th>
              <th className="pb-4 font-medium w-28">キャラ</th>
              <th className="pb-4 font-medium w-20">ステータス</th>
              <th className="pb-4 font-medium w-32 hidden lg:table-cell">エンゲージ</th>
              <th className="pb-4 font-medium w-36 hidden md:table-cell">日時</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border">
            {posts.map((post) => {
              const PlatformIcon = platformIcon[post.platform];
              const char = characters.find((c) => c.id === post.characterId);
              return (
                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 pr-4">
                    <p className="text-foreground/80 truncate max-w-[300px]">{post.content}</p>
                  </td>
                  <td className="py-4">
                    <PlatformIcon className={`w-4 h-4 ${platformColor[post.platform]}`} />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-[10px] font-bold text-white">
                        {char?.avatar ?? "?"}
                      </div>
                      <span className="text-xs text-foreground/50">{char?.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${statusBadge[post.status]}`}>
                      {statusLabel[post.status]}
                    </span>
                  </td>
                  <td className="py-4 hidden lg:table-cell">
                    {post.engagement ? (
                      <div className="flex items-center gap-2.5 text-xs text-foreground/35">
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
                    ) : (
                      <span className="text-xs text-foreground/20">-</span>
                    )}
                  </td>
                  <td className="py-4 text-xs text-foreground/35 hidden md:table-cell">
                    {formatDate(post.publishedAt || post.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
