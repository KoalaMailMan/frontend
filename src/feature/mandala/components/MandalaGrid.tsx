import { Fragment } from "react/jsx-runtime";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import MandalaModal from "./MandalaModal";

export default function MandalaGrid() {
  const store = useMandalaStore();
  const mandalaList = useMandalaStore((state) => state.data.data.mains);

  const handleContentChange = (goalId: string, value: string) => {
    const index = [0, 0];
    mandalaList.forEach((item, i) => {
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
      store.handleCellChange(goalId, value);
    }
    store.handleCellChange(goalId, value, index[0]);
  };

  const handleStartEdit = (goalId: string) => {
    store.setEditingCell(goalId);
  };

  const handleCancelEdit = () => {
    store.setEditingCell(null);
  };

  const handleDetailClick = (goalId: string) => {
    store.setModalCellId(goalId);
    store.setModalVisible(true);
  };

  const handleModalClose = () => {
    store.setModalCellId(null);
    store.setEditingSubCell(null);
    store.setModalVisible(false);
  };

  const handleSubContentChange = (value: string) => {
    if (store.modalCellId) {
      const mainIndex = findByIdWithGoalIndex(store.modalCellId);
      store.handleCellChange(
        store.editingSubCellId as string,
        value,
        mainIndex
      );
    }
  };

  const findByIdWithGoalIndex = (id: string) => {
    const index = mandalaList.findIndex((item) => item.goalId === id);
    return index === -1 ? 0 : index;
  };

  return (
    <div className="grid grid-cols-3 gap-1 max-w-lg mx-auto aspect-square">
      {mandalaList.map((item, i) => {
        const isCenter = Math.floor(mandalaList.length / 2) === i;
        const isEditing = store.editingCellId === item.goalId;
        const hasSubGoals = i !== 4 && item.subs[i].content !== "";
        return (
          <Fragment key={`main-${i}`}>
            <MandalaContainer
              className={`
              ${
                isCenter
                  ? " bg-primary/20 border-primary text-primary font-semibold"
                  : ""
              }
              ${i !== 4 ? "bg-primary/5" : ""}
              ${hasSubGoals ? "ring-2 ring-primary/50 bg-primary/5" : ""}
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
      {store.isModalOpen && store.modalCellId && (
        <MandalaModal
          isModalVisible={store.isModalOpen}
          item={
            store.getData(findByIdWithGoalIndex(store.modalCellId)) as SubGoal[]
          }
          compact={false}
          onContentChange={handleSubContentChange}
          onCancelEdit={handleModalClose}
        />
      )}
    </div>
  );
}
