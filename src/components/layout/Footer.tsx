export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e5e8eb] py-10 px-6">
      <div className="mx-auto max-w-5xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <span className="text-sm font-medium text-[#191f28]">ClimbFriends</span>
          <div className="flex flex-col gap-1 text-sm text-[#4e5968]">
            <span>© {currentYear} ClimbFriends. All rights reserved.</span>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a
                href="mailto:pjjoon1379@gmail.com"
                className="hover:text-burgundy hover:underline"
              >
                관리자 이메일: pjjoon1379@gmail.com
              </a>
              <a
                href="https://www.instagram.com/_grip_the_top.06"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-burgundy hover:underline"
              >
                인스타그램: @_grip_the_top.06
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
