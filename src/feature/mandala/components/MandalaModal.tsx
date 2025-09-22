import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import koalaImage from "@/assets/default_koala.png";
import { createPortal } from "react-dom";
import { Button } from "@/feature/ui/Button";
import { cn } from "@/lib/utils";
const getGridClasses = (idx: number) => {
  if (idx === 0) return "col-start-2 row-start-2"; // 중앙
  const positions = [
    "col-start-1 row-start-1", // 좌상
    "col-start-2 row-start-1", // 중상
    "col-start-3 row-start-1", // 우상
    "col-start-1 row-start-2", // 좌중
    "col-start-3 row-start-2", // 우중
    "col-start-1 row-start-3", // 좌하
    "col-start-2 row-start-3", // 중하
    "col-start-3 row-start-3", // 우하
  ];
  return positions[idx - 1] || "col-start-1 row-start-1";
};
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
  const editingSubCellId = useMandalaStore((state) => state.editingSubCellId);
  const setEditingSubCell = useMandalaStore((state) => state.setEditingSubCell);
  const centerIndex = 0;

  const handleSubStartEdit = (goalId: string, isCenter: boolean) => {
    if (isCenter) return;
    setEditingSubCell(goalId);
  };

  const handleSubCancelEdit = () => {
    setEditingSubCell(null);
  };

  const handleModalClose = () => {
    setEditingSubCell(null);
    onCancelEdit();
  };

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
              "{item[centerIndex]?.content}"
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
                            disabled={isCenter ? true : false}
                            isEmpty={!sub}
                            onStartEdit={() => {
                              handleSubStartEdit(sub.goalId, isCenter);
                            }}
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
                <div className="flex justify-center mt-6">
                  <div className="bg-primary/10 p-4 rounded-lg max-w-md">
                    <div className="flex items-start gap-3">
                      <img
                        src={koalaImage}
                        alt="코알라"
                        className="w-6 h-6 mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-medium text-primary mb-1">
                          코알라 팁!
                        </p>
                        <p className="text-primary/80">
                          각 세부 목표는 측정 가능하고 구체적으로 작성하세요.
                          예: "운동하기" → "주 3회 30분 이상 조깅하기"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t">
          <Button variant="outline" onClick={handleModalClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
  return createPortal(modalContent, document.body);
}
