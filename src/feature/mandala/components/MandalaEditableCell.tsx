import { Button } from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

type MandalaEditableCellProps = {
  isCenter: boolean;
  compact: boolean;
  content: string;
  disabled: boolean;
  onContentChange: (value: string) => void;
  onCancel: () => void;
};
function MandalaEditableCell(
  {
    compact,
    isCenter,
    content,
    disabled,
    onContentChange,
    onCancel,
  }: MandalaEditableCellProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onCancel();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div
      data-mandala-cell={isModalOpen && "editing"}
      className={cn(
        "border-2 border-primary bg-white flex items-center justify-center relative",
        compact ? "p-1" : "p-2",
        isCenter && "bg-primary/10"
      )}
      style={{
        minHeight: compact ? "40px" : "100px",
        aspectRatio: "1",
      }}
    >
      <textarea
        ref={ref}
        className={cn(
          "w-full h-full resize-none border-none outline-none bg-transparent text-center leading-tight",
          compact ? "text-xs" : "text-sm"
        )}
        style={{ minHeight: "20px" }}
        maxLength={40}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onBlur={onCancel}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      {!isCenter && compact && (
        <div className="absolute bottom-1 right-1 text-xs text-gray-400">
          {content.length}/40
        </div>
      )}
    </div>
  );
}

export default forwardRef(MandalaEditableCell);
