"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { GenerateResultCards } from "@/components/generate/GenerateResultCards";
import { characters } from "@/lib/dummy-data";
import type { GenerateRequest, GeneratedVariant, PlatformType } from "@/lib/types";
import { Sparkles, RefreshCw, AlertTriangle } from "lucide-react";

const platforms: { value: PlatformType; label: string }[] = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

const tones = ["カジュアル", "プロフェッショナル", "ユーモア", "インスピレーション", "煽り系"] as const;

const charCounts = [140, 280, 500, 1000] as const;

export function GenerateForm() {
  // Input state
  const [theme, setTheme] = useState("");
  const [target, setTarget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<string>(tones[0]);
  const [charCount, setCharCount] = useState<number>(280);
  const [includeCta, setIncludeCta] = useState(true);
  const [platform, setPlatform] = useState<PlatformType>("twitter");
  const [personaId, setPersonaId] = useState("");

  // Output state
  const [variants, setVariants] = useState<GeneratedVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!theme.trim()) {
      setError("テーマを入力してください");
      return;
    }

    setLoading(true);
    setError("");
    setVariants([]);

    const selectedPersona = characters.find((c) => c.id === personaId);
    const personaText = selectedPersona
      ? `${selectedPersona.name}（${selectedPersona.personality}、トーン: ${selectedPersona.tone}、得意分野: ${selectedPersona.topics.join("・")}）`
      : "";

    const body: GenerateRequest = {
      theme,
      target,
      purpose,
      tone,
      charCount,
      includeCta,
      platform,
      persona: personaText,
    };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成に失敗しました");
        return;
      }

      setVariants(data.variants);
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Panel */}
      <GlassCard hover={false} glow>
        <h3 className="text-lg font-bold neon-text mb-6">
          <Sparkles className="w-5 h-5 inline-block mr-2 text-neon-purple" />
          投稿設定
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          {/* Theme */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground/60 mb-2">
              テーマ <span className="text-neon-pink">*</span>
            </label>
            <textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="投稿のテーマやキーワードを入力..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
            />
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">ターゲット</label>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="例: 20代エンジニア、起業家"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">目的</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="例: 認知拡大、集客、教育"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all"
            />
          </div>

          {/* Persona */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-foreground/60 mb-2">ペルソナ（任意）</label>
            <select
              value={personaId}
              onChange={(e) => setPersonaId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground focus:outline-none focus:border-neon-blue/40 transition-all"
            >
              <option value="" className="bg-[#0a0a1a]">ペルソナなし（デフォルト）</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0a0a1a]">
                  {c.name} — {c.personality}（{c.tone}）
                </option>
              ))}
            </select>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">プラットフォーム</label>
            <div className="flex gap-2 flex-wrap">
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

          {/* Char Count */}
          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">目安文字数</label>
            <div className="flex gap-2 flex-wrap">
              {charCounts.map((c) => (
                <button
                  key={c}
                  onClick={() => setCharCount(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    charCount === c
                      ? "bg-neon-green/15 text-neon-green border border-neon-green/30"
                      : "bg-white/[0.03] text-foreground/50 border border-glass-border hover:bg-white/[0.06]"
                  }`}
                >
                  {c}文字
                </button>
              ))}
            </div>
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

          {/* CTA Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncludeCta(!includeCta)}
              className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                includeCta ? "bg-neon-blue/40" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white transition-transform ${
                  includeCta ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm text-foreground/60">CTA（行動喚起）を含める</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-6">
          <NeonButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                AIが3パターン生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                AIで3パターン生成
              </>
            )}
          </NeonButton>
        </div>
      </GlassCard>

      {/* Loading Skeleton */}
      {loading && <GenerateLoadingSkeleton />}

      {/* Results */}
      {!loading && variants.length > 0 && (
        <GenerateResultCards variants={variants} platform={platform} />
      )}
    </div>
  );
}

function GenerateLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[0, 1, 2].map((i) => (
        <GlassCard key={i} hover={false} className="animate-pulse">
          <div className="h-5 w-32 bg-white/[0.06] rounded-lg mb-4" />
          <div className="h-4 w-full bg-white/[0.04] rounded-lg mb-3" />
          <div className="space-y-2 mb-4">
            <div className="h-3 w-full bg-white/[0.03] rounded-lg" />
            <div className="h-3 w-5/6 bg-white/[0.03] rounded-lg" />
            <div className="h-3 w-4/6 bg-white/[0.03] rounded-lg" />
            <div className="h-3 w-full bg-white/[0.03] rounded-lg" />
            <div className="h-3 w-3/4 bg-white/[0.03] rounded-lg" />
          </div>
          <div className="h-4 w-48 bg-white/[0.04] rounded-lg mb-4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/[0.04] rounded-full" />
            <div className="h-6 w-20 bg-white/[0.04] rounded-full" />
            <div className="h-6 w-14 bg-white/[0.04] rounded-full" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
