import PURPLE_BG from "../../assets/background_purple.png";
import RED_BG from "../../assets/background_red.png";
import BLUE_BG from "../../assets/background_blue.png";
import GREEN_BG from "../../assets/background_green.png";
import YELLOW_BG from "../../assets/background_yellow.png";
import PINK_BG from "../../assets/background_pink.png";
import { useEffect, useState } from "react";

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
  red: "#df6556",
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

export default function useTheme() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    if (!window) return "red";
    const saveColor = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeColor;
    return saveColor && themeColors[saveColor] ? saveColor : "red";
  });

  useEffect(() => {
    updateCurrentTheme(currentTheme);
  }, [currentTheme]);

  const updateCSSVar = (theme: ThemeColor) => {
    if (typeof window === "undefined") return;
    if (!theme) return;

    const root = document.documentElement;
    const color = themeColors[theme] ? themeColors[theme] : themeColors["red"];

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
    return themeBackgrounds[currentTheme];
  };

  return {
    currentTheme,
    themeColors,
    themeBackgrounds,
    updateCurrentTheme,
    getCurrentBackground,
  };
}
