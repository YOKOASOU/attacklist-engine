import { GlassCard } from "@/components/ui/GlassCard";
import { Character } from "@/lib/types";
import { Pencil } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

interface PersonaCardProps {
  character: Character;
}

export function PersonaCard({ character }: PersonaCardProps) {
  return (
    <GlassCard>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-lg font-bold text-white shadow-[0_0_12px_rgba(0,212,255,0.2)] shrink-0">
          {character.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-foreground/90">{character.name}</h4>
          <p className="text-sm text-foreground/50 mt-1">{character.personality}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
              {character.tone}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {character.topics.map((topic) => (
              <span
                key={topic}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-foreground/40 border border-glass-border"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
        <NeonButton variant="ghost" size="sm">
          <Pencil className="w-3.5 h-3.5" />
        </NeonButton>
      </div>
    </GlassCard>
  );
}
