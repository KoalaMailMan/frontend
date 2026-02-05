import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useEffect } from "react";

const SWIPE_THRESHOLD = 3;

export default function UseSubsGoalNavigation() {
  const mandalart = useMandalaStore((state) => state.data.core.mains);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);

  useEffect(() => {
    let isProcessing = false;
    let timer: NodeJS.Timeout;
    const handleNavigation = (event: KeyboardEvent | WheelEvent) => {
      if (event instanceof WheelEvent) {
        const deltaX = event.deltaX;
        const deltaY = event.deltaY;
        if (Math.abs(deltaX) > 0) {
          event.preventDefault();
          event.stopPropagation();
        }

        const isHorizontalSwipe =
          Math.abs(deltaX) > Math.abs(deltaY) &&
          Math.abs(deltaX) > SWIPE_THRESHOLD;

        if (isHorizontalSwipe) {
          if (!isProcessing) {
            isProcessing = true;

            const currentModalId = useMandalaStore.getState().modalCellId;
            const currentIndex = mandalart.findIndex(
              (el) => el.goalId === currentModalId
            );
            const nextIndex =
              deltaX > 0
                ? Math.min(currentIndex + 1, mandalart.length - 1)
                : Math.max(currentIndex - 1, 1);
            if (nextIndex === 0) return;
            const id = mandalart[nextIndex].goalId;
            setModalCellId(id);
          }
        }
      } else if (event instanceof KeyboardEvent) {
        if (!isProcessing) {
          isProcessing = true;

          const currentModalId = useMandalaStore.getState().modalCellId;
          const currentIndex = mandalart.findIndex(
            (el) => el.goalId === currentModalId
          );
          const nextIndex = Math.min(currentIndex + 1, mandalart.length - 1);
          const prevIndex = Math.max(currentIndex - 1, 1);

          if (nextIndex === 0) return;
          if (event.key === "ArrowRight") {
            const id = mandalart[nextIndex].goalId;
            setModalCellId(id);
          }
          if (event.key === "ArrowLeft") {
            const id = mandalart[prevIndex].goalId;
            setModalCellId(id);
          }
        }
      }
      timer = setTimeout(() => {
        isProcessing = false;
      }, 300);
    };
    // window.addEventListener(
    //   "touchstart",
    //   (e) => {
    //     // 터치 위치가 화면 왼쪽 가장자리(10% 이내)인지 확인
    //     if (e.touches[0].clientX < window.innerWidth * 0.1) {
    //       // 엣지 제스처 막기
    //       e.preventDefault();
    //     }
    //   },
    //   { passive: false }
    // );
    window.addEventListener("keydown", handleNavigation as EventListener);

    window.addEventListener("wheel", handleNavigation as EventListener, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleNavigation, {
        capture: true,
      });
      window.removeEventListener("keydown", handleNavigation as EventListener);
      clearTimeout(timer);
    };
  }, [mandalart, setModalCellId]);
}
