import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthState = "none" | "temporary" | "loggedIn";
type SocialProvider = "google" | "naver" | null;
type States = {
  accessToken: string | null;
  temporaryAuth: AuthState;
  user: {
    nickname: string;
    email: string;
  };
  isAuthOpen: boolean;
  authComponentText: string;
} & AuthPersistedState;

type Actions = {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  setTemporaryAuth: (state: AuthState) => void;
  setWasLoggedIn: (state: boolean) => void;
  setLastProvider: (state: SocialProvider) => void;
  setLastLoginTime: (state: string) => void;
  setUserInfo: (state: States["user"]) => void;
  setSeenReminder: (state: boolean) => void;
  setAuthOpen: (state: boolean) => void;
  setAuthText: (state: string) => void;
};

type AuthPersistedState = {
  wasLoggedIn: boolean;
  temporaryAuth: AuthState;
  lastProvider: SocialProvider;
  lastLoginTime?: string | null;
  hasSeenReminderSetup: boolean;
};

const AUTH_INFO = "AUTH_INFO";

export const useAuthStore = create<States & Actions>()(
  persist(
    (set, get) => ({
      accessToken: null,
      temporaryAuth: "none",
      wasLoggedIn: false,
      lastProvider: null,
      lastLoginTime: "",
      user: {
        nickname: "",
        email: "",
      },
      hasSeenReminderSetup: false,
      isAuthOpen: false,
      authComponentText: "",

      getAccessToken: () => get().accessToken,
      setAccessToken: (token: string | null) =>
        set(() => ({ accessToken: token })),
      setTemporaryAuth: (state: AuthState) =>
        set(() => ({ temporaryAuth: state })),
      setWasLoggedIn: (state: boolean) => set(() => ({ wasLoggedIn: state })),
      setLastProvider: (state: SocialProvider) =>
        set(() => ({ lastProvider: state })),
      setLastLoginTime: (state: string) =>
        set(() => ({ lastLoginTime: state })),
      setUserInfo: (state) => set(() => ({ user: state })),
      setSeenReminder: (state) => set(() => ({ hasSeenReminderSetup: state })),
      setAuthOpen: (state) => set(() => ({ isAuthOpen: state })),
      setAuthText: (state) => set(() => ({ authComponentText: state })),
    }),
    {
      name: AUTH_INFO,
      partialize: (state): AuthPersistedState => ({
        wasLoggedIn: state.wasLoggedIn,
        temporaryAuth: state.temporaryAuth,
        lastProvider: state.lastProvider,
        lastLoginTime: state.lastLoginTime,
        hasSeenReminderSetup: state.hasSeenReminderSetup,
      }),
      version: 2,

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
