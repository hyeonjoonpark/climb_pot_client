"use client";

import { MatchingProvider as Provider } from "@/context/MatchingContext";

export default function MatchingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider>{children}</Provider>;
}
