import koalaPixelImage from "@/assets/common/header_koala_logo.webp";
import koalaTextLogoImage from "@/assets/common/koala_mailman_text_logo.png";

import { Button } from "@/feature/ui/Button";
import { HelpCircle, LogOut } from "lucide-react";
import { handleLogout } from "@/feature/auth/service";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "@/lib/stores/authStore";
import type { ThemeColor } from "@/data/themes";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
type MandaraChartProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
};

export default function Header({
  currentTheme,
  onThemeChange,
}: MandaraChartProps) {
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const setOnboardingVisible = useTutorialStore(
    (state) => state.setOnboardingVisible
  );

  if (!wasLoggedIn)
    return (
      <div className="absolute top-4 right-4 z-30">
        <ThemeSelector
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={koalaPixelImage}
            alt="날개 달린 코알라 캐릭터가 서있는 모습으로 서비스 메인 로고 이미지입니다."
            className="w-10 h-10 sm:w-12 sm:h-12 pixelated"
          />
          <div>
            <img
              src={koalaTextLogoImage}
              alt="7가지 색상으로 색칠된 코알라 우체부 텍스트 로고 이미지입니다."
              className="pixelated h-6 sm:h-8 lg:h-10"
              style={{ filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.5))" }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />
          <Button
            variant="outline"
            onClick={() => setOnboardingVisible(true)}
            className="flex items-center gap-1 sm:gap-2 pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
          >
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">사용법</span>
            <span className="sm:hidden">?</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleLogout}
            className="pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">로그아웃</span>
            <span className="sm:hidden">Exit</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
