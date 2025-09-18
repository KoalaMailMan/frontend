import { create } from "zustand";
import durmmyData, { emptyDummyData } from "@/data/durmmy";

type MandalaType = {
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

  //네비게이션
  currentCenter: { x: number; y: number };
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

  // 네비게이션
  move: (dx: number, dy: number) => void;
};

export const useMandalaStore = create<States & Actions>((set, get) => ({
  data: durmmyData,
  isDirty: false,
  editingCellId: null,
  editingSubCellId: null,
  editingFullCellId: null,
  modalCellId: null,
  changedCells: new Set([]),
  isModalOpen: false,
  isReminderOpen: false,
  isFullOpen: false,

  //네비게이션
  currentCenter: { x: 0, y: 0 },

  getData: (index) => {
    if (index) return get().data.core.mains[index].subs;
    else return get().data.core.mains;
  },
  setData: (newData) => set(() => ({ data: newData })),

  handleCellChange: (cellId, value, index) =>
    set((state) => {
      console.log("Store handleCellChange:", cellId, value, index);

      const dataList = [...state.data.core.mains];
      const ids = cellId.split("-");

      const isSubGoal = cellId.startsWith("sub");
      const isMainGoal = cellId.startsWith("main");

      if (isSubGoal) {
        const mainIndex = parseInt(ids[1]); // sub-{mainIndex}-{subIndex}
        const subIndex = parseInt(ids[2]);

        if (mainIndex < 0 || mainIndex >= dataList.length) return state;
        if (subIndex < 0 || subIndex >= dataList[mainIndex].subs.length)
          return state;

        dataList[mainIndex] = {
          ...dataList[mainIndex],
          subs: dataList[mainIndex].subs.map((sub, i) =>
            i === subIndex ? { ...sub, content: value } : sub
          ),
        };

        if (mainIndex === 4 && subIndex !== 4) {
          if (subIndex < dataList.length) {
            dataList[subIndex] = {
              ...dataList[subIndex],
              content: value,
              subs: dataList[subIndex].subs.map((sub, i) =>
                i === 4 ? { ...sub, content: value } : sub
              ),
            };
          }
        }

        if (subIndex === 4) {
          dataList[mainIndex] = {
            ...dataList[mainIndex],
            content: value,
          };

          if (mainIndex !== 4 && dataList[4]) {
            dataList[4] = {
              ...dataList[4],
              subs: dataList[4].subs.map((sub, i) =>
                i === mainIndex ? { ...sub, content: value } : sub
              ),
            };
          }
        }
      } else if (isMainGoal) {
        const mainIndex = parseInt(ids[1]); // main-{mainIndex}

        if (mainIndex < 0 || mainIndex >= dataList.length) return state;

        dataList[mainIndex] = {
          ...dataList[mainIndex],
          content: value,
          subs: dataList[mainIndex].subs.map((sub, i) =>
            i === 4 ? { ...sub, content: value } : sub
          ),
        };

        if (mainIndex !== 4 && dataList[4]) {
          dataList[4] = {
            ...dataList[4],
            subs: dataList[4].subs.map((sub, i) =>
              i === mainIndex ? { ...sub, content: value } : sub
            ),
          };
        }
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

  //네비게이션
  move: (dx, dy) => set(() => ({})),
}));
