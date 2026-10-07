import { useEffect, useRef, type RefObject } from "react";

type UseLuluDialogOptions = {
  open: boolean;
  onClose: () => void;
};

function focusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  return [...container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )].filter((element) => element.offsetParent !== null);
}

/**
 * Shared behavior for native workspace dialogs. The dialog stays in the
 * current React tree, so this deliberately locks document scroll without
 * marking the entire #root inert (which would also hide the dialog itself).
 */
export function useLuluDialog<T extends HTMLElement = HTMLElement>({ open, onClose }: UseLuluDialogOptions): RefObject<T | null> {
  const dialogRef = useRef<T | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousActiveElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusableElements(dialogRef.current);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      const activeElement = document.activeElement;
      if (event.shiftKey && activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (activeElement === last || !dialogRef.current?.contains(activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const frame = window.requestAnimationFrame(() => {
      if (dialog && dialog.contains(document.activeElement)) return;
      focusableElements(dialogRef.current)[0]?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (previousActiveElement?.isConnected) {
        window.requestAnimationFrame(() => previousActiveElement.focus({ preventScroll: true }));
      }
    };
  }, [open]);

  return dialogRef;
}
