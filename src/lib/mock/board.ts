import type { Post, Comment } from "@/types/board";

const BASE_POSTS: Post[] = [
  {
    id: "1",
    title: "이번 주말 홍대 클라이밍장 같이 가실 분~",
    content: "주말에 홍대 근처 볼더링장 가려고 합니다. 초보도 환영해요!\n\n시간: 토요일 오후 2시\n장소: 홍대입구역 근처\n\n관심 있으시면 댓글 남겨주세요.",
    category: "free",
    authorId: "u1",
    authorName: "클라이머A",
    createdAt: "2025-03-05T14:30:00",
    viewCount: 42,
    commentCount: 5,
  },
  {
    id: "2",
    title: "강남 볼더링장 후기 (실내)",
    content: "오늘 처음 가봤는데 시설이 좋고 루트도 다양했어요. 주차는 유료인 점만 참고하시면 될 것 같아요.",
    category: "free",
    authorId: "u2",
    authorName: "손잡이",
    createdAt: "2025-03-04T10:00:00",
    viewCount: 128,
    commentCount: 12,
    imageUrls: ["https://picsum.photos/seed/climb1/800/500"],
  },
  {
    id: "3",
    title: "클라이밍화 사이즈 문의",
    content: "처음 클라이밍화 살 예정인데, 일반 신발보다 한 치수 작게 신는 게 맞나요? 브랜드마다 다른가요?",
    category: "free",
    authorId: "u3",
    authorName: "초보등반",
    createdAt: "2025-03-03T09:15:00",
    viewCount: 89,
    commentCount: 8,
  },
  {
    id: "4",
    title: "오늘 오르면서 느낀 점",
    content: "한 달 전에는 V2도 힘들었는데 오늘 V3 풀었어요. 꾸준히 가는 게 답인 것 같아요 ㅎㅎ",
    category: "free",
    authorId: "u1",
    authorName: "클라이머A",
    createdAt: "2025-03-02T20:00:00",
    viewCount: 56,
    commentCount: 3,
    imageUrls: [
      "https://picsum.photos/seed/climb2/400/300",
      "https://picsum.photos/seed/climb3/400/300",
    ],
  },
  {
    id: "5",
    title: "3월 중순 양산 동행 구해요",
    content: "양산 실외 암장 가보고 싶은데 혼자라서 동행 구합니다. 경험 1년차 정도에요.",
    category: "free",
    authorId: "u2",
    authorName: "손잡이",
    createdAt: "2025-03-01T16:45:00",
    viewCount: 31,
    commentCount: 2,
  },
];

const EXTRA_TITLES = [
  "클라이밍 처음 시작했어요",
  "V4 도전 중인데 팁 있나요?",
  "인천 쪽 실내 암장 추천 부탁해요",
  "오늘 첫 리드 클라이밍 해봤어요",
  "동작구 근처 같이 올라갈 분",
  "손가락 테이프 어떻게 감나요?",
  "초보용 루트 추천해주세요",
  "클라이밍화 라스포르티바 vs 스카파",
  "암벽장 예약 어떻게 하시나요?",
  "주말에 성남 클라이밍장 갈 사람?",
  "코어 운동 루틴 공유해요",
  "실내 vs 실외 뭐가 더 재밌어요?",
  "부상 당한 적 있으신가요",
  "클라이밍 모임 참여 후기",
  "볼더링만 2년 했는데 리드 시작해도 될까요",
  "날씨 좋은데 실외 가실 분",
  "홀드 청소 어떻게 하시나요?",
  "초보 동반 구해요 (서울)",
  "클라이밍 다이어리 쓰시나요?",
  "오늘 프 send 했어요 ㅠㅠ",
  "암벽화 끼는 법 조언 부탁드려요",
  "주말 양산 가실 분 구해요",
  "클라이밍 유튜브 채널 추천",
  "손 물집 관리 방법",
  "실력 오를 때까지 걸린 기간",
  "여성 클라이머분들 옷차림 추천",
  "아이들과 가기 좋은 암장",
  "클라이밍 1년차 후기",
  "리드 벨레이 하는 법 배우고 싶어요",
  "동네 암장 비교 후기",
  "풀업 없이도 클라이밍 잘 할 수 있나요?",
  "오늘 암장에서 좋은 분 만났어요",
  "클라이밍으로 다이어트 되셨나요?",
  "초급 루트 추천 (강남)",
  "손톱 짧게 깎아야 하나요?",
];

const AUTHORS = [
  { id: "u1", name: "클라이머A" },
  { id: "u2", name: "손잡이" },
  { id: "u3", name: "초보등반" },
  { id: "u4", name: "암벽쟁이" },
  { id: "u5", name: "볼더러" },
  { id: "u6", name: "홀드러버" },
  { id: "u7", name: "등반초보" },
  { id: "u8", name: "클라이밍마스터" },
];

function makeDate(daysAgo: number, hour: number, minute: number): string {
  const d = new Date("2025-03-05T14:30:00");
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString().slice(0, 19);
}

const extraPosts: Post[] = EXTRA_TITLES.map((title, i) => {
  const author = AUTHORS[i % AUTHORS.length];
  const daysAgo = 5 + Math.floor(i / 2);
  const hour = 8 + (i % 12);
  const minute = (i % 4) * 15;
  return {
    id: String(BASE_POSTS.length + i + 1),
    title,
    content: `${title}에 대한 내용입니다. 클라이밍 커뮤니티에서 정보 나눠요.`,
    category: "free" as const,
    authorId: author.id,
    authorName: author.name,
    createdAt: makeDate(daysAgo, hour, minute),
    viewCount: Math.floor(Math.random() * 150) + 10,
    commentCount: Math.floor(Math.random() * 20),
  };
});

export const MOCK_POSTS: Post[] = [...BASE_POSTS, ...extraPosts];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    postId: "1",
    authorId: "u2",
    authorName: "손잡이",
    content: "저 참여할게요! 연락처 어떻게 드릴까요?",
    createdAt: "2025-03-05T15:00:00",
  },
  {
    id: "c2",
    postId: "1",
    authorId: "u3",
    authorName: "초보등반",
    content: "저도 초보인데 괜찮을까요 ㅠ",
    createdAt: "2025-03-05T15:30:00",
  },
  {
    id: "c3",
    postId: "2",
    authorId: "u1",
    authorName: "클라이머A",
    content: "주차비 얼마나 나왔나요?",
    createdAt: "2025-03-04T11:00:00",
  },
];

function byCreatedDesc(a: Post, b: Post) {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

let cachedFreeList: Post[] | null = null;

/** 작성일자 기준 최신순 정렬. 결과 캐시로 재정렬 비용 감소 */
export function getPosts(category: string): Post[] {
  if (category === "free") {
    if (!cachedFreeList) {
      cachedFreeList = MOCK_POSTS.filter((p) => p.category === "free").sort(byCreatedDesc);
    }
    return cachedFreeList;
  }
  if (category === "all") {
    return [...MOCK_POSTS].sort(byCreatedDesc);
  }
  return MOCK_POSTS.filter((p) => p.category === category).sort(byCreatedDesc);
}

export function getPostById(id: string): Post | undefined {
  return MOCK_POSTS.find((p) => p.id === id);
}

export function getCommentsByPostId(postId: string): Comment[] {
  return MOCK_COMMENTS.filter((c) => c.postId === postId).sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}
