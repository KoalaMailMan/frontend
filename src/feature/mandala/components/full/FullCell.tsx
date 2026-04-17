import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useShallow } from "zustand/react/shallow";
import MandalaReadOnlyCell from "../MandalaReadOnlyCell";
import MandalaEditableCell from "../MandalaEditableCell";
import React, { useCallback, useEffect, useRef } from "react";
import useMandalaData from "../../hooks/useMandalaData";

type ModalCellProps = {
  className?: string;
  goalId: string;
  isCenter: boolean;
  disabled: boolean;
};

export default React.memo(function ModalCell({
  className,
  goalId,
  isCenter,
  disabled,
}: ModalCellProps) {
  const { data } = useMandalaData();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );
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
    console.log(goalId);
    setEditingCell(goalId);
  }, [goalId, setEditingCell]);

  const handleContentChange = useCallback(
    (e: React.FormEvent, value: string) => {
      console.log(value);
      handleCellChange(goalId, value, data);
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    },
    [goalId, handleCellChange]
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();

        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
  }, [isEditing]);

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
      goalId={goalId}
      compact={true}
      isCenter={isCenter}
      disabled={disabled}
      onContentChange={handleContentChange}
    />
  ) : (
    <MandalaReadOnlyCell
      className={className}
      goalId={goalId}
      compact={true}
      isCenter={isCenter}
      disabled={disabled}
      isEmpty={!cell.content}
      onCellClick={handleCellClick}
    />
  );
});
