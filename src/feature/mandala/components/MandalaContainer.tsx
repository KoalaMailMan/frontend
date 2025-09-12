import { Button } from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import MandalaReadOnlyCell from "./MandalaReadOnlyCell";
import MandalaEditableCell from "./MandalaEditableCell";

type MandalaContainerCellProps = {
  isCenter: boolean;
  item: any;
  isEditing: boolean;
  onStartEdit: () => void;
  onContentChange: (value: string) => void;
  onCancelEdit: () => void;
  onDetailClick?: () => void;
};

export default function MandalaContainer({
  isCenter,
  item,
  isEditing,
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
      // 높이 자동 조절
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleContentChange = (value: string) => {
    onContentChange(value);
    // 높이 자동 조절
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
      isCenter={isCenter}
      content={item.content}
      onCellClick={onStartEdit}
      onDetailClick={onDetailClick}
    />
  );
}
