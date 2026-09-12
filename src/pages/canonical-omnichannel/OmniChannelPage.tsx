import { useCallback, useEffect, useState } from "react";
import { BadgeCheck, CheckCircle2, MessageCircle, ShieldCheck, XCircle } from "lucide-react";
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
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id;
  const t = useTranslation();
  const [items, setItems] = useState<OmniConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<OmniConversation | null>(null);
  const [messages, setMessages] = useState<OmniMessage[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, number>>({});
  const [upcomingEvents, setUpcomingEvents] = useState<Array<CalendarEvent | NativeCalendarEvent>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openConversation = useCallback(async (conversationId: string) => {
    if (!workspaceId) return;
    const detail = await omnichannelApi.conversation(workspaceId, conversationId);
    setSelectedId(conversationId);
    setSelected(detail.data.conversation);
    setMessages(detail.data.messages);
  }, [workspaceId]);

  const load = useCallback(async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError("");
    try {
      const [list, stats] = await Promise.all([
        omnichannelApi.conversations(workspaceId, "limit=50"),
        omnichannelApi.analytics(workspaceId),
      ]);
      setItems(list.data.items);
      setAnalytics(stats.data);
      const nextId = list.data.items.some((item) => item.id === selectedId) ? selectedId : list.data.items[0]?.id;
      if (nextId) await openConversation(nextId);
      else { setSelectedId(null); setSelected(null); setMessages([]); }
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Communications could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, [openConversation, selectedId, workspaceId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!workspaceId) return;
    let active = true;
    void calendarApi.overview(workspaceId, { from: new Date().toISOString(), limit: 8 }).then((response) => {
      if (!active) return;
      setUpcomingEvents([...response.data.events, ...response.data.nativeEvents]
        .sort((left, right) => Date.parse(left.startAt) - Date.parse(right.startAt))
        .slice(0, 5));
    }).catch(() => { if (active) setUpcomingEvents([]); });
    return () => { active = false; };
  }, [workspaceId]);
  useEffect(() => {
    if (!workspaceId) return;
    return subscribeWorkspaceEvents(workspaceId, (event) => {
      if (event.type.startsWith("conversation.") || event.type.startsWith("message.") || event.type.startsWith("website_chat.")) void load();
    });
  }, [load, workspaceId]);

  if (!workspaceId) {
    return <WorkspaceSurfaceShell activeSlug="communications"><main className="page-frame grid min-h-[70vh] place-items-center p-6"><p>{t("Choose a workspace to continue.")}</p></main></WorkspaceSurfaceShell>;
  }

  return (
    <WorkspaceSurfaceShell activeSlug="communications">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Autonomous customer communication</p>
              <h1 className="text-3xl font-semibold tracking-tight">Communications</h1>
              <p className="mt-2 max-w-3xl text-sm text-[var(--muted-foreground)]">Lulu handles email, website chat, WhatsApp, Instagram and Messenger as one continuous customer relationship.</p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800"><BadgeCheck size={15}/> No message approval required</div>
          </header>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{analytics.total_conversations ?? 0} conversations</span>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{analytics.ai_handled ?? 0} handled autonomously</span>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-2">{upcomingEvents.length} upcoming interactions</span>
          </div>

          {error ? <div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button onClick={() => setError("")} aria-label="Close"><XCircle size={16}/></button></div> : null}

          <section className="grid min-h-[620px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm lg:grid-cols-[320px_minmax(0,1fr)_280px]">
            <aside className="border-b border-[var(--border)] lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4"><h2 className="font-semibold">Live conversations</h2><MessageCircle size={18}/></div>
              <div className="max-h-[220px] overflow-y-auto lg:max-h-[570px]">
                {loading && items.length === 0 ? <p className="p-6 text-sm text-[var(--muted-foreground)]">Loading…</p> : items.length === 0 ? (
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
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4"><div className="min-w-0"><h2 className="truncate font-semibold">{selected?.subject || "Select a conversation"}</h2><p className="text-xs text-[var(--muted-foreground)]">{selected ? `${selected.channelDisplayName} · ${modeLabel(selected.handlingMode)}` : "No selection"}</p></div>{selected ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800"><ShieldCheck size={14}/> Lulu is handling this</span> : null}</div>
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
              {selected ? <div className="border-t border-[var(--border)] bg-[var(--secondary)]/40 px-4 py-3 text-xs text-[var(--muted-foreground)]">Lulu reads the complete context, responds automatically and follows up until the outcome is reached.</div> : null}
            </section>

            <aside className="hidden p-5 lg:block">
              <h2 className="font-semibold">Context</h2>
              {selected ? <div className="mt-5 space-y-4 text-sm"><div><p className="text-xs text-[var(--muted-foreground)]">Status</p><p className="mt-1 flex items-center gap-2 font-medium"><CheckCircle2 size={15}/>{statusLabel(selected.status)}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Channel</p><p className="mt-1 font-medium">{selected.channelDisplayName}</p><p className="text-xs text-[var(--muted-foreground)]">{selected.identityDisplayName}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Language</p><p className="mt-1 font-medium">{selected.language || "Automatically detected"}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Execution</p><p className="mt-1 font-medium">{modeLabel(selected.handlingMode)}</p></div><div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/50 p-3 text-xs text-[var(--muted-foreground)]">Lulu resolves routine conversations independently. Policy or provider failures are handled as system exceptions, never as content approvals.</div></div> : <p className="mt-5 text-sm text-[var(--muted-foreground)]">Context appears after selection.</p>}
              <div className="mt-6 border-t border-[var(--border)] pt-5"><h3 className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Upcoming interactions</h3>{upcomingEvents.length ? <div className="mt-3 space-y-2">{upcomingEvents.slice(0, 3).map((event) => <div key={event.id} className="rounded-xl bg-[var(--secondary)]/60 p-3"><p className="truncate text-xs font-medium">{event.title}</p><p className="mt-1 text-[11px] text-[var(--muted-foreground)]">{new Date(event.startAt).toLocaleString()}</p></div>)}</div> : <p className="mt-3 text-xs text-[var(--muted-foreground)]">No scheduled customer interactions.</p>}</div>
            </aside>
          </section>
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}
