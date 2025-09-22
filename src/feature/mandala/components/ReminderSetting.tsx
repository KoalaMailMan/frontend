import koalaImage from "@/assets/default_koala.png";
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
import { useState } from "react";

export default function ReminderSetting() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [frequency, setFrequency] = useState("1week");
  const [email] = useState("test@email.com");
  const isOpen = useMandalaStore((state) => state.isReminderOpen);
  const onClose = useMandalaStore((state) => state.setReminderVisible);

  if (!isOpen) return null;

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
            <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
          </div>

          {isEnabled && (
            <>
              <div className="space-y-2">
                <Label>리마인드 주기</Label>
                <Select value={frequency} onValueChange={setFrequency}>
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
                  value={email}
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
                      {frequency === "1week" &&
                        "일주일에 한 번씩 목표를 점검하면 꾸준히 실행할 수 있어요!"}
                      {frequency === "2week" &&
                        "2주 간격으로 리마인드를 받으면 적당한 긴장감을 유지할 수 있어요!"}
                      {frequency === "1month" &&
                        "월 단위로 목표를 되돌아보면 큰 그림을 놓치지 않을 수 있어요!"}
                      {frequency === "2month" &&
                        "2개월마다 목표를 점검하면 장기적인 관점을 유지할 수 있어요!"}
                      {frequency === "3month" &&
                        "분기별 목표 점검으로 체계적인 성장을 이룰 수 있어요!"}
                      {frequency === "6month" &&
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
            <Button className="flex-1">저장하기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
