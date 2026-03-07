"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Post } from "@/types/board";

const MediaUpload = dynamic(() => import("@/components/board/MediaUpload"), {
  ssr: false,
  loading: () => <div className="h-32 animate-pulse rounded-lg bg-[#f9fafb]" />,
});

export default function BoardEditForm({
  post,
  fromPage,
}: {
  post: Post;
  fromPage?: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrls, setImageUrls] = useState<string[]>(post.imageUrls ?? []);
  const [videoUrls, setVideoUrls] = useState<string[]>(post.videoUrls ?? []);

  const detailHref = fromPage
    ? `/board/${post.id}?fromPage=${fromPage}`
    : `/board/${post.id}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    // 목업: 실제 API 연동 시 imageUrls, videoUrls 전송. 수정 후 상세로 이동(같은 fromPage 유지)
    router.push(detailHref);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href={detailHref}
          className="inline-block text-sm text-[#4e5968] hover:text-burgundy hover:underline"
        >
          ← 글보기
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-[#191f28]">글 수정</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#191f28]">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              className="mt-2 w-full rounded-lg border border-[#e5e8eb] px-4 py-2.5 text-[15px] focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#191f28]">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="mt-2 w-full resize-y rounded-lg border border-[#e5e8eb] px-4 py-2.5 text-[15px] focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          <MediaUpload
            imageUrls={imageUrls}
            videoUrls={videoUrls}
            onImageUrlsChange={setImageUrls}
            onVideoUrlsChange={setVideoUrls}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-burgundy px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-burgundy-hover"
            >
              수정 완료
            </button>
            <Link
              href={detailHref}
              className="rounded-full border border-[#e5e8eb] px-6 py-2.5 text-sm font-medium text-[#4e5968] transition-colors hover:bg-[#f9fafb]"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
