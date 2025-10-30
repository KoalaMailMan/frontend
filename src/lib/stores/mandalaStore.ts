import { create } from "zustand";
import { emptyDummyData, serverToUI } from "@/feature/mandala/service";
import { findKeyByValue } from "@/feature/mandala/utills/\bindex";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

export type MandalaType<T = string> = {
  core: {
    goalId: T;
    content: string;
    originalId?: number | undefined;
    mains: MainGoal<T>[];
  };
};

export type DataOption = {
  reminderEnabled: boolean;
  remindInterval: string;
  remindScheduledAt: string | null;
};
export type MainGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
  position: number;
  content: string;
  subs: SubGoal<T>[];
};

export type SubGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
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
  isFullOpen: boolean;
  isEmpty: boolean;
} & PersistedState;

type PersistedState = {
  data: MandalaType;
};

type Actions = {
  setData: (newData: any) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  setMandalartId: (id: number) => void;
  handleCellChange: (cellId: string, value: string, index?: any) => void;
  updateSubsCell: (subs: SubGoal[], data: string[]) => void;
  setReminderOption: (options: DataOption) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setRemindInterval: (interval: string) => void;
  setEditingCell: (cellId: string | null) => void;
  setEditingSubCell: (cellId: string | null) => void;
  setEditingFullCell: (cellId: string | null) => void;
  setModalCellId: (cellId: string | null) => void;
  setModalVisible: (visible: boolean) => void;
  setReminderVisible: (visible: boolean) => void;
  setFullVisible: (visible: boolean) => void;
  setEmptyState: (state: boolean) => void;
  resetChangedCells: () => void;
};

export const useMandalaStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      data: serverToUI(emptyDummyData.data),
      reminderOption: {
        reminderEnabled: true,
        remindInterval: "3month",
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
      isFullOpen: false,
      isEmpty: true,

      getData: (index) => {
        if (index != null) {
          return get().data?.core?.mains?.[index]?.subs ?? [];
        }
        return (get().data && get().data?.core.mains) || [];
      },
      setData: (newData) => set(() => ({ data: serverToUI(newData) })),
      setMandalartId: (id) => set(() => ({ mandalartId: id })),
      setReminderOption: (options) =>
        set(() => ({
          reminderOption: {
            ...options,
            remindInterval: findKeyByValue(options.remindInterval) ?? "1week",
          },
        })),
      setReminderEnabled: (enabled) =>
        set((state) => ({
          reminderOption: { ...state.reminderOption, reminderEnabled: enabled },
        })),
      setRemindInterval: (interval) =>
        set((state) => ({
          reminderOption: {
            ...state.reminderOption,
            remindInterval: interval,
          },
        })),

      handleCellChange: (cellId, value, index) =>
        set((state) => {
          console.log("Store handleCellChange:", cellId, value, index);
          if (!state.data) return state;
          if (!state.data.core.mains) return state;
          const dataList = [...state.data.core.mains];
          const ids = cellId.split("-");

          const isSubGoal = cellId.startsWith("sub");
          const isMainGoal = cellId.startsWith("main");
          const isCoreGoal = cellId.startsWith("core");

          if (isSubGoal) {
            // sub-{mainIndex}-{subIndex} | sub-0-{subIndex} |  sub-center-{0}

            let mainId: string;
            if (ids[1] === "center") {
              if (ids[2] === "0") {
                mainId = `core-0`;
              } else {
                mainId = `main-${ids[2]}`;
              }
            } else if (ids[1] === "0") {
              mainId = `main-${ids[2]}`;
            } else {
              mainId = `main-${ids[1]}`;
            }
            let mainIndex = dataList.findIndex(
              (item) => item.goalId === mainId
            );
            let subIndex;
            if (mainIndex === -1) return state;
            if (cellId.includes("center") || ids[1] === "0") {
              // sub-0-{subIndex} |  sub-center-{0}
              subIndex = dataList[mainIndex].subs.findIndex(
                (sub) => sub.goalId === dataList[mainIndex].subs[0].goalId
              );
            } else {
              subIndex = dataList[mainIndex].subs.findIndex(
                (sub) => sub.goalId === cellId
              );
            }
            if (subIndex === -1) return state;

            if (ids[1] === "center" || ids[1] === "0") {
              if (ids[2] === "0") {
                // 핵심 목표: 정중앙
                dataList[0] = {
                  ...dataList[0],
                  content: value,
                  subs: dataList[0].subs.map((sub, i) =>
                    i === 0 ? { ...sub, content: value } : sub
                  ),
                };
              } else {
                // 주요 목표: mains
                dataList[0] = {
                  ...dataList[0],
                  subs: dataList[0].subs.map((sub, i) =>
                    i === mainIndex ? { ...sub, content: value } : sub
                  ),
                };
                dataList[mainIndex] = {
                  ...dataList[mainIndex],
                  content: value,
                  subs: dataList[mainIndex].subs.map((sub, i) =>
                    i === 0 ? { ...sub, content: value } : sub
                  ),
                };
              }
            } else if (ids[2] === "0") {
              dataList[0] = {
                ...dataList[0],
                subs: dataList[0].subs.map((sub, i) =>
                  i === mainIndex ? { ...sub, content: value } : sub
                ),
              };
              dataList[mainIndex] = {
                ...dataList[mainIndex],
                content: value,
                subs: dataList[mainIndex].subs.map((sub, i) =>
                  i === 0 ? { ...sub, content: value } : sub
                ),
              };
            }
            // 세부 목표: subs
            dataList[mainIndex] = {
              ...dataList[mainIndex],
              subs: dataList[mainIndex].subs.map((sub, i) =>
                i === subIndex ? { ...sub, content: value } : sub
              ),
            };
          } else if (isMainGoal) {
            const mainId = cellId; // main-{mainIndex} | main-center-{mainIndex}
            const mainIndex = dataList.findIndex(
              (item) => item.goalId === mainId
            );

            if (mainIndex < 0) return state;

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
      updateSubsCell: (subs, data) =>
        set((state) => {
          if (!subs || !data) return state;
          const mainId = subs[0].goalId.split("-")[1];
          const mainIndex = state.data.core.mains.findIndex(
            (sub) => sub.goalId === `main-${mainId}`
          );
          if (mainIndex === -1) return state;
          const newSubs = [...state.data.core.mains[mainIndex].subs];
          let dataIndex = 0;

          const updateSubs = newSubs.map((item) => {
            if (item.position === 0 || item.content) {
              return item;
            }

            if (dataIndex < data.length) {
              const newItem = { ...item, content: data[dataIndex] };
              dataIndex++;
              return newItem;
            }

            return item;
          });

          const cellIds = updateSubs
            .filter((item, i) => item.content && i !== 0 && item.goalId)
            .map((item) => item.goalId);
          return {
            ...state,
            data: {
              ...state.data,
              core: {
                ...state.data.core,
                mains: state.data.core.mains.map((main, index) =>
                  index === mainIndex ? { ...main, subs: updateSubs } : main
                ),
              },
            },
            changedCells: new Set([...state.changedCells, ...cellIds]),
            isDirty: true,
          };
        }),

      setEditingCell: (cellId) => set(() => ({ editingCellId: cellId })),
      setEditingSubCell: (cellId) => set(() => ({ editingSubCellId: cellId })),
      setEditingFullCell: (cellId) =>
        set(() => ({ editingFullCellId: cellId })),

      setModalCellId: (cellId) => set(() => ({ modalCellId: cellId })),
      setModalVisible: (visible) => set(() => ({ isModalOpen: visible })),
      setReminderVisible: (visible) => set(() => ({ isReminderOpen: visible })),
      setFullVisible: (visible) => set(() => ({ isFullOpen: visible })),
      setEmptyState: (state) => set(() => ({ isEmpty: state })),

      resetChangedCells: () =>
        set(() => ({ changedCells: new Set([]), isDirty: false })),
    }),
    {
      name: "mandalart",
      partialize: (state): PersistedState => ({
        data: state.data,
      }),
      version: 1,

      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          const wasLoggedIn = useAuthStore.getState().wasLoggedIn;
          const accessToken = useAuthStore.getState().accessToken;
          if (wasLoggedIn && accessToken) return;
          else {
            if (typeof value === "string") {
              localStorage.setItem(name, value);
            } else {
              localStorage.setItem(name, JSON.stringify(value));
            }
          }
        },
        removeItem: (name) => {
          const wasLoggedIn = useAuthStore.getState().wasLoggedIn;
          const accessToken = useAuthStore.getState().accessToken;
          if (wasLoggedIn && accessToken)
            return localStorage.removeItem("mandalart");
          localStorage.removeItem(name);
        },
      },
    }
  )
);
