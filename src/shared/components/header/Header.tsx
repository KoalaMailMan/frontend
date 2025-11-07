import Button from "@/feature/ui/Button";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/feature/auth/service";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "@/lib/stores/authStore";
import type { ThemeColor } from "@/data/themes";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import AddressBook from "./icons/AddressBook";
import { cn } from "@/lib/utils";

type MandaraChartProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
};

export default function Header({
  currentTheme,
  onThemeChange,
}: MandaraChartProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);
  const setAuthText = useAuthStore((state) => state.setAuthText);
  const setOnboardingVisible = useTutorialStore(
    (state) => state.setOnboardingVisible
  );

  return (
    <div className="w-full mb-4 sm:mb-6 lg:mb-8 px-4 p-4 fixed z-[1]">
      <div
        className={cn(
          "mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full justify-end"
        )}
      >
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
          {wasLoggedIn && accessToken ? (
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
          ) : (
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                setAuthText("만다라트 대시보드 이용");
                setAuthOpen(true);
              }}
              className="w-[86px] pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
              dir="ltr"
            >
              <span>로그인</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
