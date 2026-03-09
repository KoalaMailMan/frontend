import Button from "@/feature/ui/Button";
import StoryBoardComponents from "./StoryBoardComponents";
import { useViewportStore } from "@/lib/stores/viewportStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMandalaStore } from "@/lib/stores/mandalaStore";

type Props = {
  getCurrentBackground: () => Record<string, string>;
};
export default function ServiceIntroCompoenent({}: // getCurrentBackground,
Props) {
  // const { backgroundImage, srcSet } = getCurrentBackground();
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);
  const setAuthText = useAuthStore((state) => state.setAuthText);
  const setServiceIntroVisible = useMandalaStore(
    (state) => state.setServiceIntroVisible
  );
  const isServiceIntroOpen = useMandalaStore(
    (state) => state.isServiceIntroOpen
  );
  const isMobile = useViewportStore((state) => state.isMobile);
  //   const scrollToTop = () => {
  //     if (window) {
  //       window.scrollTo({ top: 0, behavior: "smooth" });
  //     }
  //   };
  return (
    <div className="w-full h-full py-20 px-4 absolute top-0 z-20 ">
      <div
        aria-hidden="true"
        role="presentation"
        className="background fixed inset-0 min-h-screen z-[-1000] pointer-events-none md:block bg-cover bg-center bg-no-repeat bg-scroll h-[var(--real-vh)]"
      >
        {/* <picture>
          <source srcSet={srcSet} />
          <img
            className="h-lvh fixed inset-0 object-cover -z-10"
            src={backgroundImage[0]}
            alt="만다라트 목표 작성 & 리마인드 | 코알라 우체부"
          />
        </picture> */}
      </div>
      {/* 불투명 오버레이 */}
      <div className="w-full h-[100%] fixed inset-0 object-cover bg-black/30 backdrop-blur-sm"></div>
      <div className="relative z-10 pb-30">
        <div className="max-w-4xl mx-auto ">
          {/* 소개 제목 */}
          <div className="text-center mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/20">
              <h2
                className="pixel-subtitle text-primary mb-4"
                style={{ fontSize: "16px" }}
              >
                📮 코알라 우체부는 이런 서비스예요!
              </h2>
              <p className="text-gray-700 leading-relaxed">
                체계적인 목표 설정과 꾸준한 리마인드로
                <br />
                당신의 꿈을 현실로 만들어보세요! 🐨✨
              </p>
            </div>
          </div>

          {/* 스토리보드 */}
          <StoryBoardComponents isMobile={isMobile} />

          {/* 최종 CTA 섹션 */}
          <div className="text-center pt-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-white/20">
              <h3
                className="pixel-subtitle text-primary mb-4"
                style={{ fontSize: "16px" }}
              >
                🚀 지금 바로 시작해보세요!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                코알라와 함께 체계적인 목표 달성의 여정을 시작하세요
                <br />
                오늘부터 당신의 꿈을 현실로 만들어보세요! ✨
              </p>
              {!accessToken && !wasLoggedIn ? (
                <Button
                  onClick={() => {
                    setAuthOpen(true);
                    setAuthText({
                      title: "로그인해서 만다라트를 이용해보세요.",
                      description:
                        "로그인 시 만다라트 저장은 물론, AI가 방향을 제안해주고 \n리마인드 메일로 꾸준함까지 도와드려요.",
                    });
                  }}
                >
                  로그인해서 만다라트를 이용해보세요!
                </Button>
              ) : (
                <Button
                  onClick={() => setServiceIntroVisible(!isServiceIntroOpen)}
                >
                  닫기
                </Button>
              )}
              {/* <Button
                onClick={scrollToTop}
                className="bg-primary-modal hover:bg-primary-modal/90 text-white h-12 pixel-button px-8"
              >
                ↑ 위로 올라가서 로그인하기 📝
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
