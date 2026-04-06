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
    <header className="h-[72px] border-b border-glass-border bg-sidebar-bg/40 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
      {/* Page title - visible on all screens, offset on mobile for hamburger */}
      <h2 className="text-xl font-bold neon-text pl-12 lg:pl-0">{title}</h2>

      <div className="flex items-center gap-3 lg:gap-5">
        {/* Search - hidden on small screens */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            placeholder="検索..."
            className="w-56 lg:w-72 pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.04] border border-glass-border text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-neon-blue/40 focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] transition-all duration-300"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-2xl hover:bg-white/[0.04] transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-foreground/50" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
        </button>
      </div>
    </header>
  );
}
