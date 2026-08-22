import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Languages as LanguagesIcon } from "lucide-react";
import { createPortal } from "react-dom";
import {
  DEFAULT_LANGUAGE, getLanguage, isAvailableLanguageCode, isLanguageCode, LANGUAGE_STORAGE_KEY, languages,
  type LanguageCode,
} from "./languages";
const LANGUAGE_EVENT = "lulu-language-changed";
const LANGUAGE_LOADED_EVENT = "lulu-language-loaded";
const localeLoaders: Partial<Record<LanguageCode, () => Promise<Record<string, string>>>> = {
  en: () => import("./locales/en.json").then((module) => module.default),
  de: () => import("./locales/de.json").then((module) => module.default),
  "zh-CN": () => import("./locales/zh-CN.json").then((module) => module.default),
};
const runtimeOverrideLoaders: Partial<Record<LanguageCode, () => Promise<Record<string, string>>>> = {
  de: () => import("./runtime-overrides/de.json").then((module) => module.default),
  "zh-CN": () => import("./runtime-overrides/zh-CN.json").then((module) => module.default),
};
const loadedTables: Record<string, Record<string, string>> = {};
const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const dynamicPatterns = new WeakMap<Record<string, string>, Array<{ regex: RegExp; translation: string }>>();
const translatableAttributes = ["aria-label", "placeholder", "title"] as const;

function initialLanguage(): LanguageCode {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isAvailableLanguageCode(stored)) return stored;
    const cookie = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${LANGUAGE_STORAGE_KEY}=`))?.split("=")[1] ?? null;
    if (isAvailableLanguageCode(cookie)) return cookie;
    const documentLanguage = document.documentElement.lang || null;
    if (isAvailableLanguageCode(documentLanguage)) return documentLanguage;
  } catch { /* Browser storage may be unavailable. */ }
  const candidates = typeof navigator === "undefined" ? [] : [...navigator.languages, navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    if (isAvailableLanguageCode(candidate)) return candidate;
    const base = candidate.split("-")[0];
    const match = languages.find((language) => language.code === base && isAvailableLanguageCode(language.code));
    if (match) return match.code;
  }
  return DEFAULT_LANGUAGE;
}

function excluded(element: Element | null) {
  return !element || Boolean(element.closest("script,style,noscript,code,pre,svg,[translate='no'],[data-lulu-no-translate],.lulu-global-brand-host"));
}

function lookup(dictionary: Record<string, string>, source: string) {
  if (dictionary[source]) return dictionary[source];
  let patterns = dynamicPatterns.get(dictionary);
  if (!patterns) {
    patterns = Object.entries(dictionary).filter(([pattern]) => pattern.includes("{{")).map(([pattern, translation]) => ({
      regex: new RegExp(`^${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{\\\{\d+\\\}\\\}/g, "(.+?)")}$`),
      translation,
    }));
    dynamicPatterns.set(dictionary, patterns);
  }
  for (const { regex, translation } of patterns) {
    const match = source.match(regex);
    if (!match) continue;
    return translation.replace(/\{\{(\d+)\}\}/g, (_, index) => match[Number(index) + 1] ?? "");
  }
}

async function loadDictionary(language: LanguageCode) {
  if (loadedTables[language]) return loadedTables[language];
  const loader = localeLoaders[language];
  if (!loader) return loadedTables.en;
  const dictionary = await loader();
  const overrideLoader = runtimeOverrideLoaders[language];
  const overrides = overrideLoader ? await overrideLoader() : {};
  const merged = { ...dictionary, ...overrides };
  loadedTables[language] = merged;
  return merged;
}

function applyStaticTranslations(root: HTMLElement, language: LanguageCode, dictionary = loadedTables[language] ?? {}) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const text = node as Text;
    if (!excluded(text.parentElement)) {
      const current = text.data;
      const previousOriginal = originalText.get(text);
      const previousApplied = appliedText.get(text);
      const original = previousOriginal === undefined || (current !== previousOriginal && current !== previousApplied) ? current : previousOriginal;
      originalText.set(text, original);
      const key = original.trim();
      const translated = language === DEFAULT_LANGUAGE ? key : lookup(dictionary, key);
      const next = translated ? `${original.match(/^\s*/)?.[0] ?? ""}${translated}${original.match(/\s*$/)?.[0] ?? ""}` : original;
      text.data = next;
      appliedText.set(text, next);
    }
    node = walker.nextNode();
  }
  root.querySelectorAll("*").forEach((element) => {
    if (excluded(element)) return;
    for (const attribute of translatableAttributes) {
      const current = element.getAttribute(attribute);
      if (!current) continue;
      let originals = originalAttributes.get(element);
      let applied = appliedAttributes.get(element);
      const previousOriginal = originals?.get(attribute);
      const previousApplied = applied?.get(attribute);
      const original = previousOriginal === undefined || (current !== previousOriginal && current !== previousApplied) ? current : previousOriginal;
      if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
      if (!applied) { applied = new Map(); appliedAttributes.set(element, applied); }
      originals.set(attribute, original);
      const translated = language === DEFAULT_LANGUAGE ? original : lookup(dictionary, original.trim());
      const next = translated ?? original;
      element.setAttribute(attribute, next);
      applied.set(attribute, next);
    }
  });
}

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  useEffect(() => {
    const sync = () => setLanguage(initialLanguage());
    window.addEventListener(LANGUAGE_EVENT, sync);
    return () => window.removeEventListener(LANGUAGE_EVENT, sync);
  }, []);
  return language;
}

export function useTranslation() {
  const language = useLanguage();
  const [, refresh] = useState(0);
  useEffect(() => {
    const sync = () => refresh((value) => value + 1);
    window.addEventListener(LANGUAGE_LOADED_EVENT, sync);
    return () => window.removeEventListener(LANGUAGE_LOADED_EVENT, sync);
  }, []);
  return useCallback((key: string) => loadedTables[language]?.[key] ?? loadedTables.en?.[key] ?? key, [language]);
}

export function GlobalLanguageSwitcher() {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const current = getLanguage(language);

  useEffect(() => {
    let active = true;
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguage(language).direction;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(language)}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch { /* no persistence available */ }
    const root = document.getElementById("root");
    if (!root) return;
    const translate = () => applyStaticTranslations(root, language);
    void loadDictionary(language).then(() => {
      if (!active) return;
      translate();
      window.dispatchEvent(new Event(LANGUAGE_LOADED_EVENT));
    });
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(translate, 50);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...translatableAttributes] });
    return () => { active = false; observer.disconnect(); window.clearTimeout(timer.current); };
  }, [language]);

  const selectLanguage = (next: LanguageCode) => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
      document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(next)}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch { /* no persistence available */ }
    setOpen(false);
    window.location.reload();
  };

  return createPortal(<><div className="lulu-language-shell" data-lulu-no-translate="true" translate="no">
    {open && <div className="lulu-language-menu" role="menu" aria-label={t("Select language")}><div className="lulu-language-title">{t("Language")}</div><div className="lulu-language-list">{languages.map((option) => {
      const available = isAvailableLanguageCode(option.code);
      return <button className="lulu-language-option" type="button" role="menuitemradio" aria-checked={option.code === language} disabled={!available} key={option.code} onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (available) selectLanguage(option.code); }} onPointerDown={(event) => event.stopPropagation()}><span lang={option.code} dir={option.direction}>{option.nativeName}{!available && ` (${t("soon")})`}</span><small>{t(option.name)}</small>{option.code === language && <Check aria-hidden="true" size={15} />}</button>;
    })}</div></div>}
    <button className="lulu-language-launch" type="button" aria-label={t("Change language. Current language: {{0}}").replace("{{0}}", t(current.name))} aria-haspopup="menu" aria-expanded={open} title={t("Change language")} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen((value) => !value); }} onPointerDown={(event) => event.stopPropagation()}><LanguagesIcon aria-hidden="true" size={16} /><span>{current.shortCode}</span></button>
  </div><style>{styles}</style></>, document.body);
}

const styles = `.lulu-language-shell{all:initial;position:fixed;right:18px;bottom:68px;z-index:2147483002;direction:ltr;color:#171717;font:400 13px/1.35 Poppins,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lulu-language-shell *{box-sizing:border-box}.lulu-language-launch{display:flex;align-items:center;justify-content:center;gap:6px;min-width:56px;height:40px;border:1px solid #d6d6d1;border-radius:999px;background:#fff;color:#171717;padding:0 12px;box-shadow:0 10px 30px rgba(0,0,0,.16);font:700 12px/1 Poppins,ui-sans-serif,system-ui,sans-serif;cursor:pointer}.lulu-language-menu{position:absolute;right:0;bottom:48px;width:236px;overflow:hidden;border:1px solid #d6d6d1;border-radius:14px;background:#fff;box-shadow:0 18px 54px rgba(0,0,0,.22)}.lulu-language-title{padding:12px 13px 9px;border-bottom:1px solid #ecece8;color:#686864;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lulu-language-list{max-height:min(430px,calc(100vh - 150px));overflow-y:auto;padding:6px}.lulu-language-option{position:relative;display:grid;width:100%;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:1px 8px;border:0;border-radius:9px;background:transparent;color:#171717;padding:8px 30px 8px 9px;text-align:left;cursor:pointer}.lulu-language-option:hover,.lulu-language-option:focus-visible{background:#f2f2ef;outline:0}.lulu-language-option:disabled{color:#969690;cursor:not-allowed}.lulu-language-option:disabled:hover{background:transparent}.lulu-language-option[aria-checked=true]{background:#eaf7f3}.lulu-language-option>span{grid-column:1;font-size:13px;font-weight:650}.lulu-language-option>small{grid-column:1;color:#777772;font-size:10px}.lulu-language-option>svg{position:absolute;right:9px;top:50%;color:#087a5b;transform:translateY(-50%)}`;
