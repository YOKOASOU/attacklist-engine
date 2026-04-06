import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { dashboardStats, posts, characters } from "@/lib/dummy-data";
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
      {/* Alert Banner */}
      <AlertBanner
        icon={Rocket}
        title="おかえりなさい！"
        action={
          <Link href="/generate">
            <NeonButton variant="primary" size="lg">
              <Sparkles className="w-5 h-5" />
              新しい投稿を生成
            </NeonButton>
          </Link>
        }
      >
        <p>
          今週は{" "}
          <span className="text-neon-blue font-semibold">
            {dashboardStats.postsThisWeek} 件
          </span>
          の投稿を作成しました。エンゲージメント率は{" "}
          <span className="text-neon-green font-semibold">
            {dashboardStats.engagementRate}%
          </span>
          です。
        </p>
      </AlertBanner>

      {/* Stats Grid */}
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
        <RecentPosts posts={posts} characters={characters} />
        <QuickActions />
      </div>
    </div>
  );
}
