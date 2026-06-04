import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useEffect } from "react";

const SWIPE_THRESHOLD = 50;

export default function UseSubsGoalNavigation() {
  const mandalart = useMandalaStore((state) => state.data.core.mains);
  const mainIds = useMandalaStore((state) => state.flatData.layout.mains);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);

  useEffect(() => {
    let isProcessing = false;
    let timer: NodeJS.Timeout;
    let touchStartX = 0;
    let touchStartY = 0;

    const DEBOUNCE_TIME = 300;

    const navigate = (direction: "next" | "prev") => {
      const currentModalId = useMandalaStore.getState().modalCellId;
      const currentIndex = mainIds.findIndex((id) => id === currentModalId);
      const nextIndex =
        direction === "next"
          ? Math.min(currentIndex + 1, mainIds.length - 1)
          : Math.max(currentIndex - 1, 1);
      if (nextIndex === 0) return;
      setModalCellId(mainIds[nextIndex]);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isProcessing) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

      isProcessing = true;
      navigate(deltaX < 0 ? "next" : "prev");

      timer = setTimeout(() => {
        isProcessing = false;
      }, DEBOUNCE_TIME);
    };
    let locked = false;
    let unlockTimer: NodeJS.Timeout;
    let lastDeltaX = 0; // 이전 deltaX 저장용 변수

    const handleWheel = (event: WheelEvent) => {
      const { deltaX, deltaY } = event;
      if (Math.abs(deltaX) <= Math.abs(deltaY)) return;
      if (locked) return;

      const absDeltaX = Math.abs(deltaX);

      // 1. 최소 강도 체크 (현재 30 유지)
      // 2. 가속도 체크: 이전 입력보다 현재 입력이 커야 "새로운 입력"으로 간주
      if (absDeltaX < 30 || absDeltaX <= lastDeltaX) {
        lastDeltaX = absDeltaX; // 관성 에너지가 줄어드는 중에도 업데이트는 계속
        return;
      }

      event.preventDefault();

      locked = true;
      lastDeltaX = absDeltaX; // 정점 값 저장

      navigate(deltaX > 0 ? "next" : "prev");

      clearTimeout(unlockTimer);
      unlockTimer = setTimeout(() => {
        locked = false;
        lastDeltaX = 0; // 잠금 해제 시 초기화
      }, 500); // 관성이 어느 정도 끝날 때까지 넉넉히 잠금 (300~700ms)
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isProcessing) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

      isProcessing = true;
      navigate(event.key === "ArrowRight" ? "next" : "prev");

      timer = setTimeout(() => {
        isProcessing = false;
      }, DEBOUNCE_TIME);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });
    window.addEventListener("keydown", handleKeyDown as EventListener);

    window.addEventListener("wheel", handleWheel as EventListener, {
      passive: false,
      capture: true,
    });

    return () => {
      window.removeEventListener("wheel", handleWheel, {
        capture: true,
      });
      window.removeEventListener("keydown", handleKeyDown as EventListener);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);

      clearTimeout(timer);
    };
  }, [mandalart, setModalCellId]);
}
