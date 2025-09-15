import { Button } from "@/feature/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/feature/ui/Dialog";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

import koalaImage from "@/assets/default_koala.png";

type Props = {
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  item: SubGoal[];
  isCenter: boolean;
  compact: boolean;
  onStartEdit: (goalId: string) => any;
  onContentChange: (value: string) => void;
  onCancelEdit: () => void;
  onBlur?: (e: React.FocusEvent) => void;
};

export default function MandalaModal({
  isModalVisible,
  setModalVisible,
  item,
  isCenter,
  compact,
  onStartEdit,
  onContentChange,
  onCancelEdit,
  onBlur,
}: Props) {
  const store = useMandalaStore();
  const centerIndex = Math.floor(item.length / 2);
  useEffect(() => {
    console.log(isModalVisible);
    console.log(isModalVisible);
  }, [isModalVisible]);
  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancelEdit}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <img src={koalaImage} alt="코알라" className="w-8 h-8" />
            <h2 className="text-xl font-semibold">세부 목표 설정</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancelEdit}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 text-center border-b">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-primary">
              "{item[centerIndex].content}"
            </span>
            을(를) 달성하기 위한 구체적인 실행 계획을 세워보세요
          </p>
        </div>
        <div className="space-y-4">
          {centerIndex && (
            <div className="space-y-2">
              <p className="font-medium">
                {`"${item[centerIndex].content}"을(를) 달성하기 위한 구체적인 실행 계획을 세워보세요`}
              </p>
              <div className="p-6">
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-2 w-96 aspect-square">
                    {item.map((sub, index) => {
                      const isCenter = centerIndex === index;
                      const isEditing = store.editingCellId === sub.goalId;
                      return (
                        <Fragment key={index}>
                          <MandalaContainer
                            isCenter={isCenter}
                            item={sub}
                            isEditing={isEditing}
                            compact={compact}
                            onStartEdit={() => onStartEdit(sub.goalId)}
                            onContentChange={onContentChange}
                            onCancelEdit={onCancelEdit}
                            onBlur={onBlur}
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
          <Button variant="outline" onClick={onCancelEdit}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
