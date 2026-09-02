export const languages = [
  { code: "en", shortCode: "EN", name: "English", nativeName: "English", direction: "ltr" },
  { code: "de", shortCode: "DE", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "zh-CN", shortCode: "ZH", name: "Chinese", nativeName: "中文", direction: "ltr" },
] as const;

export const AVAILABLE_LANGUAGE_CODES = [
  "en",
  "de",
  "zh-CN",
] as const;

export type LanguageCode = (typeof languages)[number]["code"];
export type Language = (typeof languages)[number];

export const DEFAULT_LANGUAGE: LanguageCode = "en";
export const LANGUAGE_STORAGE_KEY = "lulu:language";

export function isLanguageCode(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export function isAvailableLanguageCode(value: string | null): value is (typeof AVAILABLE_LANGUAGE_CODES)[number] {
  return AVAILABLE_LANGUAGE_CODES.some((language) => language === value);
}

export function getLanguage(code: LanguageCode) {
  return languages.find((language) => language.code === code)!;
}
