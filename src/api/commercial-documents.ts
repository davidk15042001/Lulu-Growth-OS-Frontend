import { requestApi } from './client';

export type CommercialLine = { productId?: string | null; variantId?: string | null; sku?: string | null; productName: string; description?: string | null; quantity: number; quantityUnit?: string | null; unitPrice: number; discount?: number; tax?: number; priceSource?: string };
export type Quote = { id: string; workspaceId: string; quoteNumber: string; status: string; currency: string; language: string; customerRecordId: string | null; currentVersionId: string | null; currentVersion?: number; subtotal?: string; discountTotal?: string; shippingTotal?: string; taxTotal?: string; grandTotal?: string; documentStatus?: string; creationMode: string; createdAt: string };
export type Invoice = { id: string; workspaceId: string; invoiceNumber: string; invoiceType: string; status: string; currency: string; language: string; customerRecordId: string | null; orderRecordId: string | null; grandTotal: string; amountPaid: string; amountDue: string; creationMode: string; issueDate: string | null; dueDate: string | null; createdAt: string };
export type InvoicePaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'ALIPAY' | 'WECHAT_PAY' | 'CASH' | 'OTHER';
export type InvoicePayment = {
  id: string;
  workspaceId: string;
  invoiceId: string;
  amountMinor: string;
  currency: string;
  paymentMethod: InvoicePaymentMethod;
  paymentReference: string | null;
  receivedAt: string;
  idempotencyKey: string;
  metadata: Record<string, unknown>;
  recordedBy: string | null;
  createdAt: string;
};
export type RecordInvoicePaymentInput = {
  amount: string;
  paymentMethod: InvoicePaymentMethod;
  paymentReference?: string | null;
  receivedAt?: string;
  idempotencyKey: string;
  metadata?: Record<string, unknown>;
};
export type QuoteDetail = { quote: Quote; versions: Array<Record<string, unknown>>; lines: Array<Record<string, unknown>>; deliveries: Array<Record<string, unknown>> };
export type DocumentSellerProfile = {
  workspaceId?: string;
  companyName: string;
  industry: string | null;
  countryRegion: string | null;
  taxId: string | null;
  address: string | null;
  legalForm: string | null;
  legalRepresentative: string | null;
  phoneNumber: string | null;
  bankAccountNumber: string | null;
  bankOpeningBank: string | null;
  bankBranch: string | null;
  bankCode: string | null;
  logoUrl: string | null;
};
export type InvoiceDetail = { invoice: Invoice; sellerProfile: DocumentSellerProfile | null; lines: Array<Record<string, unknown>>; deliveries: Array<Record<string, unknown>>; payments?: InvoicePayment[] };
const path = (workspaceId: string, suffix: string) => `/workspaces/${encodeURIComponent(workspaceId)}/commercial-documents${suffix}`;
export const commercialDocumentsApi = {
  listQuotes: (workspaceId: string, query = '') => requestApi<{ items: Quote[]; pagination: { page: number; limit: number; total: number; pages: number } }>({ path: path(workspaceId, `/quotes${query ? `?${query}` : ''}`) }),
  getQuote: (workspaceId: string, id: string) => requestApi<QuoteDetail>({ path: path(workspaceId, `/quotes/${id}`) }),
  createQuote: (workspaceId: string, body: Record<string, unknown>) => requestApi<QuoteDetail>({ path: path(workspaceId, '/quotes'), method: 'POST', body }),
  reviseQuote: (workspaceId: string, id: string, body: Record<string, unknown>) => requestApi<QuoteDetail>({ path: path(workspaceId, `/quotes/${id}/revisions`), method: 'POST', body }),
  sendQuote: (workspaceId: string, id: string, body: Record<string, unknown>) => requestApi<Record<string, unknown>>({ path: path(workspaceId, `/quotes/${id}/send`), method: 'POST', body }),
  listInvoices: (workspaceId: string, query = '') => requestApi<{ items: Invoice[]; pagination: { page: number; limit: number; total: number; pages: number } }>({ path: path(workspaceId, `/invoices${query ? `?${query}` : ''}`) }),
  getDocumentSellerProfile: (workspaceId: string) => requestApi<DocumentSellerProfile>({ path: path(workspaceId, '/seller-profile') }),
  getInvoice: (workspaceId: string, id: string) => requestApi<InvoiceDetail>({ path: path(workspaceId, `/invoices/${id}`) }),
  createInvoice: (workspaceId: string, body: Record<string, unknown>) => requestApi<InvoiceDetail>({ path: path(workspaceId, '/invoices'), method: 'POST', body }),
  issueInvoice: (workspaceId: string, id: string) => requestApi<InvoiceDetail>({ path: path(workspaceId, `/invoices/${id}/issue`), method: 'POST', body: {} }),
  sendInvoice: (workspaceId: string, id: string, body: Record<string, unknown>) => requestApi<Record<string, unknown>>({ path: path(workspaceId, `/invoices/${id}/send`), method: 'POST', body }),
  listInvoicePayments: (workspaceId: string, id: string, signal?: AbortSignal) => requestApi<InvoicePayment[]>({ path: path(workspaceId, `/invoices/${encodeURIComponent(id)}/payments`), signal }),
  recordInvoicePayment: (workspaceId: string, id: string, body: RecordInvoicePaymentInput) => requestApi<{ payment: InvoicePayment; invoice: InvoiceDetail; idempotent: boolean }>({ path: path(workspaceId, `/invoices/${encodeURIComponent(id)}/payments`), method: 'POST', body }),
};
