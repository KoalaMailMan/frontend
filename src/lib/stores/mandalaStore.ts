import { create } from "zustand";
import durmmyData from "@/data/durmmy";
import { emptyDummyData, serverToUI } from "@/feature/mandala/service";

export type MandalaType = {
  core: {
    goalId: string;
    content: string;
    mains: MainGoal[];
  };
};

export type MainGoal = {
  goalId: string;
  position: number;
  content: string;
  subs: SubGoal[];
};
export type SubGoal = {
  goalId: string;
  position: number;
  content: string;
};

type States = {
  data: MandalaType;
  isDirty: boolean;
  editingCellId: string | null;
  editingSubCellId: string | null;
  editingFullCellId: string | null;
  modalCellId: string | null;
  changedCells: Set<string>;
  isModalOpen: boolean;
  isReminderOpen: boolean;
  isFullOpen: boolean;
};

type Actions = {
  setData: (newData: any) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  handleCellChange: (cellId: string, value: string, index?: any) => void;
  setEditingCell: (cellId: string | null) => void;
  setEditingSubCell: (cellId: string | null) => void;
  setEditingFullCell: (cellId: string | null) => void;
  setModalCellId: (cellId: string | null) => void;
  setModalVisible: (visible: boolean) => void;
  setReminderVisible: (visible: boolean) => void;
  setFullVisible: (visible: boolean) => void;
};

export const useMandalaStore = create<States & Actions>((set, get) => ({
  data: serverToUI(emptyDummyData),
  isDirty: false,
  editingCellId: null,
  editingSubCellId: null,
  editingFullCellId: null,
  modalCellId: null,
  changedCells: new Set([]),
  isModalOpen: false,
  isReminderOpen: false,
  isFullOpen: false,

  getData: (index) => {
    if (index != null) {
      return get().data?.core?.mains?.[index]?.subs ?? [];
    } else return get().data.core.mains;
  },
  setData: (newData) => set(() => ({ data: newData })),

  handleCellChange: (cellId, value, index) =>
    set((state) => {
      console.log("Store handleCellChange:", cellId, value, index);
      if (!state.data.core.mains) return state;
      const dataList = [...state.data.core.mains];
      const ids = cellId.split("-");

      const isSubGoal = cellId.startsWith("sub");
      const isMainGoal = cellId.startsWith("main");
      const isCoreGoal = cellId.startsWith("core");

      if (isSubGoal) {
        const mainIndex = parseInt(ids[1]); // sub-{mainIndex}-{subIndex}
        const subIndex = parseInt(ids[2]);
        if (!dataList[mainIndex].subs) return state;
        if (mainIndex < 0 || mainIndex >= dataList.length) return state;
        if (subIndex < 0 || subIndex >= dataList[mainIndex].subs.length)
          return state;

        dataList[mainIndex] = {
          ...dataList[mainIndex],
          subs: dataList[mainIndex].subs.map((sub, i) =>
            i === subIndex ? { ...sub, content: value } : sub
          ),
        };
      } else if (isMainGoal) {
        const mainIndex =
          ids[1] === "center" ? parseInt(ids[2]) : parseInt(ids[1]); // main-{mainIndex} | main-center-{mainIndex}
        if (mainIndex < 0 || mainIndex >= dataList.length) return state;
        if (!dataList || !dataList[mainIndex].subs || !dataList[0].subs)
          return state;

        dataList[mainIndex] = {
          ...dataList[mainIndex],
          content: value,
          subs: dataList[mainIndex].subs.map((sub, i) =>
            i === 0 ? { ...sub, content: value } : sub
          ),
        };

        dataList[0] = {
          ...dataList[0],
          subs: dataList[0].subs.map((sub, i) =>
            i === mainIndex ? { ...sub, content: value } : sub
          ),
        };
      } else if (isCoreGoal) {
        if (!dataList[0].subs) return state;
        dataList[0] = {
          ...dataList[0],
          content: value,
          subs: dataList[0].subs.map((sub, i) =>
            i === 0 ? { ...sub, content: value } : sub
          ),
        };
      }

      return {
        ...state,
        data: {
          ...state.data,
          core: {
            ...state.data.core,
            mains: dataList,
          },
        },
        changedCells: new Set(state.changedCells).add(cellId),
        isDirty: true,
      };
    }),

  setEditingCell: (cellId) => set(() => ({ editingCellId: cellId })),
  setEditingSubCell: (cellId) => set(() => ({ editingSubCellId: cellId })),
  setEditingFullCell: (cellId) => set(() => ({ editingFullCellId: cellId })),

  setModalCellId: (cellId) => set(() => ({ modalCellId: cellId })),
  setModalVisible: (visible) => set(() => ({ isModalOpen: visible })),
  setReminderVisible: (visible) => set(() => ({ isReminderOpen: visible })),
  setFullVisible: (visible) => set(() => ({ isFullOpen: visible })),
}));
