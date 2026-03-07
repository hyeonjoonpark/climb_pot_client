import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "클라이밍 | 클라이머를 위한 친목 커뮤니티",
  description:
    "함께 오르고, 정보를 나누는 클라이밍 친목 커뮤니티. 게시판, 실시간 채팅, 동행 모집까지.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} font-sans antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
