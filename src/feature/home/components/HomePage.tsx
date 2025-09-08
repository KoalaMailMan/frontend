import MainSection from "../../../feature/home/components/MainSection";
import ScrollAnimation from "../../../feature/home/components/ScrollAnimation";
import StoryBoardComponents from "../../../feature/home/components/StoryBoardComponents";
import { Button } from "../../../feature/ui/Button";
import NoticeContainer from "../../../feature/ui/NoticeContainer";
import koalaPixelImage from "../../../assets/default_koala.png";
import PixelAnimationComponent from "../../../feature/home/components/PixelAnimationComponent";
import BG_RED from "../../../assets/background_red.png";
import BackgroundAnimation from "../../../feature/home/components/BackgroundAnimation";

export default function HomePage() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_RED})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <BackgroundAnimation />
        <MainSection />

        <ScrollAnimation />
      </section>

      <div className="bg-black/10 backdrop-blur-sm py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <section>
            <div className="text-center mb-16">
              <NoticeContainer variant="max">
                <img
                  src={koalaPixelImage}
                  alt="코알라"
                  className="w-12 h-12 mx-auto mb-4 pixelated"
                />
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
              </NoticeContainer>
            </div>
          </section>
          <section>
            <StoryBoardComponents />
          </section>
          <section>
            <div className="text-center py-16">
              <NoticeContainer variant="default" shadow="xl">
                {/* 픽셀 장식 */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rotate-45"></div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rotate-45"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-300 rotate-45"></div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-primary/50 rotate-45"></div>
                <img
                  src={koalaPixelImage}
                  alt="코알라"
                  className="w-16 h-16 mx-auto mb-6 pixelated"
                />
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
                  // onClick={scrollToTop}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-12 pixel-button text-sm"
                >
                  ↑ 위로 올라가서 로그인하기 📝
                </Button>

                {/* 픽셀 장식 */}
                <PixelAnimationComponent />
              </NoticeContainer>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
