import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";
const config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  server: {
    port: 8080,
    host: true,
    proxy: process.env.NODE_ENV === "production" ? {
      "/api/v1": {
        target: "https://manga-wellness-backend-rsijjqxv6a-el.a.run.app",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      "/socket.io": {
        target: "https://manga-wellness-backend-rsijjqxv6a-el.a.run.app",
        changeOrigin: true,
        ws: true,
        secure: true,
      },
    } : undefined,
  },
  preview: {
    port: 8080,
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    cssMinify: true,
  },
  define: { "process.env.NODE_ENV": "'production'" },
  esbuild: { jsx: 'automatic' as const, jsxImportSource: "react" },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "./public/audio/*", dest: "audio" },
        { src: "./public/images/*", dest: "images" },
        { src: "./src/assets/*", dest: "assets" },
      ],
      silent: true,
    }),
    tsconfigPaths(),
  ] as any[],
  resolve: {},
};
export default defineConfig(config);
