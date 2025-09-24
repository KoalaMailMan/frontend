import MandalaGrid from "../components/MandalaGrid";
import Header from "@/shared/\bcomponents/header/Header";
import { CardContent, CardHeader, CardTitle } from "@/feature/ui/Card";
import koalaPixelImage from "@/assets/default_koala.png";
import { cn } from "@/lib/utils";
import NoticeContainer from "@/feature/ui/NoticeContainer";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { Button } from "@/feature/ui/Button";
import { BellRing, Maximize2, Save } from "lucide-react";
import ReminderSetting from "../components/ReminderSetting";
import FullMandalaView from "../components/FullMandalaView";
import { useRef } from "react";
import type { ThemeColor } from "@/data/themes";

type MandaraChartProps = {
  currentTheme: ThemeColor;
  onThemeChange: (theme: ThemeColor) => void;
  getCurrentBackground: () => void;
};

export default function MandalaBoard({
  currentTheme,
  onThemeChange,
  getCurrentBackground,
}: MandaraChartProps) {
  const isReminder = useMandalaStore((state) => state.isReminderOpen);
  const isFullOpen = useMandalaStore((state) => state.isFullOpen);
  const reminderSettingComplete = useMandalaStore(
    (state) => state.reminderSettingComplete
  );
  const reminderEnabled = useMandalaStore(
    (state) => state.reminderOption.reminderEnabled
  );
  const typeRef = useRef<"save" | "reminder">("save");
  const onReminderOpen = useMandalaStore((state) => state.setReminderVisible);
  const setFullVisible = useMandalaStore((state) => state.setFullVisible);

  const handleSave = async () => {
    if (!reminderSettingComplete) {
      onReminderOpen(true);
      typeRef.current = "save";
    }
  };

  return (
    <div
      className="min-h-screen p-4 transition-all"
      style={{
        backgroundImage: `url(${getCurrentBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header currentTheme={currentTheme} onThemeChange={onThemeChange} />
      <div className="max-w-2xl mx-auto">
        <NoticeContainer
          variant={"max"}
          shadow={"xl"}
          className={cn("backdrop-blur-sm")}
        >
          <div className="mailbox-slot"></div>
          <div className="mailbox-flag"></div>
          <CardHeader className="text-center pt-8">
            <CardTitle
              className="flex items-center justify-center gap-2 pixel-subtitle"
              style={{ fontSize: "14px" }}
            >
              <img src={koalaPixelImage} alt="코알라" className="w-6 h-6" />
              코알라 우체통 📮
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              중앙에
              <span className="font-semibold text-primary">핵심 목표</span>
              를, 주변 8칸에
              <span className="font-semibold text-primary/80">주요 목표</span>를
              입력하세요
            </p>
            <p className="text-xs text-gray-500 mt-1">
              목표를 우체통에 넣어 코알라가 정기적으로 리마인드해드려요! 📬
            </p>
          </CardHeader>
          <CardContent className="pb-6">
            <MandalaGrid />
            <div className="text-center mt-6">
              <Button
                className="pixel-button bg-green-500/90 hover:bg-green-600/90 text-white px-8 py-3 text-base backdrop-blur-sm"
                onClick={handleSave}
              >
                <Save className="h-5 w-5 mr-2" />
                우체통에 저장하기 📮
              </Button>
              {/* 리마인드 설정 & 전체보기 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  onClick={() => onReminderOpen(true)}
                  className={`flex items-center gap-2 pixel-button text-sm px-4 py-2 ${
                    reminderEnabled
                      ? "bg-green-50/90 border-green-300 text-green-700"
                      : "bg-white/90"
                  } backdrop-blur-sm`}
                >
                  <BellRing className="h-4 w-4" />
                  {reminderEnabled ? "리마인드 ON" : "리마인드 설정"}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setFullVisible(true)}
                  className="flex items-center gap-2 pixel-button bg-white/90 backdrop-blur-sm text-sm px-4 py-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  9x9 전체보기
                </Button>
              </div>
            </div>
          </CardContent>
        </NoticeContainer>
      </div>
      {isReminder && <ReminderSetting openTree={typeRef.current} />}
      {isFullOpen && <FullMandalaView />}
    </div>
  );
}
