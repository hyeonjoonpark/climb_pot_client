import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자유게시판 | ClimbFriends",
  description: "ClimbFriends 자유게시판에서 정보를 나누고 소통해보세요.",
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
