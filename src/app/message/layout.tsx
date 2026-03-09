import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "메세지 | ClimbFriends",
  description: "ClimbFriends 회원과 1:1 메시지를 나눠보세요.",
};

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
