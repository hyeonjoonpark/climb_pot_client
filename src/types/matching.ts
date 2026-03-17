/** 클라이밍 실력 구간 */
export type ClimbingLevel =
  | "beginner"   // 초급
  | "intermediate" // 중급
  | "advanced"   // 고급
  | "any";       // 상관없음

/** 선호 클라이밍 (볼더링/리드 등) */
export type PreferredClimbing = "bouldering" | "lead" | "both" | "any";

export interface MatchingProfile {
  id: string;
  userId: string;
  nickname: string;
  intro: string;
  climbingLevel: ClimbingLevel;
  preferredClimbing: PreferredClimbing;
  region?: string;
  profileImageUrl?: string;
  ageRange?: string;
  createdAt: string;
}

export interface Like {
  fromUserId: string;
  toProfileId: string;
}

export type SortOption = "latest" | "level" | "name";
