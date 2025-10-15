import { create } from "zustand";

type State = {
  width: number;
  height: number;
  isMobile: boolean;
};

type Action = {
  setViewport: (width: number, height: number) => void;
};

const getInitialWidth = () =>
  typeof window !== "undefined" ? window.innerWidth : 0;
const getInitialHeight = () =>
  typeof window !== "undefined" ? window.innerHeight : 0;

export const useViewportStore = create<State & Action>((set) => ({
  width: getInitialWidth(),
  height: getInitialHeight(),
  isMobile: getInitialWidth() <= 768,
  setViewport: (width, height) =>
    set({
      width,
      height,
      isMobile: width <= 768,
    }),
}));
