"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import {
  getReports,
  getCommentReports,
  getUsers,
  getNotices,
  getActivityStats,
} from "@/lib/mock/admin";
import type {
  PostReport,
  CommentReport,
  AdminUser,
  Notice,
} from "@/types/admin";

type Tab = "reports" | "comments" | "users" | "activity" | "notices";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

const STATUS_LABEL = {
  pending: "대기",
  processed: "신고처리됨",
  dismissed: "기각됨",
} as const;

const TABS: { id: Tab; label: string }[] = [
  { id: "reports", label: "신고 게시물" },
  { id: "comments", label: "댓글 관리" },
  { id: "users", label: "전체 사용자" },
  { id: "activity", label: "활동 통계" },
  { id: "notices", label: "공지사항" },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("reports");
  const [reports, setReports] = useState<PostReport[]>(() => getReports());
  const [commentReports, setCommentReports] = useState<CommentReport[]>(() =>
    getCommentReports()
  );
  const [users, setUsers] = useState<AdminUser[]>(() => getUsers());
  const [notices, setNotices] = useState<Notice[]>(() => getNotices());

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | "USER" | "ADMIN">("all");
  const [userProviderFilter, setUserProviderFilter] = useState<"all" | "google" | "kakao">("all");
  const [userSuspendedFilter, setUserSuspendedFilter] = useState<"all" | "active" | "suspended">("all");

  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", isPinned: false });

  const pendingReports = useMemo(
    () => reports.filter((r) => r.status === "pending"),
    [reports]
  );
  const pendingCommentReports = useMemo(
    () => commentReports.filter((r) => r.status === "pending"),
    [commentReports]
  );

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch ||
        u.nickname.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchProvider =
        userProviderFilter === "all" || u.provider === userProviderFilter;
      const matchSuspended =
        userSuspendedFilter === "all" ||
        (userSuspendedFilter === "suspended" && u.isSuspended) ||
        (userSuspendedFilter === "active" && !u.isSuspended);
      return matchSearch && matchRole && matchProvider && matchSuspended;
    });
  }, [users, userSearch, userRoleFilter, userProviderFilter, userSuspendedFilter]);

  const activityStats = useMemo(() => getActivityStats(), []);

  const handleProcessReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: "processed" as const } : r
      )
    );
  };
  const handleDismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: "dismissed" as const } : r
      )
    );
  };
  const handleProcessCommentReport = (id: string) => {
    setCommentReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "processed" as const } : r
      )
    );
  };
  const handleDismissCommentReport = (id: string) => {
    setCommentReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "dismissed" as const } : r
      )
    );
  };

  const handleUserSuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSuspended: true } : u
      )
    );
  };
  const handleUserUnsuspend = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSuspended: false } : u
      )
    );
  };
  const handleUserRoleChange = (userId: string, role: "USER" | "ADMIN") => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role } : u))
    );
  };

  const openNoticeForm = (notice?: Notice) => {
    if (notice) {
      setEditingNoticeId(notice.id);
      setNoticeForm({
        title: notice.title,
        content: notice.content,
        isPinned: notice.isPinned,
      });
    } else {
      setEditingNoticeId(null);
      setNoticeForm({ title: "", content: "", isPinned: false });
    }
  };
  const saveNotice = () => {
    if (!noticeForm.title.trim()) return;
    if (editingNoticeId) {
      setNotices((prev) =>
        prev.map((n) =>
          n.id === editingNoticeId
            ? {
                ...n,
                ...noticeForm,
                updatedAt: new Date().toISOString().slice(0, 19),
              }
            : n
        )
      );
    } else {
      setNotices((prev) => [
        ...prev,
        {
          id: `n${Date.now()}`,
          ...noticeForm,
          createdAt: new Date().toISOString().slice(0, 19),
          updatedAt: new Date().toISOString().slice(0, 19),
        },
      ]);
    }
    setEditingNoticeId(null);
    setNoticeForm({ title: "", content: "", isPinned: false });
  };
  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    if (editingNoticeId === id) {
      setEditingNoticeId(null);
      setNoticeForm({ title: "", content: "", isPinned: false });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#191f28]">관리자 대시보드</h1>
          <Link
            href="/"
            className="text-sm text-[#4e5968] hover:text-burgundy hover:underline"
          >
            ← 홈으로
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-1 border-b border-[#e5e8eb]">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === id
                  ? "border-burgundy text-burgundy"
                  : "border-transparent text-[#4e5968] hover:text-[#191f28]"
              }`}
            >
              {label}
              {id === "reports" && pendingReports.length > 0 && (
                <span className="rounded-full bg-burgundy px-1.5 py-0.5 text-xs text-white">
                  {pendingReports.length}
                </span>
              )}
              {id === "comments" && pendingCommentReports.length > 0 && (
                <span className="rounded-full bg-burgundy px-1.5 py-0.5 text-xs text-white">
                  {pendingCommentReports.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "reports" && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#191f28]">신고 게시물</h2>
            <p className="mt-1 text-sm text-[#4e5968]">
              신고처리 시 해당 게시물 조치, 기각 시 신고만 반려됩니다.
            </p>
            {reports.length === 0 ? (
              <p className="mt-6 text-sm text-[#8b95a1]">신고 내역이 없습니다.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-xl border border-[#e5e8eb] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              report.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : report.status === "processed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-[#e5e8eb] text-[#4e5968]"
                            }`}
                          >
                            {STATUS_LABEL[report.status]}
                          </span>
                          <span className="text-xs text-[#8b95a1]">
                            {formatDateTime(report.createdAt)}
                          </span>
                        </div>
                        <h3 className="mt-2 font-medium text-[#191f28]">
                          {report.postTitle}
                        </h3>
                        <p className="mt-1 text-sm text-[#4e5968]">
                          신고 사유: {report.reason}
                        </p>
                        <p className="mt-1 text-xs text-[#8b95a1]">
                          작성자: {report.authorName} · 신고자: {report.reporterName}
                        </p>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => handleProcessReport(report.id)}
                            className="rounded-lg bg-burgundy px-3 py-1.5 text-sm font-medium text-white hover:bg-burgundy-hover"
                          >
                            신고처리
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDismissReport(report.id)}
                            className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
                          >
                            기각
                          </button>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/board/${report.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-burgundy hover:underline"
                    >
                      게시글 보기 →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "comments" && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#191f28]">댓글 신고 관리</h2>
            <p className="mt-1 text-sm text-[#4e5968]">
              신고된 댓글을 검토하고 처리하거나 기각할 수 있습니다.
            </p>
            {commentReports.length === 0 ? (
              <p className="mt-6 text-sm text-[#8b95a1]">댓글 신고 내역이 없습니다.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {commentReports.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-[#e5e8eb] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              r.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : r.status === "processed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-[#e5e8eb] text-[#4e5968]"
                            }`}
                          >
                            {STATUS_LABEL[r.status]}
                          </span>
                          <span className="text-xs text-[#8b95a1]">
                            {formatDateTime(r.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 text-[#191f28]">&quot;{r.commentContent}&quot;</p>
                        <p className="mt-1 text-sm text-[#4e5968]">
                          신고 사유: {r.reason}
                        </p>
                        <p className="mt-1 text-xs text-[#8b95a1]">
                          글: {r.postTitle} · 댓글 작성자: {r.authorName} · 신고자: {r.reporterName}
                        </p>
                      </div>
                      {r.status === "pending" && (
                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() => handleProcessCommentReport(r.id)}
                            className="rounded-lg bg-burgundy px-3 py-1.5 text-sm font-medium text-white hover:bg-burgundy-hover"
                          >
                            신고처리
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDismissCommentReport(r.id)}
                            className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm font-medium text-[#4e5968] hover:bg-[#f9fafb]"
                          >
                            기각
                          </button>
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/board/${r.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm text-burgundy hover:underline"
                    >
                      해당 글 보기 →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "users" && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#191f28]">전체 사용자</h2>
            <p className="mt-1 text-sm text-[#4e5968]">
              검색·필터 후 정지/해제, 역할 변경이 가능합니다.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="닉네임 또는 이메일 검색"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm w-52 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              <select
                value={userRoleFilter}
                onChange={(e) =>
                  setUserRoleFilter(e.target.value as typeof userRoleFilter)
                }
                className="rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
              >
                <option value="all">역할 전체</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <select
                value={userProviderFilter}
                onChange={(e) =>
                  setUserProviderFilter(e.target.value as typeof userProviderFilter)
                }
                className="rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
              >
                <option value="all">로그인 전체</option>
                <option value="google">Google</option>
                <option value="kakao">Kakao</option>
              </select>
              <select
                value={userSuspendedFilter}
                onChange={(e) =>
                  setUserSuspendedFilter(e.target.value as typeof userSuspendedFilter)
                }
                className="rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
              >
                <option value="all">상태 전체</option>
                <option value="active">활성</option>
                <option value="suspended">정지</option>
              </select>
            </div>
            {filteredUsers.length === 0 ? (
              <p className="mt-6 text-sm text-[#8b95a1]">조건에 맞는 사용자가 없습니다.</p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e8eb]">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#e5e8eb] bg-[#f9fafb]">
                      <th className="px-4 py-3 font-medium text-[#191f28]">닉네임</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">이메일</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">로그인</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">역할</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">상태</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">가입일</th>
                      <th className="px-4 py-3 font-medium text-[#191f28]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-[#e5e8eb] last:border-0"
                      >
                        <td className="px-4 py-3 font-medium text-[#191f28]">
                          {user.nickname}
                        </td>
                        <td className="px-4 py-3 text-[#4e5968]">{user.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs ${
                              user.provider === "google"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-[#FEE500]/30 text-[#191f28]"
                            }`}
                          >
                            {user.provider === "google" ? "Google" : "Kakao"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded px-2 py-0.5 text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "bg-burgundy/20 text-burgundy"
                                : "bg-[#e5e8eb] text-[#4e5968]"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {user.isSuspended ? (
                            <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                              정지
                            </span>
                          ) : (
                            <span className="text-[#4e5968]">활성</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#8b95a1]">
                          {formatDateTime(user.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {user.isSuspended ? (
                              <button
                                type="button"
                                onClick={() => handleUserUnsuspend(user.id)}
                                className="rounded border border-[#e5e8eb] px-2 py-1 text-xs hover:bg-[#f9fafb]"
                              >
                                해제
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUserSuspend(user.id)}
                                className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                              >
                                정지
                              </button>
                            )}
                            {user.role === "ADMIN" ? (
                              <button
                                type="button"
                                onClick={() => handleUserRoleChange(user.id, "USER")}
                                className="rounded border border-[#e5e8eb] px-2 py-1 text-xs hover:bg-[#f9fafb]"
                              >
                                USER로
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleUserRoleChange(user.id, "ADMIN")}
                                className="rounded border border-burgundy/50 px-2 py-1 text-xs text-burgundy hover:bg-burgundy/10"
                              >
                                ADMIN으로
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tab === "activity" && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#191f28]">활동 통계</h2>
            <p className="mt-1 text-sm text-[#4e5968]">
              최근 14일 일별 가입·게시글·댓글 수입니다.
            </p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-[#e5e8eb]">
              <table className="w-full min-w-[400px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#e5e8eb] bg-[#f9fafb]">
                    <th className="px-4 py-3 font-medium text-[#191f28]">날짜</th>
                    <th className="px-4 py-3 font-medium text-[#191f28]">가입</th>
                    <th className="px-4 py-3 font-medium text-[#191f28]">게시글</th>
                    <th className="px-4 py-3 font-medium text-[#191f28]">댓글</th>
                  </tr>
                </thead>
                <tbody>
                  {activityStats.map((day) => (
                    <tr
                      key={day.date}
                      className="border-b border-[#e5e8eb] last:border-0"
                    >
                      <td className="px-4 py-3 font-medium text-[#191f28]">
                        {formatDate(day.date)}
                      </td>
                      <td className="px-4 py-3 text-[#4e5968]">{day.signups}</td>
                      <td className="px-4 py-3 text-[#4e5968]">{day.posts}</td>
                      <td className="px-4 py-3 text-[#4e5968]">{day.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "notices" && (
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#191f28]">공지사항 관리</h2>
            <p className="mt-1 text-sm text-[#4e5968]">
              상단 고정 공지를 등록·수정·삭제할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => openNoticeForm()}
              className="mt-4 rounded-lg bg-burgundy px-4 py-2 text-sm font-medium text-white hover:bg-burgundy-hover"
            >
              + 공지 등록
            </button>
            {(editingNoticeId || (!editingNoticeId && !notices.length)) && (
              <div className="mt-6 rounded-xl border border-[#e5e8eb] p-4">
                <input
                  type="text"
                  placeholder="제목"
                  value={noticeForm.title}
                  onChange={(e) =>
                    setNoticeForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                />
                <textarea
                  placeholder="내용"
                  value={noticeForm.content}
                  onChange={(e) =>
                    setNoticeForm((p) => ({ ...p, content: e.target.value }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#e5e8eb] px-3 py-2 text-sm focus:border-burgundy focus:outline-none"
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={noticeForm.isPinned}
                    onChange={(e) =>
                      setNoticeForm((p) => ({ ...p, isPinned: e.target.checked }))
                    }
                  />
                  상단 고정
                </label>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={saveNotice}
                    className="rounded-lg bg-burgundy px-3 py-1.5 text-sm text-white hover:bg-burgundy-hover"
                  >
                    {editingNoticeId ? "수정" : "등록"}
                  </button>
                  <button
                    type="button"
                    onClick={() => openNoticeForm()}
                    className="rounded-lg border border-[#e5e8eb] px-3 py-1.5 text-sm hover:bg-[#f9fafb]"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
            {notices.length > 0 && (
              <div className="mt-6 space-y-3">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="rounded-xl border border-[#e5e8eb] p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-[#191f28]">
                            {notice.title}
                          </h3>
                          {notice.isPinned && (
                            <span className="rounded bg-burgundy/20 px-1.5 py-0.5 text-xs text-burgundy">
                              고정
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[#4e5968]">
                          {notice.content}
                        </p>
                        <p className="mt-1 text-xs text-[#8b95a1]">
                          수정: {formatDateTime(notice.updatedAt)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => openNoticeForm(notice)}
                          className="rounded px-2 py-1 text-sm text-burgundy hover:underline"
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteNotice(notice.id)}
                          className="rounded px-2 py-1 text-sm text-red-600 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
