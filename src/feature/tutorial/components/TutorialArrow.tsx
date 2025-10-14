import { useEffect, useState } from "react";
import FingerArrow from "./FingerArrow";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import { cn } from "@/lib/utils";
import TutorialArrowComponent from "./TutorialArrowComponent";

type IconProps = {
  targetSelector: string;
  position: "right" | "left" | "top" | "bottom";
  mobilePosition: "right" | "left" | "top" | "bottom";
  className?: string;
};

export default function TutorialArrow({
  targetSelector,
  position,
  mobilePosition,
  className,
}: IconProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const onClose = useTutorialStore((state) => state.setOnboardingVisible);
  const [arrowPosition, setArrowPosition] = useState({ top: 105, left: 531 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!targetSelector) return;

    const updateFn = isMobile ? updateMobilePosition : updatePosition;

    // 초기 위치 설정 (약간의 딜레이)
    const timer = setTimeout(updateFn, 100);

    // 스크롤/리사이즈 시 위치 업데이트
    window.addEventListener("scroll", updateFn);
    window.addEventListener("resize", updateFn);

    return () => {
      clearTimeout(timer);
      setArrowPosition({ top: 105, left: 531 });
      window.removeEventListener("scroll", updateFn);
      window.removeEventListener("resize", updateFn);
    };
  }, [targetSelector, position, isMobile]);

  const updatePosition = () => {
    const element = document.querySelector(targetSelector);
    if (!element) {
      onClose(false);
      return;
    }

    const rect = element.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const arrowWidth = 211;
    const arrowHeight = 50;
    const offset = 20;

    switch (position) {
      case "top":
        top = rect.top - arrowHeight - offset;
        left = rect.left + rect.width / 2 - arrowWidth / 2;
        break;
      case "right":
        const rightPosition = rect.right + offset;
        if (rightPosition + arrowWidth > window.innerWidth) {
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - arrowWidth / 2;
        } else {
          top = rect.top + rect.height / 2 - arrowHeight / 2;
          left = rightPosition;
        }
        break;
      case "bottom":
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - arrowWidth / 2;
        break;
      case "left":
        const leftPosition = rect.left - arrowWidth - offset;
        if (leftPosition < 0) {
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - arrowWidth / 2;
        } else {
          top = rect.top + rect.height / 2 - arrowHeight / 2;
          left = leftPosition;
        }
        break;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const padding = isMobile ? 10 : 20;

    if (left < padding) {
      left = padding;
    }
    if (left + arrowWidth > windowWidth - padding) {
      left = windowWidth - arrowWidth - padding;
    }
    if (top < padding) {
      top = padding;
    }
    if (top + arrowHeight > windowHeight - padding) {
      top = windowHeight - arrowHeight - padding;
    }

    setArrowPosition({ top, left });
    console.log(top, left);
  };
  const updateMobilePosition = () => {
    const element = document.querySelector(targetSelector);
    if (!element) {
      onClose(false);
      return;
    }

    const rect = element.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const arrowWidth = 211;
    const arrowHeight = 50;
    const offset = isMobile ? 10 : 20;
    console.log(rect);
    switch (mobilePosition) {
      case "top":
        top = rect.top - arrowHeight - offset;
        left = rect.left + rect.width / 2 - arrowWidth / 2;
        break;
      case "right":
        const rightPosition = rect.right + offset;
        if (isMobile && rightPosition + arrowWidth > window.innerWidth) {
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - arrowWidth / 2;
        } else {
          top = rect.top + rect.height / 2 - arrowHeight / 2;
          left = rightPosition;
        }
        break;
      case "bottom":
        top = rect.bottom + offset;
        left = rect.left + rect.width / 2 - arrowWidth / 2;
        break;
      case "left":
        const leftPosition = rect.left - arrowWidth - offset;
        if (isMobile && leftPosition < 0) {
          top = rect.bottom + offset;
          left = rect.left + rect.width / 2 - arrowWidth / 2;
        } else {
          top = rect.top + rect.height / 2 - arrowHeight / 2;
          left = leftPosition;
        }
        break;
    }

    setArrowPosition({ top, left });
  };

  return (
    <TutorialArrowComponent
      isMobile={isMobile}
      targetSelector={targetSelector}
      position={position}
      mobilePosition={mobilePosition}
      arrowPosition={arrowPosition}
    />
  );
}
