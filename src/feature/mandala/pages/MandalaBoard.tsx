import MandalaGrid from "../components/MandalaGrid";
import Header from "@/shared/\bcomponents/header/Header";
import { CardContent, CardHeader } from "@/feature/ui/Card";
import { cn } from "@/lib/utils";
import NoticeContainer from "@/feature/ui/NoticeContainer";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { Button } from "@/feature/ui/Button";
import { BellRing, Maximize2, Save } from "lucide-react";
import ReminderSetting from "../components/ReminderSetting";
import FullMandalaView from "../components/FullMandalaView";
import { useEffect, useRef } from "react";
import type { ThemeColor } from "@/data/themes";
import OnboardingTutorial from "@/feature/tutorial/OnboardingTutorial";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import { useAuthStore } from "@/lib/stores/authStore";
import {
  handleUpdateMandala,
  uiToServer,
  type ServerMandalaType,
} from "../service";
import { toast } from "sonner";

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
  const hasSeenReminderSetup = useAuthStore(
    (state) => state.hasSeenReminderSetup
  );
  const mandalartId = useMandalaStore((state) => state.mandalartId);
  const data = useMandalaStore((state) => state.data);
  const changedCells = useMandalaStore((state) => state.changedCells);
  const setData = useMandalaStore((state) => state.setData);

  const isReminder = useMandalaStore((state) => state.isReminderOpen);
  const isFullOpen = useMandalaStore((state) => state.isFullOpen);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const showAgain = useTutorialStore((state) => state.showAgain);
  const onReminderOpen = useMandalaStore((state) => state.setReminderVisible);
  const setFullVisible = useMandalaStore((state) => state.setFullVisible);
  const setOnboardingVisible = useTutorialStore(
    (state) => state.setOnboardingVisible
  );

  const typeRef = useRef<"save" | "reminder">("save");
  const reminderEnabled = useMandalaStore(
    (state) => state.reminderOption.reminderEnabled
  );

  const reminderOption = useMandalaStore((state) => state.reminderOption);
  useEffect(() => {
    console.log(reminderOption);
    console.log(uiToServer(data, changedCells));
  }, [data]);

  const handleSave = async () => {
    if (!hasSeenReminderSetup && !mandalartId) {
      onReminderOpen(true);
      typeRef.current = "save";
    } else {
      if (changedCells.size <= 0) {
        toast("변경된 목표가 없습니다!");
        return;
      }
      const mandalartRes: ServerMandalaType | undefined =
        await handleUpdateMandala(data, changedCells);

      if (mandalartRes !== undefined) {
        setData(mandalartRes.data);
        toast.success("만다라트가 저장되었습니다!");
      }
    }
  };

  useEffect(() => {
    showAgain ? setOnboardingVisible(false) : setOnboardingVisible(true);
  }, [showAgain]);

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
            <p className="text-sm text-gray-600 mt-2">
              중앙에
              <span className="font-semibold text-primary">핵심 목표</span>를,
              주변 8칸에
              <span className="font-semibold text-primary/80">주요 목표</span>를
              입력하세요
            </p>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              목표를 우체통에 넣어 코알라가 정기적으로 리마인드해드려요! 📬
            </p>
          </CardHeader>
          <CardContent>
            <MandalaGrid />
            <div className="text-center mt-6">
              <Button
                className="pixel-button bg-green-500/90 hover:bg-green-600/90 text-white px-8 py-3 text-base backdrop-blur-sm mb-4"
                onClick={handleSave}
              >
                <Save className="h-5 w-5 mr-2" />
                우체통에 저장하기 📮
              </Button>
              {/* 리마인드 설정 & 전체보기 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    typeRef.current = "reminder";
                    onReminderOpen(true);
                  }}
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
      {isOnboardingOpen && <OnboardingTutorial />}
    </div>
  );
}
