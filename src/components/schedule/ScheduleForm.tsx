"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import type { LocalScheduledPost, PlatformType } from "@/lib/types";
import { CalendarPlus, Save, X } from "lucide-react";

const platforms: { value: PlatformType; label: string }[] = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "threads", label: "Threads" },
];

interface ScheduleFormProps {
  editing: LocalScheduledPost | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function ScheduleForm({ editing, onSaved, onCancel }: ScheduleFormProps) {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<PlatformType>("twitter");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setContent(editing.content);
      setPlatform(editing.platform);
      // datetime-local format: YYYY-MM-DDTHH:MM
      setScheduledAt(editing.scheduledAt.slice(0, 16));
    } else {
      setContent("");
      setPlatform("twitter");
      setScheduledAt("");
    }
  }, [editing]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("投稿内容を入力してください");
      return;
    }
    if (!scheduledAt) {
      setError("予約日時を選択してください");
      return;
    }

    setSaving(true);
    setError("");

    const isoDate = new Date(scheduledAt).toISOString();

    try {
      const url = editing ? `/api/schedule/${editing.id}` : "/api/schedule";
      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), platform, scheduledAt: isoDate }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "保存に失敗しました");
        return;
      }

      onSaved();
      if (!editing) {
        setContent("");
        setScheduledAt("");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <GlassCard hover={false} glow>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold neon-text flex items-center gap-2">
          <CalendarPlus className="w-5 h-5 text-neon-blue" />
          {editing ? "予約を編集" : "新しい予約投稿"}
        </h3>
        {editing && (
          <button onClick={onCancel} className="p-1.5 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-colors">
            <X className="w-4 h-4 text-foreground/40" />
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">
            投稿内容 <span className="text-neon-pink">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="投稿する内容を入力..."
            rows={5}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 transition-all resize-none"
          />
          <p className="text-[11px] text-foreground/30 mt-1.5 text-right">{content.length} 文字</p>
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

        {/* Scheduled At */}
        <div>
          <label className="block text-sm font-medium text-foreground/60 mb-2">
            予約日時 <span className="text-neon-pink">*</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground focus:outline-none focus:border-neon-blue/40 transition-all [color-scheme:dark]"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">{error}</p>
        )}

        {/* Submit */}
        <NeonButton variant="primary" size="lg" className="w-full" onClick={handleSubmit} disabled={saving}>
          <Save className="w-5 h-5" />
          {saving ? "保存中..." : editing ? "変更を保存" : "予約を作成"}
        </NeonButton>
      </div>
    </GlassCard>
  );
}
