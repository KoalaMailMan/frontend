import { useMutation } from "@tanstack/react-query";
import { createMandalaAPI } from "../api/mandalart/createMandala";
import { useAuthStore } from "@/lib/stores/authStore";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { queryClient } from "@/lib/utils";
import { toast } from "sonner";
import type { ServerMandalaType } from "../service/type";

export default function useSaveMandala() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const resetChangedCells = useMandalaStore((state) => state.resetChangedCells);
  const setMandalartId = useMandalaStore((state) => state.setMandalartId);
  const setData = useMandalaStore((state) => state.setData);

  return useMutation({
    mutationKey: ["mandalart-save"],
    mutationFn: ({ mandalartData }: { mandalartData: ServerMandalaType }) => {
      if (!accessToken) throw new Error("토큰이 없습니다!");
      return createMandalaAPI(mandalartData);
    },
    onSuccess: (mandalartRes: ServerMandalaType) => {
      resetChangedCells();
      if (!mandalartRes?.data?.mandalartId) {
        console.error(
          "createMandalaAPI: mandalartId가 없습니다. 서버 응답을 확인해주세요.",
          mandalartRes
        );
        return;
      }
      setMandalartId(mandalartRes.data.mandalartId);
      setData(mandalartRes.data);
      queryClient.setQueryData(["mandalart"], mandalartRes);
      toast.success("만다라트가 저장되었습니다!");
    },
    onError: (error) => {
      console.log(error);
      toast.warning("만다라트 저장에 실패했습니다. 다시 시도해주세요!");
      throw error;
    },
  });
}
