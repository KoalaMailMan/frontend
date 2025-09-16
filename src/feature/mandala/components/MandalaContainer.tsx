import { Button } from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import MandalaReadOnlyCell from "./MandalaReadOnlyCell";
import MandalaEditableCell from "./MandalaEditableCell";
import type { MainGoal, SubGoal } from "@/lib/stores/mandalaStore";

type MandalaContainerCellProps = {
  isCenter: boolean;
  item: MainGoal | SubGoal;
  isEditing: boolean;
  compact: boolean;
  onStartEdit: () => void;
  onContentChange: (value: string) => void;
  onCancelEdit: () => void;
  onDetailClick?: () => void;
};

export default function MandalaContainer({
  isCenter,
  item,
  isEditing,
  compact,
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
        content={item.content}
        onContentChange={handleContentChange}
        onCancel={onCancelEdit}
      />
    );
  }

  return (
    <MandalaReadOnlyCell
      id={item.goalId}
      isCenter={isCenter}
      compact={compact}
      content={item.content}
      onCellClick={onStartEdit}
      onDetailClick={onDetailClick}
    />
  );
}
