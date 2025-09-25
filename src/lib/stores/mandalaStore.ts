import { create } from "zustand";
import { emptyDummyData, serverToUI } from "@/feature/mandala/service";

export type MandalaType<T = string> = {
  core: {
    goalId: T;
    content: string;
    mains: MainGoal<T>[];
  };
};

export type DataOption = {
  reminderEnabled: boolean;
  reminderInterval: string;
  remindScheduledAt: string | null;
};
export type MainGoal<T = string> = {
  goalId: T;
  originalId?: number; // 서버 원본 ID
  position: number;
  content: string;
  subs: SubGoal<T>[];
};

export type SubGoal<T = string> = {
  goalId: T;
  originalId?: number; // 서버 원본 ID
  position: number;
  content: string;
};
type States = {
  data: MandalaType;
  mandalartId: number | null;
  reminderOption: DataOption;
  isDirty: boolean;
  editingCellId: string | null;
  editingSubCellId: string | null;
  editingFullCellId: string | null;
  modalCellId: string | null;
  changedCells: Set<string>;
  isModalOpen: boolean;
  isReminderOpen: boolean;
  reminderSettingComplete: boolean;
  isFullOpen: boolean;
  isEmpty: boolean;
};

type Actions = {
  setData: (newData: any) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  setMandalartId: (id: number) => void;
  setReminderOption: (options: DataOption) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderInterval: (interval: string) => void;
  handleCellChange: (cellId: string, value: string, index?: any) => void;
  setEditingCell: (cellId: string | null) => void;
  setEditingSubCell: (cellId: string | null) => void;
  setEditingFullCell: (cellId: string | null) => void;
  setModalCellId: (cellId: string | null) => void;
  setModalVisible: (visible: boolean) => void;
  setReminderVisible: (visible: boolean) => void;
  setReminderSetting: (state: boolean) => void;
  setFullVisible: (visible: boolean) => void;
  setEmptyState: (state: boolean) => void;
};

export const useMandalaStore = create<States & Actions>((set, get) => ({
  data: serverToUI(emptyDummyData.data),
  reminderOption: {
    reminderEnabled: false,
    reminderInterval: "1week",
    remindScheduledAt: null,
  },
  mandalartId: null,
  isDirty: false,
  editingCellId: null,
  editingSubCellId: null,
  editingFullCellId: null,
  modalCellId: null,
  changedCells: new Set([]),
  isModalOpen: false,
  isReminderOpen: false,
  reminderSettingComplete: false,
  isFullOpen: false,
  isEmpty: true,

  getData: (index) => {
    if (index != null) {
      return get().data?.core?.mains?.[index]?.subs ?? [];
    } else return get().data.core.mains;
  },
  setData: (newData) => set(() => ({ data: serverToUI(newData) })),
  setMandalartId: (id) => set(() => ({ mandalartId: id })),
  setReminderOption: (options) =>
    set(() => ({ reminderOption: { ...options } })),
  setReminderEnabled: (enabled) =>
    set((state) => ({
      reminderOption: { ...state.reminderOption, reminderEnabled: enabled },
    })),
  setReminderInterval: (interval) =>
    set((state) => ({
      reminderOption: { ...state.reminderOption, reminderInterval: interval },
    })),

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
        // sub-{mainIndex}-{subIndex} | sub-0-{subIndex} |  sub-center-{mainIndex}

        const mainId =
          ids[1] === "center" ? `main-${ids[2]}` : `main-${ids[1]}`;
        let mainIndex = dataList.findIndex((item) => item.goalId === mainId);
        let subIndex;
        if (mainIndex === -1) {
          const mainId = `core-${ids[1]}`;
          const subId = `sub-${ids[1]}-${ids[2]}`;
          mainIndex = dataList.findIndex((item) => item.goalId === mainId);
          subIndex = dataList[mainIndex].subs.findIndex(
            (item) => item.goalId === subId
          );
        } else {
          const subId =
            ids[1] === "center"
              ? `sub-${ids[2]}-${ids[2]}`
              : `sub-${ids[1]}-${ids[2]}`;
          subIndex = dataList[mainIndex].subs.findIndex(
            (item) => item.goalId === subId
          );
        }

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
        if (ids[1] === "center") {
          dataList[mainIndex].content = value;
          dataList[0] = {
            ...dataList[0],
            subs: dataList[0].subs.map((sub, i) =>
              i === mainIndex ? { ...sub, content: value } : sub
            ),
          };
        } else if (mainIndex === 0) {
          dataList[subIndex] = {
            ...dataList[subIndex],
            content: value,
            subs: dataList[subIndex].subs.map((sub, i) =>
              i === mainIndex ? { ...sub, content: value } : sub
            ),
          };
        }
      } else if (isMainGoal) {
        const mainId = cellId; // main-{mainIndex} | main-center-{mainIndex}
        const mainIndex = dataList.findIndex((item) => item.goalId === mainId);

        if (mainIndex < 0 || mainIndex >= dataList.length) return state;
        if (
          !dataList ||
          dataList[mainIndex].subs.length <= 0 ||
          dataList[0].subs.length <= 0
        )
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
  setReminderSetting: (state) =>
    set(() => ({ reminderSettingComplete: state })),
  setFullVisible: (visible) => set(() => ({ isFullOpen: visible })),
  setEmptyState: (state) => set(() => ({ isEmpty: state })),
}));
