import FingerArrow from "./FingerArrow";
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
  console.log(arrowPosition);
  return (
    <div
      className={cn(
        "w-[211px] h-[50px] flex justify-center items-center ",
        !targetSelector ? "absolute top-[105px] left-[531px]" : `fixed`,
        !isMobile && position === "top" && "flex-col animate-bounce-vertical",
        !isMobile && position !== "top" && "animate-bounce-horizontal",
        isMobile &&
          mobilePosition === "top" &&
          "flex-col animate-bounce-vertical",
        isMobile && mobilePosition !== "top" && "animate-bounce-horizontal",
        className
      )}
      style={{
        top: `${arrowPosition.top}px`,
        left: `${arrowPosition.left}px`,
        transition: "all 0.3s ease",
      }}
    >
      {isMobile ? (
        <MobileArrow position={mobilePosition} />
      ) : (
        <DesktopArrow position={position} />
      )}
    </div>
  );
}

/* 데스크탑용 화살표 */
function DesktopArrow({
  position,
}: {
  position: "right" | "left" | "top" | "bottom";
}) {
  return (
    <>
      {position === "left" && (
        <>
          <p className="h-full flex items-center text-xl font-semibold leading-[28px] tracking-[1px] text-white">
            여기를 눌러보세요
          </p>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px] -scale-x-100"
          />
        </>
      )}
      {position === "right" && (
        <>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px]"
          />
          <p className="h-full flex items-center text-xl font-semibold leading-[28px] tracking-[1px] text-white">
            여기를 눌러보세요
          </p>
        </>
      )}
      {position === "top" && (
        <div className="flex flex-col justify-center">
          <p className="flex flex-col items-center text-xl font-semibold leading-[28px] tracking-[1px] text-white">
            여기를 눌러보세요
          </p>
          <FingerArrow
            width={57}
            height={50}
            className="p-[10px] pb-[5px] mx-auto rotate-270"
          />
        </div>
      )}
      {position === "bottom" && (
        <>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px]"
          />
          <p className="h-full flex items-center text-xl font-semibold leading-[28px] tracking-[1px] text-white">
            여기를 눌러보세요
          </p>
        </>
      )}
    </>
  );
}

/* 모바일용 화살표 */
function MobileArrow({
  position,
}: {
  position: "right" | "left" | "top" | "bottom";
}) {
  return (
    <>
      {position === "left" && (
        <>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px] -scale-x-100"
          />
        </>
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
        <div className="flex flex-col justify-center">
          <p className="flex flex-col items-center text-xl font-semibold leading-[28px] tracking-[1px] text-white">
            여기를 눌러보세요
          </p>
          <FingerArrow
            width={57}
            height={50}
            className="p-[10px] pb-[5px] mx-auto rotate-270"
          />
        </div>
      )}
      {position === "bottom" && (
        <>
          <FingerArrow
            width={57}
            height={50}
            className="h-full p-[10px] pb-[5px]"
          />
        </>
      )}
    </>
  );
}
