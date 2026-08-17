export const languages = [
  { code: "en", shortCode: "EN", name: "English", nativeName: "English", direction: "ltr" },
  { code: "de", shortCode: "DE", name: "German", nativeName: "Deutsch", direction: "ltr" },
  { code: "zh-CN", shortCode: "ZH", name: "Chinese", nativeName: "中文", direction: "ltr" },
  { code: "fr", shortCode: "FR", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "nl", shortCode: "NL", name: "Dutch", nativeName: "Nederlands", direction: "ltr" },
  { code: "pl", shortCode: "PL", name: "Polish", nativeName: "Polski", direction: "ltr" },
  { code: "nb", shortCode: "NO", name: "Norwegian", nativeName: "Norsk", direction: "ltr" },
  { code: "sv", shortCode: "SV", name: "Swedish", nativeName: "Svenska", direction: "ltr" },
  { code: "fi", shortCode: "FI", name: "Finnish", nativeName: "Suomi", direction: "ltr" },
  { code: "da", shortCode: "DA", name: "Danish", nativeName: "Dansk", direction: "ltr" },
  { code: "ar", shortCode: "AR", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "lb", shortCode: "LB", name: "Luxembourgish", nativeName: "Lëtzebuergesch", direction: "ltr" },
  { code: "mn", shortCode: "MN", name: "Mongolian", nativeName: "Монгол", direction: "ltr" },
  { code: "uk", shortCode: "UK", name: "Ukrainian", nativeName: "Українська", direction: "ltr" },
  { code: "ru", shortCode: "RU", name: "Russian", nativeName: "Русский", direction: "ltr" },
] as const;

export const AVAILABLE_LANGUAGE_CODES = [
  "en",
  "de",
  "zh-CN",
  "fr",
  "nl",
  "pl",
  "nb",
  "sv",
  "fi",
  "da",
  "ar",
  "lb",
  "mn",
  "uk",
  "ru",
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
