import { useEffect, useRef, useState } from "react";
import { Check, Languages as LanguagesIcon, LoaderCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { translateBatch } from "../api/translations";
import {
  DEFAULT_LANGUAGE,
  getLanguage,
  isLanguageCode,
  LANGUAGE_STORAGE_KEY,
  languages,
  type LanguageCode,
} from "./languages";

const TRANSLATABLE_ATTRIBUTES = ["aria-label", "placeholder", "title"] as const;
const translationMemory = new Map<LanguageCode, Map<string, string>>();
const originalText = new WeakMap<Text, string>();
const appliedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const appliedAttributes = new WeakMap<Element, Map<string, string>>();

type TextTarget = { node: Text; source: string };
type AttributeTarget = { element: Element; attribute: string; source: string };

function isExcluded(element: Element | null) {
  return !element || Boolean(element.closest(
    "script,style,noscript,code,pre,svg,[translate='no'],[data-lulu-no-translate],.lulu-global-brand-host",
  ));
}

function shouldTranslate(value: string) {
  const text = value.trim();
  if (text.length < 2 || text.length > 1_000) return false;
  if (!/\p{L}/u.test(text)) return false;
  if (/^(?:https?:\/\/|www\.|mailto:)/i.test(text)) return false;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return false;
  return true;
}

function readTextSource(node: Text) {
  const current = node.data;
  const previousTranslation = appliedText.get(node);
  let source = originalText.get(node);

  if (source === undefined || (current !== source && current !== previousTranslation)) {
    source = current;
    originalText.set(node, source);
    appliedText.delete(node);
  }
  return source;
}

function readAttributeSource(element: Element, attribute: string) {
  const current = element.getAttribute(attribute);
  if (!current) return null;
  let originals = originalAttributes.get(element);
  let applied = appliedAttributes.get(element);
  const previousTranslation = applied?.get(attribute);
  let source = originals?.get(attribute);

  if (source === undefined || (current !== source && current !== previousTranslation)) {
    originals ??= new Map();
    originals.set(attribute, current);
    originalAttributes.set(element, originals);
    applied?.delete(attribute);
    source = current;
  }
  return source;
}

function collectTargets(root: HTMLElement) {
  const texts: TextTarget[] = [];
  const attributes: AttributeTarget[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    const source = readTextSource(textNode);
    if (!isExcluded(textNode.parentElement) && shouldTranslate(source)) {
      texts.push({ node: textNode, source: source.trim() });
    }
    node = walker.nextNode();
  }

  root.querySelectorAll("*").forEach((element) => {
    if (isExcluded(element)) return;
    TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
      const source = readAttributeSource(element, attribute);
      if (source && shouldTranslate(source)) {
        attributes.push({ element, attribute, source: source.trim() });
      }
    });
  });

  return { texts, attributes };
}

function withOriginalSpacing(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function applyTranslations(
  language: LanguageCode,
  targets: ReturnType<typeof collectTargets>,
  translated: Map<string, string>,
) {
  for (const target of targets.texts) {
    if (!target.node.isConnected) continue;
    const original = originalText.get(target.node) ?? target.node.data;
    const next = language === DEFAULT_LANGUAGE
      ? original
      : withOriginalSpacing(original, translated.get(target.source) ?? target.source);
    if (target.node.data !== next) target.node.data = next;
    if (language === DEFAULT_LANGUAGE) appliedText.delete(target.node);
    else appliedText.set(target.node, next);
  }

  for (const target of targets.attributes) {
    if (!target.element.isConnected) continue;
    const original = originalAttributes.get(target.element)?.get(target.attribute);
    if (original === undefined) continue;
    const next = language === DEFAULT_LANGUAGE
      ? original
      : translated.get(target.source) ?? target.source;
    if (target.element.getAttribute(target.attribute) !== next) {
      target.element.setAttribute(target.attribute, next);
    }
    let applied = appliedAttributes.get(target.element);
    if (language === DEFAULT_LANGUAGE) applied?.delete(target.attribute);
    else {
      applied ??= new Map();
      applied.set(target.attribute, next);
      appliedAttributes.set(target.element, applied);
    }
  }
}

function splitBatches(strings: string[]) {
  const batches: string[][] = [];
  let current: string[] = [];
  let characters = 0;

  for (const value of strings) {
    if (current.length >= 40 || characters + value.length > 10_000) {
      batches.push(current);
      current = [];
      characters = 0;
    }
    current.push(value);
    characters += value.length;
  }
  if (current.length) batches.push(current);
  return batches;
}

function initialLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguageCode(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function GlobalLanguageSwitcher() {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const shellRef = useRef<HTMLDivElement>(null);
  const runId = useRef(0);
  const rerunTimer = useRef<number | undefined>(undefined);
  const activeLanguage = useRef(language);
  activeLanguage.current = language;

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const currentRun = ++runId.current;
    const controller = new AbortController();
    const descriptor = getLanguage(language);
    document.documentElement.lang = descriptor.code;
    document.documentElement.dir = descriptor.direction;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Language selection still works when storage is blocked.
    }

    let translating = false;
    let translationQueued = false;

    async function translateRoot() {
      if (translating) {
        translationQueued = true;
        return;
      }
      translating = true;

      try {
        const targets = collectTargets(root!);
        if (language === DEFAULT_LANGUAGE) {
          applyTranslations(language, targets, new Map());
          setState("idle");
          return;
        }

        setState("loading");
        const memory = translationMemory.get(language) ?? new Map<string, string>();
        translationMemory.set(language, memory);
        const sources = [...new Set([
          ...targets.texts.map((target) => target.source),
          ...targets.attributes.map((target) => target.source),
        ])];
        const missing = sources.filter((source) => !memory.has(source));

        try {
          for (const batch of splitBatches(missing)) {
            const response = await translateBatch(language, batch, controller.signal);
            if (runId.current !== currentRun) return;
            batch.forEach((source, index) => memory.set(source, response.data.translations[index] ?? source));
            applyTranslations(language, targets, memory);
          }
          if (runId.current !== currentRun) return;
          applyTranslations(language, collectTargets(root!), memory);
          setState("idle");
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          if (runId.current === currentRun) setState("error");
        }
      } finally {
        translating = false;
        if (translationQueued && !controller.signal.aborted && activeLanguage.current === language) {
          translationQueued = false;
          window.clearTimeout(rerunTimer.current);
          rerunTimer.current = window.setTimeout(() => void translateRoot(), 0);
        }
      }
    }

    void translateRoot();
    const observer = new MutationObserver((mutations) => {
      if (language === DEFAULT_LANGUAGE) return;
      const relevant = mutations.some((mutation) => {
        if (mutation.target instanceof Element && isExcluded(mutation.target)) return false;
        return true;
      });
      if (!relevant) return;
      window.clearTimeout(rerunTimer.current);
      rerunTimer.current = window.setTimeout(() => {
        if (activeLanguage.current !== language || controller.signal.aborted) return;
        void translateRoot();
      }, 350);
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => {
      controller.abort();
      observer.disconnect();
      window.clearTimeout(rerunTimer.current);
    };
  }, [language]);

  useEffect(() => {
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (shellRef.current && !shellRef.current.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const current = getLanguage(language);
  return createPortal(<>
    <div className="lulu-language-shell" data-lulu-no-translate translate="no" ref={shellRef}>
      {open && <div className="lulu-language-menu" role="menu" aria-label="Select language">
        <div className="lulu-language-title">Language</div>
        <div className="lulu-language-list">
          {languages.map((option) => <button
            className="lulu-language-option"
            type="button"
            role="menuitemradio"
            aria-checked={option.code === language}
            key={option.code}
            onClick={() => {
              setLanguage(option.code);
              setOpen(false);
            }}
          >
            <span lang={option.code} dir={option.direction}>{option.nativeName}</span>
            <small>{option.name}</small>
            {option.code === language && <Check aria-hidden="true" size={15} />}
          </button>)}
        </div>
      </div>}
      <button
        className="lulu-language-launch"
        type="button"
        aria-label={`Change language. Current language: ${current.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        title={state === "error" ? "Translation is temporarily unavailable" : "Change language"}
        onClick={() => setOpen((value) => !value)}
      >
        {state === "loading"
          ? <LoaderCircle className="lulu-language-spinner" aria-hidden="true" size={16} />
          : <LanguagesIcon aria-hidden="true" size={16} />}
        <span>{current.shortCode}</span>
        {state === "error" && <i aria-hidden="true" />}
      </button>
    </div>
    <style>{languageSwitcherStyles}</style>
  </>, document.body);
}

const languageSwitcherStyles = `
.lulu-language-shell{all:initial;position:fixed;right:18px;bottom:68px;z-index:2147483002;direction:ltr;color:#171717;font:400 13px/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.lulu-language-shell *{box-sizing:border-box}
.lulu-language-launch{display:flex;align-items:center;justify-content:center;gap:6px;min-width:56px;height:40px;border:1px solid #d6d6d1;border-radius:999px;background:#fff;color:#171717;padding:0 12px;box-shadow:0 10px 30px rgba(0,0,0,.16);font:700 12px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em;cursor:pointer;transition:transform .16s ease,background .16s ease,box-shadow .16s ease}
.lulu-language-launch:hover{background:#f4f4f1;transform:translateY(-1px);box-shadow:0 13px 34px rgba(0,0,0,.2)}.lulu-language-launch:focus-visible{outline:3px solid rgba(16,163,127,.25);outline-offset:2px}.lulu-language-launch i{position:absolute;right:3px;top:3px;width:7px;height:7px;border:2px solid #fff;border-radius:50%;background:#d92d20}
.lulu-language-spinner{animation:lulu-language-spin .8s linear infinite}.lulu-language-menu{position:absolute;right:0;bottom:48px;width:236px;overflow:hidden;border:1px solid #d6d6d1;border-radius:14px;background:#fff;box-shadow:0 18px 54px rgba(0,0,0,.22);animation:lulu-language-in .16s ease-out}.lulu-language-title{padding:12px 13px 9px;border-bottom:1px solid #ecece8;color:#686864;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lulu-language-list{max-height:min(430px,calc(100vh - 150px));overflow-y:auto;padding:6px}.lulu-language-option{position:relative;display:grid;width:100%;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:1px 8px;border:0;border-radius:9px;background:transparent;color:#171717;padding:8px 30px 8px 9px;text-align:left;cursor:pointer}.lulu-language-option:hover,.lulu-language-option:focus-visible{background:#f2f2ef;outline:0}.lulu-language-option[aria-checked=true]{background:#eaf7f3}.lulu-language-option>span{grid-column:1;font-size:13px;font-weight:650}.lulu-language-option>small{grid-column:1;color:#777772;font-size:10px}.lulu-language-option>svg{position:absolute;right:9px;top:50%;color:#087a5b;transform:translateY(-50%)}
@keyframes lulu-language-spin{to{transform:rotate(360deg)}}@keyframes lulu-language-in{from{opacity:0;transform:translateY(5px) scale(.98)}to{opacity:1;transform:none}}
@media(max-width:560px){.lulu-language-shell{right:10px;bottom:60px}.lulu-language-menu{width:min(236px,calc(100vw - 20px))}}
@media(prefers-reduced-motion:reduce){.lulu-language-launch,.lulu-language-menu{animation:none;transition:none}}
`;
