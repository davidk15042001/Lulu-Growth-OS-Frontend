import { Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getFriendlyErrorMessage } from "../../api/client";
import { commercialDocumentsApi } from "../../api/commercial-documents";
import { productsApi, type Product } from "../../api/products";
import { listRecords, type WorkspaceRecord } from "../../api/records";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import type { CommercialDocumentKind } from "./VirtualOfficePage";

type LineDraft = {
  productId: string;
  productName: string;
  sku: string;
  quantity: string;
  unitPrice: string;
  discount: string;
  tax: string;
  quantityUnit: string;
};

const emptyLine = (): LineDraft => ({
  productId: "",
  productName: "",
  sku: "",
  quantity: "1",
  unitPrice: "0",
  discount: "0",
  tax: "0",
  quantityUnit: "pcs",
});

export default function ManualCommercialDocumentForm({
  workspaceId,
  kind,
  canCreate,
  onCancel,
  onCreated,
}: {
  workspaceId: string;
  kind: CommercialDocumentKind;
  canCreate: boolean;
  onCancel: () => void;
  onCreated: () => void;
}) {
  const t = useTranslation();
  const [customers, setCustomers] = useState<WorkspaceRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState({
    customerRecordId: "",
    currency: "CNY",
    language: "en",
    dueDate: "",
    validUntil: "",
    invoiceType: "STANDARD",
    shippingTotal: "0",
  });
  const [lines, setLines] = useState<LineDraft[]>([emptyLine()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      productsApi.list(workspaceId, "limit=100"),
      listRecords("customers", "limit=100"),
    ]).then(([productResponse, customerResponse]) => {
      if (!active) return;
      setProducts(productResponse.data.items);
      setCustomers(customerResponse.data.items);
      setError(null);
    }).catch((cause) => {
      if (active) setError(getFriendlyErrorMessage(cause, t("The creation form could not be loaded.")));
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [t, workspaceId]);

  const title = kind === "invoices" ? t("Manual invoice") : t("Manual quote");
  const saveLabel = kind === "invoices" ? t("Save invoice") : t("Save quote");
  const total = useMemo(() => lines.reduce((sum, line) => {
    const quantity = Number(line.quantity) || 0;
    const price = Number(line.unitPrice) || 0;
    const discount = Number(line.discount) || 0;
    return sum + Math.max(0, quantity * price - discount);
  }, 0) + (Number(form.shippingTotal) || 0), [form.shippingTotal, lines]);

  const updateLine = (index: number, patch: Partial<LineDraft>) => {
    setLines((current) => current.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line));
  };

  const selectProduct = (index: number, productId: string) => {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) {
      updateLine(index, { productId: "" });
      return;
    }
    updateLine(index, {
      productId: product.id,
      productName: product.name,
      sku: product.sku ?? "",
      unitPrice: product.defaultPrice ?? "0",
      quantityUnit: product.moqUnit ?? "pcs",
    });
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCreate || saving) return;
    const validLines = lines.filter((line) => line.productName.trim() && Number(line.quantity) > 0);
    if (!form.customerRecordId || validLines.length === 0) {
      setError(t("Customer and at least one product line are required."));
      return;
    }
    setSaving(true);
    setError(null);
    const common = {
      customerRecordId: form.customerRecordId,
      currency: form.currency,
      language: form.language,
      lines: validLines.map((line) => ({
        productId: line.productId || null,
        productName: line.productName.trim(),
        sku: line.sku.trim() || null,
        quantity: Number(line.quantity),
        unitPrice: Number(line.unitPrice) || 0,
        discount: Number(line.discount) || 0,
        tax: Number(line.tax) || 0,
        quantityUnit: line.quantityUnit.trim() || null,
      })),
      shippingTotal: Number(form.shippingTotal) || 0,
      source: "workspace",
      creationMode: "MANUAL",
    };
    try {
      if (kind === "invoices") {
        await commercialDocumentsApi.createInvoice(workspaceId, {
          ...common,
          invoiceType: form.invoiceType,
          dueDate: form.dueDate || null,
          operationKey: `office-manual-invoice:${crypto.randomUUID()}`,
        });
      } else {
        await commercialDocumentsApi.createQuote(workspaceId, { ...common, validUntil: form.validUntil || null });
      }
      onCreated();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("The document could not be saved.")));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="lulu-office-commercial-form lulu-office-commercial-form--state"><span>{t("Loading creation form…")}</span></div>;

  return <form className="lulu-office-commercial-form" onSubmit={submit}>
    <div className="lulu-office-commercial-form__header">
      <div><span className="lulu-office-eyebrow">{t("Manual creation")}</span><h3>{title}</h3><p>{t("Create and manage this document directly from the Office panel.")}</p></div>
      <button type="button" className="lulu-office-icon-button" onClick={onCancel} aria-label={t("Cancel")}><X aria-hidden="true" size={17} /></button>
    </div>
    {!canCreate && <div className="lulu-office-error" role="alert"><span>{t("Manual creation requires the document permission.")}</span></div>}
    {error && <div className="lulu-office-error" role="alert"><span>{error}</span></div>}
    <fieldset disabled={!canCreate || saving}>
      <div className="lulu-office-commercial-form__grid">
        <label><span>{t("Customer")}</span><select value={form.customerRecordId} onChange={(event) => setForm((current) => ({ ...current, customerRecordId: event.target.value }))}><option value="">{customers.length ? t("Select customer") : t("No customers found.")}</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select></label>
        <label><span>{t("Currency")}</span><select value={form.currency} onChange={(event) => setForm((current) => ({ ...current, currency: event.target.value }))}><option>CNY</option><option>EUR</option><option>USD</option></select></label>
        {kind === "invoices" ? <>
          <label><span>{t("Invoice type")}</span><select value={form.invoiceType} onChange={(event) => setForm((current) => ({ ...current, invoiceType: event.target.value }))}><option value="STANDARD">{t("Standard")}</option><option value="COMMERCIAL">{t("VAT special")}</option></select></label>
          <label><span>{t("Due date")}</span><input type="date" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} /></label>
        </> : <label><span>{t("Valid until")}</span><input type="date" value={form.validUntil} onChange={(event) => setForm((current) => ({ ...current, validUntil: event.target.value }))} /></label>}
      </div>
      <div className="lulu-office-commercial-form__lines-heading"><strong>{t("Line items")}</strong><button type="button" onClick={() => setLines((current) => [...current, emptyLine()])}><Plus aria-hidden="true" size={14} />{t("Add line")}</button></div>
      <div className="lulu-office-commercial-form__lines">
        {lines.map((line, index) => <div className="lulu-office-commercial-form__line" key={index}>
          <label className="is-wide"><span>{t("Product")}</span><select value={line.productId} onChange={(event) => selectProduct(index, event.target.value)}><option value="">{t("Select a product or enter a custom line.")}</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><input value={line.productName} onChange={(event) => updateLine(index, { productName: event.target.value })} placeholder={t("Product name")} /></label>
          <label><span>{t("Quantity")}</span><input inputMode="decimal" type="number" min="0.01" step="0.01" value={line.quantity} onChange={(event) => updateLine(index, { quantity: event.target.value })} /></label>
          <label><span>{t("Unit price")}</span><input inputMode="decimal" type="number" min="0" step="0.01" value={line.unitPrice} onChange={(event) => updateLine(index, { unitPrice: event.target.value })} /></label>
          <label><span>{t("Discount")}</span><input inputMode="decimal" type="number" min="0" step="0.01" value={line.discount} onChange={(event) => updateLine(index, { discount: event.target.value })} /></label>
          <label><span>{t("Tax")}</span><input inputMode="decimal" type="number" min="0" step="0.01" value={line.tax} onChange={(event) => updateLine(index, { tax: event.target.value })} /></label>
          {lines.length > 1 && <button type="button" className="lulu-office-commercial-form__remove" onClick={() => setLines((current) => current.filter((_, lineIndex) => lineIndex !== index))} aria-label={t("Remove line")}><Trash2 aria-hidden="true" size={15} /></button>}
        </div>)}
      </div>
      <label className="lulu-office-commercial-form__shipping"><span>{t("Shipping")}</span><input inputMode="decimal" type="number" min="0" step="0.01" value={form.shippingTotal} onChange={(event) => setForm((current) => ({ ...current, shippingTotal: event.target.value }))} /></label>
      <div className="lulu-office-commercial-form__total"><span>{t("Estimated total")}</span><strong>{new Intl.NumberFormat(undefined, { style: "currency", currency: form.currency }).format(total)}</strong></div>
    </fieldset>
    <div className="lulu-office-commercial-form__actions"><button type="button" onClick={onCancel}>{t("Cancel")}</button><button type="submit" className="is-primary" disabled={!canCreate || saving}><Save aria-hidden="true" size={14} />{saving ? t("Saving…") : saveLabel}</button></div>
  </form>;
}
