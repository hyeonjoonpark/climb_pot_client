"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type { MatchingProfile, Like } from "@/types/matching";
import {
  getMyProfileFromMock,
  MOCK_MATCHING_PROFILES,
  MOCK_LIKES,
  CURRENT_USER_ID,
} from "@/lib/mock/matching";

const STORAGE_KEY_PROFILE = "climbfriends_my_matching_profile";
const STORAGE_KEY_LIKES = "climbfriends_matching_likes";

function loadMyProfile(): MatchingProfile | null {
  if (typeof window === "undefined") return getMyProfileFromMock();
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) return JSON.parse(raw) as MatchingProfile;
  } catch {}
  return getMyProfileFromMock();
}

function loadLikes(): Like[] {
  if (typeof window === "undefined") return [...MOCK_LIKES];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LIKES);
    if (raw) return JSON.parse(raw) as Like[];
  } catch {}
  return [...MOCK_LIKES];
}

function persistProfile(profile: MatchingProfile | null) {
  if (typeof window === "undefined") return;
  if (profile) localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  else localStorage.removeItem(STORAGE_KEY_PROFILE);
}

function saveLikes(likes: Like[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likes));
}

interface MatchingContextValue {
  myProfile: MatchingProfile | null;
  setMyProfile: (p: MatchingProfile | null) => void;
  saveMyProfile: (p: MatchingProfile) => void;
  likes: Like[];
  addLike: (toProfileId: string) => void;
  removeLike: (toProfileId: string) => void;
  isLikedByMe: (profileId: string) => boolean;
  allProfiles: MatchingProfile[];
}

const MatchingContext = createContext<MatchingContextValue | null>(null);

export function MatchingProvider({ children }: { children: ReactNode }) {
  const [myProfile, setMyProfileState] = useState<MatchingProfile | null>(loadMyProfile);
  const [likes, setLikes] = useState<Like[]>(loadLikes);

  const setMyProfile = useCallback((p: MatchingProfile | null) => {
    setMyProfileState(p);
    persistProfile(p);
  }, []);

  const saveMyProfile = useCallback((p: MatchingProfile) => {
    setMyProfileState(p);
    persistProfile(p);
  }, []);

  const addLike = useCallback((toProfileId: string) => {
    setLikes((prev) => {
      if (prev.some((l) => l.fromUserId === CURRENT_USER_ID && l.toProfileId === toProfileId))
        return prev;
      const next = [...prev, { fromUserId: CURRENT_USER_ID, toProfileId }];
      saveLikes(next);
      return next;
    });
  }, []);

  const removeLike = useCallback((toProfileId: string) => {
    setLikes((prev) => {
      const next = prev.filter(
        (l) => !(l.fromUserId === CURRENT_USER_ID && l.toProfileId === toProfileId)
      );
      saveLikes(next);
      return next;
    });
  }, []);

  const isLikedByMe = useCallback(
    (profileId: string) =>
      likes.some((l) => l.fromUserId === CURRENT_USER_ID && l.toProfileId === profileId),
    [likes]
  );

  const allProfiles = useMemo(
    () => MOCK_MATCHING_PROFILES.filter((p) => p.userId !== CURRENT_USER_ID),
    []
  );

  const value = useMemo(
    () => ({
      myProfile,
      setMyProfile,
      saveMyProfile,
      likes,
      addLike,
      removeLike,
      isLikedByMe,
      allProfiles,
    }),
    [myProfile, setMyProfile, saveMyProfile, likes, addLike, removeLike, isLikedByMe, allProfiles]
  );

  return <MatchingContext.Provider value={value}>{children}</MatchingContext.Provider>;
}

export function useMatching() {
  const ctx = useContext(MatchingContext);
  if (!ctx) throw new Error("useMatching must be used within MatchingProvider");
  return ctx;
}
