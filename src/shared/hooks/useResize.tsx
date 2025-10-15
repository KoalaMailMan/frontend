import { useViewportStore } from "@/lib/stores/viewportStore";
import { useEffect } from "react";

export default function useResize() {
  const setViewport = useViewportStore((state) => state.setViewport);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport(width, height);
      console.log(width, height);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
