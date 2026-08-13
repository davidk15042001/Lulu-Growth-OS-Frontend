import { useEffect, useState } from "react";
import { Check, Languages as LanguagesIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { DEFAULT_LANGUAGE, getLanguage, isLanguageCode, LANGUAGE_STORAGE_KEY, languages, type LanguageCode } from "./languages";
import translations from "./translations.json";

const translationTable = translations as Record<string, Record<string, string>>;

const LANGUAGE_EVENT = "lulu-language-changed";

function initialLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguageCode(stored)) return stored;
  } catch { /* Browser storage may be unavailable. */ }

  const candidates = typeof navigator === "undefined"
    ? []
    : [...navigator.languages, navigator.language].filter(Boolean);
  for (const candidate of candidates) {
    if (isLanguageCode(candidate)) return candidate;
    const baseLanguage = candidate.split("-")[0];
    const match = languages.find((language) => language.code === baseLanguage);
    if (match) return match.code;
  }
  return DEFAULT_LANGUAGE;
}

export function useLanguage() {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  useEffect(() => {
    const sync = () => setLanguage(initialLanguage());
    window.addEventListener(LANGUAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(LANGUAGE_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  return language;
}

export function useTranslation() {
  const language = useLanguage();
  return (key: string) => translationTable[language]?.[key] ?? translationTable.en[key] ?? key;
}

export function GlobalLanguageSwitcher() {
  const [language, setLanguage] = useState<LanguageCode>(initialLanguage);
  const [open, setOpen] = useState(false);
  const current = getLanguage(language);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getLanguage(language).direction;
    try { window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch { /* no persistence available */ }
  }, [language]);
  const selectLanguage = (next: LanguageCode) => {
    setLanguage(next);
    window.dispatchEvent(new Event(LANGUAGE_EVENT));
    setOpen(false);
  };

  return createPortal(<>
    <div className="lulu-language-shell" data-lulu-no-translate="true" translate="no">
      {open && <div className="lulu-language-menu" role="menu" aria-label="Select language">
        <div className="lulu-language-title">Language</div>
        <div className="lulu-language-list">{languages.map((option) => <button className="lulu-language-option" type="button" role="menuitemradio" aria-checked={option.code === language} key={option.code} onClick={() => selectLanguage(option.code)}><span lang={option.code} dir={option.direction}>{option.nativeName}</span><small>{option.name}</small>{option.code === language && <Check aria-hidden="true" size={15} />}</button>)}</div>
      </div>}
      <button className="lulu-language-launch" type="button" aria-label={`Change language. Current language: ${current.name}`} aria-haspopup="menu" aria-expanded={open} title="Change language" onClick={() => setOpen((value) => !value)}><LanguagesIcon aria-hidden="true" size={16} /><span>{current.shortCode}</span></button>
    </div>
    <style>{styles}</style>
  </>, document.body);
}

const styles = `.lulu-language-shell{all:initial;position:fixed;right:18px;bottom:68px;z-index:2147483002;direction:ltr;color:#171717;font:400 13px/1.35 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.lulu-language-shell *{box-sizing:border-box}.lulu-language-launch{display:flex;align-items:center;justify-content:center;gap:6px;min-width:56px;height:40px;border:1px solid #d6d6d1;border-radius:999px;background:#fff;color:#171717;padding:0 12px;box-shadow:0 10px 30px rgba(0,0,0,.16);font:700 12px/1 Inter,ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em;cursor:pointer}.lulu-language-menu{position:absolute;right:0;bottom:48px;width:236px;overflow:hidden;border:1px solid #d6d6d1;border-radius:14px;background:#fff;box-shadow:0 18px 54px rgba(0,0,0,.22)}.lulu-language-title{padding:12px 13px 9px;border-bottom:1px solid #ecece8;color:#686864;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.lulu-language-list{max-height:min(430px,calc(100vh - 150px));overflow-y:auto;padding:6px}.lulu-language-option{position:relative;display:grid;width:100%;grid-template-columns:1fr auto;grid-template-rows:auto auto;gap:1px 8px;border:0;border-radius:9px;background:transparent;color:#171717;padding:8px 30px 8px 9px;text-align:left;cursor:pointer}.lulu-language-option:hover,.lulu-language-option:focus-visible{background:#f2f2ef;outline:0}.lulu-language-option[aria-checked=true]{background:#eaf7f3}.lulu-language-option>span{grid-column:1;font-size:13px;font-weight:650}.lulu-language-option>small{grid-column:1;color:#777772;font-size:10px}.lulu-language-option>svg{position:absolute;right:9px;top:50%;color:#087a5b;transform:translateY(-50%)}`;
