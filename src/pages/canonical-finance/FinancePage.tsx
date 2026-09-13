import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  Landmark,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  Scale,
  ShieldCheck,
  X,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  commercialDocumentsApi,
  type Invoice,
  type InvoicePayment,
  type InvoicePaymentMethod,
  type RecordInvoicePaymentInput,
} from "../../api/commercial-documents";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  financeApi,
  type FinancialAccountBalance,
  type FinancialJournal,
  type FinancialJournalDetail,
  type FinancialTrialBalance,
} from "../../api/finance";
import { useLuluApp } from "../../api/LuluAppContext";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { navigateApp, routes } from "../../routing";

type FinanceSection = "overview" | "journals" | "accounts" | "invoices";
type Pagination = { page: number; limit: number; total: number; pages: number };
type DataLoadState = "loading" | "refreshing" | "ready" | "stale" | "error";

const FINANCE_SECTIONS = new Set<FinanceSection>(["overview", "journals", "accounts", "invoices"]);
const PAYMENT_METHODS: readonly InvoicePaymentMethod[] = ["BANK_TRANSFER", "CARD", "ALIPAY", "WECHAT_PAY", "CASH", "OTHER"];
const PAYABLE_INVOICE_STATUSES = new Set(["ISSUED", "SENT", "PARTIALLY_PAID", "OVERDUE"]);
const ZERO_DECIMAL_CURRENCIES = new Set(["BIF", "CLP", "DJF", "GNF", "ISK", "JPY", "KMF", "KRW", "PYG", "RWF", "UGX", "UYI", "VND", "VUV", "XAF", "XOF", "XPF"]);
const THREE_DECIMAL_CURRENCIES = new Set(["BHD", "IQD", "JOD", "KWD", "LYD", "OMR", "TND"]);
const FOUR_DECIMAL_CURRENCIES = new Set(["CLF", "UYW"]);
const emptyPagination: Pagination = { page: 1, limit: 25, total: 0, pages: 0 };

function isFinanceSection(value: string | null): value is FinanceSection {
  return Boolean(value && FINANCE_SECTIONS.has(value as FinanceSection));
}

function currencyDigits(currency: string) {
  if (ZERO_DECIMAL_CURRENCIES.has(currency)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(currency)) return 3;
  if (FOUR_DECIMAL_CURRENCIES.has(currency)) return 4;
  return 2;
}

function decimalToMinor(value: string, currency: string) {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return null;
  const digits = currencyDigits(currency);
  const [whole = "0", fraction = ""] = normalized.split(".");
  const kept = fraction.slice(0, digits).padEnd(digits, "0");
  const discarded = fraction.slice(digits);
  let minor = BigInt(whole) * (10n ** BigInt(digits)) + BigInt(kept || "0");
  if (discarded[0] && discarded[0] >= "5") minor += 1n;
  return minor;
}

function amountFromMinor(value: string | bigint, currency: string) {
  let minor: bigint;
  try { minor = typeof value === "bigint" ? value : BigInt(value); }
  catch { return `— ${currency}`; }
  const digits = currencyDigits(currency);
  const sign = minor < 0n ? "-" : "";
  const absolute = minor < 0n ? -minor : minor;
  const raw = absolute.toString().padStart(digits + 1, "0");
  const major = digits ? `${raw.slice(0, -digits)}.${raw.slice(-digits)}` : raw;
  const numeric = Number(`${sign}${major}`);
  if (Number.isSafeInteger(Number(absolute)) && Number.isFinite(numeric)) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(numeric);
    } catch { /* fall through to the exact ISO representation */ }
  }
  return `${sign}${major} ${currency}`;
}

function amountFromDecimal(value: string, currency: string) {
  const minor = decimalToMinor(value || "0", currency);
  return minor === null ? `— ${currency}` : amountFromMinor(minor, currency);
}

function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return withTime
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date)
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function readableCode(value: string) {
  return value.toLowerCase().split("_").filter(Boolean).map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" ");
}

function createOperationKey(invoiceId: string) {
  const cryptoApi = globalThis.crypto;
  const suffix = typeof cryptoApi?.randomUUID === "function"
    ? cryptoApi.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `finance-ui:${invoiceId}:${suffix}`;
}

function paymentOperationStorageKey(invoiceId: string) {
  return `lulu.finance.payment-operation:${invoiceId}`;
}

function getPaymentOperationKey(invoiceId: string) {
  try {
    const storageKey = paymentOperationStorageKey(invoiceId);
    const existing = window.sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const created = createOperationKey(invoiceId);
    window.sessionStorage.setItem(storageKey, created);
    return created;
  } catch {
    return createOperationKey(invoiceId);
  }
}

function clearPaymentOperationKey(invoiceId: string) {
  try { window.sessionStorage.removeItem(paymentOperationStorageKey(invoiceId)); }
  catch { /* storage is optional */ }
}

export default function FinancePage() {
  const t = useTranslation();
  const { selectedWorkspace, hasCapability } = useLuluApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get("section");
  const section: FinanceSection = isFinanceSection(requestedSection) ? requestedSection : "overview";
  const requestedCurrency = searchParams.get("currency")?.toUpperCase();
  const [currency, setCurrency] = useState(() => requestedCurrency?.match(/^[A-Z]{3}$/) ? requestedCurrency : "CNY");
  const [currencies, setCurrencies] = useState<string[]>([currency]);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [journals, setJournals] = useState<FinancialJournal[]>([]);
  const [journalPage, setJournalPage] = useState(1);
  const [journalPagination, setJournalPagination] = useState<Pagination>(emptyPagination);
  const [trialBalance, setTrialBalance] = useState<FinancialTrialBalance | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const [trialLoading, setTrialLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [journalsState, setJournalsState] = useState<DataLoadState>("loading");
  const [trialState, setTrialState] = useState<DataLoadState>("loading");
  const [invoicesState, setInvoicesState] = useState<DataLoadState>("loading");
  const verifiedFinanceRef = useRef<{ journals: string | null; trial: string | null; invoices: string | null }>({ journals: null, trial: null, invoices: null });
  const [financeError, setFinanceError] = useState("");
  const [invoiceError, setInvoiceError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [journalDetail, setJournalDetail] = useState<FinancialJournalDetail | null>(null);
  const [journalDetailLoading, setJournalDetailLoading] = useState(false);
  const [journalDetailError, setJournalDetailError] = useState("");
  const [selectedAccountCode, setSelectedAccountCode] = useState<string | null>(null);
  const [accountDetail, setAccountDetail] = useState<FinancialAccountBalance | null>(null);
  const [accountDetailLoading, setAccountDetailLoading] = useState(false);
  const [accountDetailError, setAccountDetailError] = useState("");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoicePayments, setInvoicePayments] = useState<InvoicePayment[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsState, setPaymentsState] = useState<DataLoadState>("ready");
  const [paymentsError, setPaymentsError] = useState("");
  const verifiedPaymentsRef = useRef<string | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  const canRecordPayments = hasCapability("finance.manage");
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null;

  useEffect(() => {
    const initialCurrency = requestedCurrency?.match(/^[A-Z]{3}$/) ? requestedCurrency : "CNY";
    setCurrency(initialCurrency);
    setCurrencies([initialCurrency]);
    setJournalPage(1);
    setSelectedJournalId(null);
    setSelectedAccountCode(null);
    setSelectedInvoiceId(null);
    setJournalDetail(null);
    setAccountDetail(null);
    setInvoicePayments([]);
    setPaymentsState("ready");
    verifiedPaymentsRef.current = null;
    verifiedFinanceRef.current = { journals: null, trial: null, invoices: null };
    setJournals([]);
    setJournalPagination(emptyPagination);
    setTrialBalance(null);
    setInvoices([]);
    setJournalsState("loading");
    setTrialState("loading");
    setInvoicesState("loading");
  }, [requestedCurrency, selectedWorkspace?.id]);

  const selectSection = (next: FinanceSection) => {
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      if (next === "overview") updated.delete("section");
      else updated.set("section", next);
      updated.delete("recordId");
      updated.delete("accountCode");
      return updated;
    }, { replace: true });
  };

  const changeCurrency = (next: string) => {
    setCurrency(next);
    setJournalPage(1);
    setSelectedAccountCode(null);
    setAccountDetail(null);
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("currency", next);
      updated.delete("accountCode");
      return updated;
    }, { replace: true });
  };

  useEffect(() => {
    if (!selectedWorkspace) {
      setInvoices([]);
      setInvoicesLoading(false);
      setInvoicesState("ready");
      return;
    }
    const invoiceKey = selectedWorkspace.id;
    const hasVerifiedInvoices = verifiedFinanceRef.current.invoices === invoiceKey;
    let active = true;
    setInvoicesLoading(true);
    setInvoicesState(hasVerifiedInvoices ? "refreshing" : "loading");
    if (!hasVerifiedInvoices) setInvoices([]);
    setInvoiceError("");
    void Promise.allSettled([
      commercialDocumentsApi.listInvoices(selectedWorkspace.id, "limit=100"),
      financeApi.listJournals(selectedWorkspace.id, { page: 1, limit: 100 }),
    ]).then(([invoiceResult, journalResult]) => {
      if (!active) return;
      const nextInvoices = invoiceResult.status === "fulfilled" ? invoiceResult.value.data.items : [];
      const discoveryJournals = journalResult.status === "fulfilled" ? journalResult.value.data.items : [];
      if (invoiceResult.status === "fulfilled") {
        setInvoices(nextInvoices);
        verifiedFinanceRef.current.invoices = invoiceKey;
        setInvoicesState("ready");
      } else {
        const message = getFriendlyErrorMessage(invoiceResult.reason, t("Invoices could not be loaded."));
        setInvoicesState(hasVerifiedInvoices ? "stale" : "error");
        setInvoiceError(hasVerifiedInvoices ? `${t("Showing the last successfully loaded data.")} ${message}` : message);
      }
      const discovered = [...new Set([
        ...discoveryJournals.map((journal) => journal.currency),
        ...nextInvoices.map((invoice) => invoice.currency),
      ].filter((value) => /^[A-Z]{3}$/.test(value)))].sort();
      if (discovered.length) {
        setCurrencies(discovered);
        setCurrency((current) => {
          if (requestedCurrency && discovered.includes(requestedCurrency)) return requestedCurrency;
          if (discovered.includes(current)) return current;
          return discovered.includes("CNY") ? "CNY" : discovered[0]!;
        });
      }
    }).finally(() => { if (active) setInvoicesLoading(false); });
    return () => { active = false; };
  }, [refreshVersion, requestedCurrency, selectedWorkspace, t]);

  useEffect(() => {
    if (!selectedWorkspace) {
      setJournals([]);
      setTrialBalance(null);
      setJournalsLoading(false);
      setTrialLoading(false);
      setJournalsState("ready");
      setTrialState("ready");
      return;
    }
    const journalsKey = `${selectedWorkspace.id}:${currency}:${journalPage}`;
    const trialKey = `${selectedWorkspace.id}:${currency}`;
    const hasVerifiedJournals = verifiedFinanceRef.current.journals === journalsKey;
    const hasVerifiedTrial = verifiedFinanceRef.current.trial === trialKey;
    const controller = new AbortController();
    setJournalsLoading(true);
    setTrialLoading(true);
    setJournalsState(hasVerifiedJournals ? "refreshing" : "loading");
    setTrialState(hasVerifiedTrial ? "refreshing" : "loading");
    if (!hasVerifiedJournals) { setJournals([]); setJournalPagination({ ...emptyPagination, page: journalPage }); }
    if (!hasVerifiedTrial) setTrialBalance(null);
    setFinanceError("");
    void Promise.allSettled([
      financeApi.listJournals(selectedWorkspace.id, { page: journalPage, limit: 25, currency }, controller.signal),
      financeApi.getTrialBalance(selectedWorkspace.id, currency, undefined, controller.signal),
    ]).then(([journalResult, trialResult]) => {
      if (controller.signal.aborted) return;
      const errors: string[] = [];
      if (journalResult.status === "fulfilled") {
        setJournals(journalResult.value.data.items);
        setJournalPagination(journalResult.value.data.pagination);
        verifiedFinanceRef.current.journals = journalsKey;
        setJournalsState("ready");
      } else {
        setJournalsState(hasVerifiedJournals ? "stale" : "error");
        const message = getFriendlyErrorMessage(journalResult.reason, t("Financial journals could not be loaded."));
        errors.push(hasVerifiedJournals ? `${t("Showing the last successfully loaded data.")} ${message}` : message);
      }
      if (trialResult.status === "fulfilled") {
        setTrialBalance(trialResult.value.data);
        verifiedFinanceRef.current.trial = trialKey;
        setTrialState("ready");
      }
      else {
        setTrialState(hasVerifiedTrial ? "stale" : "error");
        const message = getFriendlyErrorMessage(trialResult.reason, t("The trial balance could not be loaded."));
        errors.push(hasVerifiedTrial ? `${t("Showing the last successfully loaded data.")} ${message}` : message);
      }
      setFinanceError([...new Set(errors)].join(" "));
    }).finally(() => {
      if (!controller.signal.aborted) {
        setJournalsLoading(false);
        setTrialLoading(false);
      }
    });
    return () => controller.abort();
  }, [currency, journalPage, refreshVersion, selectedWorkspace, t]);

  useEffect(() => {
    const recordId = searchParams.get("recordId");
    if (!recordId || !selectedWorkspace) return;
    const knownInvoice = invoices.find((invoice) => invoice.id === recordId);
    if (knownInvoice) {
      setSelectedInvoiceId(recordId);
      return;
    }
    if (journals.some((journal) => journal.id === recordId)) {
      setSelectedJournalId(recordId);
      return;
    }
    if (section !== "invoices") {
      if (!journalsLoading) setSelectedJournalId(recordId);
      return;
    }
    if (invoicesLoading) return;
    let active = true;
    void commercialDocumentsApi.getInvoice(selectedWorkspace.id, recordId)
      .then((response) => {
        if (!active) return;
        const linkedInvoice = response.data.invoice;
        setInvoices((current) => current.some((invoice) => invoice.id === recordId) ? current : [linkedInvoice, ...current]);
        setCurrencies((current) => [...new Set([...current, linkedInvoice.currency])].sort());
        setCurrency(linkedInvoice.currency);
        setSelectedInvoiceId(recordId);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [invoices, invoicesLoading, journals, journalsLoading, searchParams, section, selectedWorkspace]);

  useEffect(() => {
    const accountCode = searchParams.get("accountCode");
    if (accountCode && /^[A-Z][A-Z0-9_.-]{1,79}$/.test(accountCode.toUpperCase())) {
      setSelectedAccountCode(accountCode.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (!selectedWorkspace || !selectedJournalId) {
      setJournalDetail(null);
      return;
    }
    const controller = new AbortController();
    setJournalDetail(null);
    setJournalDetailError("");
    setJournalDetailLoading(true);
    void financeApi.getJournal(selectedWorkspace.id, selectedJournalId, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setJournalDetail(response.data);
        setCurrencies((current) => [...new Set([...current, response.data.currency])].sort());
        setCurrency(response.data.currency);
      })
      .catch((cause) => { if (!controller.signal.aborted) setJournalDetailError(getFriendlyErrorMessage(cause, t("The journal could not be loaded."))); })
      .finally(() => { if (!controller.signal.aborted) setJournalDetailLoading(false); });
    return () => controller.abort();
  }, [selectedJournalId, selectedWorkspace, t]);

  useEffect(() => {
    if (!selectedWorkspace || !selectedAccountCode) {
      setAccountDetail(null);
      return;
    }
    const controller = new AbortController();
    setAccountDetail(null);
    setAccountDetailError("");
    setAccountDetailLoading(true);
    void financeApi.getAccountBalance(selectedWorkspace.id, selectedAccountCode, currency, undefined, controller.signal)
      .then((response) => { if (!controller.signal.aborted) setAccountDetail(response.data); })
      .catch((cause) => { if (!controller.signal.aborted) setAccountDetailError(getFriendlyErrorMessage(cause, t("The account balance could not be loaded."))); })
      .finally(() => { if (!controller.signal.aborted) setAccountDetailLoading(false); });
    return () => controller.abort();
  }, [currency, selectedAccountCode, selectedWorkspace, t]);

  const loadPayments = useCallback(async (workspaceId: string, invoiceId: string, signal?: AbortSignal) => {
    const paymentsKey = `${workspaceId}:${invoiceId}`;
    const hasVerifiedPayments = verifiedPaymentsRef.current === paymentsKey;
    setPaymentsLoading(true);
    setPaymentsState(hasVerifiedPayments ? "refreshing" : "loading");
    if (!hasVerifiedPayments) setInvoicePayments([]);
    setPaymentsError("");
    try {
      const response = await commercialDocumentsApi.listInvoicePayments(workspaceId, invoiceId, signal);
      if (signal?.aborted) return;
      setInvoicePayments(response.data);
      verifiedPaymentsRef.current = paymentsKey;
      setPaymentsState("ready");
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === "AbortError")) {
        const message = getFriendlyErrorMessage(cause, t("Invoice payments could not be loaded."));
        setPaymentsState(hasVerifiedPayments ? "stale" : "error");
        setPaymentsError(hasVerifiedPayments ? `${t("Showing the last successfully loaded data.")} ${message}` : message);
      }
    } finally {
      if (!signal?.aborted) setPaymentsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!selectedWorkspace || !selectedInvoiceId) {
      setInvoicePayments([]);
      setPaymentsState("ready");
      setPaymentsLoading(false);
      setPaymentsError("");
      verifiedPaymentsRef.current = null;
      return;
    }
    const controller = new AbortController();
    void loadPayments(selectedWorkspace.id, selectedInvoiceId, controller.signal);
    return () => controller.abort();
  }, [loadPayments, selectedInvoiceId, selectedWorkspace]);

  const openJournal = (journal: FinancialJournal) => {
    setSelectedJournalId(journal.id);
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("section", "journals");
      updated.set("recordId", journal.id);
      updated.delete("accountCode");
      return updated;
    }, { replace: true });
  };

  const openAccount = (accountCode: string) => {
    setSelectedAccountCode(accountCode);
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("section", "accounts");
      updated.set("accountCode", accountCode);
      updated.delete("recordId");
      return updated;
    }, { replace: true });
  };

  const openInvoice = (invoice: Invoice) => {
    setSelectedInvoiceId(invoice.id);
    setSearchParams((current) => {
      const updated = new URLSearchParams(current);
      updated.set("section", "invoices");
      updated.set("recordId", invoice.id);
      updated.delete("accountCode");
      return updated;
    }, { replace: true });
  };

  const refresh = () => {
    setNotice("");
    setRefreshVersion((version) => version + 1);
  };

  const paymentRecorded = async (payment: InvoicePayment) => {
    setPaymentInvoice(null);
    setNotice(t("Payment recorded. Lulu is projecting the receipt into the immutable operational ledger."));
    setRefreshVersion((version) => version + 1);
    if (selectedWorkspace) await loadPayments(selectedWorkspace.id, payment.invoiceId);
  };

  const invoicesForCurrency = invoices.filter((invoice) => invoice.currency === currency);
  const receivablesAccount = trialBalance?.accounts.find((account) => account.accountCode === "ACCOUNTS_RECEIVABLE");
  const outstandingMinor = receivablesAccount?.balanceMinor ?? "0";
  const recentJournals = journals.slice(0, 6);
  const busy = journalsLoading || trialLoading || invoicesLoading;

  if (!selectedWorkspace) {
    return <WorkspaceSurfaceShell activeSlug="quietly-stone-4158"><main className="page-frame min-h-screen bg-[var(--background)] p-6 sm:p-8"><div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8"><Landmark size={24}/><h1 className="mt-5 text-3xl font-semibold">{t("Finance")}</h1><p className="mt-2 text-sm text-[var(--muted-foreground)]">{t("Choose a workspace to inspect its financial operations.")}</p></div></main></WorkspaceSurfaceShell>;
  }

  return (
    <WorkspaceSurfaceShell activeSlug="quietly-stone-4158">
      <main className="page-frame min-h-screen min-w-0 overflow-x-hidden bg-[var(--background)] px-4 py-6 sm:px-7 sm:py-8">
        <div className="mx-auto max-w-[1480px] space-y-6">
          <header className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_42%),var(--card)] p-5 shadow-sm sm:p-7">
            <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="eyebrow">{t("Operational finance")}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700"><ShieldCheck size={13}/>{t("Append-only ledger")}</span>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{t("Finance")}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">{t("One canonical view of invoice receivables, recorded receipts and balanced journal entries. Lulu does not present this operational subledger as statutory accounting or tax advice.")}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/70 px-3 py-2 text-xs font-medium">
                  <span className="text-[var(--muted-foreground)]">{t("Currency")}</span>
                  <select value={currency} onChange={(event) => changeCurrency(event.target.value)} className="bg-transparent font-semibold outline-none" aria-label={t("Ledger currency")}>
                    {currencies.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <button type="button" onClick={refresh} disabled={busy} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-xs font-semibold transition hover:bg-[var(--secondary)] disabled:opacity-50"><RefreshCw size={15} className={busy ? "animate-spin" : ""}/>{t("Refresh")}</button>
              </div>
            </div>
          </header>

          {financeError ? <Feedback kind="error"><strong>{t("Some finance data is unavailable.")}</strong><span>{financeError}</span><button type="button" onClick={refresh}>{t("Try again")}</button></Feedback> : null}
          {invoiceError ? <Feedback kind="warning"><strong>{t("Invoice data is unavailable.")}</strong><span>{invoiceError}</span></Feedback> : null}
          {notice ? <Feedback kind="success"><strong>{t("Finance updated")}</strong><span>{notice}</span><button type="button" onClick={() => setNotice("")}>{t("Dismiss")}</button></Feedback> : null}

          <nav aria-label={t("Finance sections")} className="flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm">
            {(["overview", "journals", "accounts", "invoices"] as const).map((item) => (
              <button key={item} type="button" aria-current={section === item ? "page" : undefined} onClick={() => selectSection(item)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${section === item ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"}`}>
                {t(item === "overview" ? "Overview" : item === "journals" ? "Journals" : item === "accounts" ? "Accounts" : "Invoices & payments")}
              </button>
            ))}
          </nav>

          {section === "overview" ? <Overview currency={currency} journals={recentJournals} journalsTotal={journalPagination.total} journalsState={journalsState} trialBalance={trialBalance} trialState={trialState} outstandingMinor={outstandingMinor} loading={busy} onOpenJournal={openJournal} onOpenSection={selectSection} t={t}/> : null}
          {section === "journals" ? <Journals currency={currency} journals={journals} pagination={journalPagination} loading={journalsLoading} loadState={journalsState} onOpen={openJournal} onPage={setJournalPage} t={t}/> : null}
          {section === "accounts" ? <Accounts currency={currency} trialBalance={trialBalance} loading={trialLoading} loadState={trialState} onOpen={openAccount} t={t}/> : null}
          {section === "invoices" ? <Invoices currency={currency} invoices={invoicesForCurrency} loading={invoicesLoading} loadState={invoicesState} selected={selectedInvoice} payments={invoicePayments} paymentsLoading={paymentsLoading} paymentsState={paymentsState} paymentsError={paymentsError} canRecordPayments={canRecordPayments} onOpen={openInvoice} onRecord={setPaymentInvoice} t={t}/> : null}
        </div>
      </main>

      {selectedJournalId ? <SidePanel title={t("Journal entry")} onClose={() => {
        setSelectedJournalId(null);
        setJournalDetail(null);
        setSearchParams((current) => { const updated = new URLSearchParams(current); updated.delete("recordId"); return updated; }, { replace: true });
      }}><JournalDetail detail={journalDetail} loading={journalDetailLoading} error={journalDetailError} t={t}/></SidePanel> : null}

      {selectedAccountCode ? <SidePanel title={t("Account balance")} onClose={() => {
        setSelectedAccountCode(null);
        setAccountDetail(null);
        setSearchParams((current) => { const updated = new URLSearchParams(current); updated.delete("accountCode"); return updated; }, { replace: true });
      }}><AccountDetail accountCode={selectedAccountCode} detail={accountDetail} loading={accountDetailLoading} error={accountDetailError} t={t}/></SidePanel> : null}

      {paymentInvoice && canRecordPayments ? <PaymentDialog workspaceId={selectedWorkspace.id} invoice={paymentInvoice} onClose={() => setPaymentInvoice(null)} onRecorded={paymentRecorded} t={t}/> : null}
    </WorkspaceSurfaceShell>
  );
}

function Overview({ currency, journals, journalsTotal, journalsState, trialBalance, trialState, outstandingMinor, loading, onOpenJournal, onOpenSection, t }: {
  currency: string;
  journals: FinancialJournal[];
  journalsTotal: number;
  journalsState: DataLoadState;
  trialBalance: FinancialTrialBalance | null;
  trialState: DataLoadState;
  outstandingMinor: string;
  loading: boolean;
  onOpenJournal: (journal: FinancialJournal) => void;
  onOpenSection: (section: FinanceSection) => void;
  t: ReturnType<typeof useTranslation>;
}) {
  return <div className="space-y-6">
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric icon={BookOpenCheck} label={t("Journal entries")} value={loading || journalsState === "error" ? "—" : journalsTotal.toLocaleString()} helper={t("Immutable operational postings")}/>
      <Metric icon={Scale} label={t("Trial balance")} value={trialBalance ? t(trialBalance.balanced ? "Balanced" : "Needs attention") : "—"} helper={trialBalance ? `${amountFromMinor(trialBalance.totals.debitsMinor, currency)} ${t("debits")}` : t("Waiting for ledger data")} tone={trialBalance?.balanced ? "success" : trialBalance ? "danger" : undefined}/>
      <Metric icon={Banknote} label={t("Accounts receivable")} value={trialState === "loading" || trialState === "error" ? "—" : amountFromMinor(outstandingMinor, currency)} helper={t("Live accounts-receivable ledger balance")}/>
      <Metric icon={Landmark} label={t("Ledger accounts")} value={trialBalance ? trialBalance.accounts.length.toLocaleString() : "—"} helper={t("Accounts with recorded activity")}/>
    </section>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(330px,.8fr)]">
      <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <SectionHeader eyebrow={t("Latest activity")} title={t("Operational journals")} action={<button type="button" onClick={() => onOpenSection("journals")} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">{t("View all")}<ArrowRight size={14}/></button>}/>
        {loading && journals.length === 0 ? <LoadingRows/> : (journalsState === "error" || journalsState === "stale") && journals.length === 0 ? <EmptyState icon={AlertCircle} title={t("Financial journals unavailable")} text={t("Refresh to verify the current ledger state.")}/> : journalsState === "ready" && journals.length === 0 ? <EmptyState icon={BookOpenCheck} title={t("No journal entries yet")} text={t("Issued invoices and recorded payments will appear here after the backend creates their balanced postings.")}/> : <div className="divide-y divide-[var(--border)]">{journals.map((journal) => <JournalRow key={journal.id} journal={journal} onOpen={() => onOpenJournal(journal)} t={t}/>)}</div>}
      </article>
      <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
        <p className="eyebrow">{t("Accounting boundary")}</p>
        <h2 className="mt-2 text-xl font-semibold">{t("Truthful by design")}</h2>
        <div className="mt-5 space-y-4">
          <BoundaryItem icon={CheckCircle2} title={t("Balanced, atomic postings")} text={t("Every journal stores equal debit and credit totals in ISO currency minor units.")}/>
          <BoundaryItem icon={ShieldCheck} title={t("Append-only audit trail")} text={t("Posted journals and recorded payments cannot be silently edited or deleted.")}/>
          <BoundaryItem icon={ReceiptText} title={t("Canonical invoice lifecycle")} text={t("Receipts update the same invoice used throughout Lulu and are projected to the ledger.")}/>
          <BoundaryItem icon={AlertCircle} title={t("Operational, not statutory")} text={t("This workspace supports operations and reconciliation. It is not a statutory general ledger or tax advice.")}/>
        </div>
      </article>
    </section>
  </div>;
}

function Journals({ currency, journals, pagination, loading, loadState, onOpen, onPage, t }: { currency: string; journals: FinancialJournal[]; pagination: Pagination; loading: boolean; loadState: DataLoadState; onOpen: (journal: FinancialJournal) => void; onPage: (page: number) => void; t: ReturnType<typeof useTranslation> }) {
  return <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
    <SectionHeader eyebrow={t("Immutable ledger")} title={t("Financial journals")} subtitle={`${loadState === "loading" || loadState === "error" ? "—" : pagination.total.toLocaleString()} ${t("entries in")} ${currency}`}/>
    {loading && journals.length === 0 ? <LoadingRows/> : (loadState === "error" || loadState === "stale") && journals.length === 0 ? <EmptyState icon={AlertCircle} title={t("Financial journals unavailable")} text={t("Refresh to verify the current ledger state.")}/> : loadState === "ready" && journals.length === 0 ? <EmptyState icon={BookOpenCheck} title={t("No journals in this currency")} text={t("Select another ledger currency or wait until a real financial event is posted.")}/> : <div className="min-w-0 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-y border-[var(--border)] bg-[var(--secondary)]/55 text-[11px] uppercase tracking-[.12em] text-[var(--muted-foreground)]"><tr><th className="px-5 py-3 font-semibold">{t("Occurred")}</th><th className="px-5 py-3 font-semibold">{t("Journal")}</th><th className="px-5 py-3 font-semibold">{t("Reference")}</th><th className="px-5 py-3 text-right font-semibold">{t("Debits")}</th><th className="px-5 py-3 text-right font-semibold">{t("Credits")}</th><th className="w-12 px-3 py-3"><span className="sr-only">{t("Open")}</span></th></tr></thead><tbody className="divide-y divide-[var(--border)]">{journals.map((journal) => <tr key={journal.id} className="transition hover:bg-[var(--secondary)]/35"><td className="whitespace-nowrap px-5 py-4 text-xs text-[var(--muted-foreground)]">{formatDate(journal.occurredAt, true)}</td><td className="px-5 py-4"><strong className="font-medium">{readableCode(journal.journalType)}</strong><p className="mt-1 text-xs text-[var(--muted-foreground)]">{journal.id.slice(0, 8)}</p></td><td className="px-5 py-4 text-xs"><span className="rounded-full bg-[var(--secondary)] px-2.5 py-1">{journal.referenceType ? readableCode(journal.referenceType) : t("System")}</span></td><td className="whitespace-nowrap px-5 py-4 text-right font-medium">{amountFromMinor(journal.totalDebitsMinor, journal.currency)}</td><td className="whitespace-nowrap px-5 py-4 text-right font-medium">{amountFromMinor(journal.totalCreditsMinor, journal.currency)}</td><td className="px-3 py-4"><button type="button" onClick={() => onOpen(journal)} className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={`${t("Open journal")} ${journal.id}`}><ArrowRight size={16}/></button></td></tr>)}</tbody></table></div>}
    {pagination.pages > 1 ? <footer className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-xs text-[var(--muted-foreground)]"><span>{t("Page")} {pagination.page} {t("of")} {pagination.pages}</span><div className="flex gap-1"><button type="button" disabled={pagination.page <= 1 || loading} onClick={() => onPage(pagination.page - 1)} className="rounded-lg border border-[var(--border)] p-2 disabled:opacity-35" aria-label={t("Previous page")}><ChevronLeft size={15}/></button><button type="button" disabled={pagination.page >= pagination.pages || loading} onClick={() => onPage(pagination.page + 1)} className="rounded-lg border border-[var(--border)] p-2 disabled:opacity-35" aria-label={t("Next page")}><ChevronRight size={15}/></button></div></footer> : null}
  </section>;
}

function Accounts({ currency, trialBalance, loading, loadState, onOpen, t }: { currency: string; trialBalance: FinancialTrialBalance | null; loading: boolean; loadState: DataLoadState; onOpen: (accountCode: string) => void; t: ReturnType<typeof useTranslation> }) {
  return <section className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
    <SectionHeader eyebrow={t("As of now")} title={t("Trial balance")} subtitle={trialBalance ? `${trialBalance.accounts.length.toLocaleString()} ${t("active accounts")} · ${currency}` : currency} action={trialBalance ? <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${trialBalance.balanced ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>{trialBalance.balanced ? <CheckCircle2 size={13}/> : <AlertCircle size={13}/>} {t(trialBalance.balanced ? "Balanced" : "Out of balance")}</span> : undefined}/>
    {loading && !trialBalance ? <LoadingRows/> : (loadState === "error" || loadState === "stale") && !trialBalance ? <EmptyState icon={AlertCircle} title={t("Trial balance unavailable")} text={t("Refresh to verify the current ledger state.")}/> : loadState === "ready" && (!trialBalance || trialBalance.accounts.length === 0) ? <EmptyState icon={Scale} title={t("No account activity yet")} text={t("Accounts appear only after a real balanced journal has been posted in the selected currency.")}/> : trialBalance ? <div className="min-w-0 overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="border-y border-[var(--border)] bg-[var(--secondary)]/55 text-[11px] uppercase tracking-[.12em] text-[var(--muted-foreground)]"><tr><th className="px-5 py-3 font-semibold">{t("Account")}</th><th className="px-5 py-3 text-right font-semibold">{t("Debits")}</th><th className="px-5 py-3 text-right font-semibold">{t("Credits")}</th><th className="px-5 py-3 text-right font-semibold">{t("Balance")}</th><th className="w-12 px-3 py-3"><span className="sr-only">{t("Open")}</span></th></tr></thead><tbody className="divide-y divide-[var(--border)]">{trialBalance.accounts.map((account) => <tr key={account.accountCode} className="transition hover:bg-[var(--secondary)]/35"><td className="px-5 py-4"><strong className="font-medium">{readableCode(account.accountCode)}</strong><p className="mt-1 font-mono text-[11px] text-[var(--muted-foreground)]">{account.accountCode}</p></td><td className="whitespace-nowrap px-5 py-4 text-right">{amountFromMinor(account.debitsMinor, currency)}</td><td className="whitespace-nowrap px-5 py-4 text-right">{amountFromMinor(account.creditsMinor, currency)}</td><td className="whitespace-nowrap px-5 py-4 text-right"><strong>{amountFromMinor(account.balanceMinor, currency)}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{t(account.balanceDirection)}</p></td><td className="px-3 py-4"><button type="button" onClick={() => onOpen(account.accountCode)} className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]" aria-label={`${t("Open account")} ${account.accountCode}`}><ArrowRight size={16}/></button></td></tr>)}</tbody><tfoot className="border-t-2 border-[var(--border)] bg-[var(--secondary)]/35 font-semibold"><tr><td className="px-5 py-4">{t("Totals")}</td><td className="whitespace-nowrap px-5 py-4 text-right">{amountFromMinor(trialBalance.totals.debitsMinor, currency)}</td><td className="whitespace-nowrap px-5 py-4 text-right">{amountFromMinor(trialBalance.totals.creditsMinor, currency)}</td><td className="px-5 py-4 text-right">{trialBalance.balanced ? t("Balanced") : t("Review required")}</td><td/></tr></tfoot></table></div> : null}
  </section>;
}

function Invoices({ currency, invoices, loading, loadState, selected, payments, paymentsLoading, paymentsState, paymentsError, canRecordPayments, onOpen, onRecord, t }: { currency: string; invoices: Invoice[]; loading: boolean; loadState: DataLoadState; selected: Invoice | null; payments: InvoicePayment[]; paymentsLoading: boolean; paymentsState: DataLoadState; paymentsError: string; canRecordPayments: boolean; onOpen: (invoice: Invoice) => void; onRecord: (invoice: Invoice) => void; t: ReturnType<typeof useTranslation> }) {
  return <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)]">
    <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <SectionHeader eyebrow={t("Accounts receivable")} title={t("Invoices")} subtitle={`${loadState === "loading" || loadState === "error" ? "—" : invoices.length.toLocaleString()} ${t("recent documents in")} ${currency}`} action={<button type="button" onClick={() => navigateApp(routes.app.invoices)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]">{t("Manage invoices")}<ExternalLink size={14}/></button>}/>
      {loading && invoices.length === 0 ? <LoadingRows/> : (loadState === "error" || loadState === "stale") && invoices.length === 0 ? <EmptyState icon={AlertCircle} title={t("Invoice data is unavailable.")} text={t("Refresh to verify the current workspace state.")}/> : loadState === "ready" && invoices.length === 0 ? <EmptyState icon={ReceiptText} title={t("No invoices in this currency")} text={t("Create an invoice or select another ledger currency.")}/> : <div className="divide-y divide-[var(--border)]">{invoices.map((invoice) => <button key={invoice.id} type="button" onClick={() => onOpen(invoice)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[var(--secondary)]/45 ${selected?.id === invoice.id ? "bg-[var(--secondary)]/65" : ""}`}><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="truncate text-sm">{invoice.invoiceNumber}</strong><InvoiceStatus status={invoice.status}/>{invoice.invoiceType === "PROFORMA" ? <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{t("Proforma")}</span> : null}</div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{t("Issued")} {formatDate(invoice.issueDate)} · {t("Due")} {formatDate(invoice.dueDate)}</p></div><div className="shrink-0 text-right"><strong className="text-sm">{amountFromDecimal(invoice.amountDue, invoice.currency)}</strong><p className="mt-1 text-xs text-[var(--muted-foreground)]">{t("of")} {amountFromDecimal(invoice.grandTotal, invoice.currency)}</p></div></button>)}</div>}
    </article>
    <article className="min-w-0 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
      {!selected ? <EmptyState icon={FileCheck2} title={t("Select an invoice")} text={t("Inspect its canonical balance and recorded receipts without leaving Finance.")}/> : <div><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="eyebrow">{t("Invoice balance")}</p><h2 className="mt-2 text-xl font-semibold">{selected.invoiceNumber}</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">{selected.invoiceType} · {selected.currency}</p></div><InvoiceStatus status={selected.status}/></div><dl className="mt-5 grid grid-cols-2 gap-3"><BalanceCell label={t("Total")} value={amountFromDecimal(selected.grandTotal, selected.currency)}/><BalanceCell label={t("Paid")} value={amountFromDecimal(selected.amountPaid, selected.currency)}/><BalanceCell label={t("Amount due")} value={amountFromDecimal(selected.amountDue, selected.currency)} emphasized/><BalanceCell label={t("Due date")} value={formatDate(selected.dueDate)}/></dl><div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={() => navigateApp(`${routes.app.invoices}?recordId=${encodeURIComponent(selected.id)}`)} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3.5 py-2 text-xs font-semibold hover:bg-[var(--secondary)]"><ExternalLink size={14}/>{t("Open invoice")}</button>{canRecordPayments && PAYABLE_INVOICE_STATUSES.has(selected.status) && selected.invoiceType !== "PROFORMA" && (decimalToMinor(selected.amountDue, selected.currency) ?? 0n) > 0n ? <button type="button" onClick={() => onRecord(selected)} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-3.5 py-2 text-xs font-semibold text-[var(--background)]"><Banknote size={14}/>{t("Record payment")}</button> : null}</div>{!canRecordPayments ? <p className="mt-3 rounded-xl bg-[var(--secondary)] p-3 text-xs leading-5 text-[var(--muted-foreground)]">{t("Only an owner, workspace administrator or finance manager can record payments.")}</p> : null}<div className="mt-6 border-t border-[var(--border)] pt-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">{t("Recorded payments")}</h3><span className="text-xs text-[var(--muted-foreground)]">{paymentsState === "loading" || paymentsState === "error" ? "—" : payments.length.toLocaleString()}</span></div>{paymentsError ? <p role="alert" className="mt-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-700">{paymentsError}</p> : null}{paymentsLoading && payments.length === 0 ? <div className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><LoaderCircle size={15} className="animate-spin"/>{t("Loading payments…")}</div> : paymentsState === "ready" && payments.length === 0 ? <p className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-4 text-xs leading-5 text-[var(--muted-foreground)]">{t("No payment has been recorded for this invoice.")}</p> : payments.length > 0 ? <div className="mt-3 space-y-2">{payments.map((payment) => <div key={payment.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-3"><div className="flex items-center justify-between gap-3"><strong className="text-sm">{amountFromMinor(payment.amountMinor, payment.currency)}</strong><span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{readableCode(payment.paymentMethod)}</span></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{formatDate(payment.receivedAt, true)}{payment.paymentReference ? ` · ${payment.paymentReference}` : ""}</p></div>)}</div> : null}</div></div>}
    </article>
  </section>;
}

function JournalRow({ journal, onOpen, t }: { journal: FinancialJournal; onOpen: () => void; t: ReturnType<typeof useTranslation> }) {
  return <button type="button" onClick={onOpen} className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-[var(--secondary)]/40 sm:px-6"><div className="min-w-0"><div className="flex items-center gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--secondary)]"><BookOpenCheck size={15}/></span><div className="min-w-0"><strong className="block truncate text-sm">{readableCode(journal.journalType)}</strong><p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{formatDate(journal.occurredAt, true)}</p></div></div></div><div className="shrink-0 text-right"><strong className="text-sm">{amountFromMinor(journal.totalDebitsMinor, journal.currency)}</strong><p className="mt-1 text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{journal.referenceType ? readableCode(journal.referenceType) : t("System")}</p></div></button>;
}

function JournalDetail({ detail, loading, error, t }: { detail: FinancialJournalDetail | null; loading: boolean; error: string; t: ReturnType<typeof useTranslation> }) {
  if (loading) return <PanelLoading text={t("Loading journal…")}/>;
  if (error) return <PanelError text={error}/>;
  if (!detail) return null;
  const invoiceId = typeof detail.metadata.invoiceId === "string" ? detail.metadata.invoiceId : detail.referenceType === "invoice" ? detail.referenceId : null;
  return <div className="space-y-6"><section><p className="eyebrow">{readableCode(detail.journalType)}</p><h3 className="mt-2 break-words text-2xl font-semibold">{amountFromMinor(detail.totalDebitsMinor, detail.currency)}</h3><p className="mt-2 text-sm text-[var(--muted-foreground)]">{formatDate(detail.occurredAt, true)}</p></section><dl className="grid grid-cols-2 gap-3"><BalanceCell label={t("Currency")} value={detail.currency}/><BalanceCell label={t("Reference")} value={detail.referenceType ? readableCode(detail.referenceType) : t("System")}/><BalanceCell label={t("Debits")} value={amountFromMinor(detail.totalDebitsMinor, detail.currency)}/><BalanceCell label={t("Credits")} value={amountFromMinor(detail.totalCreditsMinor, detail.currency)}/></dl><section><h4 className="text-sm font-semibold">{t("Journal lines")}</h4><div className="mt-3 space-y-2">{detail.lines.map((line) => <div key={line.id} className="rounded-xl border border-[var(--border)] p-3"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><strong className="block truncate text-sm">{readableCode(line.accountCode)}</strong><span className="mt-1 block font-mono text-[10px] text-[var(--muted-foreground)]">{line.accountCode}</span></div><div className="shrink-0 text-right"><strong className={`inline-flex items-center gap-1 text-sm ${line.direction === "DEBIT" ? "text-sky-700" : "text-violet-700"}`}>{line.direction === "DEBIT" ? <ArrowDownLeft size={14}/> : <ArrowUpRight size={14}/>} {amountFromMinor(line.amountMinor, line.currency)}</strong><span className="mt-1 block text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{t(line.direction)}</span></div></div></div>)}</div></section>{invoiceId ? <button type="button" onClick={() => navigateApp(`${routes.app.invoices}?recordId=${encodeURIComponent(invoiceId)}`)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold hover:bg-[var(--secondary)]"><ExternalLink size={15}/>{t("Open canonical invoice")}</button> : null}<details className="rounded-xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]"><summary className="cursor-pointer font-semibold text-[var(--foreground)]">{t("Audit identifiers")}</summary><dl className="mt-3 space-y-2 break-all"><div><dt className="font-medium">{t("Journal ID")}</dt><dd>{detail.id}</dd></div><div><dt className="font-medium">{t("Idempotency key")}</dt><dd>{detail.idempotencyKey}</dd></div></dl></details></div>;
}

function AccountDetail({ accountCode, detail, loading, error, t }: { accountCode: string; detail: FinancialAccountBalance | null; loading: boolean; error: string; t: ReturnType<typeof useTranslation> }) {
  if (loading) return <PanelLoading text={t("Loading account balance…")}/>;
  if (error) return <PanelError text={error}/>;
  if (!detail) return null;
  return <div className="space-y-6"><section><p className="font-mono text-xs text-[var(--muted-foreground)]">{accountCode}</p><h3 className="mt-2 text-2xl font-semibold">{readableCode(accountCode)}</h3><p className="mt-2 text-sm text-[var(--muted-foreground)]">{t("Live balance calculated from immutable journal lines.")}</p></section><div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/40 p-5"><p className="text-xs text-[var(--muted-foreground)]">{t("Net balance")}</p><p className="mt-2 text-3xl font-semibold">{amountFromMinor(detail.balanceMinor, detail.currency)}</p><span className="mt-3 inline-flex rounded-full bg-[var(--card)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">{t(detail.balanceDirection)}</span></div><dl className="grid grid-cols-2 gap-3"><BalanceCell label={t("Total debits")} value={amountFromMinor(detail.debitsMinor, detail.currency)}/><BalanceCell label={t("Total credits")} value={amountFromMinor(detail.creditsMinor, detail.currency)}/></dl></div>;
}

function PaymentDialog({ workspaceId, invoice, onClose, onRecorded, t }: { workspaceId: string; invoice: Invoice; onClose: () => void; onRecorded: (payment: InvoicePayment) => Promise<void>; t: ReturnType<typeof useTranslation> }) {
  const [draft, setDraft] = useState<RecordInvoicePaymentInput>(() => ({ amount: invoice.amountDue, paymentMethod: "BANK_TRANSFER", paymentReference: "", idempotencyKey: getPaymentOperationKey(invoice.id) }));
  const [receivedAt, setReceivedAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const amountMinor = decimalToMinor(draft.amount, invoice.currency);
  const dueMinor = decimalToMinor(invoice.amountDue, invoice.currency) ?? 0n;
  const validAmount = amountMinor !== null && amountMinor > 0n && amountMinor <= dueMinor;
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, saving]);
  const submit = async () => {
    if (!validAmount || saving) return;
    setSaving(true);
    setError("");
    try {
      const response = await commercialDocumentsApi.recordInvoicePayment(workspaceId, invoice.id, { ...draft, paymentReference: draft.paymentReference?.trim() || null, ...(receivedAt ? { receivedAt: new Date(receivedAt).toISOString() } : {}), metadata: { source: "finance_workspace" } });
      clearPaymentOperationKey(invoice.id);
      await onRecorded(response.data.payment);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, t("The payment could not be recorded."))); }
    finally { setSaving(false); }
  };
  return <div className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}><section role="dialog" aria-modal="true" aria-labelledby="record-payment-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-[var(--border)] bg-[var(--card)] p-5 text-[var(--foreground)] shadow-2xl sm:rounded-3xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{t("Canonical invoice receipt")}</p><h2 id="record-payment-title" className="mt-2 text-2xl font-semibold">{t("Record payment")}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">{invoice.invoiceNumber} · {t("Due")} {amountFromDecimal(invoice.amountDue, invoice.currency)}</p></div><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-[var(--border)] p-2 disabled:opacity-40" aria-label={t("Close")}><X size={17}/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium">{t("Amount")}</span><div className="flex rounded-xl border border-[var(--border)] bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--ring)]"><input autoFocus value={draft.amount} onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))} inputMode="decimal" className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none" aria-invalid={draft.amount.length > 0 && !validAmount}/><span className="border-l border-[var(--border)] px-3 py-2.5 text-xs font-semibold text-[var(--muted-foreground)]">{invoice.currency}</span></div>{draft.amount.length > 0 && !validAmount ? <span className="mt-1.5 block text-xs text-rose-700">{t("Enter a positive amount no greater than the invoice amount due.")}</span> : null}</label><label><span className="mb-1.5 block text-xs font-medium">{t("Payment method")}</span><select value={draft.paymentMethod} onChange={(event) => setDraft((current) => ({ ...current, paymentMethod: event.target.value as InvoicePaymentMethod }))} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]">{PAYMENT_METHODS.map((method) => <option key={method} value={method}>{t(readableCode(method))}</option>)}</select></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Payment reference")} <span className="text-[var(--muted-foreground)]">({t("optional")})</span></span><input value={draft.paymentReference ?? ""} onChange={(event) => setDraft((current) => ({ ...current, paymentReference: event.target.value }))} maxLength={250} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" placeholder={t("Bank statement, provider or receipt reference")}/></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium">{t("Received at")} <span className="text-[var(--muted-foreground)]">({t("defaults to now")})</span></span><input type="datetime-local" value={receivedAt} onChange={(event) => setReceivedAt(event.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]"/></label></div><div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-5 text-amber-800"><strong className="block">{t("This action is append-only.")}</strong><span>{t("The receipt updates the canonical invoice and creates an auditable finance event. Correct mistakes through a separate compensating workflow; do not duplicate the payment.")}</span></div>{error ? <div role="alert" className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-700">{error}</div> : null}<footer className="mt-6 flex justify-end gap-2"><button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold disabled:opacity-40">{t("Cancel")}</button><button type="button" onClick={() => void submit()} disabled={!validAmount || saving} className="inline-flex items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] disabled:opacity-40">{saving ? <LoaderCircle size={16} className="animate-spin"/> : <Banknote size={16}/>} {saving ? t("Recording…") : t("Record payment")}</button></footer></section></div>;
}

function SidePanel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  return <div className="fixed inset-0 z-[110] bg-slate-950/30 backdrop-blur-[2px]" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><aside role="dialog" aria-modal="true" aria-label={title} className="absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto border-l border-[var(--border)] bg-[var(--card)] p-5 text-[var(--foreground)] shadow-2xl sm:p-7"><header className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4"><h2 className="font-semibold">{title}</h2><button type="button" autoFocus onClick={onClose} className="rounded-xl border border-[var(--border)] p-2" aria-label="Close"><X size={17}/></button></header><div className="pt-6">{children}</div></aside></div>;
}

function Metric({ icon: Icon, label, value, helper, tone }: { icon: typeof Banknote; label: string; value: string; helper: string; tone?: "success" | "danger" }) {
  return <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><span className="text-xs font-medium text-[var(--muted-foreground)]">{label}</span><span className={`grid h-8 w-8 place-items-center rounded-xl ${tone === "success" ? "bg-emerald-500/10 text-emerald-700" : tone === "danger" ? "bg-rose-500/10 text-rose-700" : "bg-[var(--secondary)]"}`}><Icon size={16}/></span></div><p className="mt-4 truncate text-2xl font-semibold tracking-tight" title={value}>{value}</p><p className="mt-1 truncate text-xs text-[var(--muted-foreground)]" title={helper}>{helper}</p></article>;
}

function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle?: string; action?: ReactNode }) {
  return <header className="flex flex-wrap items-start justify-between gap-3 px-5 py-5 sm:px-6"><div><p className="eyebrow">{eyebrow}</p><h2 className="mt-1 text-xl font-semibold">{title}</h2>{subtitle ? <p className="mt-1 text-xs text-[var(--muted-foreground)]">{subtitle}</p> : null}</div>{action}</header>;
}

function BoundaryItem({ icon: Icon, title, text }: { icon: typeof CheckCircle2; title: string; text: string }) {
  return <div className="flex gap-3"><span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--secondary)]"><Icon size={15}/></span><div><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">{text}</p></div></div>;
}

function BalanceCell({ label, value, emphasized = false }: { label: string; value: string; emphasized?: boolean }) {
  return <div className={`min-w-0 rounded-xl border border-[var(--border)] p-3 ${emphasized ? "bg-[var(--secondary)]/60" : ""}`}><dt className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{label}</dt><dd className={`mt-1 truncate ${emphasized ? "font-semibold" : "text-sm"}`} title={value}>{value}</dd></div>;
}

function InvoiceStatus({ status }: { status: string }) {
  const tone = status === "PAID" ? "bg-emerald-500/10 text-emerald-700" : status === "OVERDUE" ? "bg-rose-500/10 text-rose-700" : status === "PARTIALLY_PAID" ? "bg-amber-500/10 text-amber-700" : "bg-[var(--secondary)] text-[var(--muted-foreground)]";
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tone}`}>{readableCode(status)}</span>;
}

function Feedback({ kind, children }: { kind: "error" | "warning" | "success"; children: ReactNode }) {
  const classes = kind === "error" ? "border-rose-500/20 bg-rose-500/10 text-rose-800" : kind === "warning" ? "border-amber-500/20 bg-amber-500/10 text-amber-800" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-800";
  return <div role={kind === "error" ? "alert" : "status"} className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm ${classes}`}>{children}</div>;
}

function LoadingRows() {
  return <div role="status" className="space-y-3 border-t border-[var(--border)] p-5"><span className="sr-only">Loading…</span>{[0, 1, 2].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-[var(--secondary)]"/>)}</div>;
}

function EmptyState({ icon: Icon, title, text }: { icon: typeof BookOpenCheck; title: string; text: string }) {
  return <div className="grid min-h-56 place-items-center border-t border-[var(--border)] p-7 text-center"><div><span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--muted-foreground)]"><Icon size={20}/></span><h3 className="mt-4 text-sm font-semibold">{title}</h3><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">{text}</p></div></div>;
}

function PanelLoading({ text }: { text: string }) {
  return <div role="status" className="flex items-center gap-2 rounded-xl bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]"><LoaderCircle size={16} className="animate-spin"/>{text}</div>;
}

function PanelError({ text }: { text: string }) {
  return <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{text}</div>;
}
