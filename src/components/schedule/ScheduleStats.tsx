import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface ScheduleStatsProps {
  pending: number;
  sent: number;
  failed: number;
}

export function ScheduleStats({ pending, sent, failed }: ScheduleStatsProps) {
  const stats = [
    { label: "待機中", value: pending, icon: Clock, color: "text-neon-blue" },
    { label: "送信済", value: sent, icon: CheckCircle2, color: "text-neon-green" },
    { label: "失敗", value: failed, icon: AlertTriangle, color: "text-neon-pink" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s) => (
        <GlassCard key={s.label} hover={false} className="p-5 text-center">
          <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
          <p className="text-2xl font-bold text-foreground/90">{s.value}</p>
          <p className="text-xs text-foreground/40 mt-1">{s.label}</p>
        </GlassCard>
      ))}
    </div>
  );
}
