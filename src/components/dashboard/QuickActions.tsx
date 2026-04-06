import Link from "next/link";
import {
  Sparkles,
  CalendarClock,
  Users,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

interface ActionCardProps {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
  color: string;
}

function ActionCard({ href, icon: Icon, label, description, color }: ActionCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="glass p-6 transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_24px_rgba(0,212,255,0.12)] group-hover:border-neon-blue/25">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color} shadow-lg`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className="text-sm font-bold text-foreground/90 mb-1 group-hover:text-foreground transition-colors">
          {label}
        </h4>
        <p className="text-xs text-foreground/40 leading-relaxed">
          {description}
        </p>
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
  },
  {
    href: "/schedule",
    icon: CalendarClock,
    label: "予約投稿",
    description: "投稿スケジュールを管理する",
    color: "bg-gradient-to-br from-neon-blue to-neon-green",
  },
  {
    href: "/characters",
    icon: Users,
    label: "キャラ設定",
    description: "投稿キャラクターを編集する",
    color: "bg-gradient-to-br from-neon-green to-neon-blue",
  },
  {
    href: "/notes",
    icon: BookOpen,
    label: "学習メモ",
    description: "投稿の学びを記録する",
    color: "bg-gradient-to-br from-neon-pink to-neon-purple",
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
