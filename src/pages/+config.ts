// pages/+config.ts
import type { Config } from "vike/types";
import vikeReact from "vike-react/config";

export default {
  extends: vikeReact,
  prerender: true,
  hydrationCanBeAborted: true,
  htmlAttributes: {
    "data-theme": "spring", // 기본값
  },
} satisfies Config;
