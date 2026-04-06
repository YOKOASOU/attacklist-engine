import { GlassCard } from "@/components/ui/GlassCard";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: "blue" | "purple" | "pink" | "green";
}

const colorMap = {
  blue: {
    iconBg: "bg-neon-blue/10",
    iconText: "text-neon-blue",
    glow: "shadow-[0_0_15px_rgba(0,212,255,0.2)]",
  },
  purple: {
    iconBg: "bg-neon-purple/10",
    iconText: "text-neon-purple",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
  },
  pink: {
    iconBg: "bg-neon-pink/10",
    iconText: "text-neon-pink",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },
  green: {
    iconBg: "bg-neon-green/10",
    iconText: "text-neon-green",
    glow: "shadow-[0_0_15px_rgba(34,211,238,0.2)]",
  },
};

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <GlassCard className={colors.glow}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/50">{title}</p>
          <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <p className="text-xs mt-2 text-neon-green">
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <Icon className={`w-6 h-6 ${colors.iconText}`} />
        </div>
      </div>
    </GlassCard>
  );
}
