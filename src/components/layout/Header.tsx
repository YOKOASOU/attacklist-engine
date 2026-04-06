"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "ダッシュボード",
  "/generate": "AI投稿生成",
  "/schedule": "予約投稿",
  "/history": "投稿履歴",
  "/characters": "キャラ設定",
  "/notes": "学習メモ",
};

export function Header() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "ダッシュボード";

  return (
    <header className="h-16 border-b border-glass-border bg-sidebar-bg/50 backdrop-blur-md flex items-center justify-between px-8">
      <h2 className="text-xl font-bold neon-text">{title}</h2>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder="検索..."
            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-glass-border text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-neon-blue/50 focus:shadow-[0_0_10px_rgba(0,212,255,0.15)] transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-foreground/60" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full" />
        </button>
      </div>
    </header>
  );
}
