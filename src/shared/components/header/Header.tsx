import HeaderTextLogo from "@/assets/common/header_text_logo.png";

import { Button } from "@/feature/ui/Button";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/feature/auth/service";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "@/lib/stores/authStore";
import type { ThemeColor } from "@/data/themes";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import AddressBook from "./icons/AddressBook";
import { cn } from "@/lib/utils";
import { useMandalaStore } from "@/lib/stores/mandalaStore";

type MandaraChartProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
};

export default function Header({
  currentTheme,
  onThemeChange,
}: MandaraChartProps) {
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const isReminderOpen = useMandalaStore((state) => state.isReminderOpen);
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
    <div className="w-full mb-4 sm:mb-6 lg:mb-8 px-4 p-4 fixed z-[1]">
      <div
        className={cn(
          "mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4",
          !isReminderOpen ? "w-full justify-end" : "max-w-4xl justify-between"
        )}
      >
        <div
          className={cn("w-[210px] sm:w-[13rem]", !isReminderOpen && "hidden")}
        >
          <img
            src={HeaderTextLogo}
            alt="날개 달린 코알라 캐릭터가 서있는 모습으로 서비스 메인 로고 이미지입니다."
            className="w-full pixelated"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="default"
            onClick={() => setOnboardingVisible(true)}
            className="flex items-center gap-1 sm:gap-2 pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4 "
            dir="ltr"
          >
            <AddressBook />

            <span className="hidden sm:inline">튜토리얼</span>
            <span className="sm:hidden">?</span>
          </Button>
          <ThemeSelector
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />
          <Button
            variant="outline"
            size="default"
            onClick={handleLogout}
            className="pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
            dir="ltr"
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
