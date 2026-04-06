"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { RefreshCw, ArrowRight, Copy } from "lucide-react";

const styles = [
  "もっとカジュアルに",
  "もっとプロっぽく",
  "短く要約",
  "バズりやすく",
  "問いかけ形式",
] as const;

export function RewriteEditor() {
  const [original, setOriginal] = useState("");
  const [style, setStyle] = useState<string>(styles[0]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRewrite = () => {
    if (!original.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const rewrites: Record<string, string> = {
        "もっとカジュアルに": `${original.slice(0, 20)}...って話、マジで面白くない？🤔 みんなはどう思う？`,
        "もっとプロっぽく": `【考察】${original.slice(0, 20)}...について、データに基づく分析をお伝えします。`,
        "短く要約": original.slice(0, 40) + "...",
        "バズりやすく": `🚀 ${original.slice(0, 20)}...\n\nこれ知らないとヤバいかも。\n\nスレッドで解説👇`,
        "問いかけ形式": `${original.slice(0, 20)}...って本当？\n\nあなたはどう思いますか？`,
      };
      setResult(rewrites[style] || original);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      {/* Input */}
      <GlassCard hover={false} glow>
        <h3 className="text-lg font-bold neon-text mb-6">元のテキスト</h3>
        <div className="space-y-5">
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="リライトしたいテキストを入力..."
            rows={6}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
          />

          <div>
            <label className="block text-sm font-medium text-foreground/60 mb-2">リライトスタイル</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    style === s
                      ? "bg-neon-purple/15 text-neon-purple border border-neon-purple/30"
                      : "text-foreground/40 border border-glass-border hover:bg-white/[0.04]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <NeonButton variant="primary" size="lg" className="w-full" onClick={handleRewrite} disabled={loading || !original.trim()}>
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                リライト中...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5" />
                リライトする
              </>
            )}
          </NeonButton>
        </div>
      </GlassCard>

      {/* Output */}
      <GlassCard hover={false}>
        <h3 className="text-lg font-bold neon-text mb-6">リライト結果</h3>
        {result ? (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-glass-border min-h-[200px] whitespace-pre-wrap text-sm text-foreground/85 leading-relaxed">
              {result}
            </div>
            <NeonButton variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(result)}>
              <Copy className="w-4 h-4" />
              コピー
            </NeonButton>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <RefreshCw className="w-12 h-12 text-foreground/15 mb-4" />
            <p className="text-foreground/40 text-sm">左にテキストを入力してリライトしてください</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
