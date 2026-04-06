"use client";

import Link from "next/link";
import { Sparkles, CalendarClock, Users, BookOpen, type LucideIcon } from "lucide-react";

interface ActionCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  glowColor: string;
}

function ActionCard({ href, icon: Icon, label, description, color, glowColor }: ActionCardProps) {
  return (
    <Link href={href} className="block group">
      <div
        className="glass p-6 transition-all duration-300 group-hover:scale-[1.03]"
        style={{
          boxShadow: `0 0 0 0 transparent`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 20px ${glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`;
          e.currentTarget.style.borderColor = glowColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 0 transparent";
          e.currentTarget.style.borderColor = "";
        }}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-sm font-bold text-foreground/90 mb-1">{label}</h4>
        <p className="text-xs text-foreground/40 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

const actions = [
  {
    href: "/generate",
    icon: Sparkles,
    label: "AI投稿生成",
    description: "AIでSNS投稿を自動生成する",
    color: "bg-gradient-to-br from-neon-purple to-neon-pink",
    glowColor: "rgba(168, 85, 247, 0.3)",
  },
  {
    href: "/schedule",
    icon: CalendarClock,
    label: "予約投稿",
    description: "投稿スケジュールを管理する",
    color: "bg-gradient-to-br from-neon-blue to-neon-green",
    glowColor: "rgba(0, 212, 255, 0.3)",
  },
  {
    href: "/characters",
    icon: Users,
    label: "キャラ設定",
    description: "投稿キャラクターを編集する",
    color: "bg-gradient-to-br from-neon-green to-neon-blue",
    glowColor: "rgba(34, 211, 238, 0.3)",
  },
  {
    href: "/notes",
    icon: BookOpen,
    label: "学習メモ",
    description: "投稿の学びを記録する",
    color: "bg-gradient-to-br from-neon-pink to-neon-purple",
    glowColor: "rgba(236, 72, 153, 0.3)",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="text-lg font-bold neon-text mb-5">クイックアクション</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <ActionCard key={action.href} {...action} />
        ))}
      </div>
    </div>
  );
}
