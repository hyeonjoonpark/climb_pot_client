import type {
  PostReport,
  CommentReport,
  AdminUser,
  Notice,
  DailyActivity,
} from "@/types/admin";

export const MOCK_REPORTS: PostReport[] = [
  {
    id: "r1",
    postId: "1",
    postTitle: "이번 주말 홍대 클라이밍장 같이 가실 분~",
    authorId: "u1",
    authorName: "클라이머A",
    reporterId: "u4",
    reporterName: "암벽쟁이",
    reason: "광고성 게시물로 보입니다.",
    status: "pending",
    createdAt: "2025-03-06T10:00:00",
  },
  {
    id: "r2",
    postId: "4",
    postTitle: "오늘 오르면서 느낀 점",
    authorId: "u1",
    authorName: "클라이머A",
    reporterId: "u5",
    reporterName: "볼더러",
    reason: "욕설 및 비방이 포함되어 있습니다.",
    status: "pending",
    createdAt: "2025-03-06T09:30:00",
  },
  {
    id: "r3",
    postId: "2",
    postTitle: "강남 볼더링장 후기 (실내)",
    authorId: "u2",
    authorName: "손잡이",
    reporterId: "u3",
    reporterName: "초보등반",
    reason: "허위 정보로 판단됩니다.",
    status: "processed",
    createdAt: "2025-03-05T14:00:00",
  },
  {
    id: "r4",
    postId: "3",
    postTitle: "클라이밍화 사이즈 문의",
    authorId: "u3",
    authorName: "초보등반",
    reporterId: "u2",
    reporterName: "손잡이",
    reason: "동의하지 않음 (오해로 신고함)",
    status: "dismissed",
    createdAt: "2025-03-05T11:00:00",
  },
];

export const MOCK_COMMENT_REPORTS: CommentReport[] = [
  {
    id: "cr1",
    commentId: "c1",
    commentContent: "저 참여할게요! 연락처 어떻게 드릴까요?",
    postId: "1",
    postTitle: "이번 주말 홍대 클라이밍장 같이 가실 분~",
    authorId: "u2",
    authorName: "손잡이",
    reporterId: "u5",
    reporterName: "볼더러",
    reason: "스팸/광고성 댓글",
    status: "pending",
    createdAt: "2025-03-06T11:00:00",
  },
  {
    id: "cr2",
    commentId: "c3",
    commentContent: "주차비 얼마나 나왔나요?",
    postId: "2",
    postTitle: "강남 볼더링장 후기 (실내)",
    authorId: "u1",
    authorName: "클라이머A",
    reporterId: "u3",
    reporterName: "초보등반",
    reason: "부적절한 표현 포함",
    status: "dismissed",
    createdAt: "2025-03-05T12:00:00",
  },
];

export const MOCK_USERS: AdminUser[] = [
  {
    id: "u1",
    email: "climbera@example.com",
    nickname: "클라이머A",
    provider: "google",
    role: "USER",
    isSuspended: false,
    createdAt: "2025-02-01T10:00:00",
  },
  {
    id: "u2",
    email: "sonjabi@kakao.com",
    nickname: "손잡이",
    provider: "kakao",
    role: "USER",
    isSuspended: false,
    createdAt: "2025-02-05T14:20:00",
  },
  {
    id: "u3",
    email: "beginner@example.com",
    nickname: "초보등반",
    provider: "google",
    role: "USER",
    isSuspended: false,
    createdAt: "2025-02-10T09:15:00",
  },
  {
    id: "u4",
    email: "admin@climbfriends.com",
    nickname: "관리자",
    provider: "google",
    role: "ADMIN",
    isSuspended: false,
    createdAt: "2025-01-15T08:00:00",
  },
  {
    id: "u5",
    email: "boulderer@example.com",
    nickname: "볼더러",
    provider: "google",
    role: "USER",
    isSuspended: true,
    createdAt: "2025-02-20T16:45:00",
  },
  {
    id: "u6",
    email: "holdlover@kakao.com",
    nickname: "홀드러버",
    provider: "kakao",
    role: "USER",
    isSuspended: false,
    createdAt: "2025-03-01T11:30:00",
  },
];

export const MOCK_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "ClimbFriends 이용 안내",
    content: "클라이밍 친목 커뮤니티 ClimbFriends에 오신 것을 환영합니다. 건전한 소통 부탁드립니다.",
    isPinned: true,
    createdAt: "2025-03-01T09:00:00",
    updatedAt: "2025-03-01T09:00:00",
  },
  {
    id: "n2",
    title: "게시판 운영 정책",
    content: "광고·욕설·비방 등은 신고 대상입니다. 신고 시 검토 후 조치하겠습니다.",
    isPinned: true,
    createdAt: "2025-03-03T10:00:00",
    updatedAt: "2025-03-03T10:00:00",
  },
];

function byCreatedDesc<T extends { createdAt: string }>(a: T, b: T) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

export function getReports(
  status?: "pending" | "processed" | "dismissed"
): PostReport[] {
  if (!status)
    return [...MOCK_REPORTS].sort(byCreatedDesc);
  return MOCK_REPORTS.filter((r) => r.status === status).sort(byCreatedDesc);
}

export function getCommentReports(
  status?: "pending" | "processed" | "dismissed"
): CommentReport[] {
  if (!status)
    return [...MOCK_COMMENT_REPORTS].sort(byCreatedDesc);
  return MOCK_COMMENT_REPORTS.filter((r) => r.status === status).sort(
    byCreatedDesc
  );
}

export function getUsers(): AdminUser[] {
  return [...MOCK_USERS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getNotices(): Notice[] {
  return [...MOCK_NOTICES].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/** 최근 14일 일별 활동 통계 (목업) */
export function getActivityStats(): DailyActivity[] {
  const result: DailyActivity[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    result.push({
      date: dateStr,
      signups: Math.floor(Math.random() * 5),
      posts: Math.floor(Math.random() * 8) + 1,
      comments: Math.floor(Math.random() * 15) + 2,
    });
  }
  return result;
}
