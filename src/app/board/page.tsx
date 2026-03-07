import Link from "next/link";
import { getPosts } from "@/lib/mock/board";
import type { Post } from "@/types/board";
import ReportButton from "@/components/board/ReportButton";

const PAGE_SIZE = 10;

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const list = getPosts("free");
  const totalCount = list.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const posts = list.slice(start, start + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#191f28]">자유게시판</h1>
          <Link
            href="/board/write"
            className="rounded-full bg-burgundy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-hover"
          >
            글쓰기
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#4e5968]">아직 글이 없어요.</p>
            <Link
              href="/board/write"
              className="mt-4 text-burgundy font-medium hover:underline"
            >
              첫 글을 작성해보세요 →
            </Link>
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-[#e5e8eb]">
            {posts.map((post: Post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-2 py-4 hover:bg-[#f9fafb]"
              >
                <Link
                  href={`/board/${post.id}?fromPage=${page}`}
                  className="min-w-0 flex-1"
                  target="_self"
                  prefetch={false}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate text-[15px] font-medium text-[#191f28]">
                        {post.title}
                      </h2>
                      <p className="mt-1 text-xs text-[#4e5968]">
                        {post.authorName} · {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-3 text-xs text-[#8b95a1]">
                      <span>조회 {post.viewCount}</span>
                      <span>댓글 {post.commentCount}</span>
                    </div>
                  </div>
                </Link>
                <ReportButton />
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="mt-8">
            <p className="mb-2 text-center text-xs text-[#8b95a1]">
              최신순 · {totalCount}개 중 {(page - 1) * PAGE_SIZE + 1}-
              {Math.min(page * PAGE_SIZE, totalCount)}번
            </p>
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/board?page=${page - 1}`}
                  className="rounded border border-[#e5e8eb] px-3 py-1.5 text-sm text-[#4e5968] hover:bg-[#f9fafb]"
                >
                  이전
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/board?page=${p}`}
                  className={`rounded px-3 py-1.5 text-sm ${
                    p === page
                      ? "bg-burgundy text-white"
                      : "text-[#4e5968] hover:bg-[#f9fafb]"
                  }`}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link
                  href={`/board?page=${page + 1}`}
                  className="rounded border border-[#e5e8eb] px-3 py-1.5 text-sm text-[#4e5968] hover:bg-[#f9fafb]"
                >
                  다음
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
