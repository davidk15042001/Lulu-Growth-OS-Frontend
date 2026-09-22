import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Banknote, CheckCircle2, Clock3, CreditCard, LoaderCircle, Plus, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { financeApi, type Payout, type PayoutBalance, type PayoutsData } from "../../api/finance";
import { getFriendlyErrorMessage } from "../../api/client";
import { useLuluApp } from "../../api/LuluAppContext";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";

function money(value: string, currency: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return `${value} ${currency}`;
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
}

function statusTone(status: string) {
  if (["PAID", "SETTLED"].includes(status)) return "text-emerald-700 bg-emerald-500/10 border-emerald-500/20";
  if (["FAILED", "CANCELLED"].includes(status)) return "text-red-700 bg-red-500/10 border-red-500/20";
  return "text-amber-700 bg-amber-500/10 border-amber-500/20";
}

export default function PayoutsPage() {
  const t = useTranslation();
  const { selectedWorkspace, hasCapability } = useLuluApp();
  const [data, setData] = useState<PayoutsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CNY");
  const [reference, setReference] = useState("");
  const [accountId, setAccountId] = useState("");
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [accountLabel, setAccountLabel] = useState("");
  const [accountCurrency, setAccountCurrency] = useState("CNY");
  const [busy, setBusy] = useState<string | null>(null);
  const [requestBusy, setRequestBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (workspaceId: string, signal?: AbortSignal) => {
    const response = await financeApi.listPayouts(workspaceId, 50, signal);
    setData(response.data);
    const firstCurrency = response.data.summary[0]?.currency ?? response.data.accounts[0]?.currency ?? "CNY";
    setCurrency((current) => response.data.summary.some((item) => item.currency === current) ? current : firstCurrency);
    setAccountCurrency((current) => response.data.accounts.some((item) => item.currency === current) ? current : firstCurrency);
    setAccountId((current) => response.data.accounts.some((item) => item.id === current && item.status === "ACTIVE") ? current : response.data.accounts.find((item) => item.status === "ACTIVE")?.id ?? "");
  }, []);

  useEffect(() => {
    if (!selectedWorkspace) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    void load(selectedWorkspace.id, controller.signal).catch((cause) => {
      if (cause?.name !== "AbortError") setError(getFriendlyErrorMessage(cause));
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [load, selectedWorkspace]);

  const selectedBalance = useMemo<PayoutBalance | null>(() => data?.summary.find((item) => item.currency === currency) ?? null, [currency, data]);
  const canRequest = hasCapability("payouts.request");
  const canManage = hasCapability("payouts.manage");

  async function refresh() {
    if (!selectedWorkspace) return;
    setRefreshing(true);
    setError(null);
    try { await load(selectedWorkspace.id); } catch (cause) { setError(getFriendlyErrorMessage(cause)); } finally { setRefreshing(false); }
  }

  async function saveAccount() {
    if (!selectedWorkspace || !beneficiaryId.trim() || !accountLabel.trim()) return;
    setBusy("account"); setNotice(null);
    try {
      await financeApi.createPayoutAccount(selectedWorkspace.id, { providerBeneficiaryId: beneficiaryId.trim(), label: accountLabel.trim(), currency: accountCurrency });
      setBeneficiaryId(""); setAccountLabel(""); setNotice(t("Payout account saved")); await load(selectedWorkspace.id);
    } catch (cause) { setError(getFriendlyErrorMessage(cause)); } finally { setBusy(null); }
  }

  async function requestPayout() {
    if (!selectedWorkspace || !accountId || !amount.trim() || !reference.trim()) return;
    setRequestBusy(true); setNotice(null);
    try {
      await financeApi.requestPayout(selectedWorkspace.id, { payoutAccountId: accountId, amount: amount.trim(), currency, reference: reference.trim(), idempotencyKey: crypto.randomUUID() });
      setAmount(""); setReference(""); setNotice(t("Payout requested")); await load(selectedWorkspace.id);
    } catch (cause) { setError(getFriendlyErrorMessage(cause)); } finally { setRequestBusy(false); }
  }

  async function submitPayout(payout: Payout) {
    if (!selectedWorkspace) return;
    setBusy(payout.id); setNotice(null);
    try { await financeApi.submitPayout(selectedWorkspace.id, payout.id); setNotice(t("Payout submitted")); await load(selectedWorkspace.id); }
    catch (cause) { setError(getFriendlyErrorMessage(cause)); } finally { setBusy(null); }
  }

  if (!selectedWorkspace) return <WorkspaceSurfaceShell activeSlug="lucky-park-8649"><main className="page-frame grid min-h-screen place-items-center p-6"><p>{t("Choose a workspace to continue.")}</p></main></WorkspaceSurfaceShell>;

  return <WorkspaceSurfaceShell activeSlug="lucky-park-8649">
    <main className="page-frame min-h-screen min-w-0 overflow-x-hidden bg-[var(--background)] px-4 py-6 sm:px-7 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-5 border-b border-[var(--border)] pb-6 lg:flex-row lg:items-end">
          <div><p className="eyebrow">{t("Finance")}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{t("Payouts")}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{t("Move paid customer revenue to a verified payout beneficiary with a traceable approval and provider status.")}</p></div>
          <button type="button" onClick={() => void refresh()} disabled={refreshing} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm font-semibold hover:bg-[var(--secondary)] disabled:opacity-60"><RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />{t("Refresh")}</button>
        </header>
        {error ? <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-700"><XCircle size={17} className="mt-0.5 shrink-0" />{error}</div> : null}
        {notice ? <div role="status" className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-700"><CheckCircle2 size={17} className="mt-0.5 shrink-0" />{notice}</div> : null}
        {loading ? <div className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--border)] p-8 text-sm text-[var(--muted-foreground)]"><LoaderCircle size={16} className="animate-spin" />{t("Loading payouts…")}</div> : <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric icon={<Banknote size={18} />} label={t("Paid storefront revenue")} value={selectedBalance ? money(selectedBalance.grossCollected, selectedBalance.currency) : "—"} detail={currency} />
            <Metric icon={<XCircle size={18} />} label={t("Refunds and disputes")} value={selectedBalance ? money(selectedBalance.reversed, selectedBalance.currency) : "—"} detail={t("Held back from payout")} />
            <Metric icon={<ShieldCheck size={18} />} label={t("Net eligible revenue")} value={selectedBalance ? money(selectedBalance.netCollected, selectedBalance.currency) : "—"} detail={t("After payment adjustments")} />
            <Metric icon={<Clock3 size={18} />} label={t("Reserved for payouts")} value={selectedBalance ? money(selectedBalance.reserved, selectedBalance.currency) : "—"} detail={currency} />
            <Metric icon={<ArrowUpRight size={18} />} label={t("Available to pay out")} value={selectedBalance ? money(selectedBalance.available, selectedBalance.currency) : "—"} detail={currency} accent />
          </section>
          <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">{t("Payout history")}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{t("Every request remains visible until the provider confirms its final state.")}</p></div><ShieldCheck size={20} className="text-emerald-600" /></div>
              <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--muted-foreground)]"><tr><th className="pb-3 pr-4">{t("Reference")}</th><th className="pb-3 pr-4">{t("Amount")}</th><th className="pb-3 pr-4">{t("Destination")}</th><th className="pb-3 pr-4">{t("Status")}</th><th className="pb-3">{t("Action")}</th></tr></thead><tbody>{data?.items.length ? data.items.map((payout) => <tr key={payout.id} className="border-b border-[var(--border)] last:border-0"><td className="py-4 pr-4 font-medium">{payout.reference}<div className="mt-1 text-xs text-[var(--muted-foreground)]">{new Date(payout.createdAt).toLocaleString()}</div></td><td className="py-4 pr-4 font-semibold">{money(payout.amount, payout.currency)}</td><td className="py-4 pr-4 text-[var(--muted-foreground)]">{payout.payoutAccountLabel}</td><td className="py-4 pr-4"><span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${statusTone(payout.status)}`}>{payout.status}</span></td><td className="py-4">{canManage && payout.status.toUpperCase().startsWith("REQUEST") ? <button type="button" onClick={() => void submitPayout(payout)} disabled={busy === payout.id} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-2.5 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] disabled:opacity-60">{busy === payout.id ? <LoaderCircle size={13} className="animate-spin" /> : <ArrowUpRight size={13} />}{t("Submit")}</button> : <span className="text-xs text-[var(--muted-foreground)]">{payout.providerStatus ?? "—"}</span>}</td></tr>) : <tr><td colSpan={5} className="py-12 text-center text-sm text-[var(--muted-foreground)]">{t("No payouts have been requested yet.")}</td></tr>}</tbody></table></div>
            </div>
            <div className="space-y-6">
              <FormCard icon={<CreditCard size={18} />} title={t("Request payout")} description={t("Use paid storefront revenue only. Lulu reserves the amount before submission.")}>
                <label>{t("Payout account")}<select value={accountId} onChange={(event) => setAccountId(event.target.value)} disabled={!canRequest} className="field"><option value="">{t("Select account")}</option>{data?.accounts.filter((account) => account.status === "ACTIVE").map((account) => <option key={account.id} value={account.id}>{account.label} · {account.currency}</option>)}</select></label>
                <div className="grid gap-3 sm:grid-cols-2"><label>{t("Amount")}<input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="0.00" className="field" disabled={!canRequest} /></label><label>{t("Currency")}<input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase().slice(0, 3))} className="field" maxLength={3} disabled={!canRequest} /></label></div>
                <label>{t("Reference")}<input value={reference} onChange={(event) => setReference(event.target.value)} placeholder={t("Monthly storefront payout")} className="field" disabled={!canRequest} /></label>
                <button type="button" onClick={() => void requestPayout()} disabled={!canRequest || requestBusy || !accountId || !amount || !reference} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] disabled:cursor-not-allowed disabled:opacity-50">{requestBusy ? <LoaderCircle size={15} className="animate-spin" /> : <ArrowUpRight size={15} />}{t("Request payout")}</button>
              </FormCard>
              <FormCard icon={<Plus size={18} />} title={t("Add payout account")} description={t("Save the provider beneficiary ID created in Airwallex. Lulu never stores raw bank credentials here.")}>
                <label>{t("Beneficiary ID")}<input value={beneficiaryId} onChange={(event) => setBeneficiaryId(event.target.value)} placeholder={t("Beneficiary ID")} className="field" disabled={!canManage} /></label>
                <label>{t("Account label")}<input value={accountLabel} onChange={(event) => setAccountLabel(event.target.value)} placeholder={t("Main operating account")} className="field" disabled={!canManage} /></label>
                <label>{t("Currency")}<input value={accountCurrency} onChange={(event) => setAccountCurrency(event.target.value.toUpperCase().slice(0, 3))} className="field" maxLength={3} disabled={!canManage} /></label>
                <button type="button" onClick={() => void saveAccount()} disabled={!canManage || busy === "account" || !beneficiaryId || !accountLabel} className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-semibold hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-50">{busy === "account" ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />}{t("Save payout account")}</button>
              </FormCard>
            </div>
          </section>
        </>}
      </div>
    </main>
  </WorkspaceSurfaceShell>;
}

function Metric({ icon, label, value, detail, accent = false }: { icon: React.ReactNode; label: string; value: string; detail: string; accent?: boolean }) {
  return <article className={`rounded-2xl border p-5 ${accent ? "border-emerald-500/25 bg-emerald-500/5" : "border-[var(--border)] bg-[var(--card)]"}`}><div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--secondary)] text-[var(--foreground)]">{icon}</span>{label}</div><p className="mt-5 text-2xl font-semibold tracking-[-.03em]">{value}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{detail}</p></article>;
}

function FormCard({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--secondary)]">{icon}</span><div><h2 className="text-lg font-semibold">{title}</h2><p className="mt-1 text-sm leading-5 text-[var(--muted-foreground)]">{description}</p></div></div><div className="mt-5 space-y-3">{children}</div><style>{`.field{width:100%;margin-top:.4rem;border:1px solid var(--border);border-radius:.75rem;background:var(--card);padding:.65rem .75rem;font-size:.875rem;color:var(--foreground);outline:none}.field:focus{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in srgb,var(--ring) 18%,transparent)}label{display:block;font-size:.75rem;font-weight:600;color:var(--muted-foreground)}`}</style></section>;
}
