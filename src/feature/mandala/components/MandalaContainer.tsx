import { useEffect, useRef } from "react";
import MandalaReadOnlyCell from "./MandalaReadOnlyCell";
import MandalaEditableCell from "./MandalaEditableCell";
import type { MainGoal, SubGoal } from "@/lib/stores/mandalaStore";

type MandalaContainerCellProps = {
  type?: string;
  isCenter: boolean;
  item: MainGoal | SubGoal;
  isEditing: boolean;
  compact: boolean;
  disabled: boolean;
  isEmpty: boolean;
  className?: string;
  "data-tutorial"?: string;
  tutorialArrowButton?: boolean;
  onStartEdit: () => void;
  onContentChange: (value: string) => void;
  onCancelEdit: () => void;
  onDetailClick?: () => void;
};

export default function MandalaContainer({
  type,
  isCenter,
  item,
  isEditing,
  compact,
  disabled,
  isEmpty,
  className,
  "data-tutorial": dataTutorial,
  tutorialArrowButton = false,
  onStartEdit,
  onContentChange,
  onCancelEdit,
  onDetailClick,
}: MandalaContainerCellProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();

      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleContentChange = (value: string) => {
    onContentChange(value);

    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  if (isEditing) {
    return (
      <MandalaEditableCell
        ref={textareaRef}
        isCenter={isCenter}
        compact={compact}
        content={item.content}
        status={item.status}
        disabled={disabled}
        onContentChange={handleContentChange}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <MandalaReadOnlyCell
      className={className}
      type={type}
      id={item.goalId}
      isCenter={isCenter}
      compact={compact}
      content={item.content}
      status={item.status}
      disabled={disabled}
      isEmpty={isEmpty}
      data-tutorial={dataTutorial}
      tutorialArrowButton={tutorialArrowButton}
      onCellClick={onStartEdit}
      onDetailClick={onDetailClick}
    />
  );
}
