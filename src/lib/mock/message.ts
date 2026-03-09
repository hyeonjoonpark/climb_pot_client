import type { Conversation, Message } from "@/types/message";

/** 현재 로그인 사용자 ID (목업) - 일정/메시지 공통 */
export const CURRENT_USER_ID = "u1";

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

/** 1:1 대화 목록 (참여자 2명, 현재 사용자 포함) */
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    participantIds: ["u1", "u2"],
    lastMessagePreview: "다음에 홍대에서 볼더링 같이 해요!",
    lastMessageAt: "2025-03-07T14:32:00",
  },
  {
    id: "conv2",
    participantIds: ["u1", "u3"],
    lastMessagePreview: "초보라서 조언 많이 부탁드려요",
    lastMessageAt: "2025-03-07T11:20:00",
  },
  {
    id: "conv3",
    participantIds: ["u1", "u4"],
    lastMessagePreview: "양산 일정 확정되면 알려주세요",
    lastMessageAt: "2025-03-06T09:15:00",
  },
];

/** 대화별 메시지 (conversationId 기준) */
export const MOCK_MESSAGES: Message[] = [
  { id: "m1", conversationId: "conv1", senderId: "u2", content: "안녕하세요! 주말에 클라이밍 가실 계획 있으세요?", createdAt: "2025-03-07T14:00:00" },
  { id: "m2", conversationId: "conv1", senderId: "u1", content: "네, 홍대 쪽 생각 중이에요.", createdAt: "2025-03-07T14:05:00" },
  { id: "m3", conversationId: "conv1", senderId: "u2", content: "다음에 홍대에서 볼더링 같이 해요!", createdAt: "2025-03-07T14:32:00" },
  { id: "m4", conversationId: "conv2", senderId: "u3", content: "안녕하세요. 오르는 거 처음인데요.", createdAt: "2025-03-07T11:00:00" },
  { id: "m5", conversationId: "conv2", senderId: "u1", content: "반가워요. 궁금한 거 있으면 편하게 물어보세요.", createdAt: "2025-03-07T11:10:00" },
  { id: "m6", conversationId: "conv2", senderId: "u3", content: "초보라서 조언 많이 부탁드려요", createdAt: "2025-03-07T11:20:00" },
  { id: "m7", conversationId: "conv3", senderId: "u4", content: "양산 실외 일정 언제쯤 가실까요?", createdAt: "2025-03-06T09:00:00" },
  { id: "m8", conversationId: "conv3", senderId: "u1", content: "날씨 보면서 22일쯤 예정이에요.", createdAt: "2025-03-06T09:10:00" },
  { id: "m9", conversationId: "conv3", senderId: "u4", content: "양산 일정 확정되면 알려주세요", createdAt: "2025-03-06T09:15:00" },
];

export function getConversationsForUser(userId: string): Conversation[] {
  return MOCK_CONVERSATIONS.filter((c) => c.participantIds.includes(userId))
    .slice()
    .sort((a, b) => (b.lastMessageAt > a.lastMessageAt ? 1 : -1));
}

export function getMessagesForConversation(conversationId: string): Message[] {
  return MOCK_MESSAGES.filter((m) => m.conversationId === conversationId).sort(
    (a, b) => (a.createdAt > b.createdAt ? 1 : -1)
  );
}

/** 대화의 상대방 ID (1:1 기준) */
export function getOtherParticipantId(conversation: Conversation, currentUserId: string): string {
  const other = conversation.participantIds.find((id) => id !== currentUserId);
  return other ?? conversation.participantIds[0];
}
