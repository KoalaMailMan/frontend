import tutorialKoala from "@/assets/tutorial/tutorial_koala.png";

import { tutorialSteps } from "@/data/tutorial";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../ui/Button";
import { ChevronRight } from "lucide-react";

import { Checkbox } from "../../ui/CheckBox";
import {
  useTutorialStore,
  type TutorialStateType,
} from "@/lib/stores/tutorialStore";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import TutorialArrow from "./TutorialArrow";

export default function OnboardingDesktop() {
  const [currentStep, setCurrentStep] = useState(0);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);
  const setModalVisible = useMandalaStore((state) => state.setModalVisible);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const showAgain = useTutorialStore((state) => state.showAgain);
  const setShowAgain = useTutorialStore((state) => state.setShowAgain);
  const setCurrentStage = useTutorialStore((state) => state.setCurrentStage);
  const onClose = useTutorialStore((state) => state.setOnboardingVisible);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentTutorial = tutorialSteps[currentStep];

  useEffect(() => {
    setCurrentStage(currentTutorial.className as TutorialStateType);
  }, [currentStep]);
  useEffect(() => {
    console.log(currentTutorial.targetSelector);
    if (!currentTutorial.targetSelector) return;
    const { targetSelector, className, id } = currentTutorial;
    if (id === "recommend") {
      setModalVisible(true);
      setModalCellId("empty-0");
    } else {
      setModalCellId(null);
      setModalVisible(false);
    }

    const applyHighlight = () => {
      // 이전 하이라이트 모두 제거
      document.querySelectorAll("[data-tutorial]").forEach((el) => {
        el.classList.remove(
          "center-cell",
          "main-cells",
          "tutorial-arrow-button",
          "recommendation-button",
          "save-button",
          "reminder-button"
        );
      });

      const element = document.querySelector(targetSelector);
      console.log(`Applying ${className} to:`, element);

      if (element) {
        element.classList.add(className);
      } else {
        console.warn(`Element not found: ${targetSelector}`);
      }
    };

    // 모달이 필요한 경우 렌더링 대기
    const delay = id === "recommend" ? 200 : 50;
    const timer = setTimeout(applyHighlight, delay);

    return () => {
      clearTimeout(timer);

      // 클린업: 캡처된 selector로 다시 찾기
      const element = document.querySelector(targetSelector);
      if (element) {
        element.classList.remove(className);
      }
    };
  }, [currentTutorial]);

  const handleClose = () => {
    setCurrentStep(0);
    document.querySelectorAll("[data-tutorial]").forEach((el) => {
      el.classList.remove(
        "center-cell",
        "main-cells",
        "tutorial-arrow-button",
        "recommendation-button",
        "save-button",
        "reminder-button"
      );
    });
    onClose(false);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  if (!isOnboardingOpen) return null;
  const isTutorialActive =
    !!currentTutorial && currentTutorial.id !== "welcome";

  return (
    <article className="fixed inset-0 z-[9999]">
      {/* 오버레이 - 튜토리얼 비활성화 시에만 표시 */}
      {!isTutorialActive && <div className="absolute inset-0 bg-black/20" />}

      {/* 튜토리얼 카드 */}
      <div
        ref={cardRef}
        className="absolute bottom-[60px] left-0 w-[543px] h-[150px] flex gap-[15px] pl-[47px]"
      >
        <div className="w-[150px] flex-shrink-0">
          <img
            src={tutorialKoala}
            alt="코알라"
            className="w-full object-cover"
          />
        </div>
        {/* 텍스트 박스 */}
        <div className="w-sm h-[149px] relative rounded-lg bg-white py-8 pr-[10px] pl-[20px] border-2 border-primary">
          {/* 닫기 버튼 */}
          <Button
            // variant="ghost"
            // size="icon"
            onClick={handleClose}
            className="absolute top-[4px] right-0 w-[14px] h-[14px] bg-inherit hover:bg-inherit shadow-none z-10"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 3.5L3.5 10.5"
                stroke="#B3B3B3"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 3.5L10.5 10.5"
                stroke="#B3B3B3"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          {/* 헤더 영역 */}
          <div className="mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="w-full h-[32px] text-xl font-bold text-primary mb-2">
                  {currentTutorial.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {currentTutorial.description}
                </p>
              </div>
            </div>
            {/* 네비게이션 버튼 */}
            <div className="flex justify-end items-center pt-2">
              {currentStep === tutorialSteps.length - 1 ? (
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="dont-show-again"
                    className="text-sm text-[#4C4C4C] cursor-pointer select-none"
                    defaultChecked={showAgain}
                    onClick={nextStep}
                  >
                    다음부터 튜토리얼 보지 않기
                  </label>
                  <Checkbox
                    id="dont-show-again"
                    className=" border border-1 border-gray-200"
                    checked={showAgain}
                    onCheckedChange={(checked) =>
                      setShowAgain(checked as boolean)
                    }
                  />
                </div>
              ) : (
                <Button
                  onClick={nextStep}
                  className="absolute bottom-[4px] right-0 w-[51px] bg-inherit hover:bg-inherit shadow-none flex items-center gap-[2px] pixel-button text-xs text-[#4C4C4C]"
                >
                  다음
                  {currentStep !== tutorialSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
        <TutorialArrow
          key={currentStep}
          targetSelector={currentTutorial.targetSelector}
          position={currentTutorial.position}
          mobilePosition={currentTutorial.mobilePosition}
        />
      </div>
    </article>
  );
}
