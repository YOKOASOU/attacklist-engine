// ============================================================
// Platform & Status Enums
// ============================================================

export type PlatformType = "twitter" | "instagram" | "threads";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type ScheduleStatus = "pending" | "sent" | "failed" | "cancelled";

// ============================================================
// Database Row Types (Supabase テーブルと1:1対応)
// ============================================================

export interface PostPersona {
  id: string;
  user_id: string;
  name: string;
  avatar: string;
  personality: string;
  tone: string;
  topics: string[];
  created_at: string;
  updated_at: string;
}

export interface PostIdea {
  id: string;
  user_id: string;
  persona_id: string | null;
  title: string;
  content: string;
  tags: string[];
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedPost {
  id: string;
  user_id: string;
  persona_id: string | null;
  idea_id: string | null;
  content: string;
  platform: PlatformType;
  status: PostStatus;
  prompt_used: string | null;
  model_used: string | null;
  tone_setting: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ScheduledPost {
  id: string;
  user_id: string;
  generated_post_id: string;
  scheduledAt: string;            // camelCase for frontend compat
  platform: PlatformType;
  status: ScheduleStatus;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostMetric {
  id: string;
  generated_post_id: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  clicks: number;
  recorded_at: string;
}

// ============================================================
// Legacy aliases (既存コンポーネントとの互換)
// ============================================================

export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  tone: string;
  topics: string[];
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  platform: PlatformType;
  status: PostStatus;
  characterId: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  engagement?: {
    likes: number;
    retweets: number;
    replies: number;
  };
}

export interface LearningNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  totalEngagement: number;
  activeCharacters: number;
  postsThisWeek: number;
  engagementRate: number;
}
