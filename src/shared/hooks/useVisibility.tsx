import { useEffect, useState } from "react";

export default function useVisibility() {
  const [inactiveTab, setInactiveTab] = useState(false);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // 애니메이션 OFF
        setInactiveTab(true);
      }
      setInactiveTab(false);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return inactiveTab;
}
