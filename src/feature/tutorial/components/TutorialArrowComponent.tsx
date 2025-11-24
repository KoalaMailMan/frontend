import FingerArrow from "./icons/FingerArrow";
import { cn } from "@/lib/utils";

type IconProps = {
  isMobile: boolean;
  targetSelector: string;
  position: "right" | "left" | "top" | "bottom";
  mobilePosition: "right" | "left" | "top" | "bottom";
  arrowPosition: { top: number; left: number };
  className?: string;
};

export default function TutorialArrowComponent({
  isMobile = false,
  targetSelector,
  position,
  mobilePosition,
  arrowPosition,
  className,
}: IconProps) {
  return (
    <div
      className={cn(
        "w-[57px] h-[50px] flex justify-center items-center ",
        !targetSelector ? "absolute top-[105px] left-[377px]" : `fixed`,
        !isMobile && position === "top" && "flex-col animate-bounce-vertical",
        !isMobile && position !== "top" && "animate-bounce-horizontal",
        isMobile && position === "top" && "flex-col animate-bounce-vertical",
        isMobile && position !== "top" && "animate-bounce-horizontal",
        className
      )}
      style={{
        top: `${arrowPosition.top}px`,
        left: `${arrowPosition.left}px`,
        transition: "all 0.3s ease",
      }}
    >
      <ArrowComponent position={isMobile ? mobilePosition : position} />
    </div>
  );
}

/* 공용 화살표 */
function ArrowComponent({
  position,
}: {
  position: "right" | "left" | "top" | "bottom";
}) {
  return (
    <>
      {position === "left" && (
        <FingerArrow
          width={57}
          height={50}
          className="h-full p-[10px] pb-[5px] -scale-x-100"
        />
      )}
      {position === "right" && (
        <>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px]"
          />
        </>
      )}
      {position === "top" && (
        <FingerArrow
          width={57}
          height={50}
          className="p-[10px] pb-[5px] mx-auto rotate-270"
        />
      )}
      {position === "bottom" && (
        <FingerArrow
          width={57}
          height={50}
          className="h-full p-[10px] pb-[5px]"
        />
      )}
    </>
  );
}
