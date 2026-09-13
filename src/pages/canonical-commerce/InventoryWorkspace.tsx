import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Boxes, Building2, ChevronLeft, ChevronRight, History, PackageSearch, Plus, RefreshCw, Search, SlidersHorizontal, Warehouse } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useLuluApp } from "../../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  commerceApi,
  commerceIdempotencyKey,
  type InventoryLevel,
  type InventoryLocation,
  type InventoryMovement,
} from "../../api/commerce";
import { productsApi, type Product } from "../../api/products";
import { CommerceTabs, EmptyState, Feedback, Modal, StatCard, StatusBadge, fieldClass, formatDate, formatNumber, primaryButtonClass, secondaryButtonClass } from "./commerce-ui";

type InventoryView = "levels" | "movements" | "locations";
type LoadState = "loading" | "refreshing" | "ready" | "stale" | "error";

export default function InventoryWorkspace() {
  const { selectedWorkspace, hasCapability } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? "";
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedView = searchParams.get("view");
  const view: InventoryView = requestedView === "movements" || requestedView === "locations" ? requestedView : "levels";
  const recordId = searchParams.get("recordId");
  const [levels, setLevels] = useState<InventoryLevel[]>([]);
  const [locations, setLocations] = useState<InventoryLocation[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [selected, setSelected] = useState<InventoryLevel | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [locationFilter, setLocationFilter] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [levelsState, setLevelsState] = useState<LoadState>("loading");
  const [locationsState, setLocationsState] = useState<LoadState>("loading");
  const [movementsState, setMovementsState] = useState<LoadState>("loading");
  const verifiedWorkspaceRef = useRef<{ levels: string | null; locations: string | null; movements: string | null }>({ levels: null, locations: null, movements: null });
  const requestsRef = useRef({ levels: 0, locations: 0, movements: 0 });
  const detailRequestRef = useRef(0);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const [adjustTarget, setAdjustTarget] = useState<InventoryLevel | "new" | null>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const canWrite = hasCapability("orders.manage");

  const loadLevels = useCallback(async () => {
    if (!workspaceId) return;
    const request = ++requestsRef.current.levels;
    const collectionKey = `${workspaceId}:${page}:${locationFilter}:${lowOnly ? "low" : "all"}`;
    const hasVerifiedData = verifiedWorkspaceRef.current.levels === collectionKey;
    setLoading(true);
    setLevelsState(hasVerifiedData ? "refreshing" : "loading");
    if (!hasVerifiedData) { setLevels([]); setTotal(0); setPages(1); }
    setError("");
    try {
      const response = await commerceApi.listLevels(workspaceId, { page, limit: 50, locationId: locationFilter || undefined, belowReorderPoint: lowOnly || undefined });
      if (request !== requestsRef.current.levels) return;
      setLevels(response.data.items);
      setTotal(response.data.pagination.total);
      setPages(Math.max(1, response.data.pagination.pages));
      verifiedWorkspaceRef.current.levels = collectionKey;
      setLevelsState("ready");
    } catch (nextError) {
      if (request !== requestsRef.current.levels) return;
      const message = getFriendlyErrorMessage(nextError, "Inventory levels could not be loaded.");
      const stale = verifiedWorkspaceRef.current.levels === collectionKey;
      setLevelsState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded inventory levels. ${message}` : message);
    } finally {
      if (request === requestsRef.current.levels) setLoading(false);
    }
  }, [locationFilter, lowOnly, page, workspaceId]);

  const loadLocations = useCallback(async () => {
    if (!workspaceId) return;
    const request = ++requestsRef.current.locations;
    const hasVerifiedData = verifiedWorkspaceRef.current.locations === workspaceId;
    setLocationsState(hasVerifiedData ? "refreshing" : "loading");
    try {
      const response = await commerceApi.listLocations(workspaceId);
      if (request !== requestsRef.current.locations) return;
      setLocations(response.data);
      verifiedWorkspaceRef.current.locations = workspaceId;
      setLocationsState("ready");
    } catch (nextError) {
      if (request !== requestsRef.current.locations) return;
      const message = getFriendlyErrorMessage(nextError, "Inventory locations could not be loaded.");
      const stale = verifiedWorkspaceRef.current.locations === workspaceId;
      setLocationsState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded locations. ${message}` : message);
    }
  }, [workspaceId]);

  const loadMovements = useCallback(async (levelId?: string) => {
    if (!workspaceId) return;
    const request = ++requestsRef.current.movements;
    const collectionKey = `${workspaceId}:${levelId ?? "all"}`;
    const hasVerifiedData = verifiedWorkspaceRef.current.movements === collectionKey;
    setMovementsState(hasVerifiedData ? "refreshing" : "loading");
    if (!hasVerifiedData) setMovements([]);
    try {
      const response = await commerceApi.listMovements(workspaceId, { limit: 100, levelId });
      if (request !== requestsRef.current.movements) return;
      setMovements(response.data.items);
      verifiedWorkspaceRef.current.movements = collectionKey;
      setMovementsState("ready");
    } catch (nextError) {
      if (request !== requestsRef.current.movements) return;
      const message = getFriendlyErrorMessage(nextError, "Inventory history could not be loaded.");
      const stale = verifiedWorkspaceRef.current.movements === collectionKey;
      setMovementsState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded inventory history. ${message}` : message);
    }
  }, [workspaceId]);

  useEffect(() => {
    requestsRef.current.levels += 1; requestsRef.current.locations += 1; requestsRef.current.movements += 1; detailRequestRef.current += 1;
    verifiedWorkspaceRef.current = { levels: null, locations: null, movements: null };
    setLevels([]); setLocations([]); setMovements([]); setSelected(null); setTotal(0); setPages(1);
    setLevelsState("loading"); setLocationsState("loading"); setMovementsState("loading"); setDetailLoading(false);
  }, [workspaceId]);
  useEffect(() => { void Promise.all([loadLevels(), loadLocations()]); }, [loadLevels, loadLocations]);
  useEffect(() => { if (view === "movements") void loadMovements(); }, [loadMovements, view]);
  useEffect(() => {
    const request = ++detailRequestRef.current;
    if (!recordId || !workspaceId) { setSelected(null); setDetailLoading(false); return; }
    const current = levels.find((level) => level.id === recordId);
    if (current) { setSelected(current); setDetailLoading(false); void loadMovements(current.id); return; }
    setDetailLoading(true);
    commerceApi.getLevel(workspaceId, recordId).then((response) => { if (request !== detailRequestRef.current) return; setSelected(response.data); return loadMovements(response.data.id); }).catch((nextError) => { if (request !== detailRequestRef.current) return; setSelected(null); setError(getFriendlyErrorMessage(nextError, "This inventory level could not be loaded.")); }).finally(() => { if (request === detailRequestRef.current) setDetailLoading(false); });
  }, [levels, loadMovements, recordId, workspaceId]);

  const filteredLevels = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return levels;
    return levels.filter((level) => [level.productName, level.variantName, level.sku, level.locationName, level.locationCode].some((value) => value?.toLowerCase().includes(needle)));
  }, [levels, search]);

  const stats = useMemo(() => ({
    available: levels.reduce((sum, level) => sum + Number(level.available || 0), 0),
    reserved: levels.reduce((sum, level) => sum + Number(level.reserved || 0), 0),
    low: levels.filter((level) => Number(level.available) <= Number(level.reorderPoint)).length,
  }), [levels]);

  const setView = (nextView: InventoryView) => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    if (nextView === "levels") next.delete("view"); else next.set("view", nextView);
    if (nextView !== "levels") next.delete("recordId");
    return next;
  }, { replace: true });

  const openLevel = (level: InventoryLevel) => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    next.delete("view");
    next.set("recordId", level.id);
    return next;
  }, { replace: true });

  const closeLevel = () => setSearchParams((current) => {
    const next = new URLSearchParams(current);
    next.delete("recordId");
    return next;
  }, { replace: true });

  const refresh = async () => {
    await Promise.all([loadLevels(), loadLocations(), view === "movements" ? loadMovements() : selected ? loadMovements(selected.id) : Promise.resolve()]);
    if (selected) {
      const request = ++detailRequestRef.current;
      try { const response = await commerceApi.getLevel(workspaceId, selected.id); if (request === detailRequestRef.current) setSelected(response.data); } catch { /* surfaced by list requests */ }
    }
  };

  const toggleLocation = async (location: InventoryLocation) => {
    if (!workspaceId || busy || !canWrite) return;
    const nextStatus = location.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setBusy(`location:${location.id}`);
    setError("");
    setNotice("");
    try {
      await commerceApi.updateLocation(workspaceId, location.id, { idempotencyKey: commerceIdempotencyKey("inventory.location.update"), expectedVersion: location.version, status: nextStatus });
      setNotice(`${location.name} is now ${nextStatus.toLowerCase()}.`);
      await loadLocations();
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The location changed or could not be updated. Reload and try again."));
    } finally {
      setBusy("");
    }
  };

  if (!selectedWorkspace) return <main className="page-frame p-8"><h1 className="text-2xl font-semibold">Inventory</h1><p className="mt-2 text-[var(--muted-foreground)]">Choose a workspace to manage inventory.</p></main>;

  return (
    <main className="page-frame min-h-screen bg-[var(--background)] p-4 sm:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div><p className="eyebrow">Canonical Commerce</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--foreground)]">Inventory control</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">Real stock, reservations and fulfillment movements across every location—protected against negative availability and stale updates.</p></div>
          <div className="flex flex-wrap items-center gap-2"><CommerceTabs active="inventory" /><button type="button" onClick={() => void refresh()} className={secondaryButtonClass}><RefreshCw size={15} className={loading || detailLoading ? "animate-spin" : ""} /> Refresh</button>{canWrite ? <><button type="button" onClick={() => setLocationOpen(true)} className={secondaryButtonClass}><Building2 size={15} /> New location</button><button type="button" onClick={() => setAdjustTarget("new")} className={primaryButtonClass}><SlidersHorizontal size={15} /> Adjust stock</button></> : null}</div>
        </header>
        <Feedback error={error} notice={notice} />

        <section className="grid gap-3 sm:grid-cols-4"><StatCard label="Stock records" value={levelsState === "loading" || levelsState === "error" ? "—" : total} detail="Current filters" /><StatCard label="Available" value={levelsState === "loading" || levelsState === "error" ? "—" : formatNumber(stats.available)} detail="On this page" /><StatCard label="Reserved" value={levelsState === "loading" || levelsState === "error" ? "—" : formatNumber(stats.reserved)} detail="On this page" /><StatCard label="At/below reorder" value={levelsState === "loading" || levelsState === "error" ? "—" : stats.low} detail="On this page" /></section>

        <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
          <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap gap-1 rounded-xl bg-[var(--secondary)] p-1" aria-label="Inventory views">
              {([ ["levels", "Stock levels", Boxes], ["movements", "Movements", History], ["locations", "Locations", Warehouse] ] as const).map(([id, label, Icon]) => <button key={id} type="button" onClick={() => setView(id)} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${view === id ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`}><Icon size={14} />{label}</button>)}
            </nav>
            {view === "levels" ? <div className="flex flex-col gap-2 sm:flex-row"><label className="relative"><Search size={15} className="absolute left-3 top-3 text-[var(--muted-foreground)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter visible stock" className={`${fieldClass} pl-9 sm:w-56`} /></label><select value={locationFilter} onChange={(event) => { setPage(1); setLocationFilter(event.target.value); }} className={`${fieldClass} sm:w-52`} aria-label="Inventory location"><option value="">All locations</option>{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}</select><label className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--foreground)]"><input type="checkbox" checked={lowOnly} onChange={(event) => { setPage(1); setLowOnly(event.target.checked); }} /> Reorder only</label></div> : null}
          </div>

          {view === "levels" ? <LevelsView levels={filteredLevels} loadState={levelsState} selectedId={recordId} canWrite={canWrite} onOpen={openLevel} onAdjust={(level) => setAdjustTarget(level)} onCreate={() => setAdjustTarget("new")} /> : null}
          {view === "movements" ? <MovementsView movements={movements} loadState={movementsState} /> : null}
          {view === "locations" ? <LocationsView locations={locations} loadState={locationsState} canWrite={canWrite} busy={busy} onToggle={(location) => void toggleLocation(location)} onCreate={() => setLocationOpen(true)} /> : null}

          {view === "levels" && pages > 1 ? <footer className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3 text-xs text-[var(--muted-foreground)]"><span>Page {page} of {pages}</span><div className="flex gap-2"><button className={secondaryButtonClass} disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))} aria-label="Previous page"><ChevronLeft size={15} /></button><button className={secondaryButtonClass} disabled={page >= pages} onClick={() => setPage((value) => Math.min(pages, value + 1))} aria-label="Next page"><ChevronRight size={15} /></button></div></footer> : null}
        </section>
      </div>

      {selected ? <LevelDetailDrawer level={selected} movements={movements} movementsState={movementsState} canWrite={canWrite} onClose={closeLevel} onAdjust={() => setAdjustTarget(selected)} /> : null}
      {adjustTarget && canWrite ? <AdjustInventoryDialog workspaceId={workspaceId} target={adjustTarget === "new" ? null : adjustTarget} locations={locations.filter((location) => location.status === "ACTIVE")} onClose={() => setAdjustTarget(null)} onAdjusted={(level) => { setAdjustTarget(null); setSelected(level); openLevel(level); setNotice(`Stock for ${level.productName} was adjusted.`); void refresh(); }} /> : null}
      {locationOpen && canWrite ? <CreateLocationDialog workspaceId={workspaceId} onClose={() => setLocationOpen(false)} onCreated={(location) => { setLocationOpen(false); setNotice(`${location.name} was created.`); void loadLocations(); }} /> : null}
    </main>
  );
}

function LevelsView({ levels, loadState, selectedId, canWrite, onOpen, onAdjust, onCreate }: { levels: InventoryLevel[]; loadState: LoadState; selectedId: string | null; canWrite: boolean; onOpen: (level: InventoryLevel) => void; onAdjust: (level: InventoryLevel) => void; onCreate: () => void }) {
  if ((loadState === "loading" || loadState === "refreshing") && levels.length === 0) return <EmptyState icon={<RefreshCw className="animate-spin" />} title="Loading inventory" description="Reading current stock and reservations…" />;
  if ((loadState === "error" || loadState === "stale") && levels.length === 0) return <EmptyState icon={<PackageSearch />} title="Inventory unavailable" description="Lulu could not verify the current stock state. Refresh to try again." />;
  if (loadState === "ready" && levels.length === 0) return <EmptyState icon={<PackageSearch />} title="No inventory levels found" description="Create a location, then add the first stock adjustment. Lulu and manual workflows will use the same record." action={canWrite ? <button type="button" onClick={onCreate} className={primaryButtonClass}><Plus size={15} /> Add stock</button> : undefined} />;
  return <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-xs"><thead className="bg-[var(--secondary)] text-[var(--muted-foreground)]"><tr><th className="px-4 py-3">Product</th><th className="px-3 py-3">Location</th><th className="px-3 py-3 text-right">On hand</th><th className="px-3 py-3 text-right">Reserved</th><th className="px-3 py-3 text-right">Available</th><th className="px-3 py-3 text-right">Reorder point</th><th className="px-4 py-3 text-right">Action</th></tr></thead><tbody className="divide-y divide-[var(--border)]">{levels.map((level) => { const low = Number(level.available) <= Number(level.reorderPoint); return <tr key={level.id} className={selectedId === level.id ? "bg-[var(--secondary)]" : "hover:bg-[var(--secondary)]/60"}><td className="px-4 py-3"><button type="button" onClick={() => onOpen(level)} className="text-left"><strong className="block text-sm text-[var(--foreground)] hover:underline">{level.productName}{level.variantName ? ` — ${level.variantName}` : ""}</strong><span className="mt-0.5 block text-[var(--muted-foreground)]">{level.sku || "No SKU"} · v{level.version}</span></button></td><td className="px-3 py-3"><span className="font-medium text-[var(--foreground)]">{level.locationName}</span><span className="ml-1 text-[var(--muted-foreground)]">({level.locationCode})</span></td><td className="px-3 py-3 text-right text-[var(--foreground)]">{formatNumber(level.onHand)}</td><td className="px-3 py-3 text-right text-[var(--muted-foreground)]">{formatNumber(level.reserved)}</td><td className={`px-3 py-3 text-right font-semibold ${low ? "text-amber-700" : "text-emerald-700"}`}>{formatNumber(level.available)}</td><td className="px-3 py-3 text-right text-[var(--muted-foreground)]">{formatNumber(level.reorderPoint)}</td><td className="px-4 py-3 text-right"><button type="button" disabled={!canWrite} onClick={() => onAdjust(level)} className={secondaryButtonClass}><SlidersHorizontal size={14} /> Adjust</button></td></tr>; })}</tbody></table></div>;
}

function MovementsView({ movements, loadState = "ready" }: { movements: InventoryMovement[]; loadState?: LoadState }) {
  if ((loadState === "loading" || loadState === "refreshing") && movements.length === 0) return <EmptyState icon={<RefreshCw className="animate-spin" />} title="Loading inventory history" description="Reading immutable movements…" />;
  if ((loadState === "error" || loadState === "stale") && movements.length === 0) return <EmptyState icon={<History />} title="Inventory history unavailable" description="Lulu could not verify the current movement history." />;
  if (loadState === "ready" && movements.length === 0) return <EmptyState icon={<History />} title="No inventory movements" description="Adjustments, reservations, releases and shipped quantities will appear here as immutable operational history." />;
  return <div className="divide-y divide-[var(--border)]">{movements.map((movement) => { const net = Number(movement.onHandDelta) + Number(movement.reservedDelta); const positive = net > 0 || Number(movement.onHandDelta) > 0; return <article key={movement.id} className="grid gap-3 p-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"><div className={`grid h-9 w-9 place-items-center rounded-full ${positive ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>{positive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}</div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[var(--foreground)]">{movement.movementType.replaceAll("_", " ")}</strong><span className="text-xs text-[var(--muted-foreground)]">{movement.actorType.replaceAll("_", " ").toLowerCase()}</span></div><p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">{movement.reason}{movement.orderId ? ` · Order ${movement.orderId.slice(0, 8)}` : ""}</p></div><div className="text-right"><strong className={Number(movement.onHandDelta) > 0 ? "text-emerald-700" : Number(movement.onHandDelta) < 0 ? "text-rose-700" : "text-[var(--foreground)]"}>{Number(movement.onHandDelta) > 0 ? "+" : ""}{formatNumber(movement.onHandDelta)}</strong><span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">{formatDate(movement.createdAt)}</span></div></article>; })}</div>;
}

function LocationsView({ locations, loadState, canWrite, busy, onToggle, onCreate }: { locations: InventoryLocation[]; loadState: LoadState; canWrite: boolean; busy: string; onToggle: (location: InventoryLocation) => void; onCreate: () => void }) {
  if ((loadState === "loading" || loadState === "refreshing") && locations.length === 0) return <EmptyState icon={<RefreshCw className="animate-spin" />} title="Loading locations" description="Reading canonical inventory locations…" />;
  if ((loadState === "error" || loadState === "stale") && locations.length === 0) return <EmptyState icon={<Warehouse />} title="Locations unavailable" description="Lulu could not verify the current location state." />;
  if (loadState === "ready" && locations.length === 0) return <EmptyState icon={<Warehouse />} title="No inventory locations" description="Create the first warehouse, showroom or stock location before adding inventory." action={canWrite ? <button type="button" onClick={onCreate} className={primaryButtonClass}><Plus size={15} /> Create location</button> : undefined} />;
  return <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">{locations.map((location) => <article key={location.id} className="rounded-xl border border-[var(--border)] p-4"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><strong className="text-sm text-[var(--foreground)]">{location.name}</strong>{location.isDefault ? <span className="rounded-full bg-violet-50 px-2 py-1 text-[10px] font-semibold text-violet-700">DEFAULT</span> : null}</div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{location.code} · v{location.version}</p></div><StatusBadge status={location.status} /></div><div className="mt-4 flex items-center justify-between gap-2 text-xs text-[var(--muted-foreground)]"><span>Updated {formatDate(location.updatedAt)}</span>{canWrite && location.status !== "ARCHIVED" ? <button type="button" disabled={Boolean(busy) || location.isDefault && location.status === "ACTIVE"} title={location.isDefault ? "Assign another default before deactivating this location" : undefined} onClick={() => onToggle(location)} className={secondaryButtonClass}>{busy === `location:${location.id}` ? <RefreshCw size={14} className="animate-spin" /> : null}{location.status === "ACTIVE" ? "Deactivate" : "Activate"}</button> : null}</div></article>)}</div>;
}

function LevelDetailDrawer({ level, movements, movementsState, canWrite, onClose, onAdjust }: { level: InventoryLevel; movements: InventoryMovement[]; movementsState: LoadState; canWrite: boolean; onClose: () => void; onAdjust: () => void }) {
  const low = Number(level.available) <= Number(level.reorderPoint);
  return <div className="fixed inset-0 z-[75] bg-slate-950/20" onClick={onClose}><aside role="dialog" aria-label={`Inventory for ${level.productName}`} className="absolute inset-y-0 right-0 w-full max-w-lg overflow-y-auto border-l border-[var(--border)] bg-[var(--background)] shadow-2xl" onClick={(event) => event.stopPropagation()}><header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/95 p-5 backdrop-blur"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">{level.locationName}</p><h2 className="mt-1 text-xl font-semibold text-[var(--foreground)]">{level.productName}</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">{level.sku || "No SKU"} · record v{level.version}</p></div><button type="button" onClick={onClose} className={secondaryButtonClass}>Close</button></div>{canWrite ? <button type="button" onClick={onAdjust} className={`${primaryButtonClass} mt-4 w-full`}><SlidersHorizontal size={15} /> Adjust this stock</button> : null}</header><div className="space-y-6 p-5"><div className="grid grid-cols-2 gap-3"><StatCard label="On hand" value={formatNumber(level.onHand)} /><StatCard label="Reserved" value={formatNumber(level.reserved)} /><StatCard label="Available" value={formatNumber(level.available)} detail={low ? "At or below reorder point" : "Above reorder point"} /><StatCard label="Reorder point" value={formatNumber(level.reorderPoint)} /></div><section><h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">Movement history</h3><div className="overflow-hidden rounded-xl border border-[var(--border)]"><MovementsView movements={movements} loadState={movementsState} /></div></section></div></aside></div>;
}

function AdjustInventoryDialog({ workspaceId, target, locations, onClose, onAdjusted }: { workspaceId: string; target: InventoryLevel | null; locations: InventoryLocation[]; onClose: () => void; onAdjusted: (level: InventoryLevel) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState(target?.productId ?? "");
  const [locationId, setLocationId] = useState(target?.locationId ?? locations.find((location) => location.isDefault)?.id ?? locations[0]?.id ?? "");
  const [delta, setDelta] = useState("");
  const [reorderPoint, setReorderPoint] = useState(target?.reorderPoint ?? "0");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(!target);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (target) return;
    let active = true;
    productsApi.list(workspaceId, "status=ACTIVE&limit=100&sort=name&order=asc").then((response) => { if (!active) return; setProducts(response.data.items); if (!productId && response.data.items[0]) setProductId(response.data.items[0].id); }).catch((nextError) => setError(getFriendlyErrorMessage(nextError, "Products could not be loaded."))).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [productId, target, workspaceId]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!productId || !locationId || !reason.trim() || Number(delta) === 0) return;
    setSaving(true);
    setError("");
    try {
      let expectedVersion = target?.version ?? 0;
      if (!target) {
        const current = await commerceApi.listLevels(workspaceId, { productId, locationId, limit: 10 });
        const exact = current.data.items.find((level) => level.productId === productId && level.locationId === locationId && level.variantId === null);
        expectedVersion = exact?.version ?? 0;
      }
      const response = await commerceApi.adjustInventory(workspaceId, {
        idempotencyKey: commerceIdempotencyKey("inventory.adjust"),
        locationId,
        productId,
        variantId: target?.variantId ?? null,
        delta,
        expectedVersion,
        reason: reason.trim(),
        reorderPoint: reorderPoint || "0",
        metadata: {},
      });
      onAdjusted(response.data);
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "Stock could not be adjusted. Reload the latest level and try again."));
    } finally {
      setSaving(false);
    }
  };

  const catalog = target ? [{ id: target.productId, name: target.productName, sku: target.sku } as Product] : products;
  return <Modal title={target ? `Adjust ${target.productName}` : "Adjust inventory"} description="Positive values receive stock; negative values remove it. Lulu prevents the result from becoming negative or falling below reserved stock." onClose={onClose}>
    <form onSubmit={(event) => void submit(event)} className="space-y-5"><Feedback error={error} />{loading ? <div className="grid min-h-32 place-items-center"><RefreshCw className="animate-spin text-[var(--muted-foreground)]" /></div> : !catalog.length || !locations.length ? <EmptyState icon={<Warehouse />} title="Inventory setup required" description={!locations.length ? "Create an active inventory location first." : "Create and activate a product first."} /> : <><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Product</span><select disabled={Boolean(target)} required value={productId} onChange={(event) => setProductId(event.target.value)} className={fieldClass}>{catalog.map((product) => <option value={product.id} key={product.id}>{product.name}{product.sku ? ` · ${product.sku}` : ""}</option>)}</select></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Location</span><select disabled={Boolean(target)} required value={locationId} onChange={(event) => setLocationId(event.target.value)} className={fieldClass}>{locations.map((location) => <option value={location.id} key={location.id}>{location.name}{location.isDefault ? " · Default" : ""}</option>)}</select></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Quantity delta</span><input required type="number" step="0.0001" value={delta} onChange={(event) => setDelta(event.target.value)} placeholder="e.g. 50 or -2" className={fieldClass} /></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Reorder point</span><input required type="number" min="0" step="0.0001" value={reorderPoint} onChange={(event) => setReorderPoint(event.target.value)} className={fieldClass} /></label><label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Reason</span><textarea required rows={3} maxLength={2000} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Why is stock changing?" className={fieldClass} /></label></div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button><button type="submit" disabled={saving || !productId || !locationId || !reason.trim() || Number(delta) === 0} className={primaryButtonClass}>{saving ? <RefreshCw size={15} className="animate-spin" /> : <SlidersHorizontal size={15} />}{saving ? "Saving…" : "Apply adjustment"}</button></div></>}</form>
  </Modal>;
}

function CreateLocationDialog({ workspaceId, onClose, onCreated }: { workspaceId: string; onClose: () => void; onCreated: (location: InventoryLocation) => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isDefault, setDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim() || !name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const response = await commerceApi.createLocation(workspaceId, { idempotencyKey: commerceIdempotencyKey("inventory.location.create"), code: code.trim(), name: name.trim(), isDefault, address: {}, metadata: {} });
      onCreated(response.data);
    } catch (nextError) {
      setError(getFriendlyErrorMessage(nextError, "The inventory location could not be created."));
    } finally { setSaving(false); }
  };
  return <Modal title="Create inventory location" description="Locations are canonical stock boundaries used by manual work, Lulu employees and connected commerce providers." onClose={onClose}><form onSubmit={(event) => void submit(event)} className="space-y-5"><Feedback error={error} /><div className="grid gap-4 sm:grid-cols-2"><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Location code</span><input autoFocus required maxLength={80} value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="BER-WH-01" className={fieldClass} /></label><label><span className="mb-1.5 block text-xs font-medium text-[var(--muted-foreground)]">Name</span><input required maxLength={200} value={name} onChange={(event) => setName(event.target.value)} placeholder="Berlin warehouse" className={fieldClass} /></label><label className="sm:col-span-2 inline-flex items-center gap-3 rounded-xl border border-[var(--border)] p-4 text-sm text-[var(--foreground)]"><input type="checkbox" checked={isDefault} onChange={(event) => setDefault(event.target.checked)} /><span><strong className="block">Make this the default location</strong><small className="mt-0.5 block text-[var(--muted-foreground)]">The previous default is safely unassigned.</small></span></label></div><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButtonClass}>Cancel</button><button type="submit" disabled={saving || !code.trim() || !name.trim()} className={primaryButtonClass}>{saving ? <RefreshCw size={15} className="animate-spin" /> : <Plus size={15} />}{saving ? "Creating…" : "Create location"}</button></div></form></Modal>;
}
