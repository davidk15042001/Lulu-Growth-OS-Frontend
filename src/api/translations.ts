import type { LanguageCode } from "../i18n/languages";
import { requestApi } from "./client";

export type TranslationBatch = {
  targetLanguage: LanguageCode;
  translations: string[];
  cached: number;
  generated: number;
};

export function translateBatch(targetLanguage: LanguageCode, strings: string[], signal?: AbortSignal) {
  return requestApi<TranslationBatch>({
    path: "/translations",
    method: "POST",
    body: { sourceLanguage: "en", targetLanguage, strings },
    signal,
  });
}
