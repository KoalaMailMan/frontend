import { useEffect, useState } from "react";

// 모바일 이미지 최적화
// @ts-expect-error -- vite-imagetools query import
import RED_MO_BG from "@/assets/background/background_red.jpg?width=320;640;768;1200&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import PURPLE_MO_BG from "@/assets/background/background_purple.jpg?width=320;640;768;1200&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import BLUE_MO_BG from "@/assets/background/background_blue.jpg?width=320;640;768;1200&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import GREEN_MO_BG from "@/assets/background/background_green.jpg?width=320;640;768;1200&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import YELLOW_MO_BG from "@/assets/background/background_yellow.jpg?width=320;640;768;1200&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import PINK_MO_BG from "@/assets/background/background_pink.jpg?width=320;640;768;1200&format=webp&as=srcset";

// 데스크탑 이미지 최적화
// @ts-expect-error -- vite-imagetools query import
import RED_BG from "@/assets/background/background_red.jpg?width=800;1200;1600;1920&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import PURPLE_BG from "@/assets/background/background_purple.jpg?width=800;1200;1600;1920&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import BLUE_BG from "@/assets/background/background_blue.jpg?width=800;1200;1600;1920&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import GREEN_BG from "@/assets/background/background_green.jpg?width=800;1200;1600;1920&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import YELLOW_BG from "@/assets/background/background_yellow.jpg?width=800;1200;1600;1920&format=webp&as=srcset";
// @ts-expect-error -- vite-imagetools query import
import PINK_BG from "@/assets/background/background_pink.jpg?width=800;1200;1600;1920&format=webp&as=srcset";

export type ThemeColor =
  | "purple"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "pink";

const THEME_STORAGE_KEY = "koalart_theme";

const themeColors = {
  purple: "#86569d",
  red: "#ff5042",
  blue: "#40bbed",
  green: "#3aab63",
  yellow: "#ffe849",
  pink: "#e17aaa",
};
const modalThemeColors = {
  purple: "#86569d",
  red: "#df6556",
  blue: "#40bbed",
  green: "#3aab63",
  yellow: "#ffe849",
  pink: "#e17aaa",
};
const modalBorderThemeColors = {
  red: "#a80d00",
  purple: "#86569d",
  blue: "#40bbed",
  green: "#3aab63",
  yellow: "#ffe849",
  pink: "#e17aaa",
};
const recommendButtonThemeColors = {
  red: "#ff7f75",
  purple: "#86569d",
  blue: "#40bbed",
  green: "#3aab63",
  yellow: "#ffe849",
  pink: "#e17aaa",
};

const themeBackgrounds = {
  purple: PURPLE_BG,
  red: RED_BG,
  blue: BLUE_BG,
  green: GREEN_BG,
  yellow: YELLOW_BG,
  pink: PINK_BG,
};
const themeMOBackgrounds = {
  purple: PURPLE_MO_BG,
  red: RED_MO_BG,
  blue: BLUE_MO_BG,
  green: GREEN_MO_BG,
  yellow: YELLOW_MO_BG,
  pink: PINK_MO_BG,
};

export default function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (!window) return "red";
    const saveColor = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeColor;
    return saveColor && themeColors[saveColor] ? saveColor : "red";
  });

  useEffect(() => {
    // if()
    updateCurrentTheme(currentTheme);
  }, [currentTheme]);

  const updateCSSVar = (theme: ThemeColor) => {
    if (typeof window === "undefined") return;
    if (!theme) return;

    const root = document.documentElement;
    const color = themeColors[theme] ? themeColors[theme] : themeColors["red"];
    const modalColor = modalThemeColors[theme]
      ? modalThemeColors[theme]
      : modalThemeColors["red"];
    const modalBorderColor = modalBorderThemeColors[theme]
      ? modalBorderThemeColors[theme]
      : modalBorderThemeColors["red"];
    const recommendBtnColor = recommendButtonThemeColors[theme]
      ? recommendButtonThemeColors[theme]
      : recommendButtonThemeColors["red"];

    root.style.setProperty("--current-theme", color);

    root.style.setProperty(
      "--current-theme-lighter",
      `color-mix(in srgb, ${color} 5%, white);`
    );
    root.style.setProperty(
      "--current-theme-light",
      `color-mix(in srgb, ${color} 10%, white);`
    );
    root.style.setProperty(
      "--current-theme-dark",
      `color-mix(in srgb, ${color} 80%, black);`
    );
    root.style.setProperty(
      "--current-theme-darker",
      `color-mix(in srgb, ${color} 60%, black);`
    );

    // 모달 테마 CSS 변수 설정
    root.style.setProperty("--current-modal-theme", modalColor);
    root.style.setProperty(
      "--current-modal-theme-lighter",
      `color-mix(in srgb, ${modalColor} 5%, white)`
    );
    root.style.setProperty(
      "--current-modal-theme-light",
      `color-mix(in srgb, ${modalColor} 10%, white)`
    );
    root.style.setProperty(
      "--current-modal-theme-dark",
      `color-mix(in srgb, ${modalColor} 80%, black)`
    );
    root.style.setProperty(
      "--current-modal-theme-darker",
      `color-mix(in srgb, ${modalColor} 60%, black)`
    );
    // 모달 border 테마 CSS 변수 설정
    root.style.setProperty("--current-modal-outline-theme", modalBorderColor);
    root.style.setProperty(
      "--current-modal-outline-theme-lighter",
      `color-mix(in srgb, ${modalBorderColor} 5%, white)`
    );
    root.style.setProperty(
      "--current-modal-outline-theme-light",
      `color-mix(in srgb, ${modalBorderColor} 10%, white)`
    );
    root.style.setProperty(
      "--current-modal-outline-theme-dark",
      `color-mix(in srgb, ${modalBorderColor} 80%, black)`
    );
    root.style.setProperty(
      "--current-modal-outline-theme-darker",
      `color-mix(in srgb, ${modalBorderColor} 60%, black)`
    );
    // 목표 추천 버튼 테마 CSS 변수 설정
    root.style.setProperty("--current-recommend-btn-theme", recommendBtnColor);
    root.style.setProperty(
      "--current-recommend-btn-theme-lighter",
      `color-mix(in srgb, ${recommendBtnColor} 5%, white)`
    );
    root.style.setProperty(
      "--current-recommend-btn-theme-light",
      `color-mix(in srgb, ${recommendBtnColor} 10%, white)`
    );
    root.style.setProperty(
      "--current-recommend-btn-theme-dark",
      `color-mix(in srgb, ${recommendBtnColor} 80%, black)`
    );
    root.style.setProperty(
      "--current-recommend-btn-theme-darker",
      `color-mix(in srgb, ${recommendBtnColor} 60%, black)`
    );
  };
  const updateCurrentTheme = (theme: ThemeColor) => {
    if (typeof window === "undefined") return;
    if (!theme) return;

    const color = themeColors[theme] ? theme : "red";
    setCurrentTheme(color);
    updateCSSVar(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const getCurrentBackground = () => {
    return {
      mobile: themeMOBackgrounds[currentTheme],
      desktop: themeBackgrounds[currentTheme],
    };
  };

  const getCurrentThemeColor = (): ThemeColor => {
    return currentTheme;
  };
  const getModalThemeColors = () => {
    return modalThemeColors;
  };

  return {
    currentTheme,
    themeColors,
    themeBackgrounds,
    updateCurrentTheme,
    getCurrentBackground,
    getCurrentThemeColor,
    getModalThemeColors,
  };
}
