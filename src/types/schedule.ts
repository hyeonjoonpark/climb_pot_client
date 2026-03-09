export interface Schedule {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string;
  location?: string;
  creatorId: string;
  creatorName: string;
  /** 참여한 사용자 ID 목록 */
  participantIds: string[];
  createdAt: string;
}
