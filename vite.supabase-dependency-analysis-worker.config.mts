import { builtinModules } from "node:module";
import { defineConfig } from "vite";
import path from "node:path";

const nodeBuiltins = builtinModules.flatMap((name) => [name, `node:${name}`]);

export default defineConfig({
  // Every other Vite config defines this. Without it, the first "@/" import
  // that reaches this worker fails Rollup resolution while typecheck still
  // passes, because tsconfig resolves "@/" independently of Vite.
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(
        __dirname,
        "workers/supabase_dependency_analysis/supabase_dependency_analysis_worker.ts",
      ),
      name: "supabase_dependency_analysis_worker",
      fileName: "supabase_dependency_analysis_worker",
      formats: ["cjs"],
    },
    rollupOptions: {
      external: [...nodeBuiltins, "@typescript/typescript6"],
    },
  },
});
