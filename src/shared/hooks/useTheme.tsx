import { useEffect, useState } from "react";
import type { ThemeColor } from "@/data/themes";

import { findInTheFourSeasons } from "../utils/weather";
import {
  modalBorderThemeColors,
  modalThemeColors,
  recommendButtonThemeColors,
  themeBackgrounds,
  themeBackgroundsSrcSet,
  themeColors,
} from "./const/theme";

const THEME_STORAGE_KEY = "koalart_theme";

export default function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (typeof window === "undefined") return findInTheFourSeasons();
    const saveColor = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeColor;
    return saveColor && themeColors[saveColor]
      ? saveColor
      : findInTheFourSeasons();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    updateCurrentTheme(currentTheme);
  }, [currentTheme]);

  const updateCSSVar = (theme: ThemeColor) => {
    if (typeof window === "undefined") return;
    if (!theme) return;
    const root = document.documentElement;
    const color = themeColors[theme]
      ? themeColors[theme]
      : themeColors[findInTheFourSeasons()];
    const modalColor = modalThemeColors[theme]
      ? modalThemeColors[theme]
      : modalThemeColors[findInTheFourSeasons()];
    const modalBorderColor = modalBorderThemeColors[theme]
      ? modalBorderThemeColors[theme]
      : modalBorderThemeColors[findInTheFourSeasons()];
    const recommendBtnColor = recommendButtonThemeColors[theme]
      ? recommendButtonThemeColors[theme]
      : recommendButtonThemeColors[findInTheFourSeasons()];

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
    const color = themeColors[theme] ? theme : findInTheFourSeasons();
    setCurrentTheme(color);
    updateCSSVar(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const getCurrentBackground = () => {
    return {
      backgroundImage: themeBackgrounds[currentTheme],
      srcSet: themeBackgroundsSrcSet[currentTheme],
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
