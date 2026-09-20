import { defineConfig } from "vite";
import kapableComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import { nitro } from "nitro/vite";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  // nitro() MUST stay last: it installs an SPA fallback, and ahead of Vite's
  // module-transform middleware that fallback swallows Vite's own internal
  // URLs (/src/*.tsx, /@vite/client, /@react-refresh, /@fs/*) and answers them
  // with index.html, which breaks the dev preview.
  plugins: [kapableComponentTagger(), react(), nitro()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
