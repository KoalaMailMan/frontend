import Button from "@/feature/ui/Button";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import CheckIcon from "./icon/CheckIcon";
import { koalaSeal } from "../const/url";
import { useShallow } from "zustand/react/shallow";

type MandalaReadOnlyCellProps = {
  goalId: string;
  // cell: CellData;
  className?: string;
  type?: string;
  isCenter: boolean;
  compact?: boolean;
  disabled: boolean;
  isEmpty: boolean;
  "data-tutorial"?: string;
  tutorialArrowButton?: boolean; // 튜토리얼용 화살표 버튼 식별자
  onCellClick: () => void;
  onDetailClick?: () => void;
  onGoalClick?: () => void;
  onRemove?: (id: SubGoal["goalId"]) => void;
};
export default React.memo(function MandalaReadOnlyCell({
  goalId,
  className,
  type,
  isCenter,
  compact,
  disabled,
  "data-tutorial": dataTutorial,
  tutorialArrowButton = false,
  onCellClick,
  onDetailClick,
  onGoalClick,
}: MandalaReadOnlyCellProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const cell = useMandalaStore(
    useShallow((state) => state.flatData.cells[goalId])
  );

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
        // isEmpty && "text-gray-400",
        disabled && isCenter && "cursor-not-allowed opacity-50",
        className
      )}
      style={{
        minHeight: compact ? "40px" : "100px",
        aspectRatio: "1",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        onCellClick();
        setIsHovered(false);
      }}
      data-tutorial={dataTutorial}
    >
      <span
        className={cn(
          "leading-tight whitespace-pre-wrap wrap-break-word inline-block w-full",
          compact ? "text-xs" : isModalOpen ? "text-[10px]" : "text-[13px]",
          isCenter && type !== "main-center" && type !== "sub"
            ? "font-semibold text-primary"
            : "text-gray-400",
          cell.content && "text-[#333333]"
        )}
      >
        {cell.content || display}
      </span>

      {!isCenter && !compact && !isModalOpen && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "z-9 absolute top-1 right-1 w-6 h-6 p-0 transition-all pixel-button rounded-sm transition-all",
            isHovered ? "opacity-100 bg-primary/20" : "opacity-60 "
          )}
          onClick={onDetailClick}
          title="세부목표 설정"
          data-tutorial={
            tutorialArrowButton ? "tutorial-arrow-button" : undefined
          }
          aria-label="세부 목표 설정창 열기"
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      )}
      {!isCenter && !compact && isModalOpen && (
        <Button
          variant="none"
          size="none"
          className={cn(
            "z-1 absolute top-[5.5px] right-[7px] size-[22px] rounded-[1px]",
            cell.status === "DONE" ? "" : "bg-[#FAFAFA]"
          )}
          onClick={onGoalClick}
        >
          <CheckIcon fill={cell.status === "DONE" ? "#3A3A3A" : "#E3E3E3"} />
        </Button>
      )}
      {!compact && cell.status === "DONE" && (
        <div
          className="absolute w-full h-full p-1 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] "
          style={{ backgroundColor: "rgba(219, 219, 219, 0.6)" }}
        >
          {koalaSeal && <img src={koalaSeal} alt="해당 목표 완료했습니다." />}
        </div>
      )}
    </div>
  );
});
