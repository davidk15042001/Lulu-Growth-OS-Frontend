/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ENABLE_LIVE_STREAM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
