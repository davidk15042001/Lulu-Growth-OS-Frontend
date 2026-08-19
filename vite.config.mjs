import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = process.cwd();
const entryRoot = resolve(root, "entries");
const pageInputs = Object.fromEntries(
  readdirSync(entryRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => [`page-${entry.name}`, resolve(entryRoot, entry.name, "index.html")]),
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        app: resolve(root, "index.html"),
        ...pageInputs,
      },
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) return "vendor";
          const localeRoot = `${resolve(root, "src")}/i18n/locales/`;
          if (id.includes(localeRoot)) {
            const localeName = id.slice(localeRoot.length).split("/")[0].replace(/\.json$/, "");
            if (localeName) return `locale-${localeName}`;
          }
          if (id.includes(`${resolve(root, "src")}/i18n/`) || id.includes("translations.json")) return "i18n-runtime";
          const pageRoot = `${resolve(root, "src")}/pages/`;
          if (id.includes(pageRoot)) {
            const pageName = id.slice(pageRoot.length).split("/")[0];
            if (pageName) return `page-${pageName}`;
          }
          return undefined;
        },
      },
    },
  },
});
