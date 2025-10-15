import { useEffect, useState } from "react";
import { buildImageSrc } from "@/feature/mandala/utills/image";

// 이미지
import RED_IMAGE from "@/assets/background/background_red.png";
import PURPLE_IMAGE from "@/assets/background/background_purple.png";
import BLUE_IMAGE from "@/assets/background/background_blue.png";
import GREEN_IMAGE from "@/assets/background/background_green.png";
import YELLOW_IMAGE from "@/assets/background/background_yellow.png";
import PINK_IMAGE from "@/assets/background/background_pink.png";
import { useViewportStore } from "@/lib/stores/viewportStore";

// buildImageSrc 통한 모바일 이미지 최적화
const RED_MO_BG = buildImageSrc(RED_IMAGE, {
  width: "768",
  format: "webp",
});
const PURPLE_MO_BG = buildImageSrc(PURPLE_IMAGE, {
  width: "768",
  format: "webp",
});
const BLUE_MO_BG = buildImageSrc(BLUE_IMAGE, {
  width: "768",
  format: "webp",
});
const GREEN_MO_BG = buildImageSrc(GREEN_IMAGE, {
  width: "768",
  format: "webp",
});
const YELLOW_MO_BG = buildImageSrc(YELLOW_IMAGE, {
  width: "768",
  format: "webp",
});
const PINK_MO_BG = buildImageSrc(PINK_IMAGE, {
  width: "768",
  format: "webp",
});

// buildImageSrc 통한 데스크탑 이미지 최적화
const RED_BG = buildImageSrc(RED_IMAGE, {
  format: "webp",
});
const PURPLE_BG = buildImageSrc(PURPLE_IMAGE, {
  format: "webp",
});
const BLUE_BG = buildImageSrc(BLUE_IMAGE, {
  format: "webp",
});
const GREEN_BG = buildImageSrc(GREEN_IMAGE, {
  format: "webp",
});
const YELLOW_BG = buildImageSrc(YELLOW_IMAGE, {
  format: "webp",
});
const PINK_BG = buildImageSrc(PINK_IMAGE, {
  format: "webp",
});

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
    return {
      mobile: themeMOBackgrounds[currentTheme],
      desktop: themeBackgrounds[currentTheme],
    };
  };

  return {
    currentTheme,
    themeColors,
    themeBackgrounds,
    updateCurrentTheme,
    getCurrentBackground,
  };
}
