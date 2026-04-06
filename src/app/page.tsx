import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { dashboardStats } from "@/lib/dummy-data";
import {
  FileText,
  CalendarClock,
  TrendingUp,
  Users,
  Sparkles,
  Rocket,
} from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Welcome Banner */}
      <div className="glass-glow p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 shrink-0">
              <Rocket className="w-7 h-7 text-neon-blue" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold neon-text tracking-tight">
                おかえりなさい！
              </h1>
              <p className="text-foreground/45 mt-2 text-sm lg:text-base leading-relaxed">
                今週は{" "}
                <span className="text-neon-blue font-semibold">{dashboardStats.postsThisWeek} 件</span>
                の投稿を作成しました。エンゲージメント率は{" "}
                <span className="text-neon-green font-semibold">{dashboardStats.engagementRate}%</span>
                です。
              </p>
            </div>
          </div>
          <Link href="/generate" className="shrink-0">
            <NeonButton variant="primary" size="lg">
              <Sparkles className="w-5 h-5" />
              新しい投稿を生成
            </NeonButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid - 4 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
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

      {/* Main Content: Left = Buzz Posts, Right = Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 lg:gap-8">
        <RecentPosts />
        <QuickActions />
      </div>
    </div>
  );
}
