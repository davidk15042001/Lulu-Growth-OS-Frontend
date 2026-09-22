import { requestApi } from "./client";

export type JournalDirection = "DEBIT" | "CREDIT";
export type BalanceDirection = JournalDirection | "BALANCED";

export type FinancialJournal = {
  id: string;
  workspaceId: string;
  journalType: string;
  occurredAt: string;
  currency: string;
  totalDebitsMinor: string;
  totalCreditsMinor: string;
  referenceType: string | null;
  referenceId: string | null;
  idempotencyKey: string;
  payloadHash: string;
  metadata: Record<string, unknown>;
  actorId: string | null;
  createdAt: string;
};

export type FinancialJournalLine = {
  id: string;
  journalId: string;
  lineKey: string;
  accountCode: string;
  direction: JournalDirection;
  amountMinor: string;
  currency: string;
  referenceType: string | null;
  referenceId: string | null;
  metadata: Record<string, unknown>;
  actorId: string | null;
  createdAt: string;
};

export type FinancialJournalDetail = FinancialJournal & {
  lines: FinancialJournalLine[];
};

export type FinancialAccountBalance = {
  accountCode: string;
  currency: string;
  debitsMinor: string;
  creditsMinor: string;
  balanceDirection: BalanceDirection;
  balanceMinor: string;
};

export type FinancialTrialBalance = {
  currency: string;
  asOf: string | null;
  accounts: FinancialAccountBalance[];
  totals: {
    debitsMinor: string;
    creditsMinor: string;
  };
  balanced: boolean;
};

export type PayoutAccount = {
  id: string;
  workspaceId: string;
  provider: string;
  providerBeneficiaryId: string;
  label: string;
  currency: string;
  status: string;
  createdAt: string;
};

export type Payout = {
  id: string;
  workspaceId: string;
  payoutAccountId: string;
  provider: string;
  providerTransferId: string | null;
  amount: string;
  currency: string;
  reference: string;
  status: string;
  providerStatus: string | null;
  failureCode: string | null;
  requestedAt: string;
  submittedAt: string | null;
  completedAt: string | null;
  payoutAccountLabel: string;
  createdAt: string;
};

export type PayoutBalance = {
  currency: string;
  grossCollected: string;
  reversed: string;
  netCollected: string;
  reserved: string;
  paidOut: string;
  available: string;
};

export type PayoutsData = {
  accounts: PayoutAccount[];
  items: Payout[];
  summary: PayoutBalance[];
};

export type JournalFilters = {
  page?: number;
  limit?: number;
  currency?: string;
  accountCode?: string;
  referenceType?: string;
  referenceId?: string;
  from?: string;
  to?: string;
};

type JournalPage = {
  items: FinancialJournal[];
  pagination: { page: number; limit: number; total: number; pages: number };
};

function path(workspaceId: string, suffix: string) {
  return `/workspaces/${encodeURIComponent(workspaceId)}/finance${suffix}`;
}

function queryString(values: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const result = params.toString();
  return result ? `?${result}` : "";
}

export const financeApi = {
  listJournals(workspaceId: string, filters: JournalFilters = {}, signal?: AbortSignal) {
    return requestApi<JournalPage>({
      path: path(workspaceId, `/journals${queryString(filters)}`),
      signal,
    });
  },
  getJournal(workspaceId: string, journalId: string, signal?: AbortSignal) {
    return requestApi<FinancialJournalDetail>({
      path: path(workspaceId, `/journals/${encodeURIComponent(journalId)}`),
      signal,
    });
  },
  getAccountBalance(workspaceId: string, accountCode: string, currency: string, asOf?: string, signal?: AbortSignal) {
    return requestApi<FinancialAccountBalance>({
      path: path(
        workspaceId,
        `/accounts/${encodeURIComponent(accountCode)}/balance${queryString({ currency, asOf })}`,
      ),
      signal,
    });
  },
  getTrialBalance(workspaceId: string, currency: string, asOf?: string, signal?: AbortSignal) {
    return requestApi<FinancialTrialBalance>({
      path: path(workspaceId, `/trial-balance${queryString({ currency, asOf })}`),
      signal,
    });
  },
  listPayouts(workspaceId: string, limit = 50, signal?: AbortSignal) {
    return requestApi<PayoutsData>({
      path: path(workspaceId, `/payouts${queryString({ limit })}`),
      signal,
    });
  },
  createPayoutAccount(workspaceId: string, body: { providerBeneficiaryId: string; label: string; currency: string }) {
    return requestApi<PayoutAccount>({ path: path(workspaceId, "/payout-accounts"), method: "POST", body });
  },
  requestPayout(workspaceId: string, body: { payoutAccountId: string; amount: string; currency: string; reference: string; idempotencyKey: string }) {
    return requestApi<Payout>({ path: path(workspaceId, "/payouts"), method: "POST", body });
  },
  submitPayout(workspaceId: string, payoutId: string) {
    return requestApi<Payout>({ path: path(workspaceId, `/payouts/${encodeURIComponent(payoutId)}/submit`), method: "POST" });
  },
};
