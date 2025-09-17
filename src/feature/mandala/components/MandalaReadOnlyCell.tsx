import { Button } from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MandalaReadOnlyCellProps = {
  className?: string;
  type?: string;
  id: string;
  isCenter: boolean;
  content: string;
  compact: boolean;
  disabled: boolean;
  isEmpty: boolean;
  onCellClick: () => void;
  onDetailClick?: (id: string | number) => void;
};
export default function MandalaReadOnlyCell({
  className,
  type,
  id,
  isCenter,
  content,
  compact,
  disabled,
  isEmpty,
  onCellClick,
  onDetailClick,
}: MandalaReadOnlyCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const display = isModalOpen
    ? isCenter
      ? ""
      : "주요 목표를 입력하세요"
    : isCenter
    ? "핵심 목표를 입력하세요"
    : "주요 목표를 입력하세요";

  return (
    <div
      className={cn(
        "pixel-input border-2 border-gray-300 flex items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary relative",
        compact ? "p-1 " : "p-2",
        isCenter &&
          type === "center" &&
          "bg-primary/20 border-primary text-primary-foreground font-semibold",
        isEmpty && "text-gray-400 italic",
        disabled && isCenter && "cursor-not-allowed opacity-50",
        className
      )}
      style={{
        minHeight: compact ? "40px" : "100px",
        aspectRatio: "1",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCellClick}
    >
      <span
        className={cn(
          "leading-tight break-all word-break-break-all inline-block w-full",
          compact ? "text-xs" : "text-sm",
          isCenter && type !== "main-center" && type !== "sub"
            ? "font-semibold text-primary"
            : "text-gray-400"
        )}
      >
        {content || display}
      </span>

      {!isCenter && !compact && !isModalOpen && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-1 right-1 w-6 h-6 p-0 transition-all pixel-button rounded-sm",
            isHovered ? "opacity-100 bg-primary/20" : "opacity-60"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (onDetailClick) onDetailClick(id);
          }}
          title="세부목표 설정"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
