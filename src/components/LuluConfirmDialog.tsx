import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "../i18n/GlobalLanguageSwitcher";

export type LuluConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
};

type PendingConfirmation = LuluConfirmOptions & {
  resolve: (confirmed: boolean) => void;
  focusTarget: HTMLElement | null;
};

type LuluConfirm = (options: LuluConfirmOptions) => Promise<boolean>;

const LuluConfirmContext = createContext<LuluConfirm | null>(null);

function focusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return [...container.querySelectorAll<HTMLElement>(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => element.offsetParent !== null);
}

export function LuluConfirmProvider({ children }: { children: ReactNode }) {
  const t = useTranslation();
  const [pending, setPending] = useState<PendingConfirmation | null>(null);
  const pendingRef = useRef<PendingConfirmation | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const settle = useCallback((confirmed: boolean) => {
    const active = pendingRef.current;
    if (!active) return;
    pendingRef.current = null;
    setPending(null);
    active.resolve(confirmed);
    window.requestAnimationFrame(() => {
      if (active.focusTarget?.isConnected) active.focusTarget.focus();
    });
  }, []);

  const confirm = useCallback<LuluConfirm>((options) => new Promise<boolean>((resolve) => {
    // Two destructive actions must never share a confirmation. Resolve an
    // interrupted request as cancelled before presenting the latest one.
    pendingRef.current?.resolve(false);
    const next: PendingConfirmation = {
      ...options,
      resolve,
      focusTarget: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    };
    pendingRef.current = next;
    setPending(next);
  }), []);

  useEffect(() => () => {
    pendingRef.current?.resolve(false);
    pendingRef.current = null;
  }, []);

  useEffect(() => {
    if (!pending) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        settle(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusableElements(dialogRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => cancelRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pending, settle]);

  return <LuluConfirmContext.Provider value={confirm}>
    {children}
    {pending ? createPortal(
      <div className="lulu-confirm-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) settle(false); }}>
        <section ref={dialogRef} className="lulu-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="lulu-confirm-title" aria-describedby={pending.description ? "lulu-confirm-description" : undefined}>
          <div className={`lulu-confirm-dialog__icon${pending.tone === "danger" ? " is-danger" : ""}`} aria-hidden="true"><AlertTriangle size={19} /></div>
          <button type="button" className="lulu-confirm-dialog__close" onClick={() => settle(false)} aria-label={t("Close confirmation")}><X size={17} /></button>
          <div className="lulu-confirm-dialog__body">
            <p className="lulu-confirm-dialog__eyebrow">{t("Confirm action")}</p>
            <h2 id="lulu-confirm-title">{t(pending.title)}</h2>
            {pending.description ? <p id="lulu-confirm-description">{t(pending.description)}</p> : null}
          </div>
          <footer className="lulu-confirm-dialog__actions">
            <button ref={cancelRef} type="button" className="lulu-confirm-dialog__button lulu-confirm-dialog__button--secondary" onClick={() => settle(false)}>{pending.cancelLabel ? t(pending.cancelLabel) : t("Cancel")}</button>
            <button type="button" className={`lulu-confirm-dialog__button lulu-confirm-dialog__button--primary${pending.tone === "danger" ? " is-danger" : ""}`} onClick={() => settle(true)}>{pending.confirmLabel ? t(pending.confirmLabel) : t("Continue")}</button>
          </footer>
        </section>
      </div>,
      document.body,
    ) : null}
  </LuluConfirmContext.Provider>;
}

export function useLuluConfirm() {
  const confirm = useContext(LuluConfirmContext);
  if (!confirm) throw new Error("useLuluConfirm must be used inside LuluConfirmProvider");
  return confirm;
}
