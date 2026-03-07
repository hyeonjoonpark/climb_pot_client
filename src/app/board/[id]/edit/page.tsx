import BoardEditForm from "./BoardEditForm";
import { getPostById } from "@/lib/mock/board";
import { notFound } from "next/navigation";

export default async function BoardEditPage({
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

  return <BoardEditForm post={post} fromPage={fromPage} />;
}
