import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LoaderCircle, X, XCircle } from "lucide-react";

const MAX_UPLOAD_BYTES = 5000 * 1024;

type UploadState =
  | { kind: "idle" }
  | { kind: "loading"; fileName: string }
  | { kind: "success"; fileName: string }
  | { kind: "error"; fileName: string; message: string };

function acceptsFile(file: File, accept: string) {
  if (!accept.trim()) return true;
  return accept.split(",").some((rawRule) => {
    const rule = rawRule.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule;
  });
}

function supportedFormats(accept: string) {
  const names = accept.split(",").map((rule) => {
    const value = rule.trim().toLowerCase();
    if (value === "image/png" || value === ".png") return "PNG";
    if (["image/jpeg", ".jpg", ".jpeg"].includes(value)) return "JPG";
    if (value === "image/svg+xml" || value === ".svg") return "SVG";
    if (value === "text/csv" || value === ".csv") return "CSV";
    if (value.includes("spreadsheet") || value === ".xlsx" || value === ".xls") return "Excel";
    return value.startsWith(".") ? value.slice(1).toUpperCase() : "";
  }).filter(Boolean);
  return [...new Set(names)].join(", ");
}

export function GlobalUploadFeedback() {
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const runId = useRef(0);

  useEffect(() => {
    const onFileSelected = (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "file") return;
      const file = input.files?.[0];
      if (!file) return;

      const currentRun = ++runId.current;
      const startedAt = Date.now();
      setState({ kind: "loading", fileName: file.name });

      const finish = (next: UploadState) => {
        const remaining = Math.max(0, 700 - (Date.now() - startedAt));
        window.setTimeout(() => {
          if (runId.current === currentRun) setState(next);
        }, remaining);
      };

      if (file.size === 0) {
        finish({
          kind: "error",
          fileName: file.name,
          message: "This file is empty. Please choose another file.",
        });
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        finish({
          kind: "error",
          fileName: file.name,
          message: "Dateigröße ist zu groß.",
        });
        return;
      }
      if (!acceptsFile(file, input.accept)) {
        const formats = supportedFormats(input.accept);
        finish({
          kind: "error",
          fileName: file.name,
          message: formats
            ? `This file type is not supported. Please choose one of these formats: ${formats}.`
            : "This file type is not supported. Please choose another file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => finish({ kind: "success", fileName: file.name });
      reader.onerror = () => finish({
        kind: "error",
        fileName: file.name,
        message: "We could not read this file. Please choose it again or use another file.",
      });
      reader.readAsArrayBuffer(file);
    };

    document.addEventListener("change", onFileSelected, true);
    return () => {
      runId.current += 1;
      document.removeEventListener("change", onFileSelected, true);
    };
  }, []);

  if (state.kind === "idle") return null;
  const close = () => {
    runId.current += 1;
    setState({ kind: "idle" });
  };

  return <div
    className="lulu-upload-backdrop"
    role={state.kind === "error" ? "alertdialog" : "dialog"}
    aria-modal="true"
    aria-labelledby="lulu-upload-title"
    aria-describedby="lulu-upload-description"
  >
    <section className={`lulu-upload-card ${state.kind}`}>
      {state.kind !== "loading" && <button
        className="lulu-upload-close"
        type="button"
        aria-label="Close upload message"
        onClick={close}
      ><X size={18} aria-hidden="true" /></button>}
      <div className="lulu-upload-icon" aria-hidden="true">
        {state.kind === "loading" && <LoaderCircle className="lulu-upload-spinner" size={30} />}
        {state.kind === "success" && <CheckCircle2 size={30} />}
        {state.kind === "error" && <XCircle size={30} />}
      </div>
      <h2 id="lulu-upload-title">
        {state.kind === "loading" && "Uploading your file…"}
        {state.kind === "success" && "Upload successful"}
        {state.kind === "error" && "Upload was not successful"}
      </h2>
      <p id="lulu-upload-description">
        {state.kind === "loading" && "Please keep this page open while we check your file."}
        {state.kind === "success" && "Your file is ready to use."}
        {state.kind === "error" && state.message}
      </p>
      <span className="lulu-upload-file" data-lulu-no-translate translate="no">{state.fileName}</span>
      {state.kind !== "loading" && <button className="lulu-upload-action" type="button" onClick={close}>
        {state.kind === "success" ? "Done" : "Close"}
      </button>}
    </section>
    <style>{uploadFeedbackStyles}</style>
  </div>;
}

const uploadFeedbackStyles = `
.lulu-upload-backdrop{all:initial;position:fixed!important;inset:0!important;z-index:2147483004!important;display:grid!important;place-items:center!important;padding:20px!important;background:rgba(15,15,18,.58)!important;backdrop-filter:blur(5px)!important;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}
.lulu-upload-card{position:relative!important;box-sizing:border-box!important;width:min(400px,calc(100vw - 32px))!important;border:1px solid #deded9!important;border-radius:18px!important;background:#fff!important;color:#171717!important;padding:30px!important;box-shadow:0 28px 90px rgba(0,0,0,.28)!important;text-align:center!important;animation:lulu-upload-in .2s ease-out!important}.lulu-upload-card *{box-sizing:border-box!important}.lulu-upload-icon{display:grid!important;place-items:center!important;width:58px!important;height:58px!important;margin:0 auto 16px!important;border-radius:50%!important;background:#edf7f4!important;color:#087a5b!important}.lulu-upload-card.error .lulu-upload-icon{background:#fff1ef!important;color:#b42318!important}.lulu-upload-card h2{margin:0!important;color:#171717!important;font:700 19px/1.3 Inter,ui-sans-serif,system-ui,sans-serif!important}.lulu-upload-card p{margin:9px 0 0!important;color:#61615d!important;font:400 13px/1.55 Inter,ui-sans-serif,system-ui,sans-serif!important}.lulu-upload-file{display:block!important;overflow:hidden!important;margin:13px auto 0!important;padding:7px 10px!important;border-radius:8px!important;background:#f2f2ef!important;color:#41413e!important;font:500 11px/1.3 ui-monospace,SFMono-Regular,Consolas,monospace!important;text-overflow:ellipsis!important;white-space:nowrap!important}.lulu-upload-action{all:unset!important;box-sizing:border-box!important;display:block!important;width:100%!important;margin-top:20px!important;border-radius:9px!important;background:#171717!important;color:#fff!important;padding:11px 14px!important;font:700 13px/1 Inter,ui-sans-serif,system-ui,sans-serif!important;cursor:pointer!important;text-align:center!important}.lulu-upload-action:hover{background:#30302d!important}.lulu-upload-action:focus-visible,.lulu-upload-close:focus-visible{outline:3px solid rgba(16,163,127,.28)!important;outline-offset:2px!important}.lulu-upload-close{all:unset!important;position:absolute!important;right:15px!important;top:15px!important;display:grid!important;width:32px!important;height:32px!important;place-items:center!important;border-radius:8px!important;color:#686864!important;cursor:pointer!important}.lulu-upload-close:hover{background:#f2f2ef!important;color:#171717!important}.lulu-upload-spinner{animation:lulu-upload-spin .8s linear infinite!important}@keyframes lulu-upload-spin{to{transform:rotate(360deg)}}@keyframes lulu-upload-in{from{opacity:0;transform:translateY(7px) scale(.98)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.lulu-upload-card,.lulu-upload-spinner{animation:none!important}}
`;
