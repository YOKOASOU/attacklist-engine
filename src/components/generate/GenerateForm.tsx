"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { characters } from "@/lib/dummy-data";
import { Sparkles, Copy, RefreshCw } from "lucide-react";

const platforms = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
] as const;

const tones = ["カジュアル", "プロフェッショナル", "ユーモア", "インスピレーション"] as const;

export function GenerateForm() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<string>("twitter");
  const [characterId, setCharacterId] = useState(characters[0].id);
  const [tone, setTone] = useState<string>(tones[0]);
  const [generated, setGenerated] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setGenerated(
        `【${topic || "AIの最新動向"}について】\n\n${
          tone === "ユーモア"
            ? "知ってました？AIが進化しすぎて、もう人間がAIに仕事を教わる時代です😂"
            : "AIの進化は止まりません。最新のトレンドを押さえて、一歩先を行きましょう。"
        }\n\n#AI #テクノロジー #最新情報`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {/* Input Panel */}
      <GlassCard hover={false} glow>
        <h3 className="text-lg font-bold neon-text mb-6">投稿設定</h3>
        <div className="space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">トピック</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="投稿のテーマやキーワードを入力..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">プラットフォーム</label>
            <div className="flex gap-2">
              {platforms.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPlatform(p.value)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                    platform === p.value
                      ? "bg-neon-blue/15 text-neon-blue border border-neon-blue/30"
                      : "bg-white/[0.03] text-foreground/50 border border-glass-border hover:bg-white/[0.06]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Character */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">キャラクター</label>
            <select
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground focus:outline-none focus:border-neon-blue/40 transition-all"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a0a1a]">
                  {c.name} - {c.tone}
                </option>
              ))}
            </select>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">トーン</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    tone === t
                      ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/30"
                      : "bg-white/[0.03] text-foreground/50 border border-glass-border hover:bg-white/[0.06]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <NeonButton variant="primary" size="lg" className="w-full" onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AIで投稿を生成
              </>
            )}
          </NeonButton>
        </div>
      </GlassCard>

      {/* Output Panel */}
      <GenerateOutput content={generated} />
    </div>
  );
}

function GenerateOutput({ content }: { content: string }) {
  return (
    <GlassCard hover={false}>
      <h3 className="text-lg font-bold neon-text mb-6">生成結果</h3>
      {content ? (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-glass-border min-h-[200px] whitespace-pre-wrap text-sm text-foreground/85 leading-relaxed">
            {content}
          </div>
          <div className="flex gap-3">
            <NeonButton variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(content)}>
              <Copy className="w-4 h-4" />
              コピー
            </NeonButton>
            <NeonButton variant="ghost" size="sm">
              予約投稿に追加
            </NeonButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="w-12 h-12 text-foreground/15 mb-4" />
          <p className="text-foreground/40 text-sm">左の設定からAI投稿を生成してください</p>
        </div>
      )}
    </GlassCard>
  );
}
