import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { Lightbulb, Loader, X } from "lucide-react";

import koalaImage from "@/assets/common/default_koala.png";
import { createPortal } from "react-dom";
import Button from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { getGridClasses } from "../utills/css";
import { toast } from "sonner";
import { useTutorialStore } from "@/lib/stores/tutorialStore";
import useSSERecommendation from "../hooks/useSSERecommendation";
import { useStreamStore } from "@/lib/stores/streamStore";

type Props = {
  isModalVisible: boolean;
  item: SubGoal[];
  compact: boolean;
  onContentChange: (value: string) => void;
  onCancelEdit: () => void;
};

export default function MandalaModal({
  isModalVisible,
  item,
  compact,
  onContentChange,
  onCancelEdit,
}: Props) {
  // modal DetailedGoalRecommendationBox 컴포넌트 상태 관리
  const isOnboardingOpen = useTutorialStore((state) => state.isOnboardingOpen);
  const updateSubsCell = useMandalaStore((state) => state.updateSubsCell);
  const modalCellId = useMandalaStore((state) => state.modalCellId);
  const count = useRef(0);
  const isStreaming = useStreamStore((state) => state.isStreaming);

  // modal 컴포넌트 상태 관리
  const editingSubCellId = useMandalaStore((state) => state.editingSubCellId);
  const setEditingSubCell = useMandalaStore((state) => state.setEditingSubCell);
  const centerIndex = 0;

  // 상태 관리 함수들
  const handleSubStartEdit = (goalId: string) => {
    setEditingSubCell(goalId);
  };

  const handleSubCancelEdit = () => {
    setEditingSubCell(null);
  };

  const handleModalClose = () => {
    setEditingSubCell(null);
    onCancelEdit();
  };

  const returnsEmptyCount = (subs: SubGoal[]) => {
    let localCount = 0;
    if (!subs[0] || subs[0].content.trim() === "") {
      return localCount;
    }
    subs.forEach((sub, index) => {
      if (index < 8 && (!sub.content || sub.content.trim() === "")) {
        localCount++;
      }
    });
    return localCount;
  };

  const emptyValueValidation = () => {
    const hasEmptyGoals = item.some((main) => !main.content.trim());
    const emptyCount = returnsEmptyCount(item);
    if (emptyCount && hasEmptyGoals) {
      // 0 & false or 1~8 & true
      count.current = emptyCount;
    }
  };

  useEffect(() => {
    emptyValueValidation();
    return () => {
      count.current = 0;
    };
  }, [item]);

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalVisible]);

  if (!isModalVisible) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleModalClose} // 배경 클릭 시 모달 닫기
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 버블링 방지
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <img src={koalaImage} alt="코알라" className="w-8 h-8" />
            <h2 className="text-xl font-semibold">세부 목표 설정</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleModalClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 text-center border-b">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-primary">
              {item[centerIndex]?.content || "주요 목표"}
            </span>
            을(를) 달성하기 위한 구체적인 실행 계획을 세워보세요
          </p>
        </div>
        <div className="space-y-4">
          {centerIndex !== undefined && (
            <div className="space-y-2">
              <div className="p-6">
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-2 w-96 aspect-square">
                    {item.map((sub, index) => {
                      const isCenter = centerIndex === index;
                      const isEditing = editingSubCellId === sub.goalId;
                      return (
                        <Fragment key={`sub-${index}-${sub.goalId}`}>
                          <MandalaContainer
                            isCenter={isCenter}
                            item={sub}
                            isEditing={isEditing}
                            compact={compact}
                            disabled={isCenter ? isStreaming : false}
                            isEmpty={!sub.content || !sub.content.trim()}
                            onStartEdit={() => handleSubStartEdit(sub.goalId)}
                            onContentChange={onContentChange}
                            onCancelEdit={handleSubCancelEdit}
                            className={cn(
                              getGridClasses(index),
                              isCenter
                                ? "opacity-50 bg-primary/20 border-primary font-medium text-primary"
                                : ""
                            )}
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
                <DetailedGoalRecommendationBox
                  mainItems={item}
                  isOnboardingOpen={isOnboardingOpen}
                  updateSubsCell={updateSubsCell}
                  modalCellId={modalCellId}
                  count={count.current}
                />
              </div>
            </div>
          )}
        </div>
        <div className="p-6"></div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}

type ComponentProps = {
  mainItems: SubGoal[];
  isOnboardingOpen: boolean;
  updateSubsCell: (items: SubGoal[], data: string[]) => void;
  modalCellId: string | null;
  count: number;
};

function DetailedGoalRecommendationBox({
  mainItems,
  isOnboardingOpen,
  updateSubsCell,
  modalCellId,
  count,
}: ComponentProps) {
  const main = mainItems[0];
  const [shouldFetchRecommendation, setShouldFetchRecommendation] =
    useState(false);
  const isStreaming = useStreamStore((state) => state.isStreaming);
  const recommendation = useStreamStore((state) => state.recommendation);
  const { startStream, stopStream } = useSSERecommendation({
    goal: main.content,
    count,
    enabled: false,
    onComplete: (items) => {
      console.log("완료! 총", items.length, "개");
    },
    onError: (error) => {
      console.error("에러 발생:", error);
    },
  });

  useEffect(() => {
    if (recommendation) {
      updateSubsCell(mainItems, recommendation);
      // setShouldFetchRecommendation(false);
    }
  }, [isStreaming]);

  const handleSuggestGoals = () => {
    if (modalCellId === "empty-0") return;
    if (isStreaming) return;
    if (!main.content.trim()) {
      toast("먼저 주요 목표를 입력해주세요!");
      // setShouldFetchRecommendation(false);
      return;
    }

    if (!count) return;
    startStream();
    // setShouldFetchRecommendation(true);
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="bg-primary/10 p-4 rounded-lg max-w-md">
        <div className="flex items-start gap-3 mb-4">
          <img src={koalaImage} alt="코알라" className="w-6 h-6 mt-1" />
          <div className="text-sm">
            <p className="font-medium text-primary mb-1">코알라 팁!</p>
            <p className="text-primary/80">
              각 세부 목표는 측정 가능하고 구체적으로 작성하세요. 예: "운동하기"
              → "주 3회 30분 이상 조깅하기"
            </p>
          </div>
        </div>

        {/* 목표 추천받기 버튼 */}
        <div className="text-center">
          <Button
            onClick={handleSuggestGoals}
            className="pixel-button bg-primary/90 hover:bg-primary text-white px-4 py-2 text-sm w-full "
            disabled={isOnboardingOpen || !main?.content.trim() || isStreaming}
            data-tutorial="recommendation-button"
          >
            {isStreaming ? (
              <>
                <Loader />
                Ai가 맞춤 추천을 생성하고 있습니다...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                목표 추천받기
              </>
            )}
          </Button>
          {isStreaming && <Button onClick={stopStream}>취소하기</Button>}
          {!mainItems[0].content.trim() && (
            <p className="text-xs text-gray-500 mt-2">
              주요 목표를 먼저 입력해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
