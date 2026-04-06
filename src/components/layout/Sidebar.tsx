"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  CalendarClock,
  History,
  Users,
  BookOpen,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/generate", label: "AI投稿生成", icon: Sparkles },
  { href: "/schedule", label: "予約投稿", icon: CalendarClock },
  { href: "/history", label: "投稿履歴", icon: History },
  { href: "/characters", label: "キャラ設定", icon: Users },
  { href: "/notes", label: "学習メモ", icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar-bg backdrop-blur-xl border-r border-glass-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-glass-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,212,255,0.5)] transition-shadow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold neon-text">AttackList</h1>
            <p className="text-xs text-foreground/40">AI Post Engine</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-neon-blue shadow-[inset_0_0_20px_rgba(0,212,255,0.1)] border border-neon-blue/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-neon-blue" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-glass-border">
        <div className="glass p-3 rounded-xl">
          <p className="text-xs text-foreground/40">Powered by</p>
          <p className="text-sm font-medium bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Claude AI
          </p>
        </div>
      </div>
    </aside>
  );
}
