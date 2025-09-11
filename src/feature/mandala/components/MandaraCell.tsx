import { Button } from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CellProps = {
  compact: boolean;
  isCenter: boolean;
  showAsEmpty: boolean;
  disabled: boolean;
  className?: string;
  getModalVisible: (visible: boolean) => void;
};

export default function MandalaCell({
  compact,
  isCenter,
  showAsEmpty,
  disabled,
  className,
  getModalVisible,
}: CellProps) {
  const [editMode, setEditMode] = useState(false);
  const [isHovered, setHovered] = useState(false);
  const [editValue, setEditValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholder = isCenter
    ? "핵심 목표를 입력하세요"
    : "주요 목표를 입력하세요";
  useEffect(() => {
    if (editMode && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      adjustTextareaHeight();
    }
  }, [editMode]);
  const handleClick = () => {
    if (disabled || editMode) return;
    setEditMode(true);
    textareaRef.current?.focus();
  };
  const handleDoubleClick = () => {
    if (!disabled) {
      setEditMode(true);
      textareaRef.current?.focus();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setEditMode(false);
      textareaRef.current?.blur();
    } else if (e.key === "Escape") {
      setEditMode(false);
      textareaRef.current?.blur();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 40) {
      setEditValue(newValue);
      adjustTextareaHeight();
    }
  };

  const handleBlur = () => {
    setEditMode(false);
    textareaRef.current?.blur();
  };

  const displayValue = editMode || editValue ? editValue : placeholder;

  if (editMode) {
    return (
      <div
        className={cn(
          "border-2 border-primary bg-white flex items-center justify-center relative",
          compact ? "p-1" : "p-2",
          isCenter && "bg-primary/10",
          className
        )}
        style={{
          minHeight: compact ? "40px" : "100px",
          aspectRatio: "1",
        }}
      >
        <textarea
          ref={textareaRef}
          value={editValue}
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "w-full h-full resize-none border-none outline-none bg-transparent text-center leading-tight",
            compact ? "text-xs" : "text-sm"
          )}
          style={{ minHeight: compact ? "16px" : "20px" }}
          maxLength={40}
        />
        {!compact && (
          <div className="absolute bottom-1 right-1 text-xs text-gray-400">
            {editValue.length}/40
          </div>
        )}
      </div>
    );
  }
  return (
    <>
      <div
        className={cn(
          "pixel-input border-2 border-gray-300 flex items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary relative",
          compact ? "p-1" : "p-2",
          isCenter &&
            "bg-primary/20 border-primary text-primary-foreground font-semibold",
          showAsEmpty && "text-gray-400 italic",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        style={{
          minHeight: "40px",
          aspectRatio: "1",
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onBlur={handleBlur}
      >
        <span
          className={cn(
            "leading-tight break-words",
            compact ? "text-xs" : "text-sm",
            isCenter ? "font-semibold text-primary" : "text-gray-400"
          )}
        >
          {displayValue}
        </span>

        {!isCenter && !compact && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-1 right-1 w-6 h-6 p-0 transition-all pixel-button rounded-sm",
              isHovered ? "opacity-100 bg-primary/20" : "opacity-60"
            )}
            onClick={(e) => {
              e.stopPropagation();
              getModalVisible(true);
            }}
            title="세부목표 설정"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </>
  );
}
