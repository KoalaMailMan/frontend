import { Fragment } from "react/jsx-runtime";
import { useMandalaStore, type SubGoal } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";
import MandalaModal from "./MandalaModal";

export default function MandalaGrid() {
  const store = useMandalaStore();
  const mandalaList = store.data.data.mains;

  const handleContentChange = (
    goalId: string,
    value: string,
    index?: number | undefined
  ) => {
    if (index !== undefined)
      return store.handleCellChange(goalId, value, index);
    store.handleCellChange(goalId, value);
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
    if (store.modalCellId && store.editingSubCellId) {
      const mainIndex = findByIdWithGoalIndex(store.modalCellId);
      store.handleCellChange(store.editingSubCellId, value, mainIndex);
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
        return (
          <Fragment key={item.goalId}>
            <MandalaContainer
              isCenter={isCenter}
              item={item}
              isEditing={isEditing}
              compact={true}
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
