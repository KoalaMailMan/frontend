import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import { useCallback, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import Button from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
import { getGridClasses } from "../utills/css";
import { toast } from "sonner";
import useSSERecommendation from "../hooks/useSSERecommendation";
import X from "@/feature/tutorial/components/icons/X";
import { useAuthStore } from "@/lib/stores/authStore";
import { ensureAccessToken } from "@/feature/auth/service";
import QuestionIcon from "./icon/QuestionIcon";
import LoadingSpiner from "@/feature/ui/LoadingSpiner";
import useGridTabNavigation from "../hooks/useGridTabNavigation";
import { getNextCellId } from "../service";

type Props = {
  isModalVisible: boolean;
  item: SubGoal[];
  compact: boolean;
  onContentChange: (value: string) => void;
  onRemove: (id: string, value: string) => void;
  onCancelEdit: () => void;
};

export default function MandalaModal({
  isModalVisible,
  item,
  compact,
  onContentChange,
  onRemove,
  onCancelEdit,
}: Props) {
  const updateSubsCell = useMandalaStore((state) => state.updateSubsCell);

  // modal 컴포넌트 상태 관리
  const wasLoggedIn = useAuthStore((state) => state.wasLoggedIn);
  const accessToken = useAuthStore((state) => state.accessToken);
  const setAuthOpen = useAuthStore((state) => state.setAuthOpen);

  const positionRef = useRef<HTMLDivElement | null>(null);
  const editingSubCellId = useMandalaStore((state) => state.editingSubCellId);
  const setEditingSubCell = useMandalaStore((state) => state.setEditingSubCell);
  const [width, setWidth] = useState(0);
  const [isQuestion, setIsQuestion] = useState(false);
  const centerIndex = 0;

  const getAccessToken = useCallback(ensureAccessToken, []);

  useGridTabNavigation({
    editingId: editingSubCellId,
    setEditingId: setEditingSubCell,
    getNextId: getNextCellId,
  });

  const { startStream, recommendation, isStreaming } = useSSERecommendation({
    goal: item[0].content,
    getAccessToken,
    onComplete: (items) => {
      console.log("완료! 총", items.length, "개");
      toast.success(`목표 추천 완료되었습니다!`);
    },
    onError: (error) => {
      console.error("에러 발생:", error);
      toast.error(error);
    },
  });

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

  const handleRecommend = () => {
    if (!wasLoggedIn && !accessToken) {
      setAuthOpen(true);
      return;
    }
    const emptyCount = validateEmptyGoals(item);
    if (emptyCount) {
      startStream(emptyCount);
    }
  };

  const getEmptySubGoalCount = (subs: SubGoal[]) =>
    subs.slice(0, 9).filter((sub) => !sub.content.trim()).length;

  const validateEmptyGoals = (subs: SubGoal[]) => {
    const hasEmptyGoals = subs.some((main) => !main.content.trim());
    const emptyCount = getEmptySubGoalCount(subs);
    if (!emptyCount)
      toast.warning("목표 추천을 위해 주요 목표를 먼저 입력해주세요.");
    // 0 & false or 1~8 & true
    return emptyCount && hasEmptyGoals ? emptyCount : 0;
  };

  const removeSubGoalValue = (state: SubGoal["goalId"] | SubGoal[]) => {
    if (typeof state === "string") {
      onRemove(state, "");
    } else if (typeof state === "object") {
      state.forEach((sub, index) => index !== 0 && onRemove(sub.goalId, ""));
    }
  };

  useEffect(() => {
    if (!isStreaming && recommendation) {
      updateSubsCell(item, recommendation);
    }
    return () => {};
  }, [isStreaming]);

  useEffect(() => {
    const element = positionRef.current;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    if (element) {
      observer.observe(element);
    }

    if (isModalVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      observer.disconnect();
    };
  }, [isModalVisible]);

  if (!isModalVisible) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleModalClose} // 배경 클릭 시 모달 닫기
    >
      {isStreaming && <LoadingSpiner />}
      <div
        ref={positionRef}
        className="relative bg-white rounded-lg shadow-2xl max-w-[500px] w-full max-h-[648px] pb-12 "
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 이벤트 버블링 방지
      >
        <div className="h-[46px] flex items-center justify-between py-[10px] pl-[20px] pr-[13px]">
          <GuideWritingComponent
            parentWidth={width}
            isQuestion={isQuestion}
            setIsQuestion={setIsQuestion}
          />

          <Button
            variant="none"
            size="icon"
            className="w-[20px] h-[20px]"
            onClick={handleModalClose}
          >
            <X size={20} strokeColor="#B3B3B3" stroke={1} />
          </Button>
        </div>
        <div className=" flex flex-col justify-center">
          <p className="w-full h-[36px] flex justify-center items-center text-2xl font-semibold leading-[24.5px] text-[#2A2D3A]">
            세부 목표 설정
          </p>
          <p className="w-full h-[26px] flex justify-center items-center text-[10px] font-normal leading-[17.5px] text-[#666666]">
            <span> {item[centerIndex]?.content || "주요 목표"}</span>를 달성하기
            위한 구체적인 세부 목표을 세워보세요
          </p>
        </div>
        <div>
          {centerIndex !== undefined && (
            <div>
              <div>
                <div className="h-[430px] flex justify-center py-[25px] px-[54px]">
                  <div className="grid grid-cols-3 gap-2 w-full aspect-square relative">
                    {/* 로딩스피너 오버레이(화이트) */}
                    {isStreaming && (
                      <div className="w-full h-full absolute bg-white opacity-80 z-[1]" />
                    )}
                    {item.map((sub, index) => {
                      const isCenter = centerIndex === index;
                      const isEditing = editingSubCellId === sub.goalId;
                      return (
                        <MandalaContainer
                          key={`sub-${index}-${sub.goalId}`}
                          isCenter={isCenter}
                          item={sub}
                          isEditing={isEditing}
                          compact={compact}
                          disabled={isCenter ? isStreaming : false}
                          isEmpty={!sub.content || !sub.content.trim()}
                          onStartEdit={() => handleSubStartEdit(sub.goalId)}
                          onContentChange={onContentChange}
                          onCancelEdit={handleSubCancelEdit}
                          onRemove={removeSubGoalValue}
                          className={cn(
                            "md:min-w-[125px] w-full h-full",
                            getGridClasses(index),
                            isCenter
                              ? " bg-primary-modal/20 border-primary-modal font-medium text-primary"
                              : ""
                          )}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="w-full h-[62px] flex justify-center">
                <Button
                  className="w-[282px] h-[34px] bg-primary-recommend-btn border-primary-modal rounded-1 mt-[20px] shadow-[4px_4px_4px_0_rgba(102,102,102,0.6)]"
                  onClick={handleRecommend}
                  data-tutorial="recommendation-button"
                >
                  맞춤 목표 찾기
                </Button>
              </div>
              <p
                className="w-full h-[18px] flex justify-center text-[10px] leading-[180%] font-semibold text-[#999999]"
                onClick={() => removeSubGoalValue(item)}
              >
                맞춤 목표 모두 지우기
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}

function GuideWritingComponent({
  parentWidth = 500,
  isQuestion,
  setIsQuestion,
}: {
  parentWidth: number;
  isQuestion: boolean;
  setIsQuestion: (state: any) => void;
}) {
  const positionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const resizing = () => {
      const child = positionRef?.current;
      const rect = child?.getBoundingClientRect();

      if (child && rect) {
        const width = rect.width;
        const isOutOfViewport = rect.left < 0;

        if (isOutOfViewport) {
          const centered = Math.floor((parentWidth - width) / 2);
          child.style.top = `-61px`;
          child.style.left = `${centered}px`;
        } else {
          child.style.top = `-1px`;
          child.style.left = `-310px`;
        }
      }
    };

    resizing();
    window.addEventListener("resize", resizing);

    return () => {
      window.removeEventListener("resize", resizing);
    };
  }, [isQuestion, parentWidth]);
  return (
    <>
      <div
        className="min-w-[26px] min-h-[26px] flex justify-center items-center"
        onClick={() => setIsQuestion((prev: boolean) => !prev)}
      >
        <QuestionIcon className="hover:fill-[#333333]" />
      </div>

      <div
        ref={positionRef}
        className={cn(
          "w-[297px] h-[186px] bg-white px-[20px] pt-[10px] pb-[18px] absolute rounded-[6px] border-2 border-[#CCCCCC]",
          !isQuestion && "hidden"
        )}
      >
        <div className="w-full h-[42px] text-[#4C4C4C] flex flex-col align-item justify-center mb-[10px]">
          <p className="h-[34px] indent-[17px] font-medium">
            세부 목표 작성 가이드
          </p>
          <hr className="w-full border-[#CCCCCC]" />
        </div>
        <div>
          <ol className="w-full h-[116px] flex flex-col gap-[10px] text-[#4C4C4C] text-[11px] list-decimal pl-[20px]">
            <li className="w-full h-[20px]">
              <p>주요 목표를 먼저 입력해주세요.</p>
            </li>
            <li className="w-full h-[30px]">
              <p>각 세부 목표는 측정 가능하고 구체적으로 작성하세요.</p>
              <span className="text-[10px] text-[#999999]">{`ex) 운동하기 -> 주 3회 30분 이상 조깅하기`}</span>
            </li>
            <li className="w-full h-[36px]">
              <p>
                잘 모르겠다면 '목표 추천받기' 버튼을 눌러보세요. <br />
                당신에게 맞는 목표를 추천해드릴게요.
              </p>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
}
