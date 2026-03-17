"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Conversation, Message } from "@/types/message";
import {
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_MEMBERS,
  CURRENT_USER_ID,
  getMemberName,
  getOtherParticipantId,
} from "@/lib/mock/message";

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const h = d.getHours();
  const m = d.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const hour = h <= 12 ? (h === 0 ? 12 : h) : h - 12;
  const timeStr = `${ampm} ${hour}:${String(m).padStart(2, "0")}`;
  if (sameDay) return timeStr;
  return `${d.getMonth() + 1}/${d.getDate()} ${timeStr}`;
}

function formatListTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) {
    const h = d.getHours();
    const m = d.getMinutes();
    return `${h < 12 ? "오전" : "오후"} ${h <= 12 ? (h === 0 ? 12 : h) : h - 12}:${String(m).padStart(2, "0")}`;
  }
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function MessagePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    [...MOCK_CONVERSATIONS].sort((a, b) => (b.lastMessageAt > a.lastMessageAt ? 1 : -1))
  );
  const [messagesByConv, setMessagesByConv] = useState<Record<string, Message[]>>(() => {
    const map: Record<string, Message[]> = {};
    MOCK_MESSAGES.forEach((m) => {
      if (!map[m.conversationId]) map[m.conversationId] = [];
      map[m.conversationId].push(m);
    });
    Object.keys(map).forEach((id) =>
      map[id].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
    );
    return map;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = useMemo(
    () => (selectedId ? conversations.find((c) => c.id === selectedId) : null),
    [selectedId, conversations]
  );
  const otherUserId = selectedConversation
    ? getOtherParticipantId(selectedConversation, CURRENT_USER_ID)
    : null;
  const otherUserName = otherUserId ? getMemberName(otherUserId) : "";
  const messages = selectedId ? messagesByConv[selectedId] ?? [] : [];

  const openOrCreateConversation = (otherId: string) => {
    const existing = conversations.find(
      (c) => c.participantIds.includes(CURRENT_USER_ID) && c.participantIds.includes(otherId)
    );
    if (existing) {
      setSelectedId(existing.id);
    } else {
      const newId = `conv_${otherId}_${Date.now()}`;
      const newConv: Conversation = {
        id: newId,
        participantIds: [CURRENT_USER_ID, otherId],
        lastMessageAt: new Date().toISOString().slice(0, 19),
      };
      setConversations((prev) => [newConv, ...prev]);
      setMessagesByConv((prev) => ({ ...prev, [newId]: [] }));
      setSelectedId(newId);
    }
    setShowNewChat(false);
  };

  useEffect(() => {
    const openUserId = searchParams.get("open");
    if (openUserId && openUserId !== CURRENT_USER_ID) {
      openOrCreateConversation(openUserId);
      router.replace("/message", { scroll: false });
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !selectedId) return;
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const createdAt =
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T` +
      `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedId,
      senderId: CURRENT_USER_ID,
      content: text,
      createdAt,
    };
    setMessagesByConv((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }));
    setConversations((prev) => {
      const next = prev.map((c) =>
        c.id === selectedId
          ? {
              ...c,
              lastMessagePreview: text.slice(0, 30) + (text.length > 30 ? "…" : ""),
              lastMessageAt: newMsg.createdAt,
            }
          : c
      );
      return next.sort((a, b) => (b.lastMessageAt > a.lastMessageAt ? 1 : -1));
    });
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-16">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl">
        {/* 대화 목록 */}
        <aside
          className={`w-full shrink-0 border-r border-[#e5e8eb] bg-white md:w-80 ${
            selectedId ? "hidden md:block" : ""
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-[#e5e8eb] px-4">
            <h1 className="text-lg font-bold text-[#191f28]">메세지</h1>
            <button
              type="button"
              onClick={() => setShowNewChat(true)}
              className="text-sm font-medium text-burgundy hover:text-burgundy-hover"
            >
              새 메시지
            </button>
          </div>
          <ul className="overflow-y-auto">
            {conversations.map((conv) => {
              const otherId = getOtherParticipantId(conv, CURRENT_USER_ID);
              const name = getMemberName(otherId);
              const isSelected = conv.id === selectedId;
              return (
                <li key={conv.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(conv.id)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f2f4f6] ${
                      isSelected ? "bg-[#f2f4f6]" : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-burgundy/20 text-base font-semibold text-burgundy">
                      {name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#191f28]">{name}</p>
                      <p className="truncate text-sm text-[#8b95a1]">
                        {conv.lastMessagePreview || "대화를 시작해보세요"}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-[#8b95a1]">
                      {formatListTime(conv.lastMessageAt)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {showNewChat && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 md:left-80">
              <div
                className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-[#191f28]">새 메시지</h2>
                  <button
                    type="button"
                    onClick={() => setShowNewChat(false)}
                    className="rounded-lg p-1 text-[#4e5968] hover:bg-[#f2f4f6]"
                    aria-label="닫기"
                  >
                    ✕
                  </button>
                </div>
                <p className="mt-1 text-sm text-[#8b95a1]">대화할 상대를 선택하세요.</p>
                <ul className="mt-3 max-h-64 overflow-y-auto">
                  {MOCK_MEMBERS.filter((m) => m.id !== CURRENT_USER_ID).map((member) => (
                    <li key={member.id}>
                      <button
                        type="button"
                        onClick={() => openOrCreateConversation(member.id)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-[#f2f4f6]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/20 text-sm font-semibold text-burgundy">
                          {member.name.slice(0, 1)}
                        </div>
                        <span className="font-medium text-[#191f28]">{member.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </aside>

        {/* 채팅 영역 */}
        <section
          className={`flex flex-1 flex-col bg-white ${
            !selectedId ? "hidden md:flex" : ""
          }`}
        >
          {selectedConversation ? (
            <>
              <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#e5e8eb] px-4">
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="md:hidden rounded-lg p-2 text-[#4e5968] hover:bg-[#f2f4f6]"
                  aria-label="뒤로"
                >
                  ←
                </button>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/20 text-sm font-semibold text-burgundy">
                  {otherUserName.slice(0, 1)}
                </div>
                <span className="font-semibold text-[#191f28]">{otherUserName}</span>
              </header>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderId === CURRENT_USER_ID;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          isMe
                            ? "bg-burgundy text-white rounded-br-md"
                            : "bg-[#e5e8eb] text-[#191f28] rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {msg.content}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            isMe ? "text-white/80" : "text-[#8b95a1]"
                          }`}
                        >
                          {formatMessageTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={handleSend}
                className="shrink-0 border-t border-[#e5e8eb] p-3"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 rounded-xl border border-[#e5e8eb] bg-[#f9fafb] px-4 py-2.5 text-sm placeholder:text-[#8b95a1] focus:border-burgundy focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="rounded-xl bg-burgundy px-5 py-2.5 text-sm font-medium text-white hover:bg-burgundy-hover disabled:opacity-50 disabled:hover:bg-burgundy"
                  >
                    전송
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-[#8b95a1]">
              <p className="text-sm">대화를 선택하거나 새 메시지를 시작하세요.</p>
              <p className="text-xs">좌측 목록에서 상대를 선택해 주세요.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
