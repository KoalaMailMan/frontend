import { useMandalaStore } from "@/lib/stores/mandalaStore";
import MandalaModal from "./MandalaModal";
import { getGridClasses } from "../utills/css";
import useGridTabNavigation from "../hooks/useGridTabNavigation";
import { getNextMainCellId } from "../service";
import GridCell from "./grid/GridCell";

export default function MandalaGrid() {
  const editingCellId = useMandalaStore((state) => state.editingCellId);
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const setEditingCell = useMandalaStore((state) => state.setEditingCell);

  const flatData = useMandalaStore((state) => state.flatData);
  const layout = useMandalaStore((state) => state.flatData?.layout);

  useGridTabNavigation({
    editingId: editingCellId,
    setEditingId: setEditingCell,
    getNextId: getNextMainCellId,
  });

  return (
    <div className="grid grid-cols-3 gap-1 max-w-lg mx-auto aspect-square">
      {layout?.mains.map((goalId, index) => {
        const isCenter = index === 0;
        const subIds = layout.subs[goalId];
        const hasSubGoals = subIds?.some(
          (subId) => flatData.cells[subId]?.content
        );

        return (
          <GridCell
            key={goalId}
            goalId={goalId}
            isCenter={isCenter}
            disabled={false}
            data-tutorial={
              // 0번째 중앙의 핵심 목표
              index === 0 ? "center-cell" : index === 4 ? "main-cells" : ""
            }
            tutorialArrowButton={index === 4} // 첫번째 셀의 화살표에만 true
            className={`w-full h-full
              ${isCenter && "border-primary text-primary font-semibold"}
              ${hasSubGoals ? "ring-2 ring-primary/50 bg-primary/5" : ""}
              ${getGridClasses(index)}
            `}
          />
        );
      })}

      {isModalOpen && <MandalaModal isModalVisible={isModalOpen} />}
    </div>
  );
}
