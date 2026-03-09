export interface MessageUser {
  id: string;
  name: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  /** 마지막 메시지 미리보기 */
  lastMessagePreview?: string;
  /** 마지막 메시지 시각 (정렬용) */
  lastMessageAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
