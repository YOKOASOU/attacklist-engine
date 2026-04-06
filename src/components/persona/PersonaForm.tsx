"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { UserPlus, Save } from "lucide-react";

export function PersonaForm() {
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [tone, setTone] = useState("");
  const [topics, setTopics] = useState("");

  return (
    <GlassCard hover={false} glow>
      <h3 className="text-lg font-bold neon-text mb-6">
        <UserPlus className="w-5 h-5 inline-block mr-2 text-neon-purple" />
        新しいペルソナ
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">名前</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="キャラクター名"
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">パーソナリティ</label>
          <textarea
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            placeholder="どんな性格・キャラクターか"
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">トーン</label>
          <input
            type="text"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            placeholder="カジュアル、プロフェッショナルなど"
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">トピック</label>
          <input
            type="text"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            placeholder="カンマ区切りで入力"
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
          />
        </div>
        <NeonButton variant="primary" className="w-full">
          <Save className="w-4 h-4" />
          ペルソナを保存
        </NeonButton>
      </div>
    </GlassCard>
  );
}
