import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  emptyDummyData,
  toFlatStructure,
  toggleStatus,
  toLegacyStructure,
} from "@/feature/mandala/service";
import { findIdIndex, findKeyByValue } from "@/feature/mandala/utills/\bindex";
import { persist } from "zustand/middleware";
import { parseCellId } from "@/feature/mandala/service/parseCellId";
import { getSyncTargets } from "@/feature/mandala/service/getSyncTargets";
import {
  getChangedCellId,
  getChangedCellIdFlat,
  normalizeToTrackId,
} from "@/feature/mandala/service/changedCellId";
import type {
  CellData,
  MandalaFlatType,
  ServerMandalaType,
} from "@/feature/mandala/service/type";

export type Status = "DONE" | "UNDONE";
export type EditingContext = "main" | "full" | "sub" | null;
export type CancelReason = "blur" | "escape" | "enter";

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
  flatData: MandalaFlatType;
  mandalartId: number | null;
  reminderOption: DataOption;
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
  isServiceIntroOpen: boolean;
  editingContext: string | null;
} & PersistedState;

type PersistedState = {
  data: MandalaType;
};

type Actions = {
  setData: (newData: ServerMandalaType["data"]) => void;
  getData: (index?: number | undefined) => MainGoal[] | SubGoal[];
  setMandalartId: (id: number) => void;
  allGoalComplete: (id: string) => void;
  toggleGoalStatus: (id: string) => void;
  handleCellChange: (
    cellId: string,
    value: string,
    queryData?: ServerMandalaType["data"]
  ) => void;
  initRecommendationTargets: (mainId: string) => void;
  resetRecommendationText: () => void;
  applyRecommendationChunk: (mainId: string, value: string) => void;
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
  setServiceIntroVisible: (visible: boolean) => void;
  setEditingContext: (state: EditingContext) => void;
  clearMandalart: () => void;
  cancelEditing: (
    reason: CancelReason,
    e?: React.SyntheticEvent,
    goalId?: string
  ) => void;
};

const initialState = {
  data: toLegacyStructure(emptyDummyData.data),
  flatData: toFlatStructure(emptyDummyData.data.core),
  mandalartId: null,
  editingCellId: null,
  editingSubCellId: null,
  editingFullCellId: null,
  modalCellId: null,
  changedCells: new Set<string>([]),
  isModalOpen: false,
  isReminderOpen: false,
  isFullOpen: false,
  isEmpty: true,
  emptySubIndexes: [],
  recommendationCursor: 0,
  currentRecommendationText: "",
  isServiceIntroOpen: false,
  reminderOption: {
    reminderEnabled: true,
    remindInterval: "3month",
    remindScheduledAt: null,
  },
  editingContext: "grid",
};

export const useMandalaStore = create<States & Actions>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setEditingContext: (state) => set(() => ({ editingContext: state })),
      getData: (index) => {
        if (index != null) {
          return get().data?.core?.mains?.[index]?.subs ?? [];
        }
        return (get().data && get().data?.core.mains) || [];
      },
      setData: (newData) =>
        set(() => ({
          data: toLegacyStructure(newData),
          flatData: toFlatStructure(newData.core),
        })),
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
          reminderOption: {
            ...state.reminderOption,
            reminderEnabled: enabled,
          },
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
          };
        }),
      cancelEditing: (reason, e, goalId) =>
        set((state) => {
          if (reason === "blur") {
            const next = (e as React.FocusEvent)
              ?.relatedTarget as HTMLElement | null;

            if (get().editingCellId !== goalId) return;
            if (next?.closest("[data-editable-cell]")) return;
          }

          state.editingCellId = null;
          state.editingSubCellId = null;
          state.editingFullCellId = null;
        }),
      handleCellChange: (cellId, value, queryData) =>
        set((state) => {
          console.log("Store handleCellChange:", cellId, value, queryData);
          if (cellId == null) return state;
          if (!state.data) return state;
          if (!state.data.core.mains) return state;
          const coreList = state.data.core;

          const findIndex = parseCellId(cellId);
          const targets = getSyncTargets(findIndex);

          if (targets == null || targets?.length <= 0) return state;
          targets.forEach((target) => {
            if (target.mainIndex === 0 && "subIndex" in target === false) {
              state.data.core.content = value;
            }
            if ("subIndex" in target) {
              // sub 업데이트
              state.data.core.mains[target.mainIndex].subs[
                target.subIndex as number
              ].content = value;
            } else {
              // main 업데이트
              state.data.core.mains[target.mainIndex].content = value;
            }
          });
          // flatData cells 업데이트 추가
          const nextCells = { ...state.flatData.cells };

          targets.forEach((target) => {
            const { mainIndex, subIndex } = target;
            console.log(mainIndex, subIndex);
            if (mainIndex === 0 && !subIndex) {
              state.flatData.cells["core-0"] = {
                ...state.flatData.cells["core-0"],
                content: value,
              };
            }
            if (subIndex) {
              const cellId = "sub-" + mainIndex + "-" + subIndex;
              state.flatData.cells[cellId] = {
                ...state.flatData.cells[cellId],
                content: value,
              };
            } else if (mainIndex) {
              const cellId = "main-" + mainIndex;
              state.flatData.cells[cellId] = {
                ...state.flatData.cells[cellId],
                content: value,
              };
            }
          });
          console.log(queryData);
          if (queryData) {
            const nextChangedCells = new Set(state.changedCells);
            const mains = [];

            const updatedCellId = getChangedCellIdFlat({
              cellId,
              rawData: queryData,
              cells: state.flatData.cells,
            });

            // const updatedCellId = getChangedCellId({
            //   cellId,
            //   rawData: queryData,
            //   updatedData: state.data.core.mains,
            // });
            console.log(state.changedCells, updatedCellId);

            if (updatedCellId) {
              state.changedCells.add(updatedCellId);
            } else {
              const trackId = normalizeToTrackId(cellId);
              if (trackId) state.changedCells.delete(trackId);
            }
          }
        }),
      initRecommendationTargets: (mainId) =>
        set((state) => {
          const subIds = state.flatData.layout.subs[mainId];
          if (!subIds) return;

          const emptyIndexes = subIds
            .map((subId, index) => {
              const sub = state.flatData.cells[subId];

              return sub.position !== 0 && !sub?.content.trim() ? index : null;
            })
            .filter((v): v is number => v !== null);
          state.emptySubIndexes = emptyIndexes;
          state.recommendationCursor = 0;
          // const mainId = subs[0].goalId.split("-")[1];
          // const mainIndex = state.data.core.mains.findIndex(
          //   (sub) => sub.goalId === `main-${mainId}`
          // );
          // if (mainIndex === -1) return state;
          // const subsArr = state.data.core.mains[mainIndex].subs;

          // const emptyIndexes = subsArr
          //   .map((sub, index) =>
          //     sub.position !== 0 && !sub.content.trim() ? index : null
          //   )
          //   .filter((v): v is number => v !== null);

          // return {
          //   ...state,
          //   emptySubIndexes: emptyIndexes,
          //   recommendationCursor: 0,
          // };
        }),
      resetRecommendationText: () =>
        set(() => ({
          currentRecommendationText: "",
        })),
      applyRecommendationChunk: (mainId, chunk) =>
        set((state) => {
          const cursor = state.recommendationCursor;
          const subIds = state.flatData.layout.subs[mainId];
          // const targetIndex = state.emptySubIndexes[cursor];
          const targetSubId = subIds?.[state.emptySubIndexes[cursor]];
          if (!targetSubId) return;

          // if (targetIndex == null) return state;

          // const mainId = subs[0].goalId.split("-")[1];
          // const mainIndex = state.data.core.mains.findIndex(
          //   (sub) => sub.goalId === `main-${mainId}`
          // );
          // if (mainIndex === -1) return state;

          // const subsArr = state.data.core.mains[mainIndex].subs;
          // const target = subsArr[targetIndex];

          const hasComma = chunk.includes(",");
          // let newText = state.currentRecommendationText;

          if (hasComma) {
            state.currentRecommendationText = "";
            state.recommendationCursor = cursor + 1;
            //   return {
            //     ...state,
            //     recommendationCursor: cursor + 1,
            //     currentRecommendationText: "",
            //   };
          } else {
            const newText = state.currentRecommendationText + chunk;
            state.flatData.cells[targetSubId].content = newText;
            state.currentRecommendationText = newText;
            state.changedCells.add(targetSubId);

            //   newText = state.currentRecommendationText + chunk;
            //   const newSubs = [...subsArr];
            //   newSubs[targetIndex] = { ...target, content: newText };

            //   return {
            //     ...state,
            //     data: {
            //       ...state.data,
            //       core: {
            //         ...state.data.core,
            //         mains: state.data.core.mains.map((main, index) =>
            //           index === mainIndex ? { ...main, subs: newSubs } : main
            //         ),
            //       },
            //     },
            //     currentRecommendationText: newText,
            //     changedCells: new Set([...state.changedCells, target.goalId]),
            //   };
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
      setServiceIntroVisible: (visible) =>
        set(() => ({ isServiceIntroOpen: visible })),

      resetChangedCells: () => set(() => ({ changedCells: new Set([]) })),
      clearMandalart: () =>
        set(() => ({
          ...initialState,
        })),
    })),
    {
      name: "mandalart",
      partialize: (state): PersistedState => ({
        data: state.data,
      }),
      version: 2,
      // version 1 → 2 마이그레이션: UI 상태 persist 제거
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          const {
            modalCellId,
            isModalOpen,
            isReminderOpen,
            isFullOpen,
            ...rest
          } = persistedState;
          return rest;
        }
        return persistedState;
      },
    }
  )
);
