import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Box, ChevronLeft, ChevronRight, ClipboardCheck, Package, Plus, RefreshCw, Search, Send, Truck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useLuluApp } from "../../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  commerceApi,
  commerceIdempotencyKey,
  ORDER_STATUSES,
  type CommerceFulfillment,
  type CommerceOrder,
  type CommerceOrderDetail,
  type FulfillmentStatus,
  type InventoryLocation,
  type OrderStatus,
} from "../../api/commerce";
import { productsApi, type Product } from "../../api/products";
import { isOfficePanelSurface, routes, withOfficePanelSurface } from "../../routing";
import { CommerceTabs, EmptyState, Feedback, Modal, StatCard, StatusBadge, fieldClass, formatDate, formatMoney, formatNumber, primaryButtonClass, secondaryButtonClass } from "./commerce-ui";

const orderTransitions: Readonly<Record<OrderStatus, readonly ("PLACED" | "CONFIRMED" | "PROCESSING" | "CANCELLED")[]>> = {
  DRAFT: ["PLACED", "CANCELLED"],
  PLACED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["CANCELLED"],
  PARTIALLY_FULFILLED: ["CANCELLED"],
  FULFILLED: [],
  CANCELLED: [],
};

const fulfillmentTransitions: Readonly<Record<FulfillmentStatus, readonly Exclude<FulfillmentStatus, "DRAFT">[]>> = {
  DRAFT: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

function actionLabel(status: string) {
  if (status === "PLACED") return "Place order";
  if (status === "CONFIRMED") return "Confirm & reserve";
  if (status === "PROCESSING") return "Start processing";
  if (status === "SHIPPED") return "Mark shipped";
  if (status === "DELIVERED") return "Mark delivered";
  if (status === "CANCELLED") return "Cancel";
  return status.replaceAll("_", " ");
}

export default function OrdersWorkspace() {
  const { selectedWorkspace, hasCapability } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? "";
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CommerceOrder[]>([]);
  const [selected, setSelected] = useState<CommerceOrderDetail | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<"" | OrderStatus>("");
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadState, setLoadState] = useState<"loading" | "refreshing" | "ready" | "stale" | "error">("loading");
  const successfulLoadRef = useRef<string | null>(null);
  const loadRequestRef = useRef(0);
  const detailRequestRef = useRef(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [fulfillmentOpen, setFulfillmentOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const recordId = searchParams.get("recordId");
  const canWrite = hasCapability("orders.manage");

  const loadOrders = useCallback(async () => {
    if (!workspaceId) return;
    const request = ++loadRequestRef.current;
    const collectionKey = `${workspaceId}:${page}:${status}:${search}`;
    const hasVerifiedData = successfulLoadRef.current === collectionKey;
    setLoading(true);
    setLoadState(hasVerifiedData ? "refreshing" : "loading");
    if (!hasVerifiedData) { setItems([]); setTotal(0); setPages(1); }
    setError("");
    try {
      const response = await commerceApi.listOrders(workspaceId, { page, limit: 25, status: status || undefined, search: search || undefined });
      if (request !== loadRequestRef.current) return;
      setItems(response.data.items);
      setTotal(response.data.pagination.total);
      setPages(Math.max(1, response.data.pagination.pages));
      successfulLoadRef.current = collectionKey;
      setLoadState("ready");
    } catch (nextError) {
      if (request !== loadRequestRef.current) return;
      const message = getFriendlyErrorMessage(nextError, "Orders could not be loaded.");
      const stale = successfulLoadRef.current === collectionKey;
      setLoadState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded orders. ${message}` : message);
    } finally {
      if (request === loadRequestRef.current) setLoading(false);
    }
  }, [page, search, status, workspaceId]);

  const loadDetail = useCallback(async (id: string) => {
    if (!workspaceId) return;
    const request = ++detailRequestRef.current;
    setDetailLoading(true);
    setError("");
    try {
      const response = await commerceApi.getOrder(workspaceId, id);
      if (request !== detailRequestRef.current) return;
      setSelected(response.data);
    } catch (nextError) {
      if (request !== detailRequestRef.current) return;
      setSelected(null);
      setError(getFriendlyErrorMessage(nextError, "This order could not be loaded."));
    } finally {
      if (request === detailRequestRef.current) setDetailLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    detailRequestRef.current += 1;
    successfulLoadRef.current = null;
    setItems([]); setSelected(null); setTotal(0); setPages(1); setLoadState("loading"); setDetailLoading(false);
  }, [workspaceId]);
  useEffect(() => { void loadOrders(); return () => { loadRequestRef.current += 1; }; }, [loadOrders]);
  useEffect(() => {
    if (recordId) void loadDetail(recordId);
    else { detailRequestRef.current += 1; setSelected(null); setDetailLoading(false); }
  }, [loadDetail, recordId]);

  const openOrder = (id: string) => {
    setNotice("");
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("recordId", id);
      return next;
    }, { replace: true });
  };

  const closeOrder = () => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    next.delete("recordId");
    return next;
  }, { replace: true });

  const refreshSelected = async () => {
    await Promise.all([loadOrders(), selected ? loadDetail(selected.order.id) : Promise.resolve()]);
  };

  const transitionOrder = async (targetStatus: "PLACED" | "CONFIRMED" | "PROCESSING" | "CANCELLED") => {
    if (!selected || !workspaceId || busy || !canWrite) return;
    if (targetStatus === "CANCELLED" && !window.confirm("Cancel this order? Reserved inventory will be released.")) return;
    setBusy(`order:${targetStatus}`);
    setError("");
    setNotice("");
    try {
      const response = await commerceApi.transitionOrder(workspaceId, selected.order.id, {
        idempotencyKey: commerceIdempotencyKey(`order.${targetStatus.toLowerCase()}`),
        expectedVersion: selected.order.version,
        targetStatus,
        reason: targetStatus === "CANCELLED" ? "Cancelled manually in Commerce Workspace" : undefined,
      });
      setSelected(response.data);
      setNotice(`${response.data.order.orderNumber} is now ${targetStatus.replaceAll("_", " ").toLowerCase()}.`);
      await loadOrders();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The order status could not be changed. Reload the order and try again."));
    } finally {
      setBusy("");
    }
  };

  const transitionFulfillment = async (fulfillment: CommerceFulfillment, targetStatus: Exclude<FulfillmentStatus, "DRAFT">) => {
    if (!selected || !workspaceId || busy || !canWrite) return;
    if (targetStatus === "CANCELLED" && !window.confirm("Cancel this fulfillment?")) return;
    setBusy(`fulfillment:${fulfillment.id}:${targetStatus}`);
    setError("");
    setNotice("");
    try {
      await commerceApi.transitionFulfillment(workspaceId, selected.order.id, fulfillment.id, {
        idempotencyKey: commerceIdempotencyKey(`fulfillment.${targetStatus.toLowerCase()}`),
        expectedVersion: fulfillment.version,
        expectedOrderVersion: selected.order.version,
        targetStatus,
        carrier: fulfillment.carrier,
        trackingNumber: fulfillment.trackingNumber,
        trackingUrl: fulfillment.trackingUrl,
        reason: targetStatus === "CANCELLED" ? "Cancelled manually in Commerce Workspace" : undefined,
      });
      setNotice(`${fulfillment.fulfillmentNumber} is now ${targetStatus.toLowerCase()}.`);
      await refreshSelected();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The fulfillment changed or could not be updated. Reload it and try again."));
    } finally {
      setBusy("");
    }
  };

  const stats = useMemo(() => ({
    actionable: items.filter((item) => !["FULFILLED", "CANCELLED"].includes(item.status)).length,
    fulfillment: items.filter((item) => ["PROCESSING", "PARTIALLY_FULFILLED"].includes(item.status)).length,
  }), [items]);

  if (!selectedWorkspace) return <main className="page-frame p-8"><h1 className="text-2xl font-semibold">Orders</h1><p className="mt-2 text-[var(--muted-foreground)]">Choose a workspace to manage orders.</p></main>;

  return (
    <main className="page-frame min-h-screen bg-[var(--background)] p-4 sm:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="eyebrow">Canonical Commerce</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Orders & fulfillment</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">One operational order record for people, Lulu employees and connected storefronts—with real inventory reservations and traceable state changes.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CommerceTabs active="orders" />
            <button type="button" onClick={() => void refreshSelected()} className={secondaryButtonClass}><RefreshCw size={15} className={loading || detailLoading ? "animate-spin" : ""} /> Refresh</button>
            <button type="button" onClick={() => setCreateOpen(true)} disabled={!canWrite} className={primaryButtonClass}><Plus size={16} /> New order</button>
          </div>
        </header>

        <Feedback error={error} notice={notice} />

        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Matching orders" value={loadState === "error" || loadState === "loading" ? "—" : total} detail={search || status ? "Current filters" : "Canonical records"} />
          <StatCard label="In progress" value={loadState === "error" || loadState === "loading" ? "—" : stats.actionable} detail="On this page" />
          <StatCard label="Needs fulfillment" value={loadState === "error" || loadState === "loading" ? "—" : stats.fulfillment} detail="On this page" />
        </section>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(520px,1.18fr)]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchDraft.trim()); }} className="grid gap-3 border-b border-[var(--border)] p-4 sm:grid-cols-[minmax(0,1fr)_190px_auto]">
              <label className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-3 text-[var(--muted-foreground)]" />
                <input value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} placeholder="Order number or reference" className={`${fieldClass} pl-9`} />
              </label>
              <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value as "" | OrderStatus); }} className={fieldClass} aria-label="Order status">
                <option value="">All statuses</option>
                {ORDER_STATUSES.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
              </select>
              <button type="submit" className={secondaryButtonClass}>Apply</button>
            </form>

            {(loadState === "loading" || loadState === "refreshing") && items.length === 0 ? <EmptyState icon={<RefreshCw className="animate-spin" />} title="Loading orders" description="Reading the canonical commerce ledger…" /> : (loadState === "error" || loadState === "stale") && items.length === 0 ? <EmptyState icon={<Package />} title="Orders unavailable" description="Lulu could not verify the current order state. Refresh to try again." /> : loadState === "ready" && items.length === 0 ? <EmptyState icon={<Package />} title="No orders found" description={search || status ? "No canonical order matches the current filters." : "Orders created by the team, Lulu or a connected storefront will appear here."} action={canWrite && !search && !status ? <button className={primaryButtonClass} onClick={() => setCreateOpen(true)}><Plus size={15} /> Create first order</button> : undefined} /> : (
              <div className="divide-y divide-[var(--border)]">
                {items.map((order) => (
                  <button key={order.id} type="button" onClick={() => openOrder(order.id)} className={`grid w-full gap-3 p-4 text-left transition hover:bg-[var(--secondary)] sm:grid-cols-[minmax(0,1fr)_auto] ${recordId === order.id ? "bg-[var(--secondary)]" : ""}`}>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2"><strong className="truncate text-sm text-[var(--foreground)]">{order.orderNumber}</strong><StatusBadge status={order.status} /></div>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted-foreground)]"><span>{order.lineCount ?? 0} line{order.lineCount === 1 ? "" : "s"}</span><span>{order.source.replaceAll("_", " ")}</span><span>{formatDate(order.updatedAt)}</span></div>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end"><strong className="text-sm text-[var(--foreground)]">{formatMoney(order.grandTotal, order.currency)}</strong><ChevronRight size={16} className="text-[var(--muted-foreground)]" /></div>
                  </button>
                ))}
              </div>
            )}
            {pages > 1 ? <footer className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)]"><span>Page {page} of {pages}</span><div className="flex gap-2"><button className={secondaryButtonClass} disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={15} /></button><button className={secondaryButtonClass} disabled={page >= pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} aria-label="Next page"><ChevronRight size={15} /></button></div></footer> : null}
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
            {detailLoading && !selected ? <EmptyState icon={<RefreshCw className="animate-spin" />} title="Loading order" description="Resolving the selected record and its fulfillment state…" /> : selected ? (
              <OrderDetailPanel
                detail={selected}
                canWrite={canWrite}
                busy={busy}
                onClose={closeOrder}
                onTransition={(next) => void transitionOrder(next)}
                onCreateFulfillment={() => setFulfillmentOpen(true)}
                onTransitionFulfillment={(fulfillment, next) => void transitionFulfillment(fulfillment, next)}
              />
            ) : <EmptyState icon={<ClipboardCheck />} title="Select an order" description="Inspect line items, inventory reservations, payments and fulfillment using the same canonical record Lulu operates on." />}
          </div>
        </section>
      </div>

      {createOpen && canWrite ? <CreateOrderDialog workspaceId={workspaceId} onClose={() => setCreateOpen(false)} onCreated={(detail) => { setCreateOpen(false); setSelected(detail); openOrder(detail.order.id); setNotice(`${detail.order.orderNumber} was created as a draft.`); void loadOrders(); }} /> : null}
      {fulfillmentOpen && selected && canWrite ? <CreateFulfillmentDialog workspaceId={workspaceId} detail={selected} onClose={() => setFulfillmentOpen(false)} onCreated={() => { setFulfillmentOpen(false); setNotice("Fulfillment created. The order is now being processed."); void refreshSelected(); }} /> : null}
    </main>
  );
}

function OrderDetailPanel({ detail, canWrite, busy, onClose, onTransition, onCreateFulfillment, onTransitionFulfillment }: {
  detail: CommerceOrderDetail;
  canWrite: boolean;
  busy: string;
  onClose: () => void;
  onTransition: (status: "PLACED" | "CONFIRMED" | "PROCESSING" | "CANCELLED") => void;
  onCreateFulfillment: () => void;
  onTransitionFulfillment: (fulfillment: CommerceFulfillment, status: Exclude<FulfillmentStatus, "DRAFT">) => void;
}) {
  const { order, lines, fulfillments } = detail;
  const canFulfill = ["CONFIRMED", "PROCESSING", "PARTIALLY_FULFILLED"].includes(order.status) && lines.some((line) => Number(line.fulfilledQuantity) < Number(line.quantity));
  return (
    <div>
      <header className="border-b border-[var(--border)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><StatusBadge status={order.status} /><span className="text-xs text-[var(--muted-foreground)]">v{order.version}</span></div><h2 className="mt-3 truncate text-2xl font-semibold text-[var(--foreground)]">{order.orderNumber}</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Created {formatDate(order.createdAt)} · {order.createdByActorType.replaceAll("_", " ").toLowerCase()}</p></div>
          <button type="button" onClick={onClose} className={secondaryButtonClass}>Close</button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <DetailMetric label="Total" value={formatMoney(order.grandTotal, order.currency)} />
          <DetailMetric label="Payment" value={order.paymentStatus.replaceAll("_", " ")} />
          <DetailMetric label="Fulfillment" value={order.fulfillmentStatus.replaceAll("_", " ")} />
          <DetailMetric label="Source" value={order.source.replaceAll("_", " ")} />
        </div>
        {canWrite && orderTransitions[order.status].length ? <div className="mt-4 flex flex-wrap gap-2">{orderTransitions[order.status].map((target) => <button key={target} type="button" disabled={Boolean(busy)} onClick={() => onTransition(target)} className={target === "CANCELLED" ? `${secondaryButtonClass} text-rose-700` : primaryButtonClass}>{busy === `order:${target}` ? <RefreshCw size={15} className="animate-spin" /> : target === "PLACED" ? <Send size={15} /> : <ArrowRight size={15} />}{actionLabel(target)}</button>)}</div> : null}
      </header>

      <div className="space-y-6 p-5">
        <section>
          <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-semibold text-[var(--foreground)]">Line items</h3><span className="text-xs text-[var(--muted-foreground)]">{lines.length} line{lines.length === 1 ? "" : "s"}</span></div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full min-w-[650px] text-left text-xs"><thead className="bg-[var(--secondary)] text-[var(--muted-foreground)]"><tr><th className="px-3 py-2.5">Product</th><th className="px-3 py-2.5 text-right">Quantity</th><th className="px-3 py-2.5 text-right">Reserved</th><th className="px-3 py-2.5 text-right">Fulfilled</th><th className="px-3 py-2.5 text-right">Total</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{lines.map((line) => <tr key={line.id}><td className="px-3 py-3"><strong className="block text-[var(--foreground)]">{line.productName}</strong><span className="mt-0.5 block text-[var(--muted-foreground)]">{line.sku || "No SKU"}{line.inventoryLocationId ? " · inventory tracked" : ""}</span></td><td className="px-3 py-3 text-right text-[var(--foreground)]">{formatNumber(line.quantity)} {line.quantityUnit ?? ""}</td><td className="px-3 py-3 text-right text-[var(--muted-foreground)]">{formatNumber(line.reservedQuantity)}</td><td className="px-3 py-3 text-right text-[var(--muted-foreground)]">{formatNumber(line.fulfilledQuantity)}</td><td className="px-3 py-3 text-right font-medium text-[var(--foreground)]">{formatMoney(line.lineTotal, order.currency)}</td></tr>)}</tbody></table>
          </div>
          <dl className="ml-auto mt-3 grid max-w-xs grid-cols-2 gap-x-5 gap-y-1 text-xs"><dt className="text-[var(--muted-foreground)]">Subtotal</dt><dd className="text-right">{formatMoney(order.subtotal, order.currency)}</dd><dt className="text-[var(--muted-foreground)]">Discount</dt><dd className="text-right">{formatMoney(order.discountTotal, order.currency)}</dd><dt className="text-[var(--muted-foreground)]">Tax</dt><dd className="text-right">{formatMoney(order.taxTotal, order.currency)}</dd><dt className="text-[var(--muted-foreground)]">Shipping</dt><dd className="text-right">{formatMoney(order.shippingTotal, order.currency)}</dd><dt className="mt-1 border-t border-[var(--border)] pt-2 font-semibold">Grand total</dt><dd className="mt-1 border-t border-[var(--border)] pt-2 text-right font-semibold">{formatMoney(order.grandTotal, order.currency)}</dd></dl>
        </section>

        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-semibold text-[var(--foreground)]">Fulfillment</h3><p className="mt-0.5 text-xs text-[var(--muted-foreground)]">Shipping updates are version-checked and reduce reserved stock only when marked shipped.</p></div>{canWrite && canFulfill ? <button type="button" disabled={Boolean(busy)} onClick={onCreateFulfillment} className={secondaryButtonClass}><Truck size={15} /> Create fulfillment</button> : null}</div>
          {fulfillments.length === 0 ? <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-8 text-center text-xs text-[var(--muted-foreground)]">No fulfillment has been created for this order.</div> : <div className="space-y-3">{fulfillments.map((fulfillment) => <article key={fulfillment.id} className="rounded-xl border border-[var(--border)] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><strong className="text-sm text-[var(--foreground)]">{fulfillment.fulfillmentNumber}</strong><StatusBadge status={fulfillment.status} /></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{[fulfillment.carrier, fulfillment.trackingNumber].filter(Boolean).join(" · ") || "No carrier details yet"}</p></div>{canWrite && fulfillmentTransitions[fulfillment.status].length ? <div className="flex flex-wrap gap-2">{fulfillmentTransitions[fulfillment.status].map((target) => <button key={target} type="button" disabled={Boolean(busy)} onClick={() => onTransitionFulfillment(fulfillment, target)} className={target === "CANCELLED" ? `${secondaryButtonClass} text-rose-700` : secondaryButtonClass}>{busy === `fulfillment:${fulfillment.id}:${target}` ? <RefreshCw size={14} className="animate-spin" /> : null}{actionLabel(target)}</button>)}</div> : null}</div>{fulfillment.trackingUrl ? <a href={fulfillment.trackingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-medium text-indigo-700 underline-offset-4 hover:underline">Open carrier tracking</a> : null}</article>)}</div>}
        </section>

        {order.notes ? <section className="rounded-xl bg-[var(--secondary)] p-4"><h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Notes</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{order.notes}</p></section> : null}
      </div>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-[var(--secondary)] p-3"><dt className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">{label}</dt><dd className="mt-1 truncate text-sm font-medium capitalize text-[var(--foreground)]">{value}</dd></div>;
}

function CreateOrderDialog({ workspaceId, onClose, onCreated }: { workspaceId: string; onClose: () => void; onCreated: (detail: CommerceOrderDetail) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [productId, setProductId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [currency, setCurrency] = useState("CNY");
  const [shippingTotal, setShippingTotal] = useState("0");
  const [externalReference, setExternalReference] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      productsApi.list(workspaceId, "status=ACTIVE&limit=100&sort=name&order=asc"),
      commerceApi.listLocations(workspaceId, "ACTIVE"),
    ]).then(([productResponse, locationResponse]) => {
      if (!active) return;
      setProducts(productResponse.data.items);
      setLocations(locationResponse.data);
      const first = productResponse.data.items[0];
      if (first) {
        setProductId(first.id);
        setCurrency(first.defaultCurrency || "CNY");
        setUnitPrice(first.defaultPrice || "");
      }
      const preferred = locationResponse.data.find((location) => location.isDefault) ?? locationResponse.data[0];
      if (preferred) setLocationId(preferred.id);
    }).catch((nextError) => setError(getFriendlyErrorMessage(nextError, "The product catalog could not be prepared."))).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [workspaceId]);

  const selectProduct = (id: string) => {
    setProductId(id);
    const product = products.find((item) => item.id === id);
    if (product) {
      setCurrency(product.defaultCurrency || "CNY");
      setUnitPrice(product.defaultPrice || "");
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!productId || Number(quantity) <= 0 || Number(shippingTotal || 0) < 0 || (unitPrice && Number(unitPrice) < 0)) return;
    setSaving(true);
    setError("");
    try {
      const response = await commerceApi.createOrder(workspaceId, {
        idempotencyKey: commerceIdempotencyKey("order.create"),
        currency,
        shippingTotal: shippingTotal || "0",
        source: "workspace",
        externalReference: externalReference.trim() || null,
        sourceProvider: externalReference.trim() ? "workspace" : null,
        notes: notes.trim() || null,
        shippingAddress: {},
        billingAddress: {},
        metadata: {},
        lines: [{
          productId,
          inventoryLocationId: locationId || null,
          quantity,
          ...(unitPrice ? { unitPrice } : {}),
          discount: "0",
          tax: "0",
          metadata: {},
        }],
      });
      onCreated(response.data);
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The order could not be created."));
    } finally {
      setSaving(false);
    }
  };

  return <Modal title="Create canonical order" description="The order starts as a draft. Placing and confirming it are separate, auditable steps; confirmation reserves tracked stock." onClose={onClose}>
    <form onSubmit={(event) => void submit(event)} className="space-y-5">
      <Feedback error={error} />
      {loading ? <div className="grid min-h-40 place-items-center text-sm text-[var(--muted-foreground)]"><RefreshCw className="mb-2 animate-spin" />Loading catalog…</div> : products.length === 0 ? <EmptyState icon={<Box />} title="No active products" description="Create and activate a canonical product before creating an order." action={<Link to={isOfficePanelSurface() ? withOfficePanelSurface(routes.app.products) : routes.app.products} className={primaryButtonClass}>Open products</Link>} /> : <>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Product</span><select required value={productId} onChange={(event) => selectProduct(event.target.value)} className={fieldClass}>{products.map((product) => <option value={product.id} key={product.id}>{product.name}{product.sku ? ` · ${product.sku}` : ""}</option>)}</select></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Quantity</span><input required min="0.0001" step="0.0001" type="number" value={quantity} onChange={(event) => setQuantity(event.target.value)} className={fieldClass} /></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Inventory location <span className="font-normal">(optional)</span></span><select value={locationId} onChange={(event) => setLocationId(event.target.value)} className={fieldClass}><option value="">Not inventory-tracked</option>{locations.map((location) => <option value={location.id} key={location.id}>{location.name}{location.isDefault ? " · Default" : ""}</option>)}</select></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Unit price</span><input min="0" step="0.0001" type="number" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} placeholder="Use catalog price" className={fieldClass} /></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Currency</span><input required minLength={3} maxLength={3} value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} className={fieldClass} /></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Shipping total</span><input min="0" step="0.0001" type="number" value={shippingTotal} onChange={(event) => setShippingTotal(event.target.value)} className={fieldClass} /></label>
          <label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">External reference <span className="font-normal">(optional)</span></span><input value={externalReference} maxLength={300} onChange={(event) => setExternalReference(event.target.value)} className={fieldClass} /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Internal notes <span className="font-normal">(optional)</span></span><textarea rows={4} value={notes} maxLength={20_000} onChange={(event) => setNotes(event.target.value)} className={fieldClass} /></label>
        </div>
        <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button><button type="submit" disabled={saving || !productId} className={primaryButtonClass}>{saving ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}{saving ? "Creating…" : "Create draft"}</button></div>
      </>}
    </form>
  </Modal>;
}

function CreateFulfillmentDialog({ workspaceId, detail, onClose, onCreated }: { workspaceId: string; detail: CommerceOrderDetail; onClose: () => void; onCreated: () => void }) {
  const eligible = detail.lines.filter((line) => Number(line.quantity) > Number(line.fulfilledQuantity));
  const baseRemaining = Object.fromEntries(eligible.map((line) => [line.id, Math.max(0, Number(line.quantity) - Number(line.fulfilledQuantity))]));
  const [remainingByLine, setRemainingByLine] = useState<Record<string, number>>(baseRemaining);
  const [quantities, setQuantities] = useState<Record<string, string>>(() => Object.fromEntries(eligible.map((line) => [line.id, String(baseRemaining[line.id] ?? 0)])));
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const allocatedFulfillments = detail.fulfillments.filter((fulfillment) => ["DRAFT", "PROCESSING"].includes(fulfillment.status));
    Promise.all(allocatedFulfillments.map((fulfillment) => commerceApi.getFulfillment(workspaceId, detail.order.id, fulfillment.id)))
      .then((responses) => {
        if (!active) return;
        const allocated: Record<string, number> = {};
        responses.forEach((response) => response.data.lines.forEach((line) => { allocated[line.orderLineId] = (allocated[line.orderLineId] ?? 0) + Number(line.quantity); }));
        const nextRemaining = Object.fromEntries(eligible.map((line) => [line.id, Math.max(0, Number(line.quantity) - Number(line.fulfilledQuantity) - (allocated[line.id] ?? 0))]));
        setRemainingByLine(nextRemaining);
        setQuantities(Object.fromEntries(eligible.map((line) => [line.id, String(nextRemaining[line.id] ?? 0)])));
      })
      .catch((nextError) => setError(getFriendlyErrorMessage(nextError, "Existing fulfillment allocations could not be verified.")))
      .finally(() => active && setAllocationLoading(false));
    return () => { active = false; };
  }, [detail.fulfillments, detail.lines, detail.order.id, workspaceId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const lines = eligible.flatMap((line) => Number(quantities[line.id]) > 0 && Number(quantities[line.id]) <= (remainingByLine[line.id] ?? 0) ? [{ orderLineId: line.id, quantity: quantities[line.id]! }] : []);
    if (!lines.length) { setError("Enter a quantity for at least one order line."); return; }
    setSaving(true);
    setError("");
    try {
      await commerceApi.createFulfillment(workspaceId, detail.order.id, {
        idempotencyKey: commerceIdempotencyKey("fulfillment.create"),
        expectedOrderVersion: detail.order.version,
        carrier: carrier.trim() || null,
        trackingNumber: trackingNumber.trim() || null,
        trackingUrl: trackingUrl.trim() || null,
        notes: notes.trim() || null,
        metadata: {},
        lines,
      });
      onCreated();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The fulfillment could not be created. Reload the order and try again."));
    } finally {
      setSaving(false);
    }
  };

  return <Modal title="Create fulfillment" description="Allocate only the quantity being handled in this shipment. Stock is deducted later, when the fulfillment is marked shipped." onClose={onClose}>
    <form onSubmit={(event) => void submit(event)} className="space-y-5">
      <Feedback error={error} />
      {allocationLoading ? <div className="flex items-center gap-2 rounded-xl bg-[var(--secondary)] px-4 py-3 text-xs text-[var(--muted-foreground)]"><RefreshCw size={14} className="animate-spin" />Verifying unallocated quantities…</div> : null}
      <div className="space-y-2">{eligible.map((line) => { const remaining = remainingByLine[line.id] ?? 0; return <label key={line.id} className="grid items-center gap-3 rounded-xl border border-[var(--border)] p-3 sm:grid-cols-[minmax(0,1fr)_130px]"><span><strong className="block text-sm text-[var(--foreground)]">{line.productName}</strong><small className="text-[var(--muted-foreground)]">{formatNumber(remaining)} unallocated{line.sku ? ` · ${line.sku}` : ""}</small></span><input disabled={allocationLoading || remaining <= 0} aria-label={`Quantity for ${line.productName}`} type="number" min="0" max={remaining} step="0.0001" value={quantities[line.id] ?? "0"} onChange={(event) => setQuantities((current) => ({ ...current, [line.id]: event.target.value }))} className={fieldClass} /></label>; })}</div>
      <div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Carrier <span className="font-normal">(optional)</span></span><input value={carrier} maxLength={200} onChange={(event) => setCarrier(event.target.value)} className={fieldClass} /></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Tracking number <span className="font-normal">(optional)</span></span><input value={trackingNumber} maxLength={300} onChange={(event) => setTrackingNumber(event.target.value)} className={fieldClass} /></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Tracking URL <span className="font-normal">(optional)</span></span><input type="url" value={trackingUrl} onChange={(event) => setTrackingUrl(event.target.value)} className={fieldClass} /></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Notes <span className="font-normal">(optional)</span></span><textarea rows={3} value={notes} maxLength={5000} onChange={(event) => setNotes(event.target.value)} className={fieldClass} /></label></div>
      <div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button><button type="submit" disabled={saving || allocationLoading || !eligible.some((line) => Number(quantities[line.id]) > 0 && Number(quantities[line.id]) <= (remainingByLine[line.id] ?? 0))} className={primaryButtonClass}>{saving ? <RefreshCw size={15} className="animate-spin" /> : <Truck size={15} />}{saving ? "Creating…" : "Create fulfillment"}</button></div>
    </form>
  </Modal>;
}
