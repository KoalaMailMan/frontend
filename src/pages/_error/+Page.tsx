import Button from "@/feature/ui/Button";
import "../../styles/globals.css";
import { errorKoalalIcon, errorKoalalIconSrcSet } from "./const";

export default function Page404() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="background absolute inset-0 min-h-screen z-[-1000] pointer-events-none md:block bg-cover bg-center bg-no-repeat bg-scroll h-[var(--real-vh)]"></div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* 캐릭터 + 말풍선 */}
        <div className="flex flex-col items-center">
          <div className="relative bg-white border border-[#B3B3B3] rounded-lg px-5 py-3 text-sm font-semibold text-[#000] mb-3">
            이 페이지는 존재하지 않아요.
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#B3B3B3]" />
            <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-white" />
          </div>

          {/* 캐릭터 아이콘 영역 */}
          <div className="w-[120px] h-[120px] rounded-full">
            {/* 캐릭터 아이콘 여기 */}
            <img
              src={errorKoalalIcon[0]}
              className="w-full"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              srcSet={errorKoalalIconSrcSet}
              sizes="(max-width: 768px) 90vw, 476px"
              width={476}
              height={96}
              style={{ maxWidth: "100%", height: "auto" }}
              alt="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
            />
          </div>
        </div>

        {/* 404 텍스트 */}
        <div className="text-center flex flex-col gap-2">
          <p className="text-[64px] font-semibold leading-none">404</p>
          <p className="text-sm text-[#4C4C4C]">페이지를 찾을 수 없어요</p>
        </div>
        <Button variant="shadow" className="bg-primary">
          <a href="/">홈으로 돌아가기</a>
        </Button>
      </div>
    </div>
  );
}
