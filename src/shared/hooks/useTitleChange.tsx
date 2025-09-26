import { useEffect } from "react";

export default function useTitleChange(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
