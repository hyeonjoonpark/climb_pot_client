"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useMatching } from "@/context/MatchingContext";
import { CURRENT_USER_ID } from "@/lib/mock/matching";
import type { MatchingProfile, ClimbingLevel, PreferredClimbing } from "@/types/matching";

const LEVEL_OPTIONS: { value: ClimbingLevel; label: string }[] = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
  { value: "any", label: "상관없음" },
];

const PREFERRED_OPTIONS: { value: PreferredClimbing; label: string }[] = [
  { value: "bouldering", label: "볼더링" },
  { value: "lead", label: "리드" },
  { value: "both", label: "볼더링·리드" },
  { value: "any", label: "상관없음" },
];

const REGION_OPTIONS = ["서울", "서울 · 홍대", "서울 · 강남", "서울 · 잠실", "경기", "기타"];
const AGE_OPTIONS = ["20대", "20대 중반", "20대 후반", "30대 초반", "30대", "비공개"];

export default function MatchingProfilePage() {
  const { myProfile, setMyProfile } = useMatching();
  const [form, setForm] = useState({
    nickname: "",
    intro: "",
    climbingLevel: "intermediate" as ClimbingLevel,
    preferredClimbing: "both" as PreferredClimbing,
    region: "",
    ageRange: "",
    profileImageUrl: "",
  });

  useEffect(() => {
    if (myProfile) {
      setForm({
        nickname: myProfile.nickname,
        intro: myProfile.intro,
        climbingLevel: myProfile.climbingLevel,
        preferredClimbing: myProfile.preferredClimbing,
        region: myProfile.region ?? "",
        ageRange: myProfile.ageRange ?? "",
        profileImageUrl: myProfile.profileImageUrl ?? "",
      });
    }
  }, [myProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: MatchingProfile = {
      id: myProfile?.id ?? `my_${Date.now()}`,
      userId: CURRENT_USER_ID,
      nickname: form.nickname.trim(),
      intro: form.intro.trim(),
      climbingLevel: form.climbingLevel,
      preferredClimbing: form.preferredClimbing,
      region: form.region || undefined,
      ageRange: form.ageRange || undefined,
      profileImageUrl: form.profileImageUrl.trim() || undefined,
      createdAt: myProfile?.createdAt ?? new Date().toISOString().slice(0, 19),
    };
    setMyProfile(profile);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-24 pb-16">
      <div className="mx-auto max-w-xl px-6">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/matching"
            className="text-[#4e5968] hover:text-[#191f28]"
          >
            ← 소개팅
          </Link>
          <h1 className="text-xl font-bold text-[#191f28]">
            {myProfile ? "내 프로필 수정" : "내 프로필 등록"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-[#e5e8eb] bg-white p-6 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-[#191f28]">닉네임</label>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
              placeholder="닉네임"
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">한줄 소개</label>
            <textarea
              value={form.intro}
              onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
              placeholder="나를 소개해보세요"
              rows={4}
              className="mt-1 w-full resize-none rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">클라이밍 실력</label>
            <select
              value={form.climbingLevel}
              onChange={(e) => setForm((p) => ({ ...p, climbingLevel: e.target.value as ClimbingLevel }))}
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
            >
              {LEVEL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">선호 종목</label>
            <select
              value={form.preferredClimbing}
              onChange={(e) => setForm((p) => ({ ...p, preferredClimbing: e.target.value as PreferredClimbing }))}
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
            >
              {PREFERRED_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">지역</label>
            <select
              value={form.region}
              onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
            >
              <option value="">선택</option>
              {REGION_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">연령대</label>
            <select
              value={form.ageRange}
              onChange={(e) => setForm((p) => ({ ...p, ageRange: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
            >
              <option value="">선택</option>
              {AGE_OPTIONS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">프로필 사진 URL</label>
            <input
              type="url"
              value={form.profileImageUrl}
              onChange={(e) => setForm((p) => ({ ...p, profileImageUrl: e.target.value }))}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-burgundy py-2.5 text-sm font-medium text-white hover:bg-burgundy-hover"
            >
              {myProfile ? "수정하기" : "등록하기"}
            </button>
            <Link
              href="/matching"
              className="rounded-lg border border-[#e5e8eb] px-4 py-2.5 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
