import MainSection from "../components/MainSection";
import StoryBoardComponents from "../components/StoryBoardComponents";
import { Button } from "../../ui/Button";
import BackgroundAnimation from "../components/BackgroundAnimation";
import Header from "@/shared/\bcomponents/header/Header";
import type { ThemeColor } from "@/data/themes";

type MandaraChartProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  getCurrentBackground: () => void;
};

export default function HomePage({
  currentTheme,
  onThemeChange,
  getCurrentBackground,
}: MandaraChartProps) {
  const scrollToTop = () => {
    if (window) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 테마 선택기 - 우상단 */}
      <Header currentTheme={currentTheme} onThemeChange={onThemeChange} />

      {/* 메인 로그인 섹션 */}
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4 relative"
        style={{
          backgroundImage: `url(${getCurrentBackground()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* 날아가는 코알라 애니메이션 */}
        <BackgroundAnimation />

        {/* 메인 로그인 컨테이너 */}
        <MainSection />

        {/* 스크롤 안내 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center animate-bounce z-30">
          <div
            className="pixel-subtitle text-white/80 mb-2"
            style={{
              fontSize: "10px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            아래로 스크롤해서 서비스 소개 보기
          </div>
          <div
            className="text-3xl text-white"
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            ↓
          </div>
        </div>
      </div>

      {/* 서비스 소개 섹션 */}
      <div
        className="py-20 px-4 relative"
        style={{
          backgroundImage: `url(${getCurrentBackground()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* 불투명 오버레이 */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto">
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
            <StoryBoardComponents />

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
                <Button
                  onClick={scrollToTop}
                  className="bg-primary hover:bg-primary/90 text-white h-12 pixel-button px-8"
                >
                  ↑ 위로 올라가서 로그인하기 📝
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
