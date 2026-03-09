import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.06]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-[#191f28]">ClimbFriends</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/board"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            게시판
          </Link>
          <Link
            href="/schedule"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            일정
          </Link>
          <Link
            href="/message"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            메세지
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-burgundy px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-burgundy-hover"
          >
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
