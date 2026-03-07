import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/[0.06]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#191f28]">
          클라이밍
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/board"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            게시판
          </Link>
          <Link
            href="/crew"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            크루
          </Link>
          <Link
            href="/message"
            className="text-[15px] font-medium text-[#4e5968] hover:text-[#191f28] transition-colors"
          >
            메세지
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-[#191f28] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#333d4b]"
          >
            로그인
          </Link>
        </nav>
      </div>
    </header>
  );
}
