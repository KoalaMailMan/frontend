import { useEffect, useState } from "react";

export default function useVisibility() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // 애니메이션 OFF
        setVisible(false);
      }
      setVisible(true);
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return visible;
}
