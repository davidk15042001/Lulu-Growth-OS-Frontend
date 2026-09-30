import type { ReactNode } from "react";

export function LivePanelShell({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return <aside className="lulu-live-panel" aria-label={`${title} live data`}>
    <header className="lulu-live-header">
      <div><strong>{title}</strong><span>{subtitle}</span></div>
      <button type="button" onClick={onClose} aria-label="Close live data panel">×</button>
    </header>
    <div className="lulu-live-scroll">{children}</div>
    <style>{livePanelStyles}</style>
  </aside>;
}

export function LiveSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="lulu-live-section">
    <header><strong>{title}</strong>{action}</header>
    {children}
  </section>;
}

export function LiveError({ message }: { message: string }) {
  return message ? <p className="lulu-live-error" role="alert">{message}</p> : null;
}

export function LiveEmpty({ children }: { children: ReactNode }) {
  return <p className="lulu-live-empty">{children}</p>;
}

export function formatLiveDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium", timeStyle: "short",
  }).format(date);
}

export const livePanelStyles = `
.lulu-live-launch{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:8px;border:1px solid #d6d6d1;border-radius:999px;background:#fff;color:#171717;padding:10px 14px;box-shadow:0 12px 34px rgba(0,0,0,.16);font:600 13px/1 Inter,ui-sans-serif,system-ui,sans-serif;cursor:pointer}.lulu-live-launch:hover{background:#f4f4f1}.lulu-live-launch i{width:8px;height:8px;border-radius:50%;background:#10a37f;box-shadow:0 0 0 3px rgba(16,163,127,.13)}.lulu-live-panel{position:fixed;right:0;top:0;bottom:0;z-index:2147483001;width:min(440px,100vw);background:#f7f7f5;color:#171717;border-left:1px solid #d6d6d1;box-shadow:-18px 0 48px rgba(0,0,0,.18);font:400 13px/1.45 Inter,ui-sans-serif,system-ui,sans-serif}.lulu-live-header{height:70px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 18px;background:#fff;border-bottom:1px solid #deded9}.lulu-live-header strong,.lulu-live-header span{display:block}.lulu-live-header strong{font-size:15px}.lulu-live-header span{margin-top:3px;color:#686864;font-size:11px}.lulu-live-header button{width:34px;height:34px;border:1px solid #deded9;border-radius:8px;background:#fff;color:#171717;font-size:22px;cursor:pointer}.lulu-live-scroll{height:calc(100% - 70px);overflow:auto;padding:14px}.lulu-live-section{margin-bottom:12px;padding:14px;border:1px solid #deded9;border-radius:12px;background:#fff}.lulu-live-section>header{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.lulu-live-section>header>strong{font-size:13px}.lulu-live-button{min-height:34px;border:1px solid #c9c9c3;border-radius:7px;background:#fff;color:#171717;padding:6px 10px;font-weight:600;cursor:pointer}.lulu-live-button:hover{background:#f2f2ef}.lulu-live-button.primary{border-color:#171717;background:#171717;color:#fff}.lulu-live-button.danger{color:#b42318}.lulu-live-button:disabled{cursor:not-allowed;opacity:.5}.lulu-live-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}.lulu-live-form{display:grid;gap:9px}.lulu-live-form label{display:grid;gap:4px;color:#50504d;font-size:11px;font-weight:600}.lulu-live-form input,.lulu-live-form select,.lulu-live-form textarea{width:100%;border:1px solid #cecec8;border-radius:7px;background:#fff;color:#171717;padding:8px 9px;font:400 13px/1.4 Inter,ui-sans-serif,system-ui,sans-serif;outline:none}.lulu-live-form textarea{min-height:74px;resize:vertical}.lulu-live-form input:focus,.lulu-live-form textarea:focus,.lulu-live-form select:focus{border-color:#171717;box-shadow:0 0 0 2px rgba(0,0,0,.08)}.lulu-live-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lulu-live-row{padding:10px 0;border-top:1px solid #ecece8}.lulu-live-row:first-child{border-top:0;padding-top:0}.lulu-live-row:last-child{padding-bottom:0}.lulu-live-row strong,.lulu-live-row span,.lulu-live-row small{display:block}.lulu-live-row span,.lulu-live-row small{margin-top:3px;color:#686864}.lulu-live-row small{font-size:10px}.lulu-live-row-top{display:flex;justify-content:space-between;gap:10px}.lulu-live-badge{display:inline-flex!important;width:max-content;margin-top:5px!important;border-radius:999px;background:#ecece8;color:#50504d!important;padding:2px 7px;font-size:10px}.lulu-live-badge.good{background:#e6f7f1;color:#087a5b!important}.lulu-live-error{border:1px solid #f0b9b4;border-radius:8px;background:#fff2f0;color:#9f241b;padding:9px;margin:0 0 10px}.lulu-live-empty{color:#686864;text-align:center;padding:16px 6px;margin:0}.lulu-live-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}.lulu-live-kpi{border:1px solid #e2e2dd;border-radius:9px;padding:10px}.lulu-live-kpi span,.lulu-live-kpi strong{display:block}.lulu-live-kpi span{color:#686864;font-size:10px}.lulu-live-kpi strong{margin-top:4px;font-size:18px}.lulu-live-tabs{display:flex;gap:5px;overflow:auto;margin-bottom:12px}.lulu-live-tabs button{border:1px solid #d4d4ce;border-radius:999px;background:#fff;padding:6px 9px;white-space:nowrap;font-size:11px;cursor:pointer}.lulu-live-tabs button[aria-selected=true]{background:#171717;color:#fff;border-color:#171717}.lulu-live-json{white-space:pre-wrap;overflow-wrap:anywhere;font:11px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace;color:#50504d}.lulu-live-message{margin:8px 0;padding:9px;border-radius:9px;background:#eeeeea;white-space:pre-wrap}.lulu-live-message.assistant{background:#e6f7f1}.lulu-live-message small{display:block;margin-bottom:4px;color:#686864;text-transform:capitalize}@media(max-width:560px){.lulu-live-panel{width:100vw}.lulu-live-launch{right:10px;bottom:10px}.lulu-live-grid{grid-template-columns:1fr}}

/* Composio can also render inside the generated workspace pages, whose
   executive theme intentionally overrides generic form controls. Keep this
   catalog readable and visually self-contained in that context. */
.lulu-composio-catalog{color:#172033!important;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
.lulu-composio-catalog .lulu-live-section{border-color:#dfe4ee!important;border-radius:16px!important;background:#fff!important;color:#172033!important;box-shadow:0 14px 34px rgba(27,39,69,.08)!important}
.lulu-composio-catalog .lulu-live-section>header{align-items:flex-start!important;flex-wrap:wrap!important}
.lulu-composio-catalog .lulu-live-section>header>strong{color:#172033!important;font-size:15px!important;letter-spacing:-.01em}
.lulu-composio-catalog .lulu-live-message{border:1px solid #e4e8f0!important;background:#f5f7fb!important;color:#526079!important;font-size:12px!important;line-height:1.5!important}
.lulu-composio-catalog .lulu-live-message--success{border-color:#b9ead9!important;background:#e8f8f2!important;color:#087a5b!important}
.lulu-composio-catalog .lulu-live-section>header .lulu-live-message{max-width:520px;margin:-3px 0 0!important}
.lulu-composio-catalog .lulu-live-form{gap:8px!important}
.lulu-composio-catalog .lulu-live-form label{color:#34415a!important;font-size:12px!important}
.lulu-composio-catalog .lulu-live-form input,.lulu-composio-catalog .lulu-live-form select,.lulu-composio-catalog .lulu-live-form textarea{border-color:#cfd7e5!important;border-radius:10px!important;background:#fff!important;color:#172033!important;box-sizing:border-box!important}
.lulu-composio-catalog .lulu-live-form input::placeholder{color:#8792a7!important}
.lulu-composio-catalog .lulu-live-form input:focus,.lulu-composio-catalog .lulu-live-form select:focus,.lulu-composio-catalog .lulu-live-form textarea:focus{border-color:#6473e6!important;box-shadow:0 0 0 3px rgba(100,115,230,.15)!important}
.lulu-composio-catalog .lulu-live-search-form{grid-template-columns:minmax(0,1fr) auto!important;align-items:end!important}
.lulu-composio-catalog .lulu-live-search-form label{min-width:0}
.lulu-composio-catalog .lulu-live-button{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-height:38px!important;border-color:#cfd7e5!important;border-radius:10px!important;background:#fff!important;color:#26324a!important;padding:8px 14px!important;font-size:12px!important;line-height:1.2!important;box-shadow:none!important}
.lulu-composio-catalog .lulu-live-button:hover:not(:disabled){border-color:#9da9dd!important;background:#f7f8ff!important}
.lulu-composio-catalog .lulu-live-button.primary{border-color:#5363d9!important;background:linear-gradient(135deg,#5c67df,#4453c4)!important;color:#fff!important;box-shadow:0 8px 16px rgba(74,88,200,.2)!important}
.lulu-composio-catalog .lulu-live-button.primary:hover:not(:disabled){background:linear-gradient(135deg,#6874eb,#4b5bd1)!important}
.lulu-composio-catalog .lulu-live-row{border-top-color:#edf0f5!important}
.lulu-composio-catalog .lulu-live-row strong{color:#172033!important;font-size:13px!important}
.lulu-composio-catalog .lulu-live-row span,.lulu-composio-catalog .lulu-live-row small{color:#68758b!important}
.lulu-composio-catalog .lulu-live-badge{border:1px solid #e0e5ee!important;background:#f3f5f8!important;color:#5b667b!important}
.lulu-composio-catalog .lulu-live-badge.good{border-color:#b9ead9!important;background:#e8f8f2!important;color:#087a5b!important}
.lulu-composio-catalog .lulu-live-empty{color:#68758b!important}
.lulu-composio-catalog .lulu-live-error{border-color:#f0b9b4!important;background:#fff2f0!important;color:#9f241b!important}
@media(max-width:560px){.lulu-composio-catalog .lulu-live-search-form{grid-template-columns:1fr!important}.lulu-composio-catalog .lulu-live-search-form .lulu-live-button{width:100%!important}.lulu-composio-catalog .lulu-live-section>header .lulu-live-message{max-width:none;margin:0!important}}
.lulu-global-shell:not(.lulu-global-shell--navigation-free) .lulu-native-page .lulu-composio-catalog .lulu-live-form input,.lulu-global-shell:not(.lulu-global-shell--navigation-free) .lulu-native-page .lulu-composio-catalog .lulu-live-form select,.lulu-global-shell:not(.lulu-global-shell--navigation-free) .lulu-native-page .lulu-composio-catalog .lulu-live-form textarea{border-color:#cfd7e5!important;border-radius:10px!important;background:#fff!important;color:#172033!important}
.lulu-global-shell:not(.lulu-global-shell--navigation-free) .lulu-native-page .lulu-composio-catalog .lulu-live-button{border-color:#cfd7e5!important;border-radius:10px!important;background:#fff!important;color:#26324a!important}
.lulu-global-shell:not(.lulu-global-shell--navigation-free) .lulu-native-page .lulu-composio-catalog .lulu-live-button.primary{border-color:#5363d9!important;background:linear-gradient(135deg,#5c67df,#4453c4)!important;color:#fff!important}
`;
