"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MatchingProfile, ClimbingLevel, PreferredClimbing, SortOption } from "@/types/matching";
import { useMatching } from "@/context/MatchingContext";
import {
  getLevelLabel,
  getPreferredLabel,
  filterProfiles,
  sortProfiles,
  getLikedProfileIds,
  getLikedByUserIds,
  getMatchedUserIds,
  getProfileById,
  REGION_OPTIONS,
  AGE_OPTIONS,
  CURRENT_USER_ID,
} from "@/lib/mock/matching";

type TabId = "recommend" | "liked" | "likedMe" | "matched";

const LEVEL_FILTER_OPTIONS: { value: ClimbingLevel | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
];

const PREFERRED_FILTER_OPTIONS: { value: PreferredClimbing | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "bouldering", label: "볼더링" },
  { value: "lead", label: "리드" },
  { value: "both", label: "둘 다" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "level", label: "실력순" },
  { value: "name", label: "이름순" },
];

function ProfileCard({
  profile,
  onShowDetail,
  isLiked,
  onToggleLike,
  isMatched,
}: {
  profile: MatchingProfile;
  onShowDetail: () => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isMatched: boolean;
}) {
  const introShort =
    profile.intro.length > 60 ? profile.intro.slice(0, 60) + "…" : profile.intro;
  return (
    <article className="rounded-2xl border border-[#e5e8eb] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-burgundy/15">
          {profile.profileImageUrl ? (
            <Image
              src={profile.profileImageUrl}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-burgundy">
              {profile.nickname.slice(0, 1)}
            </span>
          )}
          {isMatched && (
            <span className="absolute -right-1 -top-1 rounded-full bg-burgundy px-1.5 py-0.5 text-[10px] font-medium text-white">
              매칭
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#191f28]">{profile.nickname}</h3>
          {profile.region && (
            <p className="mt-0.5 text-xs text-[#8b95a1]">{profile.region}</p>
          )}
          <p className="mt-2 line-clamp-2 text-sm text-[#4e5968]">{introShort}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#f2f4f6] px-2.5 py-0.5 text-xs font-medium text-[#4e5968]">
              {getLevelLabel(profile.climbingLevel)}
            </span>
            <span className="rounded-full bg-[#f2f4f6] px-2.5 py-0.5 text-xs font-medium text-[#4e5968]">
              {getPreferredLabel(profile.preferredClimbing)}
            </span>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onToggleLike}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                isLiked
                  ? "bg-burgundy/10 text-burgundy hover:bg-burgundy/20"
                  : "border border-[#e5e8eb] text-[#4e5968] hover:bg-[#f9fafb]"
              }`}
            >
              {isLiked ? "관심 해제" : "관심 있어요"}
            </button>
            <button
              type="button"
              onClick={onShowDetail}
              className="flex-1 rounded-lg bg-burgundy py-2 text-sm font-medium text-white hover:bg-burgundy-hover"
            >
              프로필 보기
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MatchingPage() {
  const { myProfile, allProfiles, likes, addLike, removeLike, isLikedByMe } = useMatching();
  const [tab, setTab] = useState<TabId>("recommend");
  const [levelFilter, setLevelFilter] = useState<ClimbingLevel | "">("");
  const [regionFilter, setRegionFilter] = useState(REGION_OPTIONS[0]);
  const [preferredFilter, setPreferredFilter] = useState<PreferredClimbing | "">("");
  const [ageFilter, setAgeFilter] = useState(AGE_OPTIONS[0]);
  const [sort, setSort] = useState<SortOption>("latest");
  const [selectedProfile, setSelectedProfile] = useState<MatchingProfile | null>(null);

  const likedProfileIds = useMemo(() => getLikedProfileIds(likes), [likes]);
  const likedByUserIds = useMemo(
    () => getLikedByUserIds(likes, myProfile?.id ?? null),
    [likes, myProfile?.id]
  );
  const matchedUserIds = useMemo(
    () => new Set(getMatchedUserIds(likes, myProfile?.id ?? null)),
    [likes, myProfile?.id]
  );

  const recommendList = useMemo(() => {
    let list = filterProfiles(allProfiles, {
      level: levelFilter || undefined,
      region: regionFilter !== "전체" ? regionFilter : undefined,
      preferred: preferredFilter || undefined,
      ageRange: ageFilter !== "전체" ? ageFilter : undefined,
    });
    return sortProfiles(list, sort);
  }, [allProfiles, levelFilter, regionFilter, preferredFilter, ageFilter, sort]);

  const likedList = useMemo(
    () => likedProfileIds.map((id) => getProfileById(id)).filter(Boolean) as MatchingProfile[],
    [likedProfileIds]
  );

  const likedMeList = useMemo(() => {
    return allProfiles.filter((p) => likedByUserIds.includes(p.userId));
  }, [allProfiles, likedByUserIds]);

  const matchedList = useMemo(() => {
    return allProfiles.filter((p) => matchedUserIds.has(p.userId));
  }, [allProfiles, matchedUserIds]);

  const currentList =
    tab === "recommend"
      ? recommendList
      : tab === "liked"
        ? likedList
        : tab === "likedMe"
          ? likedMeList
          : matchedList;

  const handleToggleLike = (profileId: string) => {
    if (isLikedByMe(profileId)) removeLike(profileId);
    else addLike(profileId);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-6">
        <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#191f28]">클라이머 소개팅</h1>
            <p className="mt-1 text-sm text-[#4e5968]">
              같은 취미를 가진 클라이머를 만나보세요.
            </p>
          </div>
          <Link
            href="/matching/profile"
            className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-burgundy-hover"
          >
            {myProfile ? "내 프로필 수정" : "내 프로필 등록"}
          </Link>
        </section>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { id: "recommend" as TabId, label: "추천" },
              { id: "liked" as TabId, label: "관심 표시한 목록" },
              { id: "likedMe" as TabId, label: "나를 관심 표시" },
              { id: "matched" as TabId, label: "매칭" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id ? "bg-burgundy text-white" : "bg-white text-[#4e5968] ring-1 ring-[#e5e8eb] hover:bg-[#f9fafb]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "recommend" && (
          <div className="mb-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#4e5968]">실력:</span>
              {LEVEL_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value || "all"}
                  type="button"
                  onClick={() => setLevelFilter(opt.value as ClimbingLevel | "")}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    levelFilter === opt.value ? "bg-burgundy text-white" : "bg-white ring-1 ring-[#e5e8eb] text-[#4e5968]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#4e5968]">지역:</span>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm"
              >
                {REGION_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <span className="text-sm font-medium text-[#4e5968]">선호:</span>
              {PREFERRED_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value || "all"}
                  type="button"
                  onClick={() => setPreferredFilter(opt.value as PreferredClimbing | "")}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    preferredFilter === opt.value ? "bg-burgundy text-white" : "bg-white ring-1 ring-[#e5e8eb] text-[#4e5968]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <span className="text-sm font-medium text-[#4e5968]">연령:</span>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#4e5968]">정렬:</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSort(opt.value)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    sort === opt.value ? "bg-burgundy text-white" : "bg-white ring-1 ring-[#e5e8eb] text-[#4e5968]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <ul className="grid gap-4 sm:grid-cols-2">
          {currentList.map((profile) => (
            <li key={profile.id}>
              <ProfileCard
                profile={profile}
                onShowDetail={() => setSelectedProfile(profile)}
                isLiked={isLikedByMe(profile.id)}
                onToggleLike={() => handleToggleLike(profile.id)}
                isMatched={matchedUserIds.has(profile.userId)}
              />
            </li>
          ))}
        </ul>

        {currentList.length === 0 && (
          <p className="py-12 text-center text-[#8b95a1]">
            {tab === "recommend"
              ? "해당 조건의 프로필이 없습니다."
              : tab === "liked"
                ? "관심 표시한 프로필이 없습니다."
                : tab === "likedMe"
                  ? "나를 관심 표시한 사람이 없습니다."
                  : "매칭된 사람이 없습니다."}
          </p>
        )}
      </div>

      {selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedProfile(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-burgundy/15">
                  {selectedProfile.profileImageUrl ? (
                    <Image
                      src={selectedProfile.profileImageUrl}
                      alt=""
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-burgundy">
                      {selectedProfile.nickname.slice(0, 1)}
                    </span>
                  )}
                  {matchedUserIds.has(selectedProfile.userId) && (
                    <span className="absolute -right-1 -top-1 rounded-full bg-burgundy px-2 py-0.5 text-xs font-medium text-white">
                      매칭됨
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#191f28]">{selectedProfile.nickname}</h2>
                  {selectedProfile.region && (
                    <p className="text-sm text-[#8b95a1]">{selectedProfile.region}</p>
                  )}
                  {selectedProfile.ageRange && (
                    <p className="text-sm text-[#8b95a1]">{selectedProfile.ageRange}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-burgundy/10 px-2.5 py-0.5 text-xs font-medium text-burgundy">
                      {getLevelLabel(selectedProfile.climbingLevel)}
                    </span>
                    <span className="rounded-full bg-[#f2f4f6] px-2.5 py-0.5 text-xs font-medium text-[#4e5968]">
                      {getPreferredLabel(selectedProfile.preferredClimbing)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="rounded-lg p-1 text-[#4e5968] hover:bg-[#f2f4f6]"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[#4e5968]">
              {selectedProfile.intro}
            </p>
            <div className="mt-6 flex gap-2">
              <Link
                href={`/message?open=${selectedProfile.userId}`}
                className="flex-1 rounded-lg bg-burgundy py-2.5 text-center text-sm font-medium text-white hover:bg-burgundy-hover"
              >
                메시지 보내기
              </Link>
              <button
                type="button"
                onClick={() => handleToggleLike(selectedProfile.id)}
                className={`rounded-lg py-2.5 px-4 text-sm font-medium ${
                  isLikedByMe(selectedProfile.id)
                    ? "bg-burgundy/10 text-burgundy"
                    : "border border-[#e5e8eb] text-[#4e5968]"
                }`}
              >
                {isLikedByMe(selectedProfile.id) ? "관심 해제" : "관심 있어요"}
              </button>
              <button
                type="button"
                onClick={() => setSelectedProfile(null)}
                className="rounded-lg border border-[#e5e8eb] px-4 py-2.5 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
