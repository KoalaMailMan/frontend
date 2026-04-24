import Button from "@/feature/ui/Button";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import { ImageIcon, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { captureAndDownload } from "../utills/image";
import {
  findbyCSS,
  getCellType,
  getGridClasses,
  type Type,
} from "../utills/css";
import useGridTabNavigation from "../hooks/useGridTabNavigation";
import { getNextFullCellId } from "../service";
import FullCell from "./full/FullCell";

export default function FullMandalaView() {
  const editingFullCellId = useMandalaStore((state) => state.editingFullCellId);
  const setEditingFullCell = useMandalaStore(
    (state) => state.setEditingFullCell
  );
  const onClose = useMandalaStore((state) => state.setFullVisible);
  const mandaraGridRef = useRef<HTMLDivElement | null>(null);
  const layout = useMandalaStore((state) => state.flatData?.layout);

  useGridTabNavigation({
    editingId: editingFullCellId,
    setEditingId: setEditingFullCell,
    getNextId: getNextFullCellId,
  });

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
          <div className="flex items-center gap-2 sm:gap-3"></div>
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
              aria-label="전체보기 닫기"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
        <div ref={mandaraGridRef} className="p-2 sm:p-6">
          {/* 모바일에서는 스크롤 가능한 뷰 */}
          <div className="w-full overflow-auto sm:overflow-visible">
            <div
              className="grid grid-cols-3 gap-0.5 sm:gap-1 mx-auto"
              style={{
                minWidth: "360px", // 모바일 최소 너비
                maxWidth: "800px", // 데스크톱 최대 너비
                aspectRatio: "1 / 1",
              }}
            >
              {layout.grid.map((subIds, blockIdx) => (
                <div
                  key={`block-${blockIdx}`}
                  className={cn(
                    "grid grid-cols-3 gap-1",
                    getGridClasses(blockIdx)
                  )}
                >
                  {subIds.map((goalId, subIdx) => {
                    const type = getCellType(blockIdx, subIdx);
                    return (
                      <FullCell
                        key={goalId}
                        goalId={goalId}
                        isCenter={blockIdx === 0 && subIdx === 0}
                        className={cn(
                          "",
                          findbyCSS((type as Type) || "sub"),
                          getGridClasses(subIdx)
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
