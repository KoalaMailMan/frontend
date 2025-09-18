import koalaPixelImage from "@/assets/default_koala.png";
import { Button } from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { ImageIcon, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef } from "react";
import MandalaContainer from "./MandalaContainer";
import { cn } from "@/lib/utils";
import { captureAndDownload } from "../utills/image";

type Type = "center" | "main" | "main-center" | "sub";
const findbyCSS = (type: Type) => {
  const typeObj = {
    center: " bg-primary/20 border-primary text-primary font-semibold",
    "main-center": " bg-primary/5 border-primary/30",
    main: " bg-primary/10 border-primary/50 font-medium",
    sub: " bg-gray-50 border-gray-200",
  };
  if (typeObj[type]) return typeObj[type];
  return typeObj["sub"];
};
export default function FullMandalaView() {
  const mandalaList = useMandalaStore((state) => state.data.core.mains);
  const isFullOpen = useMandalaStore((state) => state.isFullOpen);
  const editingFullCellId = useMandalaStore((state) => state.editingFullCellId);
  const handleCellChange = useMandalaStore((state) => state.handleCellChange);
  const setEditingFullCell = useMandalaStore(
    (state) => state.setEditingFullCell
  );
  const onClose = useMandalaStore((state) => state.setFullVisible);
  const mandaraGridRef = useRef<HTMLDivElement | null>(null);

  const addPositionProperty = useMemo(() => {
    return mandalaList.map((item, idx) => {
      const isCenter = Math.floor(mandalaList.length / 2) === idx;
      const type = isCenter ? "center" : "main";
      const content = item.content;
      const goalId = item.goalId;
      const position = item.position;

      const newSubs = item.subs.map((sub, subIdx) => {
        const isSubCenter = Math.floor(item.subs.length / 2) === subIdx;
        const typeSub = isSubCenter ? "main-center" : "sub";
        const contentSub = sub.content;
        const goalIdSub = sub.goalId;
        const positionSub = sub.position;

        return {
          type: typeSub,
          content: contentSub,
          goalId: goalIdSub,
          position: positionSub,
        };
      });
      return { type, content, goalId, position, subs: newSubs };
    });
  }, [mandalaList]);

  const grid = useMemo(() => {
    const result: (typeof addPositionProperty)[0]["subs"][] = [];
    for (let i = 0; i < addPositionProperty.length; i++) {
      const main = addPositionProperty[i];

      if (i === 4) {
        // center
        const newSubs = main.subs.map((sub, j) => ({
          ...sub,
          type: j === 4 ? "center" : "main",
        }));
        result.push(newSubs);
        continue;
      }

      result.push([...main.subs]);
    }
    return result;
  }, [addPositionProperty]);

  const handleSubStartEdit = (goalId: string) => {
    setEditingFullCell(goalId);
  };
  const findByIdWithGoalIndex = (id: string) => {
    const index = [0, 0];

    for (let i = 0; i < mandalaList.length; i++) {
      const item = mandalaList[i];
      if (item.goalId === id) {
        index[0] = i;
        break;
      }
      for (let j = 0; j < item.subs.length; j++) {
        const sub = item.subs[j];
        if (sub.goalId === id) {
          index[0] = i;
          index[1] = j;
          break;
        }
      }
    }

    return index;
  };
  const handleContentChange = (id: string, value: string) => {
    if (isFullOpen && editingFullCellId) {
      const index = findByIdWithGoalIndex(id);
      console.log("Editing:", id, "at index:", index, "value:", value);

      handleCellChange(id, value, index[0]);
    }
  };

  const handleModalClose = () => {
    setEditingFullCell(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={() => onClose(false)}
    >
      <div
        className="pixel-card bg-white/95 backdrop-blur-sm w-full h-full sm:max-w-7xl sm:max-h-[95vh] sm:h-auto overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={koalaPixelImage}
              alt="코알라"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <div>
              <h2 className="pixel-subtitle" style={{ fontSize: "12px" }}>
                📮 완전한 9x9 만다라트 우체통
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                모든 목표를 한눈에 보고 편집할 수 있어요
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 이미지 저장 버튼 */}
            <Button
              onClick={() => captureAndDownload(mandaraGridRef)}
              className="pixel-button bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2"
              title="만다라트를 이미지로 저장"
            >
              <ImageIcon className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">이미지 저장</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onClose(false)}
              className="pixel-button"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
        <div className="p-2 sm:p-6">
          {/* 모바일에서는 스크롤 가능한 뷰 */}
          <div className="w-full overflow-auto sm:overflow-visible">
            <div
              ref={mandaraGridRef}
              className="grid grid-cols-3 gap-0.5 sm:gap-1 mx-auto"
              style={{
                minWidth: "360px", // 모바일 최소 너비
                maxWidth: "800px", // 데스크톱 최대 너비
                aspectRatio: "1 / 1",
              }}
            >
              {grid.map((subBlock, blockIdx) => {
                return (
                  <div
                    key={blockIdx}
                    className={cn(
                      "grid grid-cols-3 gap-1 aspect-square text-xs"
                    )}
                  >
                    {subBlock.map((sub, subIdx: number) => {
                      const isCenter = subIdx === 4;
                      const isEditing = sub.goalId === editingFullCellId;
                      return (
                        <Fragment key={`main-${blockIdx}-${sub.goalId}`}>
                          <MandalaContainer
                            type={sub.type}
                            item={sub}
                            isCenter={isCenter}
                            isEditing={isEditing}
                            compact={true}
                            disabled={false}
                            isEmpty={!sub}
                            className={findbyCSS((sub.type as Type) || "sub")}
                            onStartEdit={() => handleSubStartEdit(sub.goalId)}
                            onContentChange={(value) =>
                              handleContentChange(sub.goalId, value)
                            }
                            onCancelEdit={handleModalClose}
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
