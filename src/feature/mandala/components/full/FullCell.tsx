import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useShallow } from "zustand/react/shallow";
import MandalaReadOnlyCell from "../common/MandalaReadOnlyCell";
import MandalaEditableCell from "../common/MandalaEditableCell";
import React, { useCallback, useEffect, useRef } from "react";
import useMandalaData from "../../hooks/useMandalaData";
import { normalizeCellId } from "../../service";
import { toast } from "sonner";

type ModalCellProps = {
  className?: string;
  goalId: string;
  isCenter: boolean;
};

export default React.memo(function ModalCell({
  className,
  goalId,
  isCenter,
}: ModalCellProps) {
  const { data } = useMandalaData();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const normalizedId = normalizeCellId(goalId);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[normalizedId])
  );
  const disabled = cell?.status === "DONE";
  const isEditing = useMandalaStore(
    useShallow((state) => state.editingFullCellId === goalId)
  );

  const cancelEditing = useMandalaStore(
    useShallow((state) => state.cancelEditing)
  );
  const setEditingCell = useMandalaStore(
    useShallow((state) => state.setEditingFullCell)
  );
  const handleCellChange = useMandalaStore(
    useShallow((state) => state.handleCellChange)
  );
  const handleCellClick = useCallback(() => {
    if (disabled) return toast.info("이미 완료한 목표는 수정할 수 없어요!");
    setEditingCell(goalId);
  }, [goalId, setEditingCell]);

  const handleContentChange = useCallback(
    (value: string) => {
      console.log(value);
      handleCellChange(normalizeCellId(goalId), value, data);
    },
    [goalId, handleCellChange, data]
  );

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      const active = document.activeElement;
      const target = e.target as Node;

      if (textareaRef.current?.contains(target)) return;

      if (active === textareaRef.current) {
        cancelEditing("escape");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return isEditing ? (
    <MandalaEditableCell
      ref={textareaRef}
      goalId={normalizedId}
      compact={true}
      isCenter={isCenter}
      disabled={disabled}
      onContentChange={handleContentChange}
    />
  ) : (
    <MandalaReadOnlyCell
      className={className}
      goalId={normalizedId}
      compact={true}
      isCenter={isCenter}
      disabled={disabled}
      isEmpty={!cell.content}
      onCellClick={handleCellClick}
    />
  );
});
