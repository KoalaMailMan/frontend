import { create } from "zustand";
import durmmyData from "@/data/durmmy";

type MandalaType = {
  data: {
    mains: MainGoal[];
  };
};

export type MainGoal = {
  goalId: any;
  position: any;
  content: string;
  subs: SubGoal[];
};
export type SubGoal = { goalId: any; position: any; content: string };

type States = {
  data: MandalaType;
  isDirty: boolean;
  editingCellId: string | null;
  editingSubCellId: string | null;
  modalCellId: string | null;
  changedCells: Set<string>;
  isModalOpen: boolean;
  isReminderOpen: boolean;
};

type Actions = {
  setData: (newData: MandalaType) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  handleCellChange: (
    cellId: string,
    value: string,
    index?: number | undefined
  ) => void;
  setEditingCell: (cellId: string | null) => void;
  setEditingSubCell: (cellId: string | null) => void;
  setModalCellId: (cellId: string | null) => void;
  setModalVisible: (visible: boolean) => void;
  setReminderVisible: (visible: boolean) => void;
};

export const useMandalaStore = create<States & Actions>((set, get) => ({
  data: durmmyData,
  isDirty: false,
  editingCellId: null,
  editingSubCellId: null,
  modalCellId: null,
  changedCells: new Set([]),
  isModalOpen: false,
  isReminderOpen: false,

  getData: (index) => {
    if (index) return get().data.data.mains[index].subs;
    else return get().data.data.mains;
  },
  setData: (newData) => set(() => ({ data: newData })),
  handleCellChange: (cellId, value, index?) =>
    set((state) => {
      const dataList = [...state.data.data.mains];
      let targetIndex;
      if (index) {
        targetIndex = dataList[index].subs.findIndex(
          (item) => item.goalId === cellId
        );
      } else {
        targetIndex = dataList.findIndex((item) => item.goalId === cellId);
      }
      if (targetIndex === -1) return state;
      if (index) {
        dataList[index].subs[targetIndex] = {
          ...dataList[index].subs[targetIndex],
          content: value,
        };
      } else {
        dataList[targetIndex] = {
          ...dataList[targetIndex],
          content: value,
        };
      }

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
  setEditingSubCell: (cellId) => set(() => ({ editingSubCellId: cellId })),
  setModalCellId: (cellId) => set(() => ({ modalCellId: cellId })),
  setModalVisible: (visible) => set(() => ({ isModalOpen: visible })),
  setReminderVisible: (visible) => set(() => ({ isReminderOpen: visible })),
}));
