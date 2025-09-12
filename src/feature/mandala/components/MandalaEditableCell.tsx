import { Button } from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";

type MandalaEditableCellProps = {
  isCenter: boolean;
  content: string;
  onContentChange: (value: string) => void;
  onCancel: () => void;
};
function MandalaEditableCell(
  { isCenter, content, onContentChange, onCancel }: MandalaEditableCellProps,
  ref: React.Ref<HTMLTextAreaElement>
) {
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
      className={cn(
        "w-full h-full border-2 border-primary bg-white flex items-center justify-center relative p-2",
        isCenter && "bg-primary/10"
      )}
      style={{ minHeight: "100px", aspectRatio: "1" }}
    >
      <textarea
        ref={ref}
        className="resize-none border-none outline-none bg-transparent text-center leading-tight text-sm"
        style={{ minHeight: "20px" }}
        maxLength={40}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        onBlur={onCancel}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute bottom-1 right-1 text-xs text-gray-400">
        {content.length}/40
      </div>
    </div>
  );
}

export default forwardRef(MandalaEditableCell);
