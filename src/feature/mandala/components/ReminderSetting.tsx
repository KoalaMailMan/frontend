import koalaImage from "@/assets/common/default_koala.png";
import { Button } from "@/feature/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/feature/ui/Card";
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
import { Mail } from "lucide-react";
import { handleUpdateMandala, type ServerMandalaType } from "../service";
import { useAuthStore } from "@/lib/stores/authStore";
import { patchReminderAPI } from "../api/reminder/patchReminder";
import { APIWithRetry } from "@/feature/auth/\butils";
import {
  handleLogout,
  reissueWithRefreshToken,
  shouldAttemptRefresh,
} from "@/feature/auth/service";
import { IntervalType } from "../const";
import useUserInfo from "@/feature/auth/hooks/useUserInfo";

type PropsType = {
  openTree: "reminder" | "save";
};

export default function ReminderSetting({ openTree = "save" }: PropsType) {
  const accessToken = useAuthStore((state) => state.accessToken);
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

  const { data: user } = useUserInfo(accessToken || "");

  if (!isOpen) return null;

  const handleReminder = async () => {
    if (!accessToken) {
      // token X
      if (shouldAttemptRefresh()) {
        // access token 없으나 로그인 기록 있음.
        const success = await APIWithRetry(reissueWithRefreshToken);
        if (!success) {
          return handleLogout();
        }
      } else {
        handleLogout();
        alert("세션 종료로 인해 처음 화면으로 돌아갑니다.");
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
          await patchReminderAPI(accessToken, reminderOptionObj);
          alert("리마인드 설정이 완료되었습니다.");
          onClose(false);
        } else {
          // 기존 대시보드 존재 X
          if (openTree === "reminder") {
            // 리마인더 설정 버튼으로 들어옴.
            alert("먼저 만다라트를 저장해주세요!");
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
    if (!accessToken) return;
    if (openTree === "reminder") {
      // 리마인더 설정
      await handleReminder();
      return;
    }
    if (openTree === "save") {
      // 만다라트 저장
      if (changedCells.size <= 0) {
        alert("변경된 목표가 없습니다!");
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
            await patchReminderAPI(accessToken, reminderOptionObj);
            setSeenReminder(true);
            alert("만다라트 저장 및 리마인드 설정이 완료되었습니다! 🎉");
          } catch (error) {
            console.error("리마인더 설정 실패:", error);
            alert("만다라트는 저장되었으나 리마인더 설정에 실패했습니다.");
          }
        } else {
          alert("만다라트가 저장되었습니다!");
        }
      }
      onClose(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={koalaImage} alt="코알라" className="w-16 h-16" />
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Mail className="h-5 w-5" />
            코알라 리마인드 설정
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">이메일 리마인드</Label>
              <p className="text-sm text-gray-600 mt-1">
                코알라가 주기적으로 목표를 상기시켜드려요
              </p>
            </div>
            <Switch
              checked={reminderEnabled}
              onCheckedChange={setReminderEnabled}
            />
          </div>

          {reminderEnabled && (
            <>
              <div className="space-y-2">
                <Label>리마인드 주기</Label>
                <Select
                  value={remindInterval}
                  onValueChange={setRemindInterval}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1week">1주</SelectItem>
                    <SelectItem value="2week">2주</SelectItem>
                    <SelectItem value="1month">1달</SelectItem>
                    <SelectItem value="2month">2달</SelectItem>
                    <SelectItem value="3month">3달</SelectItem>
                    <SelectItem value="6month">6달</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>수신 이메일</Label>
                <Input
                  type="email"
                  value={user?.email || "이메일을 찾을 수 없습니다."}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="로그인된 계정의 이메일이 사용됩니다"
                />
                <p className="text-xs text-gray-500">
                  * 로그인된 계정의 이메일로 리마인드가 발송됩니다
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <img src={koalaImage} alt="코알라" className="w-8 h-8 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium text-red-900 mb-1">코알라 팁!</p>
                    <p className="text-red-800">
                      {remindInterval === "1week" &&
                        "일주일에 한 번씩 목표를 점검하면 꾸준히 실행할 수 있어요!"}
                      {remindInterval === "2week" &&
                        "2주 간격으로 리마인드를 받으면 적당한 긴장감을 유지할 수 있어요!"}
                      {remindInterval === "1month" &&
                        "월 단위로 목표를 되돌아보면 큰 그림을 놓치지 않을 수 있어요!"}
                      {remindInterval === "2month" &&
                        "2개월마다 목표를 점검하면 장기적인 관점을 유지할 수 있어요!"}
                      {remindInterval === "3month" &&
                        "분기별 목표 점검으로 체계적인 성장을 이룰 수 있어요!"}
                      {remindInterval === "6month" &&
                        "반년마다 큰 목표를 되돌아보며 인생의 방향을 확인해보세요!"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onClose(false)}
            >
              취소
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
