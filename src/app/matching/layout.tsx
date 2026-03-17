import type { Metadata } from "next";
import MatchingProvider from "./MatchingProvider";

export const metadata: Metadata = {
  title: "클라이머 소개팅 | ClimbFriends",
  description: "ClimbFriends 클라이머 소개팅 - 같은 취미를 가진 클라이머를 만나보세요.",
};

export default function MatchingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MatchingProvider>{children}</MatchingProvider>;
}
