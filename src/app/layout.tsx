import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AttackList Engine - AI Post Generator",
  description: "AIを活用したSNS投稿生成・管理ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full">
        <Sidebar />
        <div className="lg:ml-[272px] flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-5 md:p-8 lg:p-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
