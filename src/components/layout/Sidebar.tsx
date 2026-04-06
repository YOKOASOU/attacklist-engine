"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  CalendarClock,
  History,
  Users,
  BookOpen,
  RefreshCw,
  Compass,
  Zap,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/generate", label: "AI投稿生成", icon: Sparkles },
  { href: "/schedule", label: "予約投稿", icon: CalendarClock },
  { href: "/history", label: "投稿履歴", icon: History },
  { href: "/notebook", label: "学習メモ", icon: BookOpen },
  { href: "/persona", label: "ペルソナ設定", icon: Users },
  { href: "/rewrite", label: "リライト", icon: RefreshCw },
  { href: "/guide", label: "使い方ガイド", icon: Compass },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-7 border-b border-glass-border">
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.35)] group-hover:shadow-[0_0_30px_rgba(0,212,255,0.55)] transition-shadow duration-300">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold neon-text tracking-tight">AttackList</h1>
            <p className="text-[11px] text-foreground/35 tracking-widest uppercase">AI Post Engine</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-neon-blue/15 to-neon-purple/15 text-neon-blue shadow-[inset_0_0_20px_rgba(0,212,255,0.08),0_0_12px_rgba(0,212,255,0.1)] border border-neon-blue/20"
                  : "text-foreground/50 hover:text-foreground/80 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className={`w-[18px] h-[18px] ${isActive ? "text-neon-blue drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-glass-border">
        <div className="glass p-4 rounded-2xl">
          <p className="text-[10px] text-foreground/30 uppercase tracking-wider">Powered by</p>
          <p className="text-sm font-semibold mt-0.5 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            Claude AI
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-[60] p-2.5 rounded-2xl glass cursor-pointer"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[272px] bg-sidebar-bg backdrop-blur-2xl border-r border-glass-border flex-col z-50">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-full w-[272px] bg-sidebar-bg backdrop-blur-2xl border-r border-glass-border flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
