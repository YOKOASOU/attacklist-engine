import { GlassCard } from "@/components/ui/GlassCard";
import { Users } from "lucide-react";

export default function CharactersPage() {
  return (
    <div className="space-y-8">
      <GlassCard hover={false}>
        <div className="flex items-center gap-3 text-foreground/40">
          <Users className="w-8 h-8 text-neon-green" />
          <div>
            <h2 className="text-xl font-bold text-foreground">キャラ設定</h2>
            <p className="text-sm">Phase 2で実装予定</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
