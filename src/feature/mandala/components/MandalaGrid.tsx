import { Fragment } from "react/jsx-runtime";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import MandalaModal from "./MandalaModal";

export default function MandalaGrid() {
  const mandalaList = useMandalaStore((state) => state.data.core.mains);
  const modalCellId = useMandalaStore((state) => state.modalCellId);
  const editingSubCellId = useMandalaStore((state) => state.editingSubCellId);
  const editingCellId = useMandalaStore((state) => state.editingCellId);
  const isModalOpen = useMandalaStore((state) => state.isModalOpen);
  const getData = useMandalaStore((state) => state.getData);
  const handleCellChange = useMandalaStore((state) => state.handleCellChange);
  const setEditingCell = useMandalaStore((state) => state.setEditingCell);
  const setModalCellId = useMandalaStore((state) => state.setModalCellId);
  const setModalVisible = useMandalaStore((state) => state.setModalVisible);
  const setEditingSubCell = useMandalaStore((state) => state.setEditingSubCell);

  const handleContentChange = (goalId: string, value: string) => {
    const index = [0, 0];
    mandalaList.forEach((item, i) => {
      if (!item.subs) return;
      item.subs.forEach((sub, j) => {
        if (sub.goalId === goalId) {
          index[0] = i;
          index[1] = j;
          return;
        }
      });

      if (item.goalId === goalId) {
        index[0] = i;
        return;
      }
    });
    if (index[1] === 0) {
      handleCellChange(goalId, value);
    }
    handleCellChange(goalId, value, index[0]);
  };

  const handleStartEdit = (goalId: string) => {
    setEditingCell(goalId);
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
  };

  const handleDetailClick = (goalId: string) => {
    setModalCellId(goalId);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalCellId(null);
    setEditingSubCell(null);
    setModalVisible(false);
  };

  const handleSubContentChange = (value: string) => {
    if (modalCellId) {
      const mainIndex = findByIdWithGoalIndex(modalCellId);
      handleCellChange(editingSubCellId as string, value, mainIndex);
    }
  };

  const findByIdWithGoalIndex = (id: string) => {
    const index = mandalaList.findIndex((item) => item.goalId === id);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="grid grid-cols-3 gap-1 max-w-lg mx-auto aspect-square">
      {mandalaList.map((item, i) => {
        const isCenter = 0 === i;
        const isEditing = editingCellId === item.goalId;
        const hasSubGoals = i !== 0 && item.subs && item.subs[i].content !== "";
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
        return (
          <Fragment key={`main-${i}`}>
            <MandalaContainer
              className={`
              ${
                isCenter
                  ? " bg-primary/20 border-primary text-primary font-semibold"
                  : ""
              }
              ${i !== 0 ? "bg-primary/5" : ""} 
              ${hasSubGoals ? "ring-2 ring-primary/50 bg-primary/5" : ""}
              ${getGridClasses(i)}
            `}
              isCenter={isCenter}
              item={item}
              isEditing={isEditing}
              compact={false}
              disabled={false}
              isEmpty={!item}
              onStartEdit={() => handleStartEdit(item.goalId)}
              onContentChange={(value) =>
                handleContentChange(item.goalId, value)
              }
              onCancelEdit={handleCancelEdit}
              onDetailClick={() => handleDetailClick(item.goalId)}
            />
          </Fragment>
        );
      })}
      {isModalOpen && modalCellId && (
        <MandalaModal
          isModalVisible={isModalOpen}
          item={getData(findByIdWithGoalIndex(modalCellId)) as SubGoal[]}
          compact={false}
          onContentChange={handleSubContentChange}
          onCancelEdit={handleModalClose}
        />
      )}
    </div>
  );
}
