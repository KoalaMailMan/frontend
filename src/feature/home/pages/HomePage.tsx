import MainSection from "../components/MainSection";
import BackgroundAnimation from "../components/BackgroundAnimation";
import { useViewportStore } from "@/lib/stores/viewportStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import useAccessibility from "@/shared/hooks/useAccessibility";
import useVisibility from "@/shared/hooks/useVisibility";

type MandaraChartProps = {
  getCurrentBackground: () => Record<string, string>;
};

export default function HomePage({ getCurrentBackground }: MandaraChartProps) {
  const [lcpDone, setLcpDone] = useState(false);
  const setTemporaryAuth = useAuthStore((state) => state.setTemporaryAuth);
  const height = useViewportStore((state) => state.height);
  const { backgroundImage, srcSet } = getCurrentBackground();
  const reduced = useAccessibility(); // default: false
  const inactiveTab = useVisibility(); // default: false

  useEffect(() => {
    document.documentElement.style.setProperty("--real-vh", `${height}`);
  }, [height]);
  useEffect(() => {
    requestIdleCallback(() => setLcpDone(true));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 메인 로그인 섹션 */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/*  배경 이미지 */}
        <div
          aria-hidden="true"
          role="presentation"
          className="absolute inset-0 min-h-screen z-[-1000] pointer-events-none md:block bg-cover bg-center bg-no-repeat bg-scroll h-[var(--real-vh)]"
        >
          <picture>
            <source srcSet={srcSet} />
            <img
              className="fixed inset-0 w-full h-full object-cover -z-10"
              src={backgroundImage[0]}
              alt="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
            />
          </picture>
        </div>

        {/* 메인 로그인 컨테이너 */}
        <MainSection onTemporaryLogin={setTemporaryAuth} />

        {/* 날아가는 코알라 애니메이션 */}
        {lcpDone && !reduced && !inactiveTab && <BackgroundAnimation />}
      </div>

      {/* 서비스 소개 섹션 */}
      {/* <ServiceIntroCompoenent /> */}
    </div>
  );
}
