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
    },
  },
});
