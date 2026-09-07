import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Globe2, Inbox, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { requestApi, getFriendlyErrorMessage } from '../../api/client';
import { useLuluApp } from '../../api/LuluAppContext';
import { subscribeAdminOmniEvents, type OmniStreamStatus } from '../../api/omnichannel-stream';

type Row = { id:string; workspaceId:string; workspaceName?:string; subject:string|null; status:string; handlingMode:string; channelDisplayName?:string; identityDisplayName?:string; lastMessageAt:string|null };
type Routing = { id:string; channel_type:string; identity_display_name:string; message_preview:string|null; confidence:string; reason:string|null; created_at:string };
type Channel = { id:string; channelType:string; displayName:string; status:string; identities:Array<{id:string;workspaceId:string|null;status:string}> };
type Detail = { conversation:Row & { language?:string|null; priority?:string }; messages:Array<{id:string;direction:string;senderType:string;textContent:string|null;status:string;createdAt:string}> };
type Metrics = { conversations:number; workspaces:number; active:number; ai_handled:number; human_handled:number };

export default function AdminOmniChannelPage(){
  const { currentUser } = useLuluApp();
  const [rows,setRows] = useState<Row[]>([]);
  const [routing,setRouting] = useState<Routing[]>([]);
  const [channels,setChannels] = useState<Channel[]>([]);
  const [metrics,setMetrics] = useState<Metrics|null>(null);
  const [detail,setDetail] = useState<Detail|null>(null);
  const [tab,setTab] = useState<'inbox'|'routing'|'channels'|'analytics'>('inbox');
  const [query,setQuery] = useState('');
  const [loading,setLoading] = useState(true);
  const [detailLoading,setDetailLoading] = useState(false);
  const [error,setError] = useState('');
  const [streamStatus,setStreamStatus] = useState<OmniStreamStatus>('connecting');

  const load = useCallback(async()=>{
    setLoading(true); setError('');
    try {
      const [inbox,queue,channelResult,metricsResult] = await Promise.all([
        requestApi<{items:Row[]}>({path:`/admin/omnichannel/conversations?limit=200${query?`&search=${encodeURIComponent(query)}`:''}`}),
        requestApi<Routing[]>({path:'/admin/omnichannel/routing'}),
        requestApi<Channel[]>({path:'/admin/omnichannel/channels'}),
        requestApi<Metrics>({path:'/admin/omnichannel/analytics'}),
      ]);
      setRows(inbox.data.items); setRouting(queue.data); setChannels(channelResult.data); setMetrics(metricsResult.data);
    } catch (cause) { setError(getFriendlyErrorMessage(cause,'Admin OmniChannel konnte nicht geladen werden.')); }
    finally { setLoading(false); }
  },[query]);

  useEffect(()=>{ if(currentUser?.role==='admin') void load(); },[currentUser,load]);
  useEffect(()=>{
    if(currentUser?.role!=='admin') return;
    return subscribeAdminOmniEvents((event)=>{
      if(event.type?.startsWith('conversation.')||event.type?.startsWith('message.')||event.type?.startsWith('routing.')||event.type?.startsWith('channel.identity.')) void load();
    }, setStreamStatus);
  },[currentUser,load]);

  const openDetail = async(row:Row)=>{
    setDetailLoading(true); setError('');
    try { const result = await requestApi<Detail>({path:`/admin/omnichannel/conversations/${encodeURIComponent(row.id)}`}); setDetail(result.data); }
    catch (cause) { setError(getFriendlyErrorMessage(cause,'Die Konversation konnte nicht geladen werden.')); }
    finally { setDetailLoading(false); }
  };
  const tabClass = (active:boolean) => `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${active?'bg-[var(--foreground)] text-[var(--background)]':'border border-[var(--border)]'}`;

  return <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-[1500px] space-y-6">
    <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-2 text-sm"><a href="/admin" className="shrink-0 rounded-xl px-3 py-2 hover:bg-[var(--secondary)]">Admin Übersicht</a><a href="/admin/omnichannel" className="shrink-0 rounded-xl bg-[var(--foreground)] px-3 py-2 text-[var(--background)]">OmniChannel</a></nav>
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Lulu Platform Operations</p><h1 className="text-3xl font-semibold tracking-tight">OmniChannel Admin</h1><p className="mt-1 text-sm text-[var(--muted-foreground)]">Globale Kommunikation – jeder Zugriff ist capability-geschützt und wird protokolliert.</p></div><div className="flex items-center gap-2"><span className={`rounded-full px-3 py-2 text-xs ${streamStatus==='connected'?'bg-emerald-100 text-emerald-800':'bg-amber-100 text-amber-900'}`}>{streamStatus==='connected'?'Live':'Wird geladen…'}</span><button onClick={()=>void load()} className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--secondary)]"><RefreshCw size={15}/> Aktualisieren</button></div></header>
    {error?<div role="alert" className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"><span>{error}</span><button onClick={()=>setError('')} aria-label="Schließen"><X size={16}/></button></div>:null}
    <div className="flex flex-wrap gap-2"><button onClick={()=>setTab('inbox')} className={tabClass(tab==='inbox')}><Inbox size={15}/> Globaler Posteingang ({rows.length})</button><button onClick={()=>setTab('routing')} className={tabClass(tab==='routing')}><AlertTriangle size={15}/> Routing-Ausnahmen ({routing.length})</button><button onClick={()=>setTab('channels')} className={tabClass(tab==='channels')}><Globe2 size={15}/> Channel Health ({channels.length})</button><button onClick={()=>setTab('analytics')} className={tabClass(tab==='analytics')}><ShieldCheck size={15}/> Analytics</button></div>
    {tab==='inbox'?<section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]"><div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]"><div className="flex items-center gap-3 border-b border-[var(--border)] p-4"><Search size={17} className="text-[var(--muted-foreground)]"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Workspace, Konversation oder Kanal suchen…" className="w-full bg-transparent text-sm outline-none"/><ShieldCheck size={17} className="text-emerald-600"/></div>{loading?<p className="p-8 text-sm text-[var(--muted-foreground)]">Wird geladen…</p>:rows.length===0?<div className="p-12 text-center text-sm text-[var(--muted-foreground)]"><Globe2 className="mx-auto mb-2"/>Keine globalen Konversationen gefunden.</div>:<div className="divide-y divide-[var(--border)]">{rows.map(row=><button type="button" onClick={()=>void openDetail(row)} key={row.id} className={`grid w-full gap-3 px-5 py-4 text-left transition hover:bg-[var(--secondary)] md:grid-cols-[minmax(0,1fr)_180px_160px] md:items-center ${detail?.conversation.id===row.id?'bg-[var(--secondary)]':''}`}><div className="min-w-0"><p className="truncate font-medium">{row.subject||'Neue Anfrage'}</p><p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">{row.channelDisplayName} · {row.identityDisplayName}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Workspace</p><p className="truncate text-sm font-medium">{row.workspaceName||row.workspaceId}</p></div><div className="text-xs"><span className="rounded-full bg-[var(--secondary)] px-2 py-1">{row.handlingMode}</span><span className="ml-2 text-[var(--muted-foreground)]">{row.status}</span></div></button>)}</div>}</div>{detailLoading?<aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted-foreground)]">Wird geladen…</aside>:detail?<aside className="rounded-3xl border border-[var(--border)] bg-[var(--card)]"><div className="flex items-center justify-between border-b border-[var(--border)] p-4"><div><p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">Workspace</p><h2 className="font-semibold">{detail.conversation.workspaceName||detail.conversation.workspaceId}</h2></div><button onClick={()=>setDetail(null)} aria-label="Schließen" className="rounded-full p-2 hover:bg-[var(--secondary)]"><X size={16}/></button></div><div className="space-y-4 p-5"><div><p className="text-xs text-[var(--muted-foreground)]">Konversation</p><p className="font-medium">{detail.conversation.subject||'Neue Anfrage'}</p></div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-[var(--muted-foreground)]">Kanal</p><p>{detail.conversation.channelDisplayName}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Status</p><p>{detail.conversation.status}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Handling</p><p>{detail.conversation.handlingMode}</p></div><div><p className="text-xs text-[var(--muted-foreground)]">Nachrichten</p><p>{detail.messages.length}</p></div></div><div className="max-h-[420px] space-y-2 overflow-y-auto border-t border-[var(--border)] pt-4">{detail.messages.length?detail.messages.map(message=><div key={message.id} className={`rounded-xl px-3 py-2 text-sm ${message.direction==='INBOUND'?'bg-[var(--secondary)]':'bg-[var(--foreground)] text-[var(--background)]'}`}><p className="mb-1 text-[10px] uppercase opacity-70">{message.senderType} · {message.status}</p>{message.textContent||'Keine Textnachricht'}</div>):<p className="text-sm text-[var(--muted-foreground)]">Keine Nachrichten.</p>}</div><p className="text-xs text-[var(--muted-foreground)]">Cross-Workspace-Zugriff bleibt auditiert.</p></div></aside>:<aside className="rounded-3xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted-foreground)]">Konversation auswählen, um Details mit Workspace-Kontext zu sehen.</aside>}</section>:tab==='routing'?<section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)]">{loading?<p className="p-8 text-sm text-[var(--muted-foreground)]">Wird geladen…</p>:routing.length===0?<div className="p-12 text-center text-sm text-[var(--muted-foreground)]"><ShieldCheck className="mx-auto mb-2 text-emerald-600"/>Keine ungelösten Routing-Ausnahmen.</div>:<div className="divide-y divide-[var(--border)]">{routing.map(item=><div key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[140px_minmax(0,1fr)_130px]"><div className="text-xs"><p className="font-medium">{item.channel_type}</p><p className="text-[var(--muted-foreground)]">{item.identity_display_name}</p></div><div><p className="text-sm">{item.message_preview||'Keine Vorschau'}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.reason||'Workspace konnte nicht deterministisch aufgelöst werden'}</p></div><span className="h-fit justify-self-start rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-900">{item.confidence}</span></div>)}</div>}</section>:tab==='channels'?<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{channels.map(channel=><div key={channel.id} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">{channel.displayName}</h2><span className={`rounded-full px-2 py-1 text-xs ${channel.status==='ACTIVE'?'bg-emerald-100 text-emerald-800':'bg-amber-100 text-amber-900'}`}>{channel.status}</span></div><p className="mt-2 text-sm text-[var(--muted-foreground)]">{channel.identities.length} Identitäten · Status wird nicht fingiert.</p></div>)}</section>:<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{[['Konversationen',metrics?.conversations??0],['Workspaces',metrics?.workspaces??0],['Aktiv',metrics?.active??0],['AI-geführt',metrics?.ai_handled??0],['Menschlich',metrics?.human_handled??0]].map(([label,value])=><div key={String(label)} className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5"><p className="text-sm text-[var(--muted-foreground)]">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>)}</section>}
  </div></main>;
}
