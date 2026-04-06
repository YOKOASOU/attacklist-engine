import { HistoryTable } from "@/components/history/HistoryTable";
import { HistoryFilter } from "@/components/history/HistoryFilter";
import { posts, characters } from "@/lib/dummy-data";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <HistoryFilter />
      <HistoryTable posts={posts} characters={characters} />
    </div>
  );
}
