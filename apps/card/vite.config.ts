import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative base so the same build works on GitHub Pages, Vercel or any sub-path.
  base: "./",
  server: {
    port: 5178,
    fs: { allow: ["../.."] },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
