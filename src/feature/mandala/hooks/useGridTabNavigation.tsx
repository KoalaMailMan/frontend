import { useEffect } from "react";

type UseGridTabNavigationProps = {
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  getNextId: (id: string) => string | null;
};

export default function useGridTabNavigation({
  editingId,
  setEditingId,
  getNextId,
}: UseGridTabNavigationProps) {
  useEffect(() => {
    let isComposing = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComposing) return;
      if (e.key !== "Tab") return;
      e.preventDefault();
      if (editingId == undefined) return;

      const nextId = getNextId(editingId);
      if (nextId) setEditingId(nextId);
    };
    window.addEventListener("compositionstart", () => {
      isComposing = true;
    });
    window.addEventListener("compositionend", () => {
      isComposing = false;
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editingId, setEditingId, getNextId]);
}
