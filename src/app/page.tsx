import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-24 px-6 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-[#191f28] md:text-5xl lg:text-6xl">
            클라이밍하는 사람들을 위한
            <br />
            <span className="text-burgundy">친목 커뮤니티</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[#4e5968] md:text-xl">
            함께 오르고, 정보를 나누고, 동행을 구해보세요.
            <br className="hidden sm:block" />
            이제껏 경험 못 했던 편한 클라이밍 모임, 여기서 시작해요.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full bg-[#191f28] px-6 text-base font-medium text-white transition-colors hover:bg-[#333d4b]"
            >
              시작하기
            </Link>
            <Link
              href="/board"
              className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full border border-[#e5e8eb] bg-white px-6 text-base font-medium text-[#191f28] transition-colors hover:bg-[#f9fafb]"
            >
              게시판 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features - 토스 스타일 섹션 */}
      <section className="border-t border-[#e5e8eb] bg-[#f9fafb] py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-[#191f28] md:text-3xl">
            꼭 필요했던 것들
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[#4e5968]">
            정보 공유부터 실시간 대화까지, 한곳에서 해보세요.
          </p>

          <div className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md">
              <h3 className="text-lg font-bold text-[#191f28]">게시판</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4e5968]">
                자신의 실력을 마음껏 뽐내고, 다른 사람들과 소통해보세요.
              </p>
              <Link
                href="/board"
                className="mt-4 inline-block text-[15px] font-medium text-burgundy hover:underline"
              >
                게시판 가기 →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md">
              <h3 className="text-lg font-bold text-[#191f28]">실시간 채팅</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4e5968]">
                같은 관심사를 가진 클라이머와 실시간으로 대화해보세요.
              </p>
              <Link
                href="/chat"
                className="mt-4 inline-block text-[15px] font-medium text-burgundy hover:underline"
              >
                채팅하기 →
              </Link>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/[0.04] transition-shadow hover:shadow-md md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-bold text-[#191f28]">크루</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4e5968]">
                같은 관심사를 가진 클라이머와 함께 클라이밍을 즐기세요.
              </p>
              <Link
                href="/board"
                className="mt-4 inline-block text-[15px] font-medium text-burgundy hover:underline"
              >
                크루페이지 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-[#191f28] md:text-3xl">
            지금 가입하고 시작해보세요
          </h2>
          <p className="mt-4 text-[#4e5968]">
            Google 또는 Kakao 계정으로 간편하게 로그인할 수 있어요.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-burgundy px-8 text-base font-medium text-white transition-colors hover:bg-burgundy-hover"
          >
            로그인 / 회원가입
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
