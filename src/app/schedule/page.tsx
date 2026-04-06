import { GlassCard } from "@/components/ui/GlassCard";
import { CalendarClock } from "lucide-react";

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <GlassCard hover={false}>
        <div className="flex items-center gap-3 text-foreground/40">
          <CalendarClock className="w-8 h-8 text-neon-blue" />
          <div>
            <h2 className="text-xl font-bold text-foreground">予約投稿</h2>
            <p className="text-sm">Phase 3で実装予定</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
