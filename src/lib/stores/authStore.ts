import { create } from "zustand";
import { persist } from "zustand/middleware";

type SocialProvider = "google" | "naver" | null;

type States = {
  accessToken: string | null;
  user: {
    nickname: string;
    email: string;
  };
} & AuthPersistedState;

type Actions = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  setWasLoggedIn: (state: boolean) => void;
  setLastProvider: (state: SocialProvider) => void;
  setLastLoginTime: (state: string) => void;
  setUserInfo: (state: States["user"]) => void;
};

type AuthPersistedState = {
  wasLoggedIn: boolean;
  lastProvider: SocialProvider;
  lastLoginTime?: string | null;
};

const AUTH_INFO = "AUTH_INFO";

export const useAuthStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      accessToken: null,
      wasLoggedIn: false,
      lastProvider: null,
      lastLoginTime: "",
      user: {
        nickname: "",
        email: "",
      },
      getAccessToken: () => get().accessToken,
      setAccessToken: (token: string | null) =>
        set(() => ({ accessToken: token })),
      setWasLoggedIn: (state: boolean) => set(() => ({ wasLoggedIn: state })),
      setLastProvider: (state: SocialProvider) =>
        set(() => ({ lastProvider: state })),
      setLastLoginTime: (state: string) =>
        set(() => ({ lastLoginTime: state })),
      setUserInfo: (state) => set(() => ({ user: state })),
    }),
    {
      name: AUTH_INFO,
      partialize: (state): AuthPersistedState => ({
        wasLoggedIn: state.wasLoggedIn,
        lastProvider: state.lastProvider,
        lastLoginTime: state.lastLoginTime,
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
