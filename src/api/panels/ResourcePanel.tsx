import { useCallback, useEffect, useState, type FormEvent } from "react";
import { archiveRecord, createRecord, listRecords, updateRecord, type WorkspaceRecord } from "../records";
import { getFriendlyErrorMessage } from "../client";
import { workspaceAppApi, type SavedView } from "../workspace-app";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

type RecordDraft = { name: string; status: string; description: string; tags: string; data: string };
const emptyDraft: RecordDraft = { name: "", status: "active", description: "", tags: "", data: "{}" };

function draftFromRecord(record: WorkspaceRecord): RecordDraft {
  return {
    name: record.name,
    status: record.status,
    description: record.description ?? "",
    tags: record.tags.join(", "),
    data: JSON.stringify(record.data, null, 2),
  };
}

function parseDraft(draft: RecordDraft) {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(draft.data || "{}");
  } catch {
    throw new Error("The data field must contain valid JSON.");
  }
  if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("The data field must be a JSON object.");
  return {
    name: draft.name.trim(),
    status: draft.status.trim() || "active",
    description: draft.description.trim() || null,
    tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    data,
  };
}

export function ResourcePanel({ workspaceId, resourceType, onClose }: { workspaceId: string; resourceType: string; onClose: () => void }) {
  const [records, setRecords] = useState<WorkspaceRecord[]>([]);
  const [views, setViews] = useState<SavedView[]>([]);
  const [draft, setDraft] = useState<RecordDraft>(emptyDraft);
  const [editing, setEditing] = useState<WorkspaceRecord | null>(null);
  const [search, setSearch] = useState("");
  const [viewName, setViewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const query = new URLSearchParams({ limit: "100", sort: "updatedAt", order: "desc" });
      if (search.trim()) query.set("search", search.trim());
      const [recordResponse, viewResponse] = await Promise.all([
        listRecords(resourceType, query.toString()),
        workspaceAppApi.savedViews(workspaceId, resourceType),
      ]);
      setRecords(recordResponse.data.items);
      setViews(viewResponse.data.items);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not load these records. Please try again."));
    } finally {
      setBusy(false);
    }
  }, [resourceType, search, workspaceId]);

  useEffect(() => { void load(); }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const input = parseDraft(draft);
      if (!input.name) throw new Error("Name is required.");
      if (editing) await updateRecord(resourceType, editing.id, { ...input, expectedVersion: editing.version });
      else await createRecord(resourceType, input);
      setEditing(null);
      setDraft(emptyDraft);
      await load();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "We could not save this record. Please try again."));
      setBusy(false);
    }
  }

  async function archive(recordId: string) {
    if (busy || !window.confirm("Archive this live record?")) return;
    setBusy(true);
    setError("");
    try { await archiveRecord(resourceType, recordId); await load(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not archive this record. Please try again.")); setBusy(false); }
  }

  async function saveView(event: FormEvent) {
    event.preventDefault();
    if (!viewName.trim() || busy) return;
    setBusy(true);
    try {
      await workspaceAppApi.createSavedView(workspaceId, {
        resourceType, name: viewName.trim(), filters: search.trim() ? { search: search.trim() } : {}, sorting: { sort: "updatedAt", order: "desc" },
      });
      setViewName("");
      await load();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not save this view. Please try again.")); setBusy(false); }
  }

  return <LivePanelShell title="Live workspace data" subtitle={resourceType} onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title={`${records.length} live records`} action={<span className="lulu-live-message">Use Update in the navigation bar.</span>}>
      <form className="lulu-live-form" onSubmit={(event) => { event.preventDefault(); void load(); }}>
        <label>Search<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name and description" /></label>
      </form>
      {records.length === 0 ? <LiveEmpty>No live records yet.</LiveEmpty> : records.map((record) => <article className="lulu-live-row" key={record.id}>
        <div className="lulu-live-row-top"><div><strong>{record.name}</strong><span>{record.description || "No description"}</span></div><span className="lulu-live-badge good">{record.status}</span></div>
        <small>Updated {formatLiveDate(record.updatedAt)} · v{record.version}</small>
        <div className="lulu-live-actions" style={{ marginTop: 8 }}>
          <button className="lulu-live-button" onClick={() => { setEditing(record); setDraft(draftFromRecord(record)); }}>Edit</button>
          <button className="lulu-live-button danger" onClick={() => void archive(record.id)}>Archive</button>
        </div>
      </article>)}
    </LiveSection>
    <LiveSection title={editing ? `Edit ${editing.name}` : "Create live record"}>
      <form className="lulu-live-form" onSubmit={submit}>
        <label>Name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={300} /></label>
        <label>Status<input value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })} maxLength={100} /></label>
        <label>Description<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
        <label>Tags, comma separated<input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} /></label>
        <label>Domain data (JSON)<textarea className="lulu-live-json" value={draft.data} onChange={(event) => setDraft({ ...draft, data: event.target.value })} /></label>
        <div className="lulu-live-actions">
          <button className="lulu-live-button primary" disabled={busy}>{editing ? "Save changes" : "Create record"}</button>
          {editing && <button type="button" className="lulu-live-button" onClick={() => { setEditing(null); setDraft(emptyDraft); }}>Cancel</button>}
        </div>
      </form>
    </LiveSection>
    <LiveSection title="Saved views">
      <form className="lulu-live-form" onSubmit={saveView}>
        <label>View name<input value={viewName} onChange={(event) => setViewName(event.target.value)} placeholder="Save current search" /></label>
        <button className="lulu-live-button" disabled={busy || !viewName.trim()}>Save view</button>
      </form>
      {views.map((view) => <div className="lulu-live-row" key={view.id}><div className="lulu-live-row-top"><strong>{view.name}</strong><button className="lulu-live-button danger" onClick={async () => { await workspaceAppApi.deleteSavedView(workspaceId, view.id); await load(); }}>Delete</button></div><small>{view.isShared ? "Shared" : "Private"}</small></div>)}
    </LiveSection>
  </LivePanelShell>;
}
