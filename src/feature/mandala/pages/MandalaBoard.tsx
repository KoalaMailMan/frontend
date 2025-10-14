import KoalaTextRowLogo from "@/assets/common/header_text_logo.png";

import MandalaGrid from "../components/MandalaGrid";
import { CardContent } from "@/feature/ui/Card";
import { cn } from "@/lib/utils";
import NoticeContainer from "@/feature/ui/NoticeContainer";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { Button } from "@/feature/ui/Button";
import { BellRing, Maximize2, Save } from "lucide-react";
import ReminderSetting from "../components/ReminderSetting";
import FullMandalaView from "../components/FullMandalaView";
import { useEffect, useRef } from "react";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { handleUpdateMandala, type ServerMandalaType } from "../service";
import { toast } from "sonner";
import OnboardingTutorial from "@/feature/tutorial/page";

type MandaraChartProps = {
  getCurrentBackground: () => void;
};

export default function MandalaBoard({
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
      className="min-h-screen p-4 pt-[51px] "
      style={{
        backgroundImage: `url(${getCurrentBackground()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <div>
          <img src={KoalaTextRowLogo} />
        </div>
        <NoticeContainer
          variant={"max"}
          shadow={"xl"}
          className={cn("backdrop-blur-sm pr-4 pl-4 pt-[80px]")}
        >
          <CardContent className="px-0">
            <MandalaGrid />
            <div className="text-center mt-6">
              <Button
                className="pixel-button border-1 bg-[#0AA372] hover:bg-[#077351] text-white px-8 pt-3 mb-3 text-base backdrop-blur-sm mb-4 shadow-[4px_4px_0_0_rgba(102,102,102,0.8)]"
                onClick={handleSave}
                data-tutorial="save-button"
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
                  data-tutorial="reminder-button"
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
