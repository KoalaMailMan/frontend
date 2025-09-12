import { Fragment } from "react/jsx-runtime";
import { useMandalaStore } from "@/lib/stores/mandalaStore";
import MandalaContainer from "./MandalaContainer";

export default function MandalaGrid() {
  const store = useMandalaStore();
  const mandalaList = store.data.data.mains;

  const handleContentChange = (goalId: string, value: string) => {
    store.handleCellChange(goalId, value);
  };

  const handleStartEdit = (goalId: string) => {
    store.setEditingCell(goalId);
  };

  const handleCancelEdit = () => {
    store.setEditingCell(null);
  };
  const handleDetailClick = (goalId: string) => {
    // 세부 목표 모달 열기 로직
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
    </div>
  );
}
