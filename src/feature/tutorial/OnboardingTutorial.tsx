import { tutorialSteps } from "@/data/tutorial";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import koalaPixelImage from "@/assets/common/default_koala.png";
import { Checkbox } from "../ui/CheckBox";
import { useTutorialStore } from "@/lib/stores/tutorialStore";

export default function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [cardPosition, setCardPosition] = useState({
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  });
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const showAgain = useTutorialStore((state) => state.showAgain);
  const setShowAgain = useTutorialStore((state) => state.setShowAgain);
  const onClose = useTutorialStore((state) => state.setOnboardingVisible);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentTutorial = tutorialSteps[currentStep];

  useEffect(() => {
    updateCardPosition();
  }, [currentStep]);

  const handleClose = () => {
    setCurrentStep(0);
    onClose(false);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateCardPosition = () => {
    const currentTutorial = tutorialSteps[currentStep];
    if (!currentTutorial.targetSelector) {
      // 첫 번째 단계는 중앙 상단에 위치 (헤더를 피해서)
      setCardPosition({
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const targetElement = document.querySelector(
      currentTutorial.targetSelector
    );
    if (!targetElement) {
      setCardPosition({
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const cardWidth = 384; // w-96 = 384px
    const cardHeight = 400; // 더 정확한 높이 (다시 보지 않기 옵션 포함)

    let top = 0;
    let left = 0;

    switch (currentTutorial.position) {
      case "top":
        top = targetRect.top - cardHeight - 30;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        break;
      case "bottom":
        top = targetRect.bottom + 30;
        left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.left - cardWidth - 30;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
        left = targetRect.right + 30;
        break;
    }

    // 화면 경계 체크 및 조정
    if (left < 20) {
      left = 20;
      // 좌측으로 밀렸을 때는 상하로 조정
      if (currentTutorial.position === "left") {
        top = targetRect.bottom + 30;
      }
    }
    if (left + cardWidth > windowWidth - 20) {
      left = windowWidth - cardWidth - 20;
      // 우측으로 밀렸을 때는 상하로 조정
      if (currentTutorial.position === "right") {
        top = targetRect.bottom + 30;
      }
    }
    if (top < 80) {
      // 헤더 공간 확보
      top = 80;
    }
    if (top + cardHeight > windowHeight - 20) {
      top = windowHeight - cardHeight - 20;
    }

    setCardPosition({
      top: `${top}px`,
      left: `${left}px`,
      transform: "none",
    });
  };

  if (!isOnboardingOpen) return null;

  return (
    <article className="fixed inset-0 z-[9999]">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 하이라이트 효과 */}
      {currentTutorial.targetSelector && (
        <style>
          {`
            ${currentTutorial.targetSelector} {
              z-index: 9998 !important;
              box-shadow: 0 0 0 4px var(--color-primary), 0 0 0 8px color-mix(in srgb, var(--color-primary) 20%, transparent) !important;
              border-radius: 8px !important;
            }
          `}
        </style>
      )}

      {/* 튜토리얼 카드 */}
      <div
        ref={cardRef}
        className="absolute bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 p-6 z-[10000] max-h-[80vh] overflow-y-auto"
        style={cardPosition}
      >
        {/* 닫기 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 z-10"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* 헤더 영역 */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <img
                src={koalaPixelImage}
                alt="코알라"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentTutorial.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentTutorial.description}
              </p>
            </div>
          </div>

          {/* 코알라 말풍선 - 별도 영역으로 분리 */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 ml-4 relative">
            <div className="text-primary text-sm font-medium">
              💬 {currentTutorial.koalaMessage}
            </div>
            {/* 말풍선 꼬리 */}
            <div className="absolute -top-2 left-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-primary/20"></div>
          </div>
        </div>

        {/* 진행 표시 */}
        <div className="flex items-center gap-2 mb-6">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full flex-1 transition-colors duration-300 ${
                index <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* 다시 보지 않기 체크박스 (마지막 단계에서만 표시) */}
        {currentStep === tutorialSteps.length - 1 && (
          <div className="mb-4 p-3 bg-amber-50/80 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dont-show-again"
                checked={showAgain}
                onCheckedChange={(checked) => setShowAgain(checked as boolean)}
              />
              <label
                htmlFor="dont-show-again"
                className="text-sm text-amber-800 cursor-pointer select-none"
              >
                다음에 자동으로 튜토리얼 표시하지 않기
              </label>
            </div>
            <p className="text-xs text-amber-600 mt-1 ml-6">
              💡 언제든지 '사용법' 버튼을 클릭하면 다시 볼 수 있어요
            </p>
          </div>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 pixel-button"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>

          <span className="text-sm text-gray-500">
            {currentStep + 1} / {tutorialSteps.length}
          </span>

          <Button
            onClick={nextStep}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2 pixel-button"
          >
            {currentStep === tutorialSteps.length - 1 ? "완료" : "다음"}
            {currentStep !== tutorialSteps.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
