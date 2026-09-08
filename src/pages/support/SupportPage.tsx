import { useEffect, useState } from 'react';
import { useLuluApp } from '../../api/LuluAppContext';
import { requestApi, getFriendlyErrorMessage } from '../../api/client';
import { useTranslation } from '../../i18n/GlobalLanguageSwitcher';

type Ticket={id:string;subject:string;status:string;workspaceId:string;workspaceName?:string};
type Detail={ticket:Ticket;messages:{id:string;authorType:string;body:string;createdAt:string}[]};
export default function SupportPage({admin=false}:{admin?:boolean}) {
 const {selectedWorkspace,currentUser}=useLuluApp();
 const base=admin?'/admin/support':selectedWorkspace?`/workspaces/${selectedWorkspace.id}/support`:null;
 return <SupportInbox key={base} base={base} admin={admin} canReply={!admin||Boolean(currentUser?.adminCapabilities?.includes('support.manage'))}/>;
}
function SupportInbox({base,admin,canReply}:{base:string|null;admin:boolean;canReply:boolean}) {
 const t=useTranslation();
 const [tickets,setTickets]=useState<Ticket[]>([]),[detail,setDetail]=useState<Detail|null>(null);
 const [subject,setSubject]=useState(''),[body,setBody]=useState(''),[reply,setReply]=useState('');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[offset,setOffset]=useState(0);
 const [messageOffset,setMessageOffset]=useState(0),[loading,setLoading]=useState(true);
 async function load(){if(!base){setLoading(false);return;}setLoading(true);setError('');try{setTickets((await requestApi<{tickets:Ticket[]}>({path:`${base}?limit=50&offset=${offset}`})).data.tickets);}catch(e){setError(getFriendlyErrorMessage(e,t('Support could not be loaded.')));}finally{setLoading(false);}}
 async function open(id:string,page=0){if(!base)return;setDetail(null);setReply('');setBusy(true);try{setDetail((await requestApi<Detail>({path:`${base}/${id}?limit=100&offset=${page}`})).data);setMessageOffset(page);}catch(e){setError(getFriendlyErrorMessage(e));}finally{setBusy(false);}}
 useEffect(()=>{void load();},[base,offset]);
 async function send(create=false,resolve=false){if(!base||busy)return;setBusy(true);setError('');try{const r=await requestApi<{id:string}>({path:create?base:`${base}/${detail!.ticket.id}/messages`,method:'POST',body:create?{subject,body}:resolve?{status:'resolved'}:{body:reply}});setSubject('');setBody('');setReply('');await load();await open(r.data.id);}catch(e){setError(getFriendlyErrorMessage(e));}finally{setBusy(false);}}
 const button='rounded-lg border px-4 py-2 disabled:opacity-40',input='w-full rounded-lg border bg-transparent p-3';
 return <main className="page-frame mx-auto max-w-7xl space-y-5 p-4 md:p-8">
 <header className="flex flex-wrap justify-between gap-3"><h1 className="text-3xl font-semibold">{t('Support')}</h1><a className={button} href={admin?'/app/admin-billing-overview-9901':'/app'}>{t('Back')}</a><button className={button} onClick={()=>void load()}>{t('Refresh')}</button></header>
 {error&&<p role="alert" className="border border-red-300 p-3 text-red-700">{error}</p>}
 {(loading||busy)&&<p role="status">{t('Loading…')}</p>}
 {detail&&<div className="flex gap-3"><button disabled={busy||messageOffset===0} onClick={()=>void open(detail.ticket.id,Math.max(0,messageOffset-100))}>{t('Previous messages')}</button><button disabled={busy||detail.messages.length<100} onClick={()=>void open(detail.ticket.id,messageOffset+100)}>{t('Next messages')}</button></div>}
 {!admin&&<form className="space-y-3 rounded-xl border p-4" onSubmit={e=>{e.preventDefault();void send(true);}}><label className="block">{t('Subject')}<input required maxLength={200} className={input} value={subject} onChange={e=>setSubject(e.target.value)}/></label><label className="block">{t('Message')}<textarea required maxLength={10000} className={input} value={body} onChange={e=>setBody(e.target.value)}/></label><button className={button} disabled={busy||!base||!subject.trim()||!body.trim()}>{t('Create ticket')}</button></form>}
 <div className="grid gap-4 lg:grid-cols-[minmax(240px,1fr)_2fr]"><section className="min-w-0 space-y-2 rounded-xl border p-4">{tickets.length===0?<p>{t('No support tickets.')}</p>:tickets.map(ticket=><button disabled={busy} key={ticket.id} className="block w-full rounded-lg border p-3 text-left" onClick={()=>void open(ticket.id)}><strong className="block break-words">{ticket.subject}</strong><span>{t(ticket.status)}</span>{admin&&<small className="block">{ticket.workspaceName??ticket.workspaceId}</small>}</button>)}<div className="flex gap-2"><button className={button} disabled={offset===0||busy} onClick={()=>setOffset(v=>v-50)}>{t('Previous')}</button><button className={button} disabled={tickets.length<50||busy} onClick={()=>setOffset(v=>v+50)}>{t('Next')}</button></div></section>
 <section className="min-w-0 space-y-4 rounded-xl border p-4">{!detail?<p>{t('Select a ticket.')}</p>:<><h2 className="break-words text-xl font-semibold">{detail.ticket.subject}</h2>{admin&&<p>{t('Workspace')}: {detail.ticket.workspaceId}</p>}{detail.messages.map(m=><article key={m.id} className="rounded-lg border p-3"><p className="text-sm opacity-70">{m.authorType==='ADMIN'?t('Support'):t('Customer')} · {new Date(m.createdAt).toLocaleString()}</p><p className="whitespace-pre-wrap break-words">{m.body}</p></article>)}{canReply&&<form className="space-y-3" onSubmit={e=>{e.preventDefault();void send();}}><label className="block">{t('Message')}<textarea required maxLength={10000} className={input} value={reply} onChange={e=>setReply(e.target.value)}/></label><button className={button} disabled={busy||!reply.trim()}>{t('Send reply')}</button>{admin&&<button type="button" className={button} disabled={busy} onClick={()=>void send(false,true)}>{t('Resolve ticket')}</button>}</form>}</>}</section></div></main>;
}
