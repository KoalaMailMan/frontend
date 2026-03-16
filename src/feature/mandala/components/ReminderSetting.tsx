import Button from "@/feature/ui/Button";
import { Card, CardContent } from "@/feature/ui/Card";
import { Input } from "@/feature/ui/Input";
import { Label } from "@/feature/ui/Label";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/feature/ui/Select";
import { Switch } from "@/feature/ui/Switch";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { Select } from "@radix-ui/react-select";
import { handleUpdateMandala, type ServerMandalaType } from "../service";
import { useAuthStore } from "@/lib/stores/authStore";
import { patchReminderAPI } from "../api/reminder/patchReminder";
import { APIWithRetry } from "@/feature/auth/\butils";
import {
  reissueWithRefreshToken,
  shouldAttemptRefresh,
} from "@/feature/auth/service";
import { IntervalType } from "../const";
import { toast } from "sonner";
import RemindeIcon from "./icon/RemindeIcon";
import X from "@/feature/tutorial/components/icons/X";
import { cn } from "@/lib/utils";
import { performLogout } from "@/feature/auth/hooks/useLogout";

type PropsType = {
  openTree: "reminder" | "save";
};

export default function ReminderSetting({ openTree = "save" }: PropsType) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setAuthText = useAuthStore((state) => state.setAuthText);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);
  const setSeenReminder = useAuthStore((state) => state.setSeenReminder);

  const reminderEnabled = useMandalaStore(
    (state) => state.reminderOption.reminderEnabled
  );
  const remindInterval = useMandalaStore(
    (state) => state.reminderOption.remindInterval
  );
  const setReminderEnabled = useMandalaStore(
    (state) => state.setReminderEnabled
  );
  const setRemindInterval = useMandalaStore((state) => state.setRemindInterval);

  const data = useMandalaStore((state) => state.data);
  const mandalartId = useMandalaStore((state) => state.mandalartId);
  const changedCells = useMandalaStore((state) => state.changedCells);
  const isOpen = useMandalaStore((state) => state.isReminderOpen);
  const setData = useMandalaStore((state) => state.setData);
  const onClose = useMandalaStore((state) => state.setReminderVisible);

  if (!isOpen) return null;

  const handleReminder = async () => {
    if (!accessToken) {
      // token X
      if (shouldAttemptRefresh()) {
        // access token 없으나 로그인 기록 있음.
        const success = await APIWithRetry(reissueWithRefreshToken);
        if (!success) {
          return performLogout();
        }
      } else {
        performLogout();

        toast("세션 종료로 인해 처음 화면으로 돌아갑니다.");
        return;
      }
    } else {
      // token O
      try {
        if (mandalartId) {
          // 기존 대시보드 존재
          setSeenReminder(true);
          const interval = IntervalType[remindInterval];
          const reminderOptionObj = {
            data: {
              mandalartId: mandalartId,
              reminderEnabled: reminderEnabled,
              reminderInterval: interval,
            },
          };
          await patchReminderAPI(reminderOptionObj);
          toast.success("리마인드 설정이 완료되었습니다.");
          onClose(false);
        } else {
          // 기존 대시보드 존재 X
          if (openTree === "reminder") {
            // 리마인더 설정 버튼으로 들어옴.
            toast("먼저 만다라트를 저장해주세요!");
            onClose(false);
            return;
          }
        }
      } catch (error) {
        setSeenReminder(true);
        console.error("리마인더 설정 실패:", error);
      }
    }
  };

  const handleSave = async () => {
    if (!accessToken) {
      setAuthText({
        title: "리마인드를 설정하려면 로그인이 필요해요.",
        description:
          "로그인하고 목표를 잊지 않도록 정기 알림을 받아보세요. \nAI 맞춤 목표 제안도 받을 수 있어요",
      });
      setAuthOpen(true);
      return;
    }
    if (openTree === "reminder") {
      // 리마인더 설정
      await handleReminder();
      return;
    }
    if (openTree === "save") {
      // 만다라트 저장
      if (changedCells.size <= 0) {
        toast("변경된 목표가 없습니다!");
        onClose(false);
        return;
      }
      const mandalartRes: ServerMandalaType | undefined =
        await handleUpdateMandala(data, changedCells);
      if (mandalartRes?.data) {
        setData(mandalartRes.data);

        if (reminderEnabled && mandalartRes.data.mandalartId) {
          const mandalartId = mandalartRes.data.mandalartId;
          const interval = IntervalType[remindInterval];
          const reminderOptionObj = {
            data: {
              mandalartId: mandalartId,
              reminderEnabled: reminderEnabled,
              remindInterval: interval,
            },
          };

          try {
            await patchReminderAPI(reminderOptionObj);
            setSeenReminder(true);
            toast.success(
              "만다라트 저장 및 리마인드 설정이 완료되었습니다! 🎉"
            );
          } catch (error) {
            console.error("리마인더 설정 실패:", error);
            toast.warning(
              "만다라트는 저장되었으나 리마인더 설정에 실패했습니다."
            );
          }
        } else {
          toast.success("만다라트가 저장되었습니다! 🎉");
        }
      }
      onClose(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <Card className="w-[421px] max-w-lg px-[20px] pt-[21px] pb-[17px] relative">
        <div
          className="w-[40px] h-[40px] absolute right-[13px] top-[13px]"
          onClick={() => onClose(false)}
        >
          <X className="w-full h-full p-2" />
        </div>
        <CardContent className="space-y-3 p-0">
          <div className="w-full h-[62px] pl-[10px] flex items-center">
            <RemindeIcon />
          </div>
          <div className="h-[24px] flex items-center justify-between">
            <Label className="text-base font-semibold leading-[12.25px]">
              이메일 리마인드 설정
            </Label>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              value={user?.email || "알림 받을 이메일을 입력해주세요"}
              readOnly
              className={cn(
                "bg-white border-1 border-[#CCCCCC] text-[#B3B3B3] cursor-not-allowed",
                !reminderEnabled && "bg-[#E6E6E6] !opacity-100 text-[#CACACA]"
              )}
              placeholder="user@example.com"
              disabled={!reminderEnabled}
            />
            <Select
              value={remindInterval}
              onValueChange={setRemindInterval}
              disabled={!reminderEnabled}
            >
              <SelectTrigger
                className={cn(
                  "w-full border-1 border-[#CCCCCC] text-[#666666]",
                  !reminderEnabled && "bg-[#E6E6E6] !opacity-100 text-[#CACACA]"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-1 border-[#CCCCCC]">
                <SelectItem value="1week">1주</SelectItem>
                <SelectItem value="2week">2주</SelectItem>
                <SelectItem value="1month">1달</SelectItem>
                <SelectItem value="2month">2달</SelectItem>
                <SelectItem value="3month">3달</SelectItem>
                <SelectItem value="6month">6달</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full h-[70px] flex items-center justify-center">
            <Button
              variant="shadow"
              className="min-w-[299px] h-[30px] active:border-[#4C4C4C] active:bg-[#CCCCCC] active:shadow-none"
              onClick={handleSave}
            >
              저장하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
