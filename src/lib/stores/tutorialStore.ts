import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TutorialStateType =
  | "center-cell"
  | "main-cells"
  | "tutorial-arrow-button"
  | "recommendation-button"
  | "save-button"
  | "reminder-button";
type TutorialStages = Record<TutorialStateType, boolean>;

type States = {
  isOnboardingOpen: boolean;
  currentStage: TutorialStages;
} & PersistedState;

type Actions = {
  setOnboardingVisible: (visible: boolean) => void;
  setShowAgain: (state: boolean) => void;
  setCurrentStage: (className: TutorialStateType) => void;
  resetStage: () => void;
};

type PersistedState = {
  showAgain: boolean;
};

const TOTURIAL = "koala-postman-tutorial";

export const useTutorialStore = create<States & Actions>()(
  persist(
    (set, _) => ({
      isOnboardingOpen: false,
      showAgain: false,
      currentStage: {
        "center-cell": false,
        "main-cells": false,
        "tutorial-arrow-button": false,
        "recommendation-button": false,
        "save-button": false,
        "reminder-button": false,
      },

      setOnboardingVisible: (visible) =>
        set(() => ({ isOnboardingOpen: visible })),
      setShowAgain: (state) => set(() => ({ showAgain: state })),
      setCurrentStage: (className) =>
        set((state) => {
          return {
            ...state,
            currentStage: {
              ...state.currentStage,
              [className]: true,
            },
          };
        }),
      resetStage: () =>
        set(() => ({
          currentStage: {
            "center-cell": false,
            "main-cells": false,
            "tutorial-arrow-button": false,
            "recommendation-button": false,
            "save-button": false,
            "reminder-button": false,
          },
        })),
    }),
    {
      name: TOTURIAL,
      partialize: (state): PersistedState => ({
        showAgain: state.showAgain,
      }),
      version: 1,

      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof value === "string") {
            localStorage.setItem(name, value);
          } else {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
