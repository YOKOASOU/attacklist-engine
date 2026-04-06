import { Character, DashboardStats, LearningNote, Post, ScheduledPost } from "./types";

export const characters: Character[] = [
  {
    id: "char-1",
    name: "TechBot",
    avatar: "TB",
    personality: "テクノロジーに詳しいフレンドリーなアシスタント",
    tone: "カジュアル・親しみやすい",
    topics: ["プログラミング", "AI", "Web開発"],
    createdAt: "2026-03-01T00:00:00Z",
  },
  {
    id: "char-2",
    name: "CreativeAI",
    avatar: "CA",
    personality: "クリエイティブで芸術的なAI",
    tone: "インスピレーション重視",
    topics: ["デザイン", "アート", "創造性"],
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "char-3",
    name: "BizHelper",
    avatar: "BH",
    personality: "ビジネス戦略に強いコンサルタント",
    tone: "プロフェッショナル",
    topics: ["マーケティング", "起業", "成長戦略"],
    createdAt: "2026-03-20T00:00:00Z",
  },
];

export const posts: Post[] = [
  {
    id: "post-1",
    content: "Next.js 16がリリースされました！新機能をチェックしよう 🚀",
    platform: "twitter",
    status: "published",
    characterId: "char-1",
    publishedAt: "2026-04-05T10:00:00Z",
    createdAt: "2026-04-05T09:30:00Z",
    engagement: { likes: 142, retweets: 38, replies: 12 },
  },
  {
    id: "post-2",
    content: "AIアートの可能性は無限大。今日のインスピレーションをシェアします ✨",
    platform: "instagram",
    status: "published",
    characterId: "char-2",
    publishedAt: "2026-04-04T14:00:00Z",
    createdAt: "2026-04-04T13:00:00Z",
    engagement: { likes: 256, retweets: 0, replies: 34 },
  },
  {
    id: "post-3",
    content: "スタートアップの成長に必要な3つの要素とは？",
    platform: "threads",
    status: "published",
    characterId: "char-3",
    publishedAt: "2026-04-03T08:00:00Z",
    createdAt: "2026-04-03T07:00:00Z",
    engagement: { likes: 89, retweets: 21, replies: 8 },
  },
  {
    id: "post-4",
    content: "TypeScript 6.0のジェネリクス改善がすごい！解説スレッド👇",
    platform: "twitter",
    status: "scheduled",
    characterId: "char-1",
    scheduledAt: "2026-04-07T10:00:00Z",
    createdAt: "2026-04-06T08:00:00Z",
  },
  {
    id: "post-5",
    content: "デザインシステムの構築ガイド - 初心者向け完全版",
    platform: "threads",
    status: "scheduled",
    characterId: "char-2",
    scheduledAt: "2026-04-07T15:00:00Z",
    createdAt: "2026-04-06T09:00:00Z",
  },
  {
    id: "post-6",
    content: "2026年のマーケティングトレンド TOP5",
    platform: "twitter",
    status: "draft",
    characterId: "char-3",
    createdAt: "2026-04-06T10:00:00Z",
  },
];

export const scheduledPosts: ScheduledPost[] = [
  {
    id: "sched-1",
    postId: "post-4",
    scheduledAt: "2026-04-07T10:00:00Z",
    platform: "twitter",
    characterId: "char-1",
    content: "TypeScript 6.0のジェネリクス改善がすごい！解説スレッド👇",
    status: "pending",
  },
  {
    id: "sched-2",
    postId: "post-5",
    scheduledAt: "2026-04-07T15:00:00Z",
    platform: "threads",
    characterId: "char-2",
    content: "デザインシステムの構築ガイド - 初心者向け完全版",
    status: "pending",
  },
  {
    id: "sched-3",
    postId: "post-99",
    scheduledAt: "2026-04-08T09:00:00Z",
    platform: "instagram",
    characterId: "char-3",
    content: "成功する起業家の朝のルーティン",
    status: "pending",
  },
];

export const learningNotes: LearningNote[] = [
  {
    id: "note-1",
    title: "効果的なツイートの構造",
    content: "フック → 本文 → CTA の3構造が効果的。最初の一文で注意を引く。",
    tags: ["Twitter", "ライティング"],
    createdAt: "2026-03-25T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z",
  },
  {
    id: "note-2",
    title: "エンゲージメント向上のコツ",
    content: "質問形式の投稿はリプライ率が2倍。画像付きは1.5倍のインプレッション。",
    tags: ["エンゲージメント", "分析"],
    createdAt: "2026-03-28T00:00:00Z",
    updatedAt: "2026-04-02T00:00:00Z",
  },
];

export const dashboardStats: DashboardStats = {
  totalPosts: 48,
  scheduledPosts: 3,
  totalEngagement: 1842,
  activeCharacters: 3,
  postsThisWeek: 7,
  engagementRate: 4.2,
};
