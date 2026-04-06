"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Plus, Save } from "lucide-react";

export function NoteEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  return (
    <GlassCard hover={false} glow>
      <h3 className="text-lg font-bold neon-text mb-6">
        <Plus className="w-5 h-5 inline-block mr-2 text-neon-blue" />
        新しいメモ
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="学んだこと、気づき、メモを入力..."
          rows={6}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグ（カンマ区切り）"
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
        />
        <NeonButton variant="primary" className="w-full">
          <Save className="w-4 h-4" />
          メモを保存
        </NeonButton>
      </div>
    </GlassCard>
  );
}
