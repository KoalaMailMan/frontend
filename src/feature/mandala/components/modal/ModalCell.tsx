import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { useShallow } from "zustand/react/shallow";
import MandalaReadOnlyCell from "../MandalaReadOnlyCell";
import MandalaEditableCell from "../MandalaEditableCell";
import React, { useCallback, useEffect, useRef } from "react";

type ModalCellProps = {
  className?: string;
  dashboard: string;
  goalId: string;
  isCenter: boolean;
  disabled: boolean;
};

export default React.memo(function ModalCell({
  className,
  dashboard,
  goalId,
  isCenter,
  disabled,
}: ModalCellProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );
  const isFullOpen = useMandalaStore(useShallow((state) => state.isFullOpen));
  const isEditing = useMandalaStore(
    useShallow(
      (state) =>
        `${dashboard}-${state.editingCellId}` === `${dashboard}-${goalId}`
    )
  );
  const editingCellId = useMandalaStore(
    useShallow((state) => !state.isFullOpen && state.editingCellId)
  );
  useEffect(() => {
    console.log(editingCellId);
  }, []);

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
  const handleCellClick = useCallback(() => {
    console.log("클릭:", goalId);
    setEditingCell(goalId);
    console.log(useMandalaStore.getState().editingCellId);
  }, [goalId, setEditingCell]);

  const handleDetailClick = useCallback(() => {
    setEditingCell(null);
    setModalCellId(goalId);
    setModalVisible(true);
  }, [goalId, setEditingCell, setModalCellId, setModalVisible]);

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
  const onCancel = useCallback(() => {
    if (dashboard === "sub") {
      // edit/read 컴포넌트를 재사용하여 사용하므로
      // editingCell의 초기화가 연동됨.
      // 한 화면에 main/sub, main/full 두 개 이하의 컴포넌트가 렌더링되어
      // blur 이벤트가 두 번 이상 발생하므로 조건부 처리가 필수적임.
      setEditingCell(null);
    }
  }, []);

  useEffect(() => {
    console.log({
      editingCellId,
      isFullOpen,
      result: !isFullOpen && editingCellId === goalId,
    });
    requestAnimationFrame(() => {
      if (isEditing && textareaRef.current) {
        console.log("포커스!");
        console.log(useMandalaStore.getState().editingCellId === goalId);
        console.log(isEditing);
        console.log(textareaRef.current);
        textareaRef.current.focus();
        textareaRef.current.select();

        const textarea = textareaRef.current;
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
    });
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
        onCellClick={handleCellClick}
        onDetailClick={handleDetailClick}
      />
    </>
  );
});
