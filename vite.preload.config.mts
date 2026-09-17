import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  // The preload bundle pulls in shared modules under src/ipc, which import
  // siblings by the "@/" alias the app and main configs already define. Without
  // the same alias here, any such import fails Rollup resolution and the
  // preload target silently builds broken — typecheck still passes, because
  // tsconfig resolves "@/" independently of Vite.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
