import { create } from "zustand";
import { persist } from "zustand/middleware";

type States = {
  recommendation: string[] | null;
  error: string | null;
  isStreaming: boolean;
} & PersistedState;

type Actions = {
  setRecommendation: (data: string | string[]) => void;
  setError: (error: string) => void;
  setStreaming: (state: boolean) => void;
  clearRecommendations: () => void;
};

type PersistedState = {};

const TOTURIAL = "koala-postman-tutorial";

export const useStreamStore = create<States & Actions>()(
  persist(
    (set, _) => ({
      recommendation: null,
      error: null,
      isStreaming: false,

      setRecommendation: (data) =>
        set(() => {
          if (typeof data === "string") {
            return { recommendation: [data] };
          }
          return { recommendation: data };
        }),
      setError: (error) => set(() => ({ error: error })),
      setStreaming: (state) => set(() => ({ isStreaming: state })),
      clearRecommendations: () => set(() => ({ error: null })),
    }),
    {
      name: TOTURIAL,
      partialize: (state): PersistedState => ({}),
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
