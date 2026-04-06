import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { SchedulePreview } from "@/components/dashboard/SchedulePreview";
import { dashboardStats } from "@/lib/dummy-data";
import {
  FileText,
  CalendarClock,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass p-8 neon-glow">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold neon-text">
              おかえりなさい！
            </h1>
            <p className="text-foreground/50 mt-2">
              今週は {dashboardStats.postsThisWeek} 件の投稿を作成しました。エンゲージメント率は {dashboardStats.engagementRate}% です。
            </p>
          </div>
          <Link href="/generate">
            <NeonButton variant="primary" size="lg">
              <Sparkles className="w-5 h-5" />
              新しい投稿を生成
            </NeonButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="総投稿数"
          value={dashboardStats.totalPosts}
          change="+12% vs 先週"
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="予約投稿"
          value={dashboardStats.scheduledPosts}
          icon={CalendarClock}
          color="purple"
        />
        <StatsCard
          title="総エンゲージメント"
          value={dashboardStats.totalEngagement.toLocaleString()}
          change="+8% vs 先週"
          icon={TrendingUp}
          color="pink"
        />
        <StatsCard
          title="アクティブキャラ"
          value={dashboardStats.activeCharacters}
          icon={Users}
          color="green"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        <RecentPosts />
        <SchedulePreview />
      </div>

      {/* Quick Actions */}
      <div className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 neon-text flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-neon-blue" />
          クイックアクション
        </h3>
        <div className="flex gap-3">
          <Link href="/generate">
            <NeonButton variant="secondary">
              <Sparkles className="w-4 h-4" />
              AI投稿生成
            </NeonButton>
          </Link>
          <Link href="/schedule">
            <NeonButton variant="secondary">
              <CalendarClock className="w-4 h-4" />
              予約投稿を管理
            </NeonButton>
          </Link>
          <Link href="/characters">
            <NeonButton variant="secondary">
              <Users className="w-4 h-4" />
              キャラ設定
            </NeonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
