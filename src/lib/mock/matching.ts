import type { MatchingProfile, ClimbingLevel, PreferredClimbing, Like, SortOption } from "@/types/matching";

export const CURRENT_USER_ID = "u1";

export const MOCK_MATCHING_PROFILES: MatchingProfile[] = [
  {
    id: "mp1",
    userId: "u2",
    nickname: "손잡이",
    intro: "주말마다 홍대 볼더링장 다니는 1년차예요. 같이 오르면서 실력 늘렸으면 좋겠어요!",
    climbingLevel: "intermediate",
    preferredClimbing: "bouldering",
    region: "서울 · 홍대",
    ageRange: "20대 후반",
    profileImageUrl: "https://picsum.photos/seed/mp1/200/200",
    createdAt: "2025-03-01T10:00:00",
  },
  {
    id: "mp2",
    userId: "u3",
    nickname: "초보등반",
    intro: "막 시작한 진짜 초보에요. 친절하게 알려주실 분 구해요 ㅎㅎ",
    climbingLevel: "beginner",
    preferredClimbing: "both",
    region: "경기",
    ageRange: "20대 중반",
    profileImageUrl: "https://picsum.photos/seed/mp2/200/200",
    createdAt: "2025-03-02T14:00:00",
  },
  {
    id: "mp3",
    userId: "u4",
    nickname: "암벽러",
    intro: "리드 클라이밍 좋아해요. 실외 암장이나 인공암장 둘 다 가요.",
    climbingLevel: "advanced",
    preferredClimbing: "lead",
    region: "서울 · 강남",
    ageRange: "30대 초반",
    profileImageUrl: "https://picsum.photos/seed/mp3/200/200",
    createdAt: "2025-03-03T09:00:00",
  },
  {
    id: "mp4",
    userId: "u5",
    nickname: "볼더러",
    intro: "볼더링만 해요. V4 정도 오르고 있어요. 같이 라이트 풀고 카페 가요!",
    climbingLevel: "intermediate",
    preferredClimbing: "bouldering",
    region: "서울 · 잠실",
    ageRange: "20대 후반",
    createdAt: "2025-03-04T18:00:00",
  },
  {
    id: "mp5",
    userId: "u1",
    nickname: "클라이머A",
    intro: "볼더링·리드 둘 다 즐겨요. 동행 구할 때마다 여기서 구해요.",
    climbingLevel: "intermediate",
    preferredClimbing: "both",
    region: "서울",
    ageRange: "20대",
    profileImageUrl: "https://picsum.photos/seed/mp5/200/200",
    createdAt: "2025-03-05T11:00:00",
  },
];

/** fromUserId가 toProfileId에 관심 표시 */
export const MOCK_LIKES: Like[] = [
  { fromUserId: "u1", toProfileId: "mp1" },
  { fromUserId: "u2", toProfileId: "mp5" },
];

const LEVEL_LABEL: Record<MatchingProfile["climbingLevel"], string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
  any: "상관없음",
};

const PREFERRED_LABEL: Record<MatchingProfile["preferredClimbing"], string> = {
  bouldering: "볼더링",
  lead: "리드",
  both: "볼더링·리드",
  any: "상관없음",
};

const LEVEL_ORDER: Record<ClimbingLevel, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  any: 1,
};

export function getLevelLabel(level: MatchingProfile["climbingLevel"]): string {
  return LEVEL_LABEL[level];
}

export function getPreferredLabel(preferred: MatchingProfile["preferredClimbing"]): string {
  return PREFERRED_LABEL[preferred];
}

export function getMyProfileFromMock(): MatchingProfile | null {
  return MOCK_MATCHING_PROFILES.find((p) => p.userId === CURRENT_USER_ID) ?? null;
}

export function getLevelOrder(level: ClimbingLevel): number {
  return LEVEL_ORDER[level] ?? 1;
}

export function getProfileById(profileId: string): MatchingProfile | undefined {
  return MOCK_MATCHING_PROFILES.find((p) => p.id === profileId);
}

export function getProfileByUserId(userId: string): MatchingProfile | undefined {
  return MOCK_MATCHING_PROFILES.find((p) => p.userId === userId);
}

/** 내가 관심 표시한 프로필 ID 목록 */
export function getLikedProfileIds(likes: Like[]): string[] {
  return likes.filter((l) => l.fromUserId === CURRENT_USER_ID).map((l) => l.toProfileId);
}

/** 내 프로필을 관심 표시한 userId 목록 (내 프로필 ID 필요) */
export function getLikedByUserIds(likes: Like[], myProfileId: string | null): string[] {
  if (!myProfileId) return [];
  return likes.filter((l) => l.toProfileId === myProfileId).map((l) => l.fromUserId);
}

/** 서로 관심 표시한 userId 목록 (매칭됨) */
export function getMatchedUserIds(likes: Like[], myProfileId: string | null): string[] {
  const iLiked = new Set(getLikedProfileIds(likes).map((id) => getProfileById(id)?.userId).filter(Boolean));
  const likedMe = getLikedByUserIds(likes, myProfileId);
  return likedMe.filter((uid) => iLiked.has(uid));
}

export const REGION_OPTIONS = ["전체", "서울", "서울 · 홍대", "서울 · 강남", "서울 · 잠실", "경기"];
export const AGE_OPTIONS = ["전체", "20대", "20대 중반", "20대 후반", "30대 초반"];

export function filterProfiles(
  profiles: MatchingProfile[],
  opts: {
    level?: ClimbingLevel | "";
    region?: string;
    preferred?: PreferredClimbing | "";
    ageRange?: string;
  }
): MatchingProfile[] {
  let list = [...profiles];
  if (opts.level && opts.level !== "any") {
    list = list.filter((p) => p.climbingLevel === opts.level);
  }
  if (opts.region && opts.region !== "전체") {
    list = list.filter((p) => p.region?.includes(opts.region!) ?? false);
  }
  if (opts.preferred && opts.preferred !== "any") {
    list = list.filter((p) => p.preferredClimbing === opts.preferred);
  }
  if (opts.ageRange && opts.ageRange !== "전체") {
    list = list.filter((p) => p.ageRange === opts.ageRange);
  }
  return list;
}

export function sortProfiles(profiles: MatchingProfile[], sort: SortOption): MatchingProfile[] {
  const list = [...profiles];
  if (sort === "latest") {
    list.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  } else if (sort === "level") {
    list.sort((a, b) => getLevelOrder(a.climbingLevel) - getLevelOrder(b.climbingLevel));
  } else if (sort === "name") {
    list.sort((a, b) => a.nickname.localeCompare(b.nickname));
  }
  return list;
}
