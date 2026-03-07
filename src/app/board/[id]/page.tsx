import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostById,
  getCommentsByPostId,
} from "@/lib/mock/board";
import type { Comment } from "@/types/board";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function BoardDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fromPage?: string }>;
}) {
  const { id } = await params;
  const { fromPage } = await searchParams;
  const post = getPostById(id);
  if (!post) notFound();

  const comments = getCommentsByPostId(id);
  const listHref = fromPage ? `/board?page=${fromPage}` : "/board";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href={listHref}
          className="inline-block text-sm text-[#4e5968] hover:text-burgundy hover:underline"
        >
          ← 목록으로
        </Link>

        <article className="mt-6 border-b border-[#e5e8eb] pb-8">
          <span className="text-sm text-[#8b95a1]">자유게시판</span>
          <h1 className="mt-1 text-2xl font-bold text-[#191f28]">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#4e5968]">
            <span>{post.authorName}</span>
            <span>{formatDateTime(post.createdAt)}</span>
            <span>조회 {post.viewCount}</span>
            <span>댓글 {post.commentCount}</span>
          </div>
          <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-[#191f28]">
            {post.content}
          </div>
          {(post.imageUrls?.length ?? 0) > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {post.imageUrls!.map((url: string, i: number) => (
                <img
                  key={i}
                  src={url}
                  alt={`첨부 이미지 ${i + 1}`}
                  className="max-h-80 rounded-lg border border-[#e5e8eb] object-contain"
                />
              ))}
            </div>
          )}
          {(post.videoUrls?.length ?? 0) > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {post.videoUrls!.map((url: string, i: number) => (
                <video
                  key={i}
                  src={url}
                  controls
                  className="max-h-80 rounded-lg border border-[#e5e8eb] bg-black"
                />
              ))}
            </div>
          )}
          <div className="mt-8 flex gap-2">
            <Link
              href={fromPage ? `/board/${id}/edit?fromPage=${fromPage}` : `/board/${id}/edit`}
              className="rounded-full border border-[#e5e8eb] px-4 py-2 text-sm font-medium text-[#4e5968] transition-colors hover:bg-[#f9fafb]"
            >
              수정
            </Link>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="text-lg font-bold text-[#191f28]">
            댓글 {comments.length}개
          </h2>
          {comments.length === 0 ? (
            <p className="mt-4 text-sm text-[#8b95a1]">아직 댓글이 없어요.</p>
          ) : (
            <ul className="mt-4 divide-y divide-[#e5e8eb]">
              {comments.map((c: Comment) => (
                <li key={c.id} className="py-4">
                  <div className="flex justify-between gap-2">
                    <span className="text-sm font-medium text-[#191f28]">
                      {c.authorName}
                    </span>
                    <span className="text-xs text-[#8b95a1]">
                      {formatDateTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#4e5968]">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <textarea
              placeholder="댓글을 입력하세요. (로그인 후 이용 가능)"
              className="w-full resize-none rounded-lg border border-[#e5e8eb] px-4 py-3 text-sm placeholder:text-[#8b95a1] focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
              rows={3}
              readOnly
            />
            <p className="mt-2 text-xs text-[#8b95a1]">
              로그인 후 댓글을 작성할 수 있어요.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
