import { GlassCard } from "@/components/ui/GlassCard";
import { type LucideIcon } from "lucide-react";

interface GuideStep {
  title: string;
  description: string;
}

interface GuideSectionProps {
  icon: LucideIcon;
  title: string;
  steps: GuideStep[];
  color?: string;
}

export function GuideSection({ icon: Icon, title, steps, color = "text-neon-blue" }: GuideSectionProps) {
  return (
    <GlassCard hover={false}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-2xl bg-white/[0.04]">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h3 className="text-lg font-bold neon-text">{title}</h3>
      </div>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center text-xs font-bold text-neon-blue shrink-0 border border-neon-blue/15">
              {i + 1}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground/85">{step.title}</h4>
              <p className="text-sm text-foreground/45 mt-1 leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
