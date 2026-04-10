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
  const isComponents = useMandalaStore(
    useShallow((state) => state.isModalOpen || state.isFullOpen)
  );
  const isModalOpen = useMandalaStore(useShallow((state) => state.isModalOpen));
  const editingCellId = useMandalaStore(
    useShallow((state) => state.editingCellId)
  );
  const editingContext = useMandalaStore(
    useShallow((state) => state.editingContext)
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
  const setEditingContext = useMandalaStore(
    useShallow((state) => state.setEditingContext)
  );
  const handleCellChange = useMandalaStore(
    useShallow((state) => state.handleCellChange)
  );
  const handleCellClick = useCallback(
    () => setEditingCell(goalId),
    [goalId, setEditingCell]
  );
  const handleDetailClick = useCallback(() => {
    console.log("모달 오픈이요");
    setEditingCell(null);
    setModalCellId(goalId);
    setModalVisible(true);
    setEditingContext("sub");
  }, [goalId, setModalCellId, setModalVisible]);

  const handleContentChange = useCallback(
    (e: React.FormEvent, value: string) => {
      console.log(value);
      handleCellChange(goalId, value);
      if (textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    },
    [goalId, handleCellChange]
  );
  const onCancel = useCallback((e) => {
    const next = e.relatedTarget as HTMLElement | null;

    // 1. 내가 현재 editing 셀이 아니면 무시
    if (useMandalaStore.getState().editingCellId !== goalId) return;

    // 2. editable 영역 내부 이동이면 무시
    if (next?.closest("[data-editable-cell]")) return;

    // 3. 진짜 외부 blur만 처리
    setEditingCell(null);
    setEditingContext("main");
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
