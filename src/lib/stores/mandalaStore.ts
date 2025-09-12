import { create } from "zustand";
import durmmyData from "@/data/durmmy";

type MandalaType = {
  data: {
    mains: MainGoal[];
  };
};

type MainGoal = {
  goalId: any;
  position: any;
  content: string;
  subs: SubGoal[];
};
type SubGoal = { goalId: any; position: any; content: string };

type States = {
  data: MandalaType;
  isDirty: boolean;
  editingCellId: string | null;
  modalCellId: string | null;
  changedCells: Set<string>;
  editingContent: string;
};

type Actions = {
  handleCellChange: (cellId: string, value: string) => void;
  setEditingCell: (cellId: string | null) => void;
};

export const useMandalaStore = create<States & Actions>((set, get) => ({
  data: durmmyData,
  isDirty: false,
  editingCellId: null,
  modalCellId: null,
  changedCells: new Set([]),
  editingContent: "",

  handleCellChange: (cellId, value) =>
    set((state) => {
      const dataList = [...state.data.data.mains];
      const targetIndex = dataList.findIndex((item) => item.goalId === cellId);

      if (targetIndex === -1) return state;

      dataList[targetIndex] = {
        ...dataList[targetIndex],
        content: value,
      };

      return {
        ...state,
        data: {
          ...state.data,
          data: {
            mains: dataList,
          },
        },
        changedCells: state.changedCells.add(cellId),
        isDirty: true,
      };
    }),
  setEditingCell: (cellId) => set(() => ({ editingCellId: cellId })),
}));
