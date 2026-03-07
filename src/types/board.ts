export type BoardCategory = "all" | "free";

export interface Post {
  id: string;
  title: string;
  content: string;
  category: "free";
  authorId: string;
  authorName: string;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  /** 이미지 URL 목록 (업로드 후 서버 URL 또는 data URL) */
  imageUrls?: string[];
  /** 영상 URL 목록 */
  videoUrls?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export const CATEGORY_LABEL: Record<Exclude<BoardCategory, "all">, string> = {
  free: "자유게시판",
};
