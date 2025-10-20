import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import vitePrerender from "vite-plugin-prerender";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools(),
    vitePrerender({
      staticDir: path.join(__dirname, "dist"),
      routes: ["/"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  server: {
    host: true,
    port: 3000,
    // allowedHosts: [".ngrok-free.app"],
  },
});
