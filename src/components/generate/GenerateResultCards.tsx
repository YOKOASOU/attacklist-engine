"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import type { GeneratedVariant, PlatformType } from "@/lib/types";
import {
  Copy,
  Check,
  BookmarkPlus,
  Hash,
  Lightbulb,
  MessageSquareText,
  ArrowRight,
} from "lucide-react";

interface GenerateResultCardsProps {
  variants: GeneratedVariant[];
  platform: PlatformType;
}

const variantColors = [
  { border: "rgba(0, 212, 255, 0.3)", label: "text-neon-blue", badge: "bg-neon-blue/15 text-neon-blue border-neon-blue/25" },
  { border: "rgba(168, 85, 247, 0.3)", label: "text-neon-purple", badge: "bg-neon-purple/15 text-neon-purple border-neon-purple/25" },
  { border: "rgba(236, 72, 153, 0.3)", label: "text-neon-pink", badge: "bg-neon-pink/15 text-neon-pink border-neon-pink/25" },
];

export function GenerateResultCards({ variants, platform }: GenerateResultCardsProps) {
  return (
    <div>
      <h3 className="text-lg font-bold neon-text mb-6">
        生成結果 — {variants.length} パターン
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {variants.map((variant, i) => (
          <VariantCard
            key={variant.id}
            variant={variant}
            index={i}
            platform={platform}
            color={variantColors[i % variantColors.length]}
          />
        ))}
      </div>
    </div>
  );
}

function VariantCard({
  variant,
  index,
  color,
}: {
  variant: GeneratedVariant;
  index: number;
  platform: PlatformType;
  color: (typeof variantColors)[number];
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const fullText = [variant.hook, variant.body, variant.cta]
    .filter(Boolean)
    .join("\n\n");
  const fullWithTags = `${fullText}\n\n${variant.hashtags.map((t) => `#${t}`).join(" ")}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullWithTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setSaved(true);
    // TODO: Supabase連携時にgenerated_postsへINSERT
  };

  return (
    <GlassCard hover={false} className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className={`text-[11px] px-3 py-1 rounded-full border font-semibold ${color.badge}`}>
          パターン {index + 1}
        </span>
      </div>

      {/* Title */}
      <h4 className={`text-base font-bold mb-4 ${color.label}`}>
        {variant.title}
      </h4>

      {/* Hook */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-neon-green/60" />
          <span className="text-[11px] text-foreground/35 font-medium uppercase tracking-wider">フック</span>
        </div>
        <p className="text-sm text-foreground/75 leading-relaxed pl-5 border-l-2 border-neon-green/20">
          {variant.hook}
        </p>
      </div>

      {/* Body */}
      <div className="mb-4 flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MessageSquareText className="w-3.5 h-3.5 text-foreground/30" />
          <span className="text-[11px] text-foreground/35 font-medium uppercase tracking-wider">本文</span>
        </div>
        <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-wrap">
          {variant.body}
        </p>
      </div>

      {/* CTA */}
      {variant.cta && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-neon-blue/60" />
            <span className="text-[11px] text-foreground/35 font-medium uppercase tracking-wider">CTA</span>
          </div>
          <p className="text-sm text-neon-blue/80 font-medium">{variant.cta}</p>
        </div>
      )}

      {/* Hashtags */}
      {variant.hashtags.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="w-3.5 h-3.5 text-foreground/30" />
            <span className="text-[11px] text-foreground/35 font-medium uppercase tracking-wider">ハッシュタグ</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {variant.hashtags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neon-purple/8 text-neon-purple/60 border border-neon-purple/12"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-glass-border">
        <NeonButton variant="secondary" size="sm" onClick={handleCopy} className="flex-1">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              コピー済み
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              コピー
            </>
          )}
        </NeonButton>
        <NeonButton
          variant={saved ? "ghost" : "primary"}
          size="sm"
          onClick={handleSave}
          disabled={saved}
          className="flex-1"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              保存済み
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              保存
            </>
          )}
        </NeonButton>
      </div>
    </GlassCard>
  );
}
