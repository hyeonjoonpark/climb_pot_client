import type { Schedule } from "@/types/schedule";

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: "sc1",
    title: "홍대 볼더링 모임",
    description: "주말에 홍대 근처 볼더링장에서 같이 올라요.",
    date: "2025-03-15",
    startTime: "14:00",
    endTime: "17:00",
    location: "홍대입구역 인근",
    creatorId: "u1",
    creatorName: "클라이머A",
    participantIds: ["u1", "u2", "u3"],
    createdAt: "2025-03-05T10:00:00",
  },
  {
    id: "sc2",
    title: "강남 실내 클라이밍",
    date: "2025-03-15",
    startTime: "19:00",
    creatorId: "u2",
    creatorName: "손잡이",
    participantIds: ["u2"],
    createdAt: "2025-03-06T09:00:00",
  },
  {
    id: "sc3",
    title: "양산 실외 클라이밍 동행",
    description: "날씨 좋은 날 양산 쪽 실외 암장 가요.",
    date: "2025-03-22",
    startTime: "09:00",
    location: "양산",
    creatorId: "u1",
    creatorName: "클라이머A",
    participantIds: ["u1", "u4"],
    createdAt: "2025-03-01T14:00:00",
  },
  {
    id: "sc4",
    title: "초보자 친화 볼더링",
    date: "2025-03-08",
    startTime: "15:00",
    creatorId: "u3",
    creatorName: "초보등반",
    participantIds: ["u3", "u5"],
    createdAt: "2025-03-07T11:00:00",
  },
];

/** 현재 로그인 사용자 ID (목업) */
export const CURRENT_USER_ID = "u1";

/** 목업 멤버 목록 (참여/불참 인원 표시용) */
export const MOCK_MEMBERS: { id: string; name: string }[] = [
  { id: "u1", name: "클라이머A" },
  { id: "u2", name: "손잡이" },
  { id: "u3", name: "초보등반" },
  { id: "u4", name: "암벽러" },
  { id: "u5", name: "볼더러" },
];

export function getMemberName(id: string): string {
  return MOCK_MEMBERS.find((m) => m.id === id)?.name ?? id;
}

export function getParticipantNames(participantIds: string[]): string[] {
  return participantIds.map(getMemberName);
}

export function getNonParticipantNames(participantIds: string[]): string[] {
  const set = new Set(participantIds);
  return MOCK_MEMBERS.filter((m) => !set.has(m.id)).map((m) => m.name);
}

export function getSchedulesByDate(dateStr: string): Schedule[] {
  return MOCK_SCHEDULES.filter((s) => s.date === dateStr).sort(
    (a, b) => (a.startTime || "").localeCompare(b.startTime || "")
  );
}

export function getScheduleById(id: string): Schedule | undefined {
  return MOCK_SCHEDULES.find((s) => s.id === id);
}

/** 해당 월에 일정이 있는 날짜 목록 (YYYY-MM-DD) */
export function getDatesWithSchedules(year: number, month: number): string[] {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const set = new Set<string>();
  MOCK_SCHEDULES.forEach((s) => {
    if (s.date.startsWith(prefix)) set.add(s.date);
  });
  return Array.from(set);
}
