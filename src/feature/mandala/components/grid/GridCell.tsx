import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useShallow } from "zustand/react/shallow";
import MandalaReadOnlyCell from "../MandalaReadOnlyCell";
import MandalaEditableCell from "../MandalaEditableCell";
import React, { useCallback, useEffect, useRef } from "react";
import useMandalaData from "../../hooks/useMandalaData";

type GridCellProps = {
  className?: string;
  goalId: string;
  isCenter: boolean;
  disabled: boolean;
  tutorialArrowButton?: boolean;
};

export default React.memo(function GridCell({
  className,
  goalId,
  isCenter,
  disabled,
  tutorialArrowButton,
}: GridCellProps) {
  const { data } = useMandalaData();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );
  const editingCellId = useMandalaStore((state) => state.editingCellId);
  const isEditing = useMandalaStore(
    useShallow((state) => state.editingCellId === goalId)
  );
  const setEditingCell = useMandalaStore(
    useShallow((state) => state.setEditingCell)
  );
  const setModalCellId = useMandalaStore(
    useShallow((state) => state.setModalCellId)
  );
  const setModalVisible = useMandalaStore(
    useShallow((state) => state.setModalVisible)
  );
  const cancelEditing = useMandalaStore(
    useShallow((state) => state.cancelEditing)
  );
  const handleCellChange = useMandalaStore(
    useShallow((state) => state.handleCellChange)
  );
  const handleCellClick = useCallback(
    () => setEditingCell(goalId),
    [goalId, setEditingCell]
  );
  const handleDetailClick = useCallback(() => {
    setEditingCell(null);
    setModalCellId(goalId);
    setModalVisible(true);
  }, [goalId, setModalCellId, setModalVisible]);

  const handleContentChange = useCallback(
    (e: React.FormEvent, value: string) => {
      console.log(data);
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
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
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
      isCenter={isCenter}
      disabled={disabled}
      onContentChange={handleContentChange}
    />
  ) : (
    <MandalaReadOnlyCell
      className={className}
      goalId={goalId}
      isCenter={isCenter}
      disabled={disabled}
      isEmpty={!cell.content}
      tutorialArrowButton={tutorialArrowButton}
      onCellClick={handleCellClick}
      onDetailClick={handleDetailClick}
    />
  );
});
