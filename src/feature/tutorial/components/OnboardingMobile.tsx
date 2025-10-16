import tutorialKoala from "@/assets/tutorial/tutorial_koala.png";
import { tutorialSteps } from "@/data/tutorial";
import { useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "../../ui/CheckBox";
import {
  useTutorialStore,
  type TutorialStateType,
} from "@/lib/stores/tutorialStore";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import TutorialArrow from "./TutorialArrow";
import X from "./icons/X";
import { cn } from "@/lib/utils";

export default function OnboardingMobile() {
  const [currentStep, setCurrentStep] = useState(0);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);
  const setModalVisible = useMandalaStore((state) => state.setModalVisible);
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const showAgain = useTutorialStore((state) => state.showAgain);
  const setShowAgain = useTutorialStore((state) => state.setShowAgain);
  const setCurrentStage = useTutorialStore((state) => state.setCurrentStage);
  const resetStage = useTutorialStore((state) => state.resetStage);
  const onClose = useTutorialStore((state) => state.setOnboardingVisible);

  const cardRef = useRef<HTMLDivElement>(null);
  const currentTutorial = tutorialSteps[currentStep];

  useEffect(() => {
    setCurrentStage(currentTutorial.className as TutorialStateType);
  }, [currentStep]);

  useEffect(() => {
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
      if (element) {
        element.classList.add(className);
      } else {
        console.warn(`Element not found: ${targetSelector}`);
      }
    };

    const timer = setTimeout(applyHighlight, id === "recommend" ? 200 : 80);
    return () => clearTimeout(timer);
  }, [currentTutorial]);

  const handleClose = () => {
    resetStage();
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
    <article className="fixed inset-0 z-[9999] pointer-events-none">
      {/* 배경 오버레이 */}
      {!isTutorialActive && (
        <div className="absolute inset-0 bg-black/20 pointer-events-auto" />
      )}

      {/* 튜토리얼 카드 */}
      <div
        ref={cardRef}
        className={cn(
          "absolute left-1/2 -translate-x-1/2 w-[min(90vw,543px)] max-w-[543px] h-auto flex flex-col gap-4 p-4 bg-transparent pointer-events-auto",
          currentStep > 3 ? "bottom-[50vh]" : "bottom-[5vh]"
        )}
      >
        <div className="w-[30vw] max-w-[120px] flex-shrink-0 mx-auto">
          <img
            src={tutorialKoala}
            alt="코알라"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* 텍스트 박스 */}
        <div className="flex-1 relative rounded-lg bg-white py-4 px-4 border-2 border-primary shadow-md">
          <Button
            onClick={handleClose}
            className="absolute top-2 right-2 w-4 h-4 bg-inherit hover:bg-inherit shadow-none z-10"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-primary mb-2">
              {currentTutorial.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {currentTutorial.description}
            </p>
          </div>

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
                  className="border border-gray-200"
                  checked={showAgain}
                  onCheckedChange={(checked) =>
                    setShowAgain(checked as boolean)
                  }
                />
              </div>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-inherit hover:bg-inherit shadow-none flex items-center gap-[2px] pixel-button text-xs text-[#4C4C4C]"
                data-tutorial="next-button"
              >
                다음
                <ChevronRight className="h-4 w-4" />
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
    </article>
  );
}
