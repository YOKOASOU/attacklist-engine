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
    borderGlow: "rgba(0, 212, 255, 0.35)",
    shadowGlow: "rgba(0, 212, 255, 0.12)",
  },
  purple: {
    iconBg: "bg-neon-purple/10",
    iconText: "text-neon-purple",
    borderGlow: "rgba(168, 85, 247, 0.35)",
    shadowGlow: "rgba(168, 85, 247, 0.12)",
  },
  pink: {
    iconBg: "bg-neon-pink/10",
    iconText: "text-neon-pink",
    borderGlow: "rgba(236, 72, 153, 0.35)",
    shadowGlow: "rgba(236, 72, 153, 0.12)",
  },
  green: {
    iconBg: "bg-neon-green/10",
    iconText: "text-neon-green",
    borderGlow: "rgba(34, 211, 238, 0.35)",
    shadowGlow: "rgba(34, 211, 238, 0.12)",
  },
};

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div
      className="glass p-7 transition-all duration-300 hover:scale-[1.02]"
      style={{
        borderColor: c.borderGlow,
        boxShadow: `0 0 20px ${c.shadowGlow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-foreground/45 font-medium">{title}</p>
          <p className="text-4xl font-bold mt-3 tracking-tight bg-gradient-to-b from-white to-foreground/60 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <p className="text-xs mt-3 text-neon-green font-medium flex items-center gap-1">
              <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-neon-green" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${c.iconBg}`}>
          <Icon className={`w-6 h-6 ${c.iconText}`} />
        </div>
      </div>
    </div>
  );
}
