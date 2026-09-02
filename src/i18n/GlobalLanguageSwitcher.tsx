import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Languages as LanguagesIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import deCoreLocaleUrl from "./namespaces/locales/core/de.json?url";
import enCoreLocaleUrl from "./namespaces/locales/core/en.json?url";
import zhCnCoreLocaleUrl from "./namespaces/locales/core/zh-CN.json?url";
import deWorkspaceShellLocaleUrl from "./namespaces/locales/workspace-shell/de.json?url";
import enWorkspaceShellLocaleUrl from "./namespaces/locales/workspace-shell/en.json?url";
import zhCnWorkspaceShellLocaleUrl from "./namespaces/locales/workspace-shell/zh-CN.json?url";
import deCoreRuntimeOverrideUrl from "./namespaces/runtime-overrides/core/de.json?url";
import enCoreRuntimeOverrideUrl from "./namespaces/runtime-overrides/core/en.json?url";
import zhCnCoreRuntimeOverrideUrl from "./namespaces/runtime-overrides/core/zh-CN.json?url";
import deWorkspaceShellRuntimeOverrideUrl from "./namespaces/runtime-overrides/workspace-shell/de.json?url";
import enWorkspaceShellRuntimeOverrideUrl from "./namespaces/runtime-overrides/workspace-shell/en.json?url";
import zhCnWorkspaceShellRuntimeOverrideUrl from "./namespaces/runtime-overrides/workspace-shell/zh-CN.json?url";
import {
  DEFAULT_LANGUAGE, getLanguage, isAvailableLanguageCode, isLanguageCode, LANGUAGE_STORAGE_KEY, languages,
  type LanguageCode,
} from "./languages";
import { routes } from "../routing";
const LANGUAGE_EVENT = "lulu-language-changed";
const LANGUAGE_LOADED_EVENT = "lulu-language-loaded";
type TranslationNamespace = string;

const localeStaticNamespaceAssetUrls: Partial<Record<LanguageCode, Record<string, string>>> = {
  en: { core: enCoreLocaleUrl, "workspace-shell": enWorkspaceShellLocaleUrl },
  de: { core: deCoreLocaleUrl, "workspace-shell": deWorkspaceShellLocaleUrl },
  "zh-CN": { core: zhCnCoreLocaleUrl, "workspace-shell": zhCnWorkspaceShellLocaleUrl },
};
const runtimeOverrideStaticNamespaceAssetUrls: Partial<Record<LanguageCode, Record<string, string>>> = {
  en: { core: enCoreRuntimeOverrideUrl, "workspace-shell": enWorkspaceShellRuntimeOverrideUrl },
  de: { core: deCoreRuntimeOverrideUrl, "workspace-shell": deWorkspaceShellRuntimeOverrideUrl },
  "zh-CN": { core: zhCnCoreRuntimeOverrideUrl, "workspace-shell": zhCnWorkspaceShellRuntimeOverrideUrl },
};
const loadedTables: Record<string, Record<string, string>> = {};
const loadedNamespaceTables: Partial<Record<LanguageCode, Record<string, Record<string, string>>>> = {};
const loadingNamespaceTables = new Map<string, Promise<Record<string, string>>>();
const pageLocaleAssetUrls = import.meta.glob("./namespaces/locales/pages/*/*.json", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const pageRuntimeOverrideAssetUrls = import.meta.glob("./namespaces/runtime-overrides/pages/*/*.json", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;
const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();
const dynamicPatterns = new WeakMap<Record<string, string>, Array<{ regex: RegExp; translation: string }>>();
const translatableAttributes = ["aria-label", "placeholder", "title"] as const;
let translationWriteDepth = 0;

function withTranslationWrite<T>(callback: () => T): T {
  translationWriteDepth += 1;
  try {
    return callback();
  } finally {
    translationWriteDepth = Math.max(0, translationWriteDepth - 1);
  }
}

function applyTranslationsToSubtree(root: Node, dictionary: Record<string, string>) {
  const translateElementAttributes = (element: Element) => {
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
      const translated = lookup(dictionary, original.trim());
      const next = translated ?? original;
      if (next === current) {
        applied.set(attribute, next);
        continue;
      }
      withTranslationWrite(() => element.setAttribute(attribute, next));
      applied.set(attribute, next);
    }
  };

  if (root.nodeType === Node.TEXT_NODE) {
    const text = root as Text;
    if (!excluded(text.parentElement)) {
      const current = text.data;
      const previousOriginal = originalText.get(text);
      const previousApplied = appliedText.get(text);
      const original = previousOriginal === undefined || (current !== previousOriginal && current !== previousApplied) ? current : previousOriginal;
      originalText.set(text, original);
      const key = original.trim();
      const translated = lookup(dictionary, key);
      const next = translated ? `${original.match(/^\s*/)?.[0] ?? ""}${translated}${original.match(/\s*$/)?.[0] ?? ""}` : original;
      if (next === current) {
        appliedText.set(text, next);
        return;
      }
      withTranslationWrite(() => { text.data = next; });
      appliedText.set(text, next);
    }
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE) return;

  const element = root as Element;
  translateElementAttributes(element);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node: Node | null = walker.currentNode;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node as Text;
      if (!excluded(text.parentElement)) {
        const current = text.data;
        const previousOriginal = originalText.get(text);
        const previousApplied = appliedText.get(text);
        const original = previousOriginal === undefined || (current !== previousOriginal && current !== previousApplied) ? current : previousOriginal;
        originalText.set(text, original);
        const key = original.trim();
        const translated = lookup(dictionary, key);
        const next = translated ? `${original.match(/^\s*/)?.[0] ?? ""}${translated}${original.match(/\s*$/)?.[0] ?? ""}` : original;
        if (next === current) {
          appliedText.set(text, next);
          node = walker.nextNode();
          continue;
        }
        withTranslationWrite(() => { text.data = next; });
        appliedText.set(text, next);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node !== element) {
      translateElementAttributes(node as Element);
    }
    node = walker.nextNode();
  }
}

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

async function loadJsonTable(url: string) {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Could not load translation table: ${response.status}`);
  return response.json() as Promise<Record<string, string>>;
}

function pageSlugForPath(pathname: string) {
  const pageSlugsByPath: Record<string, string> = {
    [routes.auth.login]: "brightly-door-5741",
    [routes.auth.signUp]: "finely-year-1146",
    [routes.auth.forgotPassword]: "crisp-garden-7026",
    [routes.auth.verificationEmail]: "crisp-week-7116",
    [routes.auth.verifyEmail]: "eagerly-bay-9885",
    [routes.auth.resetPassword]: "deep-coast-9085",
    [routes.auth.sessionExpired]: "kind-morning-4984",
    [routes.auth.signedOut]: "mightily-minute-5145",
    [routes.onboarding.companyInformation]: "bravely-path-4713",
    [routes.onboarding.businessDescription]: "quiet-garden-9477",
    [routes.onboarding.productsServices]: "keen-morning-6353",
    [routes.onboarding.existingPlatforms]: "fresh-tide-9404",
    [routes.app.website]: "lulu-website-portal-9012",
    [routes.app.email]: "lulu-email-portal-9013",
    [routes.app.calendar]: "lulu-calendar-portal-9014",
  };
  if (pageSlugsByPath[pathname]) return pageSlugsByPath[pathname];
  if (!pathname.startsWith("/app/")) return null;
  const slug = pathname.slice("/app/".length).split("/")[0];
  return slug || null;
}

function pageNamespacesForPortalSection(pathname: string, search: string) {
  const section = new URLSearchParams(search).get("section") ?? "";
  if (!section) return [] as string[];
  if (pathname === routes.app.website) return [section, `website-${section}`];
  if (pathname === routes.app.email) return [`email-${section || "inbox"}`];
  if (pathname === routes.app.calendar) return [`calendar-${section || "overview"}`];
  return [] as string[];
}

function requiredNamespaces(pathname: string, search: string): TranslationNamespace[] {
  const namespaces = new Set<TranslationNamespace>(["core"]);
  const slug = pageSlugForPath(pathname);
  const usesWorkspaceShell = pathname.startsWith("/app/") || pathname === routes.onboarding.billing || pathname === routes.onboarding.billings;
  if (usesWorkspaceShell) namespaces.add("workspace-shell");
  if (slug) namespaces.add(`page:${slug}`);
  for (const pageSlug of pageNamespacesForPortalSection(pathname, search)) {
    namespaces.add(`page:${pageSlug}`);
  }
  return [...namespaces];
}

function namespaceAssetUrl(
  assetUrls: Partial<Record<LanguageCode, Record<string, string>>>,
  pageAssetUrls: Record<string, string>,
  language: LanguageCode,
  namespace: TranslationNamespace,
) {
  if (namespace.startsWith("page:")) {
    const slug = namespace.slice("page:".length);
    const assetPrefix = assetUrls === localeStaticNamespaceAssetUrls ? "locales" : "runtime-overrides";
    return pageAssetUrls[`./namespaces/${assetPrefix}/pages/${slug}/${language}.json`] ?? null;
  }
  return assetUrls[language]?.[namespace] ?? null;
}

function mergeLoadedNamespaces(language: LanguageCode) {
  const namespaceTables = loadedNamespaceTables[language];
  if (!namespaceTables) return loadedTables[language] ?? {};
  const merged = Object.values(namespaceTables).reduce<Record<string, string>>(
    (accumulator, table) => ({ ...accumulator, ...table }),
    {},
  );
  loadedTables[language] = merged;
  return merged;
}

async function loadNamespace(language: LanguageCode, namespace: TranslationNamespace) {
  const cached = loadedNamespaceTables[language]?.[namespace];
  if (cached) return cached;
  const localeUrl = namespaceAssetUrl(localeStaticNamespaceAssetUrls, pageLocaleAssetUrls, language, namespace);
  if (!localeUrl) return {};
  const cacheKey = `${language}:${namespace}`;
  const existingLoad = loadingNamespaceTables.get(cacheKey);
  if (existingLoad) return existingLoad;
  const runtimeOverrideUrl = namespaceAssetUrl(runtimeOverrideStaticNamespaceAssetUrls, pageRuntimeOverrideAssetUrls, language, namespace);
  const loadPromise = Promise.all([
    loadJsonTable(localeUrl),
    runtimeOverrideUrl
      ? loadJsonTable(runtimeOverrideUrl)
      : Promise.resolve({}),
  ]).then(([dictionary, overrides]) => {
    const merged = { ...dictionary, ...overrides };
    loadedNamespaceTables[language] = {
      ...(loadedNamespaceTables[language] ?? {}),
      [namespace]: merged,
    };
    mergeLoadedNamespaces(language);
    loadingNamespaceTables.delete(cacheKey);
    return merged;
  }).catch((error) => {
    loadingNamespaceTables.delete(cacheKey);
    throw error;
  });
  loadingNamespaceTables.set(cacheKey, loadPromise);
  return loadPromise;
}

async function ensureNamespaces(language: LanguageCode, namespaces: TranslationNamespace[]) {
  await Promise.all(namespaces.map((namespace) => loadNamespace(language, namespace)));
  return mergeLoadedNamespaces(language);
}

function applyStaticTranslations(root: HTMLElement, language: LanguageCode, dictionary = loadedTables[language] ?? {}) {
  applyTranslationsToSubtree(root, dictionary);
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

export function switchLanguage(next: LanguageCode) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(next)}; Max-Age=31536000; Path=/; SameSite=Lax`;
  } catch { /* no persistence available */ }
  window.dispatchEvent(new CustomEvent(LANGUAGE_EVENT, { detail: { language: next } }));
}

export function GlobalLanguageSwitcher({ showButton = true }: { showButton?: boolean } = {}) {
  const location = useLocation();
  const language = useLanguage();
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const current = getLanguage(language);
  const isWorkspaceApp = location.pathname.startsWith("/app/");
  const namespaces = useMemo(() => requiredNamespaces(location.pathname, location.search), [location.pathname, location.search]);

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
    void ensureNamespaces(language, namespaces).then(() => {
      if (!active) return;
      translate();
      window.dispatchEvent(new Event(LANGUAGE_LOADED_EVENT));
    });
    const observer = new MutationObserver((mutations) => {
      if (translationWriteDepth > 0) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        if (translationWriteDepth > 0) return;
        const dictionary = loadedTables[language] ?? {};
        const seen = new Set<Node>();
        for (const mutation of mutations) {
          if (mutation.type === "characterData" && mutation.target) {
            applyTranslationsToSubtree(mutation.target, dictionary);
            continue;
          }
          if (mutation.type === "attributes" && mutation.target instanceof Element) {
            applyTranslationsToSubtree(mutation.target, dictionary);
          }
          mutation.addedNodes.forEach((node) => {
            if (seen.has(node)) return;
            seen.add(node);
            applyTranslationsToSubtree(node, dictionary);
          });
        }
      }, 50);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...translatableAttributes] });
    return () => { active = false; observer.disconnect(); window.clearTimeout(timer.current); };
  }, [language, namespaces]);

  const selectLanguage = (next: LanguageCode) => {
    setOpen(false);
    switchLanguage(next);
  };

  if (!showButton) return null;

  return createPortal(<><div className={`lulu-language-shell${isWorkspaceApp ? " lulu-language-shell--workspace" : ""}`} data-lulu-no-translate="true" translate="no">
    {open && <div className="lulu-language-menu" role="menu" aria-label={t("Select language")}><div className="lulu-language-title">{t("Language")}</div><div className="lulu-language-list">{languages.map((option) => {
      const available = isAvailableLanguageCode(option.code);
      return <button className="lulu-language-option" type="button" role="menuitemradio" aria-checked={option.code === language} disabled={!available} key={option.code} onClick={(event) => { event.preventDefault(); event.stopPropagation(); if (available) selectLanguage(option.code); }} onPointerDown={(event) => event.stopPropagation()}><span lang={option.code} dir={option.direction}>{option.nativeName}{!available && ` (${t("soon")})`}</span><small>{t(option.name)}</small>{option.code === language && <Check aria-hidden="true" size={15} />}</button>;
    })}</div></div>}
    <button className="lulu-language-launch" type="button" aria-label={t("Change language. Current language: {{0}}").replace("{{0}}", t(current.name))} aria-haspopup="menu" aria-expanded={open} title={t("Change language")} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen((value) => !value); }} onPointerDown={(event) => event.stopPropagation()}><LanguagesIcon aria-hidden="true" size={16} /><span>{current.shortCode}</span></button>
  </div><style>{styles}</style></>, document.body);
}

const styles = `.lulu-language-shell{all:initial;position:fixed;right:max(18px,env(safe-area-inset-right));bottom:max(18px,env(safe-area-inset-bottom));z-index:2147483002;direction:ltr;color:#171717;font:400 13px/1.35 Poppins,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lulu-language-shell *{box-sizing:border-box}.lulu-language-shell--workspace{right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom))}.lulu-language-launch{display:flex;align-items:center;justify-content:center;gap:6px;min-width:56px;height:40px;border:1px solid #d6d6d1;border-radius:999px;background:#fff;color:#171717;padding:0 12px;box-shadow:0 10px 30px rgba(0,0,0,.16);font:700 12px/1 Poppins,ui-sans-serif,system-ui,sans-serif;cursor:pointer}.lulu-language-shell--workspace .lulu-language-launch{min-width:48px;height:36px;padding:0 10px;border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.14)}.lulu-language-shell--workspace .lulu-language-launch span{font-size:11px}.lulu-language-menu{position:absolute;right:0;bottom:48px;width:236px;overflow:hidden;border:1px solid #d6d6d1;border-radius:14px;background:#fff;box-shadow:0 18px 54px rgba(0,0,0,.22)}.lulu-language-title{padding:12px 13px 9px;border-bottom:1px solid #ecece8;color:#686864;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lulu-language-list{max-height:min(430px,calc(100vh - 150px));overflow-y:auto;padding:6px}.lulu-language-option{position:relative;display:grid;width:100%;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:1px 8px;border:0;border-radius:9px;background:transparent;color:#171717;padding:8px 30px 8px 9px;text-align:left;cursor:pointer}.lulu-language-option:hover,.lulu-language-option:focus-visible{background:#f2f2ef;outline:0}.lulu-language-option:disabled{color:#969690;cursor:not-allowed}.lulu-language-option:disabled:hover{background:transparent}.lulu-language-option[aria-checked=true]{background:#eaf7f3}.lulu-language-option>span{grid-column:1;font-size:13px;font-weight:650}.lulu-language-option>small{grid-column:1;color:#777772;font-size:10px}.lulu-language-option>svg{position:absolute;right:9px;top:50%;color:#087a5b;transform:translateY(-50%)}@media (min-width:901px){.lulu-language-shell--workspace{left:18px;right:auto;bottom:74px}.lulu-language-shell--workspace .lulu-language-menu{left:0;right:auto;bottom:44px}}@media (max-width:1100px),(max-height:760px){.lulu-language-shell{right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom))}.lulu-language-shell--workspace{right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));left:auto}.lulu-language-launch{min-width:44px;height:36px;padding:0 10px;border-radius:12px;box-shadow:0 8px 22px rgba(0,0,0,.14)}.lulu-language-launch span{font-size:11px}.lulu-language-menu{width:min(220px,calc(100vw - 24px));bottom:42px}.lulu-language-shell--workspace .lulu-language-menu{left:auto;right:0}}`;
