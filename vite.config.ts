import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    build: {
      minify: "esbuild",
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
          },
        },
      },
    },
    esbuild: {
      drop: mode === "production" ? ["console", "debugger"] : [], // 프로덕션에서 console, debugger 제거
    },
    plugins: [
      react(),
      tailwindcss(),
      imagetools({
        defaultDirectives: (url) => {
          const format = url.searchParams.get("format");

          // quality가 명시되지 않은 경우만 자동 적용
          if (!url.searchParams.has("quality")) {
            if (format === "webp") {
              url.searchParams.set("quality", "75");
            } else if (format === "avif") {
              url.searchParams.set("quality", "60");
            } else if (format === "jpg" || format === "jpeg") {
              url.searchParams.set("quality", "80");
            }
          }

          return url.searchParams;
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
        },
      },
      host: true,
      port: 3000,
      allowedHosts: [".ngrok-free.app"],
    },
  });
};
