import { useMutation } from "@tanstack/react-query";
import {
  patchReminderAPI,
  type ReminderType,
} from "../api/reminder/patchReminder";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { toast } from "sonner";

export default function useSaveReminder() {
  return useMutation({
    mutationFn: (data: ReminderType) => patchReminderAPI(data),
    onSuccess: () => {
      toast.success("리마인드 설정이 완료되었습니다.");
    },
    onError: () => {
      toast.warning("리마인드 설정에 실패했습니다. 다시 시도해주세요.");
    },
  });
}
