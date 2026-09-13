import { useCallback, useEffect, useRef, useState } from "react";
import { BadgeCheck, Bot, CheckCircle2, Hand, MessageCircle, Send, ShieldCheck, StickyNote, XCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../api/client";
import { omnichannelApi, type OmniConversation, type OmniMessage } from "../../api/omnichannel";
import { useLuluApp } from "../../api/LuluAppContext";
import { subscribeWorkspaceEvents } from "../../api/agent-stream";
import { calendarApi, type CalendarEvent, type NativeCalendarEvent } from "../../api/calendar";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";

function modeLabel(mode: string) {
  if (mode === "AI_AUTO") return "Autonomous";
  if (mode === "AI_ASSISTED") return "AI coordinated";
  if (mode === "HUMAN") return "Human control";
  if (mode === "ESCALATED") return "Policy exception";
  return "Operations recovery";
}

function statusLabel(status: string) {
  if (status === "RESOLVED") return "Resolved";
  if (status === "CLOSED") return "Closed";
  if (status === "ESCALATED") return "Exception detected";
  return "Active";
}

export default function OmniChannelPage() {
  const { selectedWorkspace, hasCapability } = useLuluApp();
  const workspaceId = selectedWorkspace?.id;
  const t = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<OmniConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<OmniConversation | null>(null);
  const [messages, setMessages] = useState<OmniMessage[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [upcomingEvents, setUpcomingEvents] = useState<Array<CalendarEvent | NativeCalendarEvent>>([]);
  const [upcomingState, setUpcomingState] = useState<"loading" | "ready" | "error">("loading");
  const [loading, setLoading] = useState(true);
  const [loadState, setLoadState] = useState<"loading" | "refreshing" | "ready" | "stale" | "error">("loading");
  const verifiedWorkspaceRef = useRef<string | null>(null);
  const loadRequestRef = useRef(0);
  const detailRequestRef = useRef(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [actionBusy, setActionBusy] = useState(false);
  const [composerMode, setComposerMode] = useState<"message" | "note">("message");
  const [draft, setDraft] = useState("");
  const canManage = hasCapability("omnichannel.manage");
  const canReply = hasCapability("omnichannel.reply");

  const openConversation = useCallback(async (conversationId: string, updateLocation = true) => {
    if (!workspaceId) return;
    const request = ++detailRequestRef.current;
    const detail = await omnichannelApi.conversation(workspaceId, conversationId);
    if (request !== detailRequestRef.current) return;
    setSelectedId(conversationId);
    setSelected(detail.data.conversation);
    setMessages(detail.data.messages);
    if (updateLocation) {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("conversationId", conversationId);
        return next;
      }, { replace: true });
    }
  }, [setSearchParams, workspaceId]);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    const request = ++loadRequestRef.current;
    const hasVerifiedData = verifiedWorkspaceRef.current === workspaceId;
    setLoading(true);
    setLoadState(hasVerifiedData ? "refreshing" : "loading");
    setError("");
    try {
      const [list, stats] = await Promise.all([
        omnichannelApi.conversations(workspaceId, "limit=50"),
        omnichannelApi.analytics(workspaceId),
      ]);
      if (request !== loadRequestRef.current) return;
      setItems(list.data.items);
      setAnalytics(stats.data);
      verifiedWorkspaceRef.current = workspaceId;
      setLoadState("ready");
      const requestedId = searchParams.get("conversationId");
      const nextId = requestedId && list.data.items.some((item) => item.id === requestedId)
        ? requestedId
        : list.data.items.some((item) => item.id === selectedId) ? selectedId : list.data.items[0]?.id;
      if (nextId) await openConversation(nextId, false);
      else { setSelectedId(null); setSelected(null); setMessages([]); }
    } catch (cause) {
      if (request !== loadRequestRef.current) return;
      const message = getFriendlyErrorMessage(cause, "Communications could not be loaded.");
      const stale = verifiedWorkspaceRef.current === workspaceId;
      setLoadState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded conversations. ${message}` : message);
    } finally {
      if (request === loadRequestRef.current) setLoading(false);
    }
  }, [openConversation, searchParams, selectedId, workspaceId]);

  const updateSelectedConversation = useCallback((conversation: OmniConversation) => {
    setSelected(conversation);
    setItems((current) => current.map((item) => item.id === conversation.id ? { ...item, ...conversation } : item));
  }, []);

  const takeOver = async () => {
    if (!workspaceId || !selected || !canManage) return;
    setActionBusy(true); setError(""); setNotice("");
    try {
      updateSelectedConversation((await omnichannelApi.takeOver(workspaceId, selected.id)).data);
      setNotice("You are now in control of this conversation.");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The conversation could not be taken over."));
    } finally { setActionBusy(false); }
  };

  const returnToAi = async () => {
    if (!workspaceId || !selected || !canManage) return;
    setActionBusy(true); setError(""); setNotice("");
    try {
      updateSelectedConversation((await omnichannelApi.returnToAi(workspaceId, selected.id, "AI_AUTO")).data);
      setNotice("Lulu has resumed autonomous handling.");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The conversation could not be returned to Lulu."));
    } finally { setActionBusy(false); }
  };

  const submitComposer = async () => {
    const text = draft.trim();
    if (!workspaceId || !selected || !text || !canReply) return;
    if (composerMode === "message" && selected.handlingMode !== "HUMAN") {
      setError("Take control of the conversation before sending a manual customer message.");
      return;
    }
    setActionBusy(true); setError(""); setNotice("");
    try {
      const message = composerMode === "note"
        ? (await omnichannelApi.note(workspaceId, selected.id, text)).data
        : (await omnichannelApi.send(workspaceId, selected.id, text, crypto.randomUUID())).data;
      setMessages((current) => [...current, message]);
      setDraft("");
      setNotice(composerMode === "note" ? "Internal note added." : "Message sent.");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, composerMode === "note" ? "The note could not be added." : "The message could not be sent."));
    } finally { setActionBusy(false); }
  };

  useEffect(() => {
    loadRequestRef.current += 1; detailRequestRef.current += 1; verifiedWorkspaceRef.current = null;
    setItems([]); setSelectedId(null); setSelected(null); setMessages([]); setAnalytics({}); setLoadState("loading");
  }, [workspaceId]);
  useEffect(() => { void load(); return () => { loadRequestRef.current += 1; }; }, [load]);
  useEffect(() => {
    if (!workspaceId) return;
    let active = true;
    setUpcomingEvents([]);
    setUpcomingState("loading");
    void calendarApi.overview(workspaceId, { from: new Date().toISOString(), limit: 8 }).then((response) => {
      if (!active) return;
      setUpcomingEvents([...response.data.events, ...response.data.nativeEvents]
        .sort((left, right) => Date.parse(left.startAt) - Date.parse(right.startAt))
        .slice(0, 5));
      setUpcomingState("ready");
    }).catch(() => {
      if (active) setUpcomingState("error");
    });
    return () => { active = false; };
  }, [workspaceId]);
  useEffect(() => {
    if (!workspaceId) return;
    return subscribeWorkspaceEvents(workspaceId, (event) => {
      if (event.type.startsWith("conversation.") || event.type.startsWith("message.") || event.type.startsWith("website_chat.")) void load();
    });
  }, [load, workspaceId]);

  if (!workspaceId) {
    return <WorkspaceSurfaceShell activeSlug="omnichannel"><main className="page-frame grid min-h-[70vh] place-items-center p-6"><p>{t("Choose a workspace to continue.")}</p></main></WorkspaceSurfaceShell>;
  }

  return (
    <WorkspaceSurfaceShell activeSlug="omnichannel">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Autonomous customer communication</p>
              <h1 className="text-3xl font-semibold tracking-tight">Communications</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">Lulu handles email, website chat, WhatsApp and Messenger through the providers enabled for this workspace, while keeping one continuous customer relationship.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"><BadgeCheck size={15}/> No message approval required</div>
          </header>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{loadState === "loading" || loadState === "error" ? "—" : analytics.total_conversations ?? 0} conversations</span>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{loadState === "loading" || loadState === "error" ? "—" : analytics.ai_handled ?? 0} handled autonomously</span>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{upcomingState === "ready" ? upcomingEvents.length : "—"} upcoming interactions</span>
          </div>

          {error ? <div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button onClick={() => setError("")} aria-label="Close"><XCircle size={16}/></button></div> : null}
          {notice ? <div role="status" className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Close"><XCircle size={16}/></button></div> : null}

          <section className="grid min-h-[620px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm lg:grid-cols-[320px_minmax(0,1fr)_280px]">
            <aside className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4"><h2 className="font-semibold">Live conversations</h2><MessageCircle size={18}/></div>
              <div className="max-h-[220px] overflow-y-auto lg:max-h-[570px]">
                {(loadState === "loading" || loadState === "refreshing") && items.length === 0 ? <p className="p-6 text-sm text-[var(--muted-foreground)]">Loading…</p> : (loadState === "error" || loadState === "stale") && items.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--muted-foreground)]"><XCircle className="mx-auto mb-2"/><p>Conversations are unavailable.</p><p className="mt-1 text-xs">Refresh to verify the current channel state.</p></div>
                ) : loadState === "ready" && items.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--muted-foreground)]"><MessageCircle className="mx-auto mb-2"/><p>No conversations yet.</p><p className="mt-1 text-xs">Every connected channel will appear here automatically.</p></div>
                ) : items.map((item) => (
                  <button key={item.id} onClick={() => void openConversation(item.id)} className={`w-full border-b border-[var(--border)] px-4 py-4 text-left transition hover:bg-[var(--secondary)] ${selectedId === item.id ? "bg-[var(--secondary)]" : ""}`}>
                    <div className="flex items-center justify-between gap-2"><span className="truncate font-medium">{item.subject || "New conversation"}</span><span className="text-[11px] text-[var(--muted-foreground)]">{statusLabel(item.status)}</span></div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted-foreground)]"><span>{item.channelDisplayName}</span><span>·</span><span>{modeLabel(item.handlingMode)}</span></div>
                  </button>
                ))}
              </div>
            </aside>

            <section className="flex min-h-[430px] min-w-0 flex-col border-b border-[var(--border)] lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4"><div className="min-w-0"><h2 className="truncate font-semibold">{selected?.subject || "Select a conversation"}</h2><p className="text-xs text-[var(--muted-foreground)]">{selected ? `${selected.channelDisplayName} · ${modeLabel(selected.handlingMode)}` : "No selection"}</p></div>{selected ? selected.handlingMode === "HUMAN" ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800"><Hand size={14}/> Human control</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800"><ShieldCheck size={14}/> Lulu is handling this</span> : null}</div>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {selected && messages.length ? messages.map((message) => (
                  <div key={message.id} className={`flex ${message.direction === "INBOUND" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${message.direction === "INBOUND" ? "bg-[var(--secondary)]" : "bg-[var(--foreground)] text-[var(--background)]"} ${message.direction === "INTERNAL" ? "border border-dashed border-amber-400 bg-amber-50 text-amber-900" : ""}`}>
                      <div className="mb-1 text-[10px] uppercase tracking-wide opacity-70">{message.direction === "INTERNAL" ? "Operations note" : message.senderType === "BUYER" ? "Customer" : "Lulu"} · {message.status}</div>
                      {message.textContent}
                    </div>
                  </div>
                )) : <div className="grid h-full place-items-center text-center text-sm text-[var(--muted-foreground)]"><div><MessageCircle className="mx-auto mb-2"/><p>{selected ? "No messages yet." : "Select a conversation."}</p></div></div>}
              </div>
              {selected ? <div className="space-y-3 border-t border-[var(--border)] bg-[var(--secondary)]/30 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-1">
                    <button type="button" onClick={() => setComposerMode("message")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${composerMode === "message" ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--muted-foreground)]"}`}><Send size={13}/>Message</button>
                    <button type="button" onClick={() => setComposerMode("note")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ${composerMode === "note" ? "bg-[var(--foreground)] text-[var(--background)]" : "text-[var(--muted-foreground)]"}`}><StickyNote size={13}/>Internal note</button>
                  </div>
                  {selected.handlingMode === "HUMAN"
                    ? <button type="button" disabled={actionBusy || !canManage} onClick={() => void returnToAi()} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium disabled:opacity-40"><Bot size={14}/>Return to Lulu</button>
                    : <button type="button" disabled={actionBusy || !canManage} onClick={() => void takeOver()} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-medium disabled:opacity-40"><Hand size={14}/>Take control</button>}
                </div>
                <div className="flex items-end gap-2">
                  <label className="min-w-0 flex-1"><span className="sr-only">{composerMode === "note" ? "Internal note" : "Customer message"}</span><textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); void submitComposer(); } }} rows={2} maxLength={4000} placeholder={composerMode === "note" ? "Add context for your team…" : selected.handlingMode === "HUMAN" ? "Write a customer message…" : "Take control to write a customer message…"} disabled={!canReply || (composerMode === "message" && selected.handlingMode !== "HUMAN")} className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"/></label>
                  <button type="button" onClick={() => void submitComposer()} disabled={actionBusy || !canReply || !draft.trim() || (composerMode === "message" && selected.handlingMode !== "HUMAN")} className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[var(--foreground)] px-3 text-xs font-medium text-[var(--background)] disabled:opacity-40"><Send size={14}/>{composerMode === "note" ? "Add" : "Send"}</button>
                </div>
                <p className="text-[11px] text-[var(--muted-foreground)]">{composerMode === "note" ? "Notes remain internal and are never sent to the customer." : selected.handlingMode === "HUMAN" ? "Manual messages use the same canonical conversation and audit trail as Lulu." : "Lulu remains autonomous until you explicitly take control."}</p>
              </div> : null}
            </section>

            <aside className="hidden p-5 lg:block">
              <h2 className="font-semibold">Context</h2>
              {selected ? <div className="mt-5 space-y-4 text-sm"><div><p className="text-xs text-[var(--muted-foreground)]">Status</p><p className="mt-1 flex items-center gap-2 font-medium"><CheckCircle2 size={15}/>{statusLabel(selected.status)}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Channel</p><p className="mt-1 font-medium">{selected.channelDisplayName}</p><p className="text-xs text-[var(--muted-foreground)]">{selected.identityDisplayName}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Language</p><p className="mt-1 font-medium">{selected.language || "Automatically detected"}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Execution</p><p className="mt-1 font-medium">{modeLabel(selected.handlingMode)}</p></div><div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/50 p-3 text-xs text-[var(--muted-foreground)]">Lulu resolves routine conversations independently. Policy or provider failures are handled as system exceptions, never as content approvals.</div></div> : <p className="mt-5 text-sm text-[var(--muted-foreground)]">Context appears after selection.</p>}
              <div className="mt-6 border-t border-[var(--border)] pt-5"><h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Upcoming interactions</h3>{upcomingState === "loading" ? <p className="mt-3 text-xs text-[var(--muted-foreground)]">Loading…</p> : upcomingState === "error" ? <p className="mt-3 text-xs text-[var(--muted-foreground)]">Calendar interactions are unavailable.</p> : upcomingEvents.length ? <div className="mt-3 space-y-2">{upcomingEvents.slice(0, 3).map((event) => <div key={event.id} className="rounded-xl bg-[var(--secondary)]/60 p-3"><p className="truncate text-xs font-medium">{event.title}</p><p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{new Date(event.startAt).toLocaleString()}</p></div>)}</div> : <p className="mt-3 text-xs text-[var(--muted-foreground)]">No scheduled customer interactions.</p>}</div>
            </aside>
          </section>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}
