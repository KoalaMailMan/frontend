import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useEffect } from "react";

const SWIPE_THRESHOLD = 3;

export default function UseSubsGoalNavigation() {
  const mandalart = useMandalaStore((state) => state.data.core.mains);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);

  useEffect(() => {
    let isProcessing = false;
    let timer: NodeJS.Timeout;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastSwipeTime = 0;

    const DEBOUNCE_TIME = 300;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontalSwipe) {
        const now = Date.now();
        if (now - lastSwipeTime < DEBOUNCE_TIME) return;
        lastSwipeTime = now;
        const currentModalId = useMandalaStore.getState().modalCellId;
        const currentIndex = mandalart.findIndex(
          (el) => el.goalId === currentModalId
        );
        const nextIndex = Math.min(currentIndex + 1, mandalart.length - 1);
        const prevIndex = Math.max(currentIndex - 1, 1);

        if (nextIndex === 0) return;
        if (deltaX > 0) {
          const id = mandalart[prevIndex].goalId;
          setModalCellId(id);
        } else {
          const id = mandalart[nextIndex].goalId;
          setModalCellId(id);
        }
      }
    };

    const handleNavigation = (event: KeyboardEvent | WheelEvent) => {
      if (event instanceof WheelEvent) {
        const deltaX = event.deltaX;
        const deltaY = event.deltaY;
        if (Math.abs(deltaX) > 0) {
          event.preventDefault();
          // event.stopPropagation();
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

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
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
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);

      clearTimeout(timer);
    };
  }, [mandalart, setModalCellId]);
}
