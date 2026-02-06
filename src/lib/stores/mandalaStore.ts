import { create } from "zustand";
import {
  emptyDummyData,
  getDataById,
  isEqual,
  serverToUI,
  toggleStatus,
} from "@/feature/mandala/service";
import { findIdIndex, findKeyByValue } from "@/feature/mandala/utills/\bindex";
import { persist } from "zustand/middleware";
import { useAuthStore } from "./authStore";

export type Status = "DONE" | "UNDONE";

export type MandalaType<T = string> = {
  core: {
    goalId: T;
    content: string;
    originalId?: number | undefined;
    status: Status;
    mains: MainGoal<T>[];
  };
};
export type MainGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
  position: number;
  content: string;
  status: Status;
  subs: SubGoal<T>[];
};

export type SubGoal<T = string> = {
  goalId: T;
  originalId?: number | undefined; // 서버 원본 ID
  position: number;
  content: string;
  status: Status;
};

export type DataOption = {
  reminderEnabled: boolean;
  remindInterval: string;
  remindScheduledAt: string | null;
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
  emptySubIndexes: number[];
  recommendationCursor: number;
  currentRecommendationText: string;
} & PersistedState;

type PersistedState = {
  data: MandalaType;
  modalCellId: string | null;
  isModalOpen: boolean;
  isReminderOpen: boolean;
  isFullOpen: boolean;
};

type Actions = {
  setData: (newData: any) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  setMandalartId: (id: number) => void;
  allGoalComplete: (id: string) => void;
  toggleGoalStatus: (id: string) => void;
  handleCellChange: (
    cellId: string,
    value: string,
    queryData?: MandalaType
  ) => void;
  initRecommendationTargets: (subs: SubGoal[]) => void;
  resetRecommendationText: () => void;
  applyRecommendationChunk: (subs: SubGoal[], value: string) => void;
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
      emptySubIndexes: [],
      recommendationCursor: 0,
      currentRecommendationText: "",

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
      allGoalComplete: (id: string) =>
        set((state) => {
          const mains = state.data.core.mains;
          const { mainIndex } = findIdIndex(mains, id);

          if (mainIndex !== -1) {
            const isSubsComplete = mains[mainIndex].subs
              .slice(1)
              .every((item) => item.status === "DONE");

            if (isSubsComplete) {
              const { newMain } = toggleStatus("DONE", mains, mainIndex);

              return {
                ...state,
                data: {
                  ...state.data,
                  core: {
                    ...state.data.core,
                    mains: newMain,
                  },
                },
                changedCells: new Set(state.changedCells).add(id),
                isDirty: true,
              };
            } else {
              const { newMain } = toggleStatus("UNDONE", mains, mainIndex);

              return {
                ...state,
                data: {
                  ...state.data,
                  core: {
                    ...state.data.core,
                    mains: newMain,
                  },
                },
                changedCells: new Set(state.changedCells).add(id),
                isDirty: true,
              };
            }
          }
          return state;
        }),
      toggleGoalStatus: (id: string) =>
        set((state) => {
          const newState = state.data.core.mains.map((main: MainGoal) => {
            if (main.goalId === id) {
              return {
                ...main,
                status:
                  main.status === "DONE"
                    ? ("UNDONE" as Status)
                    : ("DONE" as Status),
              };
            } else {
              const updatedSubs = main.subs.map((sub) => {
                if (sub.goalId === id) {
                  return {
                    ...sub,
                    status:
                      sub.status === "DONE"
                        ? ("UNDONE" as Status)
                        : ("DONE" as Status),
                  };
                }
                return sub;
              });
              return {
                ...main,
                subs: updatedSubs,
              };
            }
          });

          return {
            ...state,
            data: {
              ...state.data,
              core: {
                ...state.data.core,
                mains: newState,
              },
            },
            changedCells: new Set(state.changedCells).add(id),
            isDirty: true,
          };
        }),

      handleCellChange: (cellId, value, queryData) =>
        set((state) => {
          console.log("Store handleCellChange:", cellId, value, queryData);
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
            let subIndex: number;
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

          if (queryData) {
            const original =
              getDataById(queryData.core.mains, cellId) ?? queryData.core;

            const next = getDataById(dataList, cellId)! ?? dataList[0];

            const isChanged = !isEqual(original, next);

            const nextChangedCells = new Set(state.changedCells);
            let dirty = false;
            if (isChanged) {
              if (isSubGoal && cellId === "sub-center-0") {
                nextChangedCells.add("core-0");
              } else {
                nextChangedCells.add(cellId);
              }
              dirty = true;
            } else {
              if (isSubGoal && cellId === "sub-center-0") {
                nextChangedCells.delete("core-0");
              } else {
                nextChangedCells.delete(cellId);
              }
              dirty = false;
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
              changedCells: nextChangedCells,
              isDirty: dirty,
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
          };
        }),
      initRecommendationTargets: (subs) =>
        set((state) => {
          const mainId = subs[0].goalId.split("-")[1];
          const mainIndex = state.data.core.mains.findIndex(
            (sub) => sub.goalId === `main-${mainId}`
          );
          if (mainIndex === -1) return state;
          const subsArr = state.data.core.mains[mainIndex].subs;

          const emptyIndexes = subsArr
            .map((sub, index) =>
              sub.position !== 0 && !sub.content.trim() ? index : null
            )
            .filter((v): v is number => v !== null);

          return {
            ...state,
            emptySubIndexes: emptyIndexes,
            recommendationCursor: 0,
          };
        }),
      resetRecommendationText: () =>
        set(() => ({
          currentRecommendationText: "",
        })),
      applyRecommendationChunk: (subs, chunk) =>
        set((state) => {
          const cursor = state.recommendationCursor;
          const targetIndex = state.emptySubIndexes[cursor];

          if (targetIndex == null) return state;

          const mainId = subs[0].goalId.split("-")[1];
          const mainIndex = state.data.core.mains.findIndex(
            (sub) => sub.goalId === `main-${mainId}`
          );
          if (mainIndex === -1) return state;

          const subsArr = state.data.core.mains[mainIndex].subs;
          const target = subsArr[targetIndex];

          const hasComma = chunk.includes(",");
          let newText = state.currentRecommendationText;

          if (hasComma) {
            return {
              ...state,
              recommendationCursor: cursor + 1,
              currentRecommendationText: "",
            };
          } else {
            newText = state.currentRecommendationText + chunk;
            const newSubs = [...subsArr];
            newSubs[targetIndex] = { ...target, content: newText };

            return {
              ...state,
              data: {
                ...state.data,
                core: {
                  ...state.data.core,
                  mains: state.data.core.mains.map((main, index) =>
                    index === mainIndex ? { ...main, subs: newSubs } : main
                  ),
                },
              },
              currentRecommendationText: newText,
              changedCells: new Set([...state.changedCells, target.goalId]),
              isDirty: true,
            };
          }
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
        modalCellId: state.modalCellId,
        isModalOpen: state.isModalOpen,
        isReminderOpen: state.isReminderOpen,
        isFullOpen: state.isFullOpen,
      }),
      version: 1,

      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          const { wasLoggedIn, accessToken } = useAuthStore.getState();
          if (wasLoggedIn && accessToken && value?.state?.data) {
            return;
          }
          if (typeof value === "string") {
            localStorage.setItem(name, value);
          } else {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          const { wasLoggedIn, accessToken } = useAuthStore.getState();
          if (wasLoggedIn && accessToken) {
            const current = localStorage.getItem(name);
            if (!current) return;
            const parsed = JSON.parse(current);
            if (parsed?.state?.data !== undefined) {
              delete parsed.state.data;
              localStorage.setItem(name, JSON.stringify(parsed));
            }
            return;
          }
          localStorage.removeItem(name);
        },
      },
    }
  )
);
