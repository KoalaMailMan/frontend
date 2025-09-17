import { Button } from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MandalaReadOnlyCellProps = {
  id: string;
  isCenter: boolean;
  content: string;
  compact: boolean;
  onCellClick: () => void;
  onDetailClick?: (id: string | number) => void;
};
export default function MandalaReadOnlyCell({
  id,
  isCenter,
  content,
  compact,
  onCellClick,
  onDetailClick,
}: MandalaReadOnlyCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "pixel-input border-2 border-gray-300 flex items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary relative",
        isCenter &&
          "bg-primary/20 border-primary text-primary-foreground font-semibold cursor-not-allowed"
      )}
      style={{ minHeight: "40px", aspectRatio: "1" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCellClick}
    >
      <span
        className={cn(
          "leading-tight break-all word-break-break-all inline-block w-full",
          isCenter ? "font-semibold text-primary" : "text-gray-400"
        )}
      >
        {content}
      </span>

      {!isCenter && compact && (
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
