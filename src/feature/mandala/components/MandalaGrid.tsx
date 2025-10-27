import { Fragment } from "react/jsx-runtime";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import MandalaModal from "./MandalaModal";
import { getGridClasses } from "../utills/css";

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
      {mandalaList.map((item, index) => {
        const isCenter = 0 === index;
        const isEditing = editingCellId === item.goalId;
        const hasSubGoals =
          index !== 0 &&
          item.subs
            .slice(1)
            .some((sub) => sub.content && sub.content.trim() !== "");
        return (
          <Fragment key={`main-${index}`}>
            <MandalaContainer
              className={`
              ${isCenter && "border-primary text-primary font-semibold"}
              ${hasSubGoals ? "ring-2 ring-primary/50 bg-primary/5" : ""}
              ${getGridClasses(index)}
            `}
              isCenter={isCenter}
              item={item}
              isEditing={isEditing}
              compact={false}
              disabled={false}
              isEmpty={!item.content || item.content.trim() === ""}
              onStartEdit={() => handleStartEdit(item.goalId)}
              onContentChange={(value) =>
                handleContentChange(item.goalId, value)
              }
              onCancelEdit={handleCancelEdit}
              onDetailClick={() => handleDetailClick(item.goalId)}
              data-tutorial={
                // 0번째 중앙의 핵심 목표
                index === 0 ? "center-cell" : index === 4 ? "main-cells" : ""
              }
              tutorialArrowButton={index === 4} // 첫번째 셀의 화살표에만 true
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
