import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
const config = {
  mode: "development",
  server: {
    port: 8080,
    host: true,
    proxy: {
      "/api/v1": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/socket.io": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  preview: {
    port: 8080,
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    cssMinify: false,
    terserOptions: { compress: false, mangle: false },
  },
  define: { "process.env.NODE_ENV": "'development'" },
  esbuild: { jsx: 'automatic' as const, jsxImportSource: "react" },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "./assets/*", dest: "assets" },
        {
          src: "./public/assets/{*,}",
          dest: path.join("dist", "public/assets"),
        },
        { src: "src/assets/*", dest: path.join("dist", "assets") },
      ],
      silent: true,
    }),
    tsconfigPaths(),
  ] as any[],
  resolve: {},
};
export default defineConfig(config);
