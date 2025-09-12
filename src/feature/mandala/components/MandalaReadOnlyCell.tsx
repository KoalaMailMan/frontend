import { Button } from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MandalaReadOnlyCellProps = {
  isCenter: boolean;
  content: string;
  onCellClick: () => void;
  onDetailClick?: () => void;
};
export default function MandalaReadOnlyCell({
  isCenter,
  content,
  onCellClick,
  onDetailClick,
}: MandalaReadOnlyCellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "pixel-input border-2 border-gray-300 flex items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary relative",
        isCenter &&
          "bg-primary/20 border-primary text-primary-foreground font-semibold"
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

      {!isCenter && onDetailClick && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-1 right-1 w-6 h-6 p-0 transition-all pixel-button rounded-sm",
            isHovered ? "opacity-100 bg-primary/20" : "opacity-60"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick();
          }}
          title="세부목표 설정"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
