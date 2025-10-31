import X from "@/feature/tutorial/components/icons/X";
import Button from "@/feature/ui/Button";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type MandalaReadOnlyCellProps = {
  className?: string;
  type?: string;
  id: string;
  isCenter: boolean;
  content: string;
  compact: boolean;
  disabled: boolean;
  isEmpty: boolean;
  "data-tutorial"?: string;
  tutorialArrowButton?: boolean; // 튜토리얼용 화살표 버튼 식별자
  onCellClick: () => void;
  onDetailClick?: (id: string | number) => void;
  onRemove?: (id: SubGoal["goalId"]) => void;
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
  "data-tutorial": dataTutorial,
  tutorialArrowButton = false,
  onCellClick,
  onDetailClick,
  onRemove,
}: MandalaReadOnlyCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const display = compact
    ? ""
    : isModalOpen
    ? isCenter
      ? ""
      : "세부 목표를 입력하세요"
    : isCenter
    ? "핵심 목표를 입력하세요"
    : "주요 목표를 입력하세요";

  return (
    <div
      className={cn(
        "pixel-input flex items-center justify-center text-center cursor-pointer transition-all hover:bg-primary/10 hover:border-primary relative",
        compact ? "p-1 " : "p-2",
        isCenter &&
          type === "center" &&
          "border-primary text-primary-foreground font-semibold",
        isEmpty && "text-gray-400",
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
      data-tutorial={dataTutorial}
    >
      <span
        className={cn(
          "leading-tight break-all word-break-break-all inline-block w-full",
          compact ? "text-xs" : isModalOpen ? "text-[10px]" : "text-[13px]",
          isCenter && type !== "main-center" && type !== "sub"
            ? "font-semibold text-primary"
            : "text-gray-400",
          content && "text-[#333333]"
        )}
      >
        {content || display}
      </span>

      {!isCenter && !compact && !isModalOpen && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-1 right-1 w-6 h-6 p-0 transition-all pixel-button rounded-sm ",
            isHovered ? "opacity-100 bg-primary/20" : "opacity-60 "
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (onDetailClick) onDetailClick(id);
            setIsHovered(false);
          }}
          title="세부목표 설정"
          data-tutorial={
            tutorialArrowButton ? "tutorial-arrow-button" : undefined
          }
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
      {!isCenter && isModalOpen && (
        <div
          className="w-[24px] h-[24px] absolute right-[4px] top-[3.5px]"
          onClick={(e) => {
            e.stopPropagation();
            if (onRemove) {
              onRemove(id);
            }
          }}
        >
          <X size={8} className="w-full h-full p-0.5" />
        </div>
      )}
    </div>
  );
}
