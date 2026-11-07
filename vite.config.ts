import { defineConfig } from "vite";

// Local: http://127.0.0.1:45321/
// GitHub Pages: https://leaf405-wq.github.io/deployment/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/deployment/" : "/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
  server: {
    host: "127.0.0.1",
    port: 45321,
  },
  preview: {
    host: "127.0.0.1",
    port: 45321,
  },
}));
