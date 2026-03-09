import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "일정 | ClimbFriends",
  description: "ClimbFriends 일정을 확인하고 참여해보세요.",
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
