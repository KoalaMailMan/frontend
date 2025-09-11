import { Button } from "@/feature/ui/Button";
import koalaPixelImage from "@/assets/default_koala.png";
import { HelpCircle, LogOut, Maximize2 } from "lucide-react";
import { handleLogout } from "@/feature/auth/service";

export default function Header() {
  return (
    <div className="max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 px-4 p-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={koalaPixelImage}
            alt="코알라"
            className="w-10 h-10 sm:w-12 sm:h-12"
          />
          <div>
            <h1 className="pixel-title text-white text-sm sm:text-base lg:text-lg">
              코알라 우체부
            </h1>
            <p className="text-white/80 mt-1 text-xs sm:text-sm">
              체계적인 목표 설정으로 꿈을 현실로
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
          >
            <HelpCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">사용법</span>
            <span className="sm:hidden">?</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
          >
            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden lg:inline">9x9 전체보기</span>
            <span className="lg:hidden">전체</span>
          </Button>

          <Button
            variant="outline"
            className="pixel-button bg-white/90 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4"
            onClick={handleLogout}
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
