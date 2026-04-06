export interface Post {
  id: string;
  content: string;
  platform: "twitter" | "instagram" | "threads";
  status: "draft" | "scheduled" | "published" | "failed";
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

export interface Character {
  id: string;
  name: string;
  avatar: string;
  personality: string;
  tone: string;
  topics: string[];
  createdAt: string;
}

export interface ScheduledPost {
  id: string;
  postId: string;
  scheduledAt: string;
  platform: "twitter" | "instagram" | "threads";
  characterId: string;
  content: string;
  status: "pending" | "sent" | "failed";
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
