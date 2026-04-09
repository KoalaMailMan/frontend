import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useShallow } from "zustand/react/shallow";
import MandalaReadOnlyCell from "../MandalaReadOnlyCell";
import MandalaEditableCell from "../MandalaEditableCell";
import React, { useCallback, useEffect, useRef } from "react";

type GridCellProps = {
  className?: string;
  dashboard: string;
  goalId: string;
  isCenter: boolean;
  disabled: boolean;
  tutorialArrowButton?: boolean;
};

export default React.memo(function GridCell({
  className,
  dashboard,
  goalId,
  isCenter,
  disabled,
  tutorialArrowButton,
}: GridCellProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );
  const isEditing = useMandalaStore(
    useShallow((state) => !state.isFullOpen && state.editingCellId === goalId)
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
      console.log(value);
      handleCellChange(goalId, value);
      (e.target as HTMLTextAreaElement).focus();
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    },
    [goalId, handleCellChange]
  );
  const onCancel = useCallback(() => {
    if (dashboard === "main") {
      setEditingCell(null);
      console.log("Test");
    }
  }, []);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [isEditing]);

  return (
    <>
      <MandalaEditableCell
        ref={textareaRef}
        goalId={goalId}
        // cell={cell}
        isCenter={isCenter}
        disabled={disabled}
        onContentChange={handleContentChange}
        onCancel={onCancel}
      />
      <MandalaReadOnlyCell
        className={className}
        goalId={goalId}
        // cell={cell}
        isCenter={isCenter}
        disabled={disabled}
        isEmpty={!cell.content}
        tutorialArrowButton={tutorialArrowButton}
        onCellClick={handleCellClick}
        onDetailClick={handleDetailClick}
      />
    </>
  );
});
