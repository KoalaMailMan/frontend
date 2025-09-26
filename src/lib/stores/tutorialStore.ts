import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = {
  isOnboardingOpen: boolean;
} & PersistedState;

type Actions = {
  setOnboardingVisible: (visible: boolean) => void;
  setShowAgain: (state: boolean) => void;
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

      setOnboardingVisible: (visible) =>
        set(() => ({ isOnboardingOpen: visible })),
      setShowAgain: (state) => set(() => ({ showAgain: state })),
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
