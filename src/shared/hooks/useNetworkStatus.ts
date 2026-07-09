import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useEffect } from "react";
import { toast } from "sonner";

export default function useNetworkStatus() {
  useEffect(() => {
    const handleOffline = () => toast.error("인터넷 연결이 끊겼어요.");
    const handleOnline = () => {
      const changedCells = useMandalaStore.getState().changedCells;
      if (changedCells.size > 0) {
        toast.info(
          "인터넷 연결이 복구됐어요. 저장되지 않은 변경사항이 있어요."
        );
      } else {
        toast.success("인터넷 연결이 복구됐어요.");
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
}
