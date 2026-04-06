import { ScheduleCalendar } from "@/components/schedule/ScheduleCalendar";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { scheduledPosts, posts, characters } from "@/lib/dummy-data";

export default function SchedulePage() {
  const pending = scheduledPosts.filter((p) => p.status === "pending").length;
  const sent = scheduledPosts.filter((p) => p.status === "sent").length;
  const failed = scheduledPosts.filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-8">
      <ScheduleStats pending={pending} sent={sent} failed={failed} />
      <ScheduleCalendar items={scheduledPosts} posts={posts} characters={characters} />
    </div>
  );
}
