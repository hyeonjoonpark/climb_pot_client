export type ReportStatus = "pending" | "processed" | "dismissed";

export interface PostReport {
  id: string;
  postId: string;
  postTitle: string;
  authorId: string;
  authorName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface CommentReport {
  id: string;
  commentId: string;
  commentContent: string;
  postId: string;
  postTitle: string;
  authorId: string;
  authorName: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
  provider: "google" | "kakao";
  role: "USER" | "ADMIN";
  isSuspended?: boolean;
  createdAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DailyActivity {
  date: string;
  signups: number;
  posts: number;
  comments: number;
}
