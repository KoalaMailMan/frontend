import { useEffect } from "react";

export default function useVisibility() {
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // 애니메이션 OFF
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}
