import { useMandalaStore } from "@/lib/stores/mandalaStore";
import useGridTabNavigation from "../../hooks/useGridTabNavigation";
import { getNextMainCellId } from "../../service";
import GridCell from "./GridCell";
import { getGridClasses } from "../../utills/css";
import MandalaModal from "../modal/MandalaModal";

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
        const hasSubGoals = subIds
          ?.slice(1)
          .some((subId) => flatData.cells[subId]?.content);
        return (
          <div
            data-testid={`cell-${goalId}`}
            className={`${getGridClasses(index)}`}
            key={goalId}
          >
            <GridCell
              goalId={goalId}
              isCenter={isCenter}
              disabled={false}
              className={`w-full h-full
                ${isCenter && "border-primary text-primary font-semibold"}
                ${hasSubGoals ? "ring-2 ring-primary/50 bg-primary/5" : ""}
              `}
            />
          </div>
        );
      })}

      {isModalOpen && <MandalaModal isModalVisible={isModalOpen} />}
    </div>
  );
}
