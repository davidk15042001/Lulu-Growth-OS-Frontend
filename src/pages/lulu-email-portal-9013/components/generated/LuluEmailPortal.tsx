import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bot, Check, ChevronLeft, CircleAlert, Edit3, Folder, Inbox, LoaderCircle, Mail, MailOpen, Plus, RefreshCw, Search, Send, ShieldCheck, Sparkles, Star, Trash2, UserRound, WandSparkles, X } from 'lucide-react';
import { emailApi, type EmailAccount, type EmailAddress, type EmailAutomationRule, type EmailDraft, type EmailFolder, type EmailSyncJob, type EmailThread, type EmailThreadDetail } from '../../../../api/email';
import { ApiError, getFriendlyErrorMessage } from '../../../../api/client';
import { useLuluApp } from '../../../../api/LuluAppContext';
import { useLanguage, useTranslation } from '../../../../i18n/GlobalLanguageSwitcher';
import '../../index.css';

type Section = 'inbox' | 'starred' | 'sent' | 'drafts' | 'automations' | 'settings';
type ComposeState = { draftId?: string; threadId?: string | null; to: string; cc: string; subject: string; bodyText: string; source: 'manual' | 'ai' | 'automation' };
const emptyCompose: ComposeState = { to: '', cc: '', subject: '', bodyText: '', source: 'manual' };

function sectionFromUrl(): Section {
  const value = new URLSearchParams(window.location.search).get('section');
  return ['starred', 'sent', 'drafts', 'automations', 'settings'].includes(value ?? '') ? value as Section : 'inbox';
}

function folderFromUrl() {
  return new URLSearchParams(window.location.search).get('folder');
}

function emailList(value: string): EmailAddress[] {
  return value.split(/[;,]/).map((address) => address.trim().toLowerCase()).filter((address) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)).map((address) => ({ address }));
}

function displayAddress(address?: EmailAddress | null) { return address?.name || address?.address || '—'; }
function dateLabel(value: string, language: string) { const date = new Date(value); return Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(date) : ''; }
function providerLabel(provider: EmailAccount['provider']) { return provider === 'google' ? 'Google / Gmail' : provider === 'microsoft' ? 'Microsoft 365 / Outlook' : 'IMAP / SMTP'; }

export default function EmailPortal() {
  const { selectedWorkspace, permissions, loading: appLoading } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const t = useTranslation();
  const language = useLanguage();
  const section = sectionFromUrl();
  const selectedProviderFolderId = folderFromUrl();
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [accountId, setAccountId] = useState('');
  const [folders, setFolders] = useState<EmailFolder[]>([]);
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [activeThread, setActiveThread] = useState<EmailThreadDetail | null>(null);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [rules, setRules] = useState<EmailAutomationRule[]>([]);
  const [query, setQuery] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busy, setBusy] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [compose, setCompose] = useState<ComposeState | null>(null);
  const [showImap, setShowImap] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [syncJobs, setSyncJobs] = useState<Record<string, EmailSyncJob>>({});
  const activeAccount = accounts.find((account) => account.id === accountId) ?? null;

  const loadAccounts = useCallback(async () => {
    if (!workspaceId) return;
    const result = await emailApi.accounts(workspaceId);
    setAccounts(result.data.items);
    setAccountId((current) => result.data.items.some((account) => account.id === current) ? current : result.data.items[0]?.id ?? '');
  }, [workspaceId]);

  const loadMailbox = useCallback(async () => {
    if (!workspaceId || !accountId) { setFolders([]); setThreads([]); return; }
    const folderResult = await emailApi.folders(workspaceId, accountId);
    setFolders(folderResult.data.items);
    const systemName = section === 'sent' ? 'sent' : section === 'inbox' && !selectedProviderFolderId ? 'inbox' : null;
    const folderId = selectedProviderFolderId || (systemName ? folderResult.data.items.find((folder) => folder.systemName === systemName)?.providerFolderId : undefined);
    const threadResult = await emailApi.threads(workspaceId, { accountId, ...(folderId ? { folderId } : {}), ...(query.trim() ? { q: query.trim() } : {}), ...(unreadOnly ? { unread: true } : {}), ...(section === 'starred' ? { starred: true } : {}) });
    setThreads(threadResult.data.items);
  }, [workspaceId, accountId, section, selectedProviderFolderId, query, unreadOnly]);

  const loadSectionData = useCallback(async () => {
    if (!workspaceId) return;
    if (section === 'drafts') setDrafts((await emailApi.drafts(workspaceId)).data.items);
    else if (section === 'automations') setRules((await emailApi.automations(workspaceId)).data.items);
    else if (section !== 'settings') await loadMailbox();
  }, [workspaceId, section, loadMailbox]);

  useEffect(() => {
    if (!workspaceId) { if (!appLoading) setBusy(false); return; }
    let active = true; setBusy(true); setError(null);
    loadAccounts().catch((cause) => { if (active) setError(getFriendlyErrorMessage(cause, t('Email accounts could not be loaded.'))); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [workspaceId, appLoading, loadAccounts, t]);

  useEffect(() => { if (!workspaceId) return; let active = true; setBusy(true); setError(null); loadSectionData().catch((cause) => { if (active) setError(getFriendlyErrorMessage(cause, t('The mailbox could not be loaded.'))); }).finally(() => { if (active) setBusy(false); }); return () => { active = false; }; }, [workspaceId, loadSectionData, t]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('emailConnection') === 'error') {
      const code = params.get('code') || 'EMAIL_OAUTH_CALLBACK_FAILED';
      setError(getFriendlyErrorMessage(new ApiError(400, code, 'Email connection could not be completed'), t('Email connection could not be completed.')));
      return;
    }
    if (params.get('emailConnection') !== 'success' || !workspaceId || !accounts.length) return;
    const connectedId = params.get('accountId') || accounts[0]?.id;
    if (!connectedId || sessionStorage.getItem(`lulu.email.oauth-synced.${connectedId}`)) return;
    sessionStorage.setItem(`lulu.email.oauth-synced.${connectedId}`, '1'); setAccountId(connectedId); void syncAccount(connectedId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId, accounts, t]);

  useEffect(() => {
    const running = Object.values(syncJobs).filter((job) => job.status === 'queued' || job.status === 'running');
    if (!workspaceId || !running.length) return;
    const timer = window.setInterval(() => { void Promise.all(running.map(async (job) => { const result = await emailApi.syncJob(workspaceId, job.accountId, job.id); setSyncJobs((value) => ({ ...value, [job.accountId]: result.data })); if (result.data.status === 'succeeded') { await loadAccounts(); await loadSectionData(); setNotice(t('Mailbox synchronized.')); } if (result.data.status === 'failed') setError(result.data.errorMessage || t('Synchronization failed.')); })); }, 1800);
    return () => window.clearInterval(timer);
  }, [workspaceId, syncJobs, loadAccounts, loadSectionData, t]);

  async function syncAccount(id: string) {
    if (!workspaceId) return; setError(null);
    try { const result = await emailApi.startSync(workspaceId, id); setSyncJobs((value) => ({ ...value, [id]: result.data })); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('Synchronization failed.'))); }
  }

  async function connectOAuth(provider: 'google' | 'microsoft') {
    if (!workspaceId) return; setActionBusy(true); setError(null);
    try { const result = await emailApi.startOAuth(workspaceId, provider, `/app/email?section=settings`); window.location.assign(result.data.authorizationUrl); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('Email connection could not be started.'))); setActionBusy(false); }
  }

  async function openThread(thread: EmailThread) {
    if (!workspaceId) return; setActionBusy(true); setError(null);
    try { const result = await emailApi.thread(workspaceId, thread.id); setActiveThread(result.data); const unreadMessages = result.data.messages.filter((message) => !message.isRead); void Promise.all(unreadMessages.map((message) => emailApi.updateMessage(workspaceId, message.id, { isRead: true }))).then(loadMailbox); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('The conversation could not be opened.'))); }
    finally { setActionBusy(false); }
  }

  async function createAiReply() {
    if (!workspaceId || !activeThread || !accountId) return; setActionBusy(true); setError(null);
    try { const result = await emailApi.aiDraft(workspaceId, activeThread.id, { accountId, tone: 'professional', language: language === 'de' || language === 'zh-CN' ? language : 'en' }); const draft = result.data; setCompose({ draftId: draft.id, threadId: draft.threadId, to: draft.to.map((item) => item.address).join(', '), cc: draft.cc.map((item) => item.address).join(', '), subject: draft.subject, bodyText: draft.bodyText, source: draft.source }); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, t('AI could not prepare a reply.'))); }
    finally { setActionBusy(false); }
  }

  async function saveAndSend() {
    if (!workspaceId || !accountId || !compose) return;
    const to = emailList(compose.to); const cc = emailList(compose.cc);
    if (!to.length || !compose.bodyText.trim()) { setError(t('Add at least one valid recipient and a message.')); return; }
    setActionBusy(true); setError(null);
    try {
      let draftId = compose.draftId;
      if (draftId) await emailApi.updateDraft(workspaceId, draftId, { to, cc, subject: compose.subject, bodyText: compose.bodyText });
      else draftId = (await emailApi.createDraft(workspaceId, { accountId, threadId: compose.threadId, to, cc, subject: compose.subject, bodyText: compose.bodyText })).data.id;
      if (!window.confirm(t('Send this email now?'))) { setNotice(t('Draft saved.')); setCompose(null); await loadSectionData(); return; }
      await emailApi.sendDraft(workspaceId, draftId); setCompose(null); setNotice(t('Email sent.')); await loadSectionData();
    } catch (cause) { setError(getFriendlyErrorMessage(cause, t('The email could not be sent.'))); }
    finally { setActionBusy(false); }
  }

  const selectedFolderName = useMemo(() => selectedProviderFolderId ? folders.find((folder) => folder.providerFolderId === selectedProviderFolderId)?.name ?? t('Folders') : section === 'starred' ? t('Starred') : section === 'sent' ? t('Sent') : t('Inbox'), [selectedProviderFolderId, folders, section, t]);
  const syncing = activeAccount ? ['queued', 'running'].includes(syncJobs[activeAccount.id]?.status ?? '') : false;

  if (appLoading || busy && !accounts.length) return <main className="email-page email-page--center" role="status"><LoaderCircle className="spin" /><p>{t('Loading email workspace…')}</p></main>;
  if (!workspaceId) return <main className="email-page email-page--center"><CircleAlert /><h1>{t('No workspace selected')}</h1><p>{t('Select a workspace before opening email.')}</p></main>;

  return <main className="email-page">
    <header className="email-header">
      <div><p className="email-eyebrow">Lulu AI / {t('Email')}</p><h1>{t('Email workspace')}</h1><p>{t('Connect inboxes, organize conversations and prepare accurate AI replies.')}</p></div>
      <div className="email-header__actions">
        {activeAccount && <select value={accountId} onChange={(event) => { setAccountId(event.target.value); setActiveThread(null); }} aria-label={t('Email account')}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.emailAddress}</option>)}</select>}
        {activeAccount && <button type="button" className="email-button email-button--secondary" disabled={syncing} onClick={() => void syncAccount(activeAccount.id)}><RefreshCw size={16} className={syncing ? 'spin' : ''} />{syncing ? t('Synchronizing…') : t('Synchronize')}</button>}
        {permissions.canEdit && <button type="button" className="email-button" onClick={() => setCompose({ ...emptyCompose })}><Edit3 size={16} />{t('Compose')}</button>}
      </div>
    </header>
    {error && <div className="email-alert email-alert--error" role="alert"><CircleAlert size={17} /><span>{error}</span><button type="button" onClick={() => setError(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {notice && <div className="email-alert email-alert--success" role="status"><Check size={17} /><span>{notice}</span><button type="button" onClick={() => setNotice(null)} aria-label={t('Close')}><X size={15} /></button></div>}
    {!accounts.length ? <ConnectEmpty onGoogle={() => void connectOAuth('google')} onMicrosoft={() => void connectOAuth('microsoft')} onImap={() => setShowImap(true)} busy={actionBusy} canEdit={permissions.canEdit} t={t} /> : section === 'settings' ? <SettingsView accounts={accounts} jobs={syncJobs} onGoogle={() => void connectOAuth('google')} onMicrosoft={() => void connectOAuth('microsoft')} onImap={() => setShowImap(true)} onSync={(id) => void syncAccount(id)} onDisconnect={async (id) => { if (!workspaceId || !window.confirm(t('Disconnect this email account?'))) return; await emailApi.disconnect(workspaceId, id); await loadAccounts(); }} canEdit={permissions.canEdit} t={t} language={language} /> : section === 'drafts' ? <DraftsView drafts={drafts} onOpen={(draft) => setCompose({ draftId: draft.id, threadId: draft.threadId, to: draft.to.map((item) => item.address).join(', '), cc: draft.cc.map((item) => item.address).join(', '), subject: draft.subject, bodyText: draft.bodyText, source: draft.source })} t={t} language={language} /> : section === 'automations' ? <AutomationsView rules={rules} accounts={accounts} canEdit={permissions.canEdit} onAdd={() => setShowRule(true)} onToggle={async (rule) => { if (!workspaceId) return; await emailApi.updateAutomation(workspaceId, rule.id, { enabled: !rule.enabled }); setRules((await emailApi.automations(workspaceId)).data.items); }} onDelete={async (rule) => { if (!workspaceId || !window.confirm(t('Delete this automation rule?'))) return; await emailApi.deleteAutomation(workspaceId, rule.id); setRules((await emailApi.automations(workspaceId)).data.items); }} t={t} language={language} /> : <MailboxView folders={folders} threads={threads} activeThread={activeThread} selectedFolderName={selectedFolderName} query={query} unreadOnly={unreadOnly} loading={busy || actionBusy} onQuery={setQuery} onUnread={setUnreadOnly} onThread={(thread) => void openThread(thread)} onBack={() => setActiveThread(null)} onAiReply={() => void createAiReply()} onReply={() => { if (!activeThread) return; const latest = [...activeThread.messages].reverse().find((message) => message.direction === 'inbound'); setCompose({ threadId: activeThread.id, to: latest?.sender.address ?? '', cc: '', subject: /^re:/i.test(activeThread.subject) ? activeThread.subject : `Re: ${activeThread.subject}`, bodyText: '', source: 'manual' }); }} t={t} language={language} canEdit={permissions.canEdit} />}
    {compose && <ComposeModal value={compose} busy={actionBusy} onChange={setCompose} onClose={() => setCompose(null)} onSend={() => void saveAndSend()} t={t} />}
    {showImap && <ImapModal workspaceId={workspaceId} busy={actionBusy} setBusy={setActionBusy} onClose={() => setShowImap(false)} onConnected={async () => { setShowImap(false); await loadAccounts(); setNotice(t('Email account connected.')); }} onError={setError} t={t} />}
    {showRule && <RuleModal workspaceId={workspaceId} accounts={accounts} busy={actionBusy} setBusy={setActionBusy} onClose={() => setShowRule(false)} onSaved={async () => { setShowRule(false); setRules((await emailApi.automations(workspaceId)).data.items); }} onError={setError} t={t} language={language} />}
  </main>;
}

function ConnectEmpty({ onGoogle, onMicrosoft, onImap, busy, canEdit, t }: { onGoogle: () => void; onMicrosoft: () => void; onImap: () => void; busy: boolean; canEdit: boolean; t: (key: string) => string }) {
  return <section className="email-connect"><div className="email-connect__icon"><Mail size={28} /></div><h2>{t('Connect your first inbox')}</h2><p>{t('Messages stay under your control. Lulu only sends after explicit confirmation.')}</p><div className="email-connect__grid"><button disabled={!canEdit || busy} onClick={onGoogle}><strong>Google / Gmail</strong><span>{t('Connect securely with OAuth')}</span></button><button disabled={!canEdit || busy} onClick={onMicrosoft}><strong>Microsoft 365 / Outlook</strong><span>{t('Connect securely with OAuth')}</span></button><button disabled={!canEdit || busy} onClick={onImap}><strong>IMAP / SMTP</strong><span>{t('Connect another email provider')}</span></button></div>{!canEdit && <small>{t('A workspace editor must connect email accounts.')}</small>}</section>;
}

function MailboxView({ folders, threads, activeThread, selectedFolderName, query, unreadOnly, loading, onQuery, onUnread, onThread, onBack, onAiReply, onReply, t, language, canEdit }: { folders: EmailFolder[]; threads: EmailThread[]; activeThread: EmailThreadDetail | null; selectedFolderName: string; query: string; unreadOnly: boolean; loading: boolean; onQuery: (value: string) => void; onUnread: (value: boolean) => void; onThread: (thread: EmailThread) => void; onBack: () => void; onAiReply: () => void; onReply: () => void; t: (key: string) => string; language: string; canEdit: boolean }) {
  const counts = Object.fromEntries(folders.filter((folder) => folder.systemName).map((folder) => [folder.systemName!, folder.unreadCount]));
  return <section className={`email-mailbox${activeThread ? ' has-thread' : ''}`}>
    <aside className="email-folder-panel"><h2>{t('Folders')}</h2><a href="/app/email?section=inbox"><Inbox size={17} />{t('Inbox')}<span>{counts.inbox ?? 0}</span></a><a href="/app/email?section=starred"><Star size={17} />{t('Starred')}</a><a href="/app/email?section=sent"><Send size={17} />{t('Sent')}</a><a href="/app/email?section=drafts"><Edit3 size={17} />{t('Drafts')}</a><div className="email-folder-panel__custom">{folders.filter((folder) => !folder.systemName).slice(0, 40).map((folder) => <a key={folder.id} href={`/app/email?section=inbox&folder=${encodeURIComponent(folder.providerFolderId)}`}><Folder size={15} /><span>{folder.name}</span>{folder.unreadCount > 0 && <small>{folder.unreadCount}</small>}</a>)}</div></aside>
    <section className="email-thread-list"><div className="email-thread-list__header"><div><h2>{selectedFolderName}</h2><span>{threads.length} {t('conversations')}</span></div><label><input type="checkbox" checked={unreadOnly} onChange={(event) => onUnread(event.target.checked)} />{t('Unread only')}</label></div><div className="email-search"><Search size={16} /><input value={query} onChange={(event) => onQuery(event.target.value)} placeholder={t('Search email…')} /></div>{loading && <div className="email-list-state"><LoaderCircle className="spin" />{t('Loading…')}</div>}{!loading && !threads.length && <div className="email-list-state"><MailOpen />{t('No conversations found.')}</div>}{threads.map((thread) => <button type="button" key={thread.id} className={`email-thread-row${thread.unread ? ' is-unread' : ''}${activeThread?.id === thread.id ? ' is-active' : ''}`} onClick={() => onThread(thread)}><span className="email-avatar">{thread.participantEmails[0]?.charAt(0).toUpperCase() || <UserRound size={15} />}</span><span className="email-thread-row__content"><span><strong>{thread.participantEmails.find(Boolean) || thread.accountEmail}</strong><time>{dateLabel(thread.latestAt, language)}</time></span><b>{thread.subject}</b><small>{thread.preview}</small></span>{thread.starred && <Star size={14} fill="currentColor" />}</button>)}</section>
    <section className="email-reader">{activeThread ? <><header><button type="button" className="email-reader__back" onClick={onBack}><ChevronLeft size={18} />{t('Back')}</button><div><h2>{activeThread.subject}</h2><p>{activeThread.participantEmails.join(', ')}</p></div><div className="email-reader__actions">{canEdit && <button type="button" onClick={onReply}><Mail size={16} />{t('Reply')}</button>}{canEdit && <button type="button" className="is-ai" onClick={onAiReply}><Sparkles size={16} />{t('AI reply')}</button>}</div></header><div className="email-message-stack">{activeThread.messages.map((message) => <article key={message.id} className={message.direction === 'outbound' ? 'is-outbound' : ''}><div className="email-message-meta"><span className="email-avatar">{displayAddress(message.sender).charAt(0).toUpperCase()}</span><div><strong>{displayAddress(message.sender)}</strong><small>{message.sender.address}</small></div><time>{dateLabel(message.receivedAt || message.sentAt || '', language)}</time></div><pre>{message.textBody || t('No message body available.')}</pre></article>)}</div></> : <div className="email-reader__empty"><MailOpen size={30} /><h2>{t('Select a conversation')}</h2><p>{t('Open an email to read it and prepare a reply.')}</p></div>}</section>
  </section>;
}

function DraftsView({ drafts, onOpen, t, language }: { drafts: EmailDraft[]; onOpen: (draft: EmailDraft) => void; t: (key: string) => string; language: string }) { return <section className="email-card"><div className="email-card__header"><div><h2>{t('Drafts')}</h2><p>{t('Manual and AI-prepared replies waiting for review.')}</p></div></div><div className="email-table">{!drafts.length && <div className="email-list-state"><Edit3 />{t('No drafts yet.')}</div>}{drafts.map((draft) => <button key={draft.id} onClick={() => onOpen(draft)}><span className={`email-source is-${draft.source}`}>{draft.source === 'ai' || draft.source === 'automation' ? <Bot size={15} /> : <Edit3 size={15} />}{draft.source === 'automation' ? t('Automation') : draft.source === 'ai' ? t('AI draft') : t('Manual')}</span><strong>{draft.subject || t('(No subject)')}</strong><span>{draft.to.map((item) => item.address).join(', ')}</span><time>{dateLabel(draft.updatedAt, language)}</time></button>)}</div></section>; }

function AutomationsView({ rules, accounts, canEdit, onAdd, onToggle, onDelete, t, language }: { rules: EmailAutomationRule[]; accounts: EmailAccount[]; canEdit: boolean; onAdd: () => void; onToggle: (rule: EmailAutomationRule) => void; onDelete: (rule: EmailAutomationRule) => void; t: (key: string) => string; language: string }) { return <section className="email-card"><div className="email-card__header"><div><h2>{t('Email automations')}</h2><p>{t('Rules can classify messages and prepare AI drafts. Sending always requires confirmation.')}</p></div>{canEdit && <button className="email-button" onClick={onAdd}><Plus size={16} />{t('New rule')}</button>}</div><div className="email-rule-list">{!rules.length && <div className="email-list-state"><WandSparkles />{t('No automation rules yet.')}</div>}{rules.map((rule) => <article key={rule.id}><div className="email-rule-list__main"><span className={rule.enabled ? 'is-on' : ''}><WandSparkles size={18} /></span><div><h3>{rule.name}</h3><p>{rule.accountId ? accounts.find((account) => account.id === rule.accountId)?.emailAddress : t('All connected accounts')} · {rule.actions.map((action) => action.type === 'generate_ai_draft' ? t('Prepare AI draft') : action.type === 'mark_read' ? t('Mark as read') : t('Star')).join(', ')}</p><small>{rule.lastRunAt ? `${t('Last run')}: ${dateLabel(rule.lastRunAt, language)} · ${rule.runCount}×` : t('Not run yet')}</small></div></div><div><button disabled={!canEdit} onClick={() => onToggle(rule)}>{rule.enabled ? t('Enabled') : t('Paused')}</button><button disabled={!canEdit} className="danger" onClick={() => onDelete(rule)} aria-label={t('Delete')}><Trash2 size={16} /></button></div></article>)}</div></section>; }

function SettingsView({ accounts, jobs, onGoogle, onMicrosoft, onImap, onSync, onDisconnect, canEdit, t, language }: { accounts: EmailAccount[]; jobs: Record<string, EmailSyncJob>; onGoogle: () => void; onMicrosoft: () => void; onImap: () => void; onSync: (id: string) => void; onDisconnect: (id: string) => void; canEdit: boolean; t: (key: string) => string; language: string }) { return <section className="email-card"><div className="email-card__header"><div><h2>{t('Email settings')}</h2><p>{t('Manage connected inboxes and synchronization.')}</p></div><div className="email-connect-buttons"><button disabled={!canEdit} onClick={onGoogle}>+ Gmail</button><button disabled={!canEdit} onClick={onMicrosoft}>+ Outlook</button><button disabled={!canEdit} onClick={onImap}>+ IMAP</button></div></div><div className="email-account-list">{accounts.map((account) => { const job = jobs[account.id]; const syncing = job?.status === 'queued' || job?.status === 'running'; return <article key={account.id}><span className="email-account-list__icon"><Mail /></span><div><h3>{account.displayName || account.emailAddress}</h3><p>{account.emailAddress} · {providerLabel(account.provider)}</p><small>{account.lastSyncAt ? `${t('Last synchronized')}: ${dateLabel(account.lastSyncAt, language)}` : t('Not synchronized yet')} · <b className={`status-${account.status}`}>{t(account.status)}</b></small>{account.lastErrorMessage && <em>{account.lastErrorMessage}</em>}</div><div><button disabled={!canEdit || syncing} onClick={() => onSync(account.id)}><RefreshCw className={syncing ? 'spin' : ''} size={16} />{t('Synchronize')}</button><button disabled={!canEdit} className="danger" onClick={() => onDisconnect(account.id)}><Trash2 size={16} />{t('Disconnect')}</button></div></article>; })}</div><div className="email-security-note"><ShieldCheck size={20} /><div><strong>{t('Security and control')}</strong><p>{t('OAuth tokens and IMAP credentials are encrypted. AI creates drafts; only a user can confirm sending.')}</p></div></div></section>; }

function ComposeModal({ value, busy, onChange, onClose, onSend, t }: { value: ComposeState; busy: boolean; onChange: (value: ComposeState) => void; onClose: () => void; onSend: () => void; t: (key: string) => string }) { return <div className="email-modal-backdrop"><section className="email-compose" role="dialog" aria-modal="true" aria-labelledby="compose-title"><header><div><span>{value.source === 'manual' ? <Edit3 size={17} /> : <Sparkles size={17} />}</span><div><h2 id="compose-title">{value.source === 'manual' ? t('New email') : t('Review AI draft')}</h2><p>{value.source !== 'manual' && t('Check and edit everything before sending.')}</p></div></div><button onClick={onClose} aria-label={t('Close')}><X /></button></header><label><span>{t('To')}</span><input value={value.to} onChange={(event) => onChange({ ...value, to: event.target.value })} placeholder="name@example.com" /></label><label><span>{t('Cc')}</span><input value={value.cc} onChange={(event) => onChange({ ...value, cc: event.target.value })} placeholder={t('Optional')} /></label><label><span>{t('Subject')}</span><input value={value.subject} onChange={(event) => onChange({ ...value, subject: event.target.value })} /></label><textarea value={value.bodyText} onChange={(event) => onChange({ ...value, bodyText: event.target.value })} placeholder={t('Write your message…')} /><footer><p><ShieldCheck size={15} />{t('Nothing is sent without your confirmation.')}</p><button className="email-button email-button--secondary" onClick={onClose}>{t('Cancel')}</button><button className="email-button" disabled={busy} onClick={onSend}>{busy ? <LoaderCircle className="spin" size={16} /> : <Send size={16} />}{t('Review & send')}</button></footer></section></div>; }

function ImapModal({ workspaceId, busy, setBusy, onClose, onConnected, onError, t }: { workspaceId: string; busy: boolean; setBusy: (value: boolean) => void; onClose: () => void; onConnected: () => void; onError: (value: string) => void; t: (key: string) => string }) { const [form, setForm] = useState({ emailAddress: '', displayName: '', password: '', imapHost: '', imapPort: 993, imapSecure: true, smtpHost: '', smtpPort: 465, smtpSecure: true }); return <div className="email-modal-backdrop"><section className="email-dialog" role="dialog" aria-modal="true"><header><div><h2>{t('Connect IMAP / SMTP')}</h2><p>{t('Use an app password when your provider supports it.')}</p></div><button onClick={onClose}><X /></button></header><div className="email-form-grid"><label>{t('Email address')}<input type="email" value={form.emailAddress} onChange={(e) => setForm({ ...form, emailAddress: e.target.value })} /></label><label>{t('Display name')}<input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} /></label><label className="wide">{t('Password / app password')}<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label><label>{t('IMAP host')}<input value={form.imapHost} onChange={(e) => setForm({ ...form, imapHost: e.target.value })} /></label><label>{t('IMAP port')}<input type="number" value={form.imapPort} onChange={(e) => setForm({ ...form, imapPort: Number(e.target.value) })} /></label><label>{t('SMTP host')}<input value={form.smtpHost} onChange={(e) => setForm({ ...form, smtpHost: e.target.value })} /></label><label>{t('SMTP port')}<input type="number" value={form.smtpPort} onChange={(e) => setForm({ ...form, smtpPort: Number(e.target.value) })} /></label><label className="checkbox"><input type="checkbox" checked={form.imapSecure} onChange={(e) => setForm({ ...form, imapSecure: e.target.checked })} />{t('Secure IMAP (TLS)')}</label><label className="checkbox"><input type="checkbox" checked={form.smtpSecure} onChange={(e) => setForm({ ...form, smtpSecure: e.target.checked })} />{t('Secure SMTP (TLS)')}</label></div><footer><button className="email-button email-button--secondary" onClick={onClose}>{t('Cancel')}</button><button className="email-button" disabled={busy} onClick={async () => { setBusy(true); try { await emailApi.connectImap(workspaceId, { ...form, ...(form.displayName.trim() ? { displayName: form.displayName.trim() } : {}) }); onConnected(); } catch (cause) { onError(getFriendlyErrorMessage(cause, t('Email account could not be connected.'))); } finally { setBusy(false); } }}>{busy ? <LoaderCircle className="spin" size={16} /> : <ShieldCheck size={16} />}{t('Verify & connect')}</button></footer></section></div>; }

function RuleModal({ workspaceId, accounts, busy, setBusy, onClose, onSaved, onError, t, language }: { workspaceId: string; accounts: EmailAccount[]; busy: boolean; setBusy: (value: boolean) => void; onClose: () => void; onSaved: () => void; onError: (value: string) => void; t: (key: string) => string; language: string }) { const [name, setName] = useState(''); const [accountId, setAccountId] = useState(''); const [sender, setSender] = useState(''); const [subject, setSubject] = useState(''); const [tone, setTone] = useState('professional'); const [markRead, setMarkRead] = useState(false); return <div className="email-modal-backdrop"><section className="email-dialog" role="dialog" aria-modal="true"><header><div><h2>{t('New email automation')}</h2><p>{t('Matching messages receive a draft for human review.')}</p></div><button onClick={onClose}><X /></button></header><div className="email-form-grid"><label className="wide">{t('Rule name')}<input value={name} onChange={(e) => setName(e.target.value)} /></label><label className="wide">{t('Account')}<select value={accountId} onChange={(e) => setAccountId(e.target.value)}><option value="">{t('All connected accounts')}</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.emailAddress}</option>)}</select></label><label>{t('Sender contains')}<input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="@customer.com" /></label><label>{t('Subject contains')}<input value={subject} onChange={(e) => setSubject(e.target.value)} /></label><label className="wide">{t('AI tone')}<select value={tone} onChange={(e) => setTone(e.target.value)}><option value="professional">{t('Professional')}</option><option value="friendly">{t('Friendly')}</option><option value="concise">{t('Concise')}</option><option value="empathetic">{t('Empathetic')}</option></select></label><label className="checkbox wide"><input type="checkbox" checked={markRead} onChange={(e) => setMarkRead(e.target.checked)} />{t('Mark matching email as read')}</label></div><div className="email-rule-warning"><ShieldCheck size={18} /><p>{t('This rule prepares drafts only. A person must still confirm every send.')}</p></div><footer><button className="email-button email-button--secondary" onClick={onClose}>{t('Cancel')}</button><button className="email-button" disabled={busy || !name.trim()} onClick={async () => { setBusy(true); try { await emailApi.createAutomation(workspaceId, { accountId: accountId || null, name: name.trim(), enabled: true, conditions: { ...(sender.trim() ? { senderContains: sender.trim() } : {}), ...(subject.trim() ? { subjectContains: subject.trim() } : {}), onlyUnread: true }, actions: [{ type: 'generate_ai_draft', tone, language: language === 'de' || language === 'zh-CN' ? language : 'en' }, ...(markRead ? [{ type: 'mark_read' as const }] : [])] }); onSaved(); } catch (cause) { onError(getFriendlyErrorMessage(cause, t('Automation rule could not be saved.'))); } finally { setBusy(false); } }}><WandSparkles size={16} />{t('Save rule')}</button></footer></section></div>; }
