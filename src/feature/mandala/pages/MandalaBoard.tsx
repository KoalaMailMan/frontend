// @ts-expect-error -- vite-imagetools query import
import KoalaTextRowLogo from "@/assets/common/header_text_logo.png?width=476;952;1428&as=srcset&format=webp";
import MandalaGrid from "../components/MandalaGrid";
import { CardContent } from "@/feature/ui/Card";
import { cn } from "@/lib/utils";
import NoticeContainer from "@/feature/ui/NoticeContainer";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import Button from "@/feature/ui/Button";
import ReminderSetting from "../components/ReminderSetting";
import FullMandalaView from "../components/FullMandalaView";
import { useRef } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { handleUpdateMandala, type ServerMandalaType } from "../service";
import { toast } from "sonner";
import MailIcon from "../components/icon/MailIcon";
import ActivationBellIcon from "../components/icon/ActivationBellIcon";
import DisableBellIcon from "../components/icon/DisableBellIcon";
import FullIcon from "../components/icon/FullIcon";
import BackgroundAnimation from "@/feature/home/components/BackgroundAnimation";
import useAccessibility from "@/shared/hooks/useAccessibility";

type MandaraChartProps = {
  getCurrentBackground: () => Record<string, string>;
};

export default function MandalaBoard({
  getCurrentBackground,
}: MandaraChartProps) {
  const { mobile, desktop } = getCurrentBackground();
  const reduced = useAccessibility();

  const accessToken = useAuthStore((state) => state.accessToken);
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);
  const setAuthText = useAuthStore((state) => state.setAuthText);
  const hasSeenReminderSetup = useAuthStore(
    (state) => state.hasSeenReminderSetup
  );
  const mandalartId = useMandalaStore((state) => state.mandalartId);
  const setMandalartId = useMandalaStore((state) => state.setMandalartId);
  const data = useMandalaStore((state) => state.data);
  const changedCells = useMandalaStore((state) => state.changedCells);
  const setData = useMandalaStore((state) => state.setData);

  const isReminder = useMandalaStore((state) => state.isReminderOpen);
  const isFullOpen = useMandalaStore((state) => state.isFullOpen);
  const onReminderOpen = useMandalaStore((state) => state.setReminderVisible);
  const setFullVisible = useMandalaStore((state) => state.setFullVisible);

  const typeRef = useRef<"save" | "reminder">("save");
  const reminderEnabled = useMandalaStore(
    (state) => state.reminderOption.reminderEnabled
  );

  const handleSave = async () => {
    if (!accessToken && !wasLoggedIn) {
      setAuthText({
        title: "저장하려면 로그인이 필요해요",
        description:
          "로그인 시 만다라트 저장은 물론, AI가 방향을 제안해주고 \n리마인드 메일로 꾸준함까지 도와드려요.",
      });
      setAuthOpen(true);
      return;
    }
    if (!hasSeenReminderSetup && !mandalartId) {
      onReminderOpen(true);
      typeRef.current = "save";
    } else {
      if (changedCells.size <= 0) {
        toast("변경된 목표가 없습니다!");
        return;
      }
      const mandalartRes: ServerMandalaType = await handleUpdateMandala(
        data,
        changedCells
      );
      if (mandalartRes.data.mandalartId != undefined) {
        setMandalartId(mandalartRes?.data?.mandalartId);
        setData(mandalartRes.data);
        toast.success("만다라트가 저장되었습니다!");
      }
    }
  };

  return (
    <div className="relative min-h-screen p-4 pt-[51px] ">
      {!reduced && <BackgroundAnimation />}
      {/* 모바일 배경 이미지 */}
      <div className="absolute inset-0 min-h-screen z-[-1000] pointer-events-none md:block bg-cover bg-center bg-no-repeat">
        <picture>
          <source srcSet={mobile} media="(min-width: 768px)" />
          <img
            className="fixed inset-0 w-full h-full object-cover -z-10"
            srcSet={mobile}
            src={mobile}
            alt="테마 배경 이미지"
          />
        </picture>
      </div>
      {/* 데스크탑 배경 이미지 */}
      <div className="absolute inset-0 min-h-screen z-[-1000] pointer-events-none md:block bg-cover bg-center bg-no-repeat">
        <picture>
          <source srcSet={desktop} media="(min-width: 1200px)" />
          <img
            className="fixed inset-0 w-full h-full object-cover -z-10"
            src={desktop}
            srcSet={desktop}
            alt="테마 배경 이미지"
          />
        </picture>
      </div>
      <div className="max-w-2xl mx-auto">
        <div
          className={cn(
            "w-[476px] max-w-full md:h-[96px] mx-auto mt-[15px]",
            isReminder && "h-[96px]"
          )}
        >
          <img
            src={KoalaTextRowLogo}
            className="w-full"
            loading="lazy"
            decoding="async"
            srcSet={KoalaTextRowLogo}
            sizes="(max-width: 768px) 90vw, 476px"
            width={476}
            height={96}
            style={{ maxWidth: "100%", height: "auto" }}
          />
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
                className="w-[196px] pixel-button border-1 bg-[#0AA372] active:bg-[#077351] active:border-[#04432F] text-white px-8 pt-3 mb-3 text-base backdrop-blur-sm mb-4 shadow-[4px_4px_0_0_rgba(102,102,102,0.8)] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)]"
                onClick={handleSave}
                data-tutorial="save-button"
              >
                <MailIcon />
                우체통에 저장하기
              </Button>
              {/* 리마인드 설정 & 전체보기 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    typeRef.current = "reminder";
                    onReminderOpen(true);
                  }}
                  className={`w-[136px] h-[32px] flex items-center gap-2 pixel-button text-sm px-4 py-2 bg-white border-[#CCCCCC] border-1 text-[#373737] active:bg-[#CCCCCC] active:border-[#B3B3B3] font-medium shadow-[4px_4px_0_0_rgba(102,102,102,0.6)] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-sm`}
                  data-tutorial="reminder-button"
                >
                  {reminderEnabled && wasLoggedIn ? (
                    <ActivationBellIcon />
                  ) : (
                    <DisableBellIcon />
                  )}
                  {reminderEnabled && wasLoggedIn
                    ? "리마인드 ON"
                    : "리마인드 OFF"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFullVisible(true)}
                  className={`w-[136px] h-[32px] flex items-center gap-2 pixel-button text-sm px-4 py-2 bg-white border-[#CCCCCC] border-1 text-[#373737] font-medium active:bg-[#CCCCCC] active:border-[#B3B3B3] shadow-[4px_4px_0_0_rgba(102,102,102,0.6)] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-sm`}
                  data-tutorial="reminder-button"
                >
                  <FullIcon />
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
