import { type LucideIcon } from "lucide-react";

interface AlertBannerProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function AlertBanner({
  icon: Icon,
  iconColor = "text-neon-blue",
  title,
  children,
  action,
}: AlertBannerProps) {
  return (
    <div className="glass-glow p-7 lg:p-9">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-neon-blue/15 to-neon-purple/15 shrink-0 border border-neon-blue/10">
            <Icon className={`w-7 h-7 ${iconColor}`} />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold neon-text tracking-tight">
              {title}
            </h2>
            <div className="text-foreground/45 mt-1.5 text-sm lg:text-[15px] leading-relaxed">
              {children}
            </div>
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
