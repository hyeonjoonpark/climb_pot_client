import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "로그인 | ClimbFriends",
  description: "ClimbFriends에 로그인하여 게시판, 크루, 메세지를 이용하세요.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white pt-24 pb-24">
      <div className="mx-auto flex max-w-md flex-col items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-2xl font-bold tracking-tight text-[#191f28]">
            ClimbFriends
          </span>
        </Link>

        <h1 className="mt-12 text-xl font-bold text-[#191f28]">
          로그인
        </h1>
        <p className="mt-2 text-center text-[15px] text-[#4e5968]">
          소셜 계정으로 간편하게 시작하세요.
        </p>

        <div className="mt-10 w-full space-y-3">
          <a
            href="/api/auth/google"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5e8eb] bg-white py-3.5 px-4 text-[15px] font-medium text-[#191f28] transition-colors hover:bg-[#f9fafb]"
          >
            <GoogleIcon className="h-5 w-5" />
            Google로 로그인
          </a>
          <a
            href="/api/auth/kakao"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e5e8eb] bg-[#FEE500] py-3.5 px-4 text-[15px] font-medium text-[#191f28] transition-colors hover:bg-[#FDD835]"
          >
            <KakaoIcon className="h-5 w-5" />
            Kakao로 로그인
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-[#8b95a1]">
          로그인 시{" "}
          <Link href="/" className="text-burgundy hover:underline">
            이용약관
          </Link>
          및{" "}
          <Link href="/" className="text-burgundy hover:underline">
            개인정보처리방침
          </Link>
          에 동의하게 됩니다.
        </p>

        <Link
          href="/"
          className="mt-8 text-sm text-[#4e5968] hover:text-burgundy hover:underline"
        >
          ← 홈으로
        </Link>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3c-5.52 0-10 3.59-10 8 0 2.87 1.89 5.39 4.72 6.82-.2.72-.73 2.64-.83 3.06-.13.52.2.48.55.35.27-.1 4.26-2.81 5.93-3.82C17.17 17.63 22 15.36 22 11c0-4.41-4.48-8-10-8z"
        fill="#191F28"
      />
    </svg>
  );
}
