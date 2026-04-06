import { GlassCard } from "@/components/ui/GlassCard";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-8">
      <GlassCard hover={false}>
        <div className="flex items-center gap-3 text-foreground/40">
          <History className="w-8 h-8 text-neon-pink" />
          <div>
            <h2 className="text-xl font-bold text-foreground">投稿履歴</h2>
            <p className="text-sm">Phase 3で実装予定</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
