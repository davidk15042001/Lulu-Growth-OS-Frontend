import { requestApi } from './client';

export type EmailProvider = 'google' | 'microsoft' | 'imap';
export type EmailAddress = { name?: string | null; address: string };
export type EmailAccount = { id: string; workspaceId: string; provider: EmailProvider; emailAddress: string; displayName: string | null; status: string; lastSyncAt: string | null; lastErrorCode: string | null; lastErrorMessage: string | null; createdAt: string; updatedAt: string };
export type EmailFolder = { id: string; accountId: string; providerFolderId: string; parentProviderFolderId: string | null; name: string; systemName: string | null; unreadCount: number; totalCount: number };
export type EmailThread = { id: string; accountId: string; accountEmail: string; provider: EmailProvider; providerThreadId: string; subject: string; preview: string; participantEmails: string[]; folderProviderIds: string[]; latestAt: string; unread: boolean; starred: boolean };
export type EmailMessage = { id: string; providerMessageId: string; internetMessageId: string | null; direction: 'inbound' | 'outbound'; sender: EmailAddress; recipients: EmailAddress[]; ccRecipients: EmailAddress[]; subject: string; textBody: string; receivedAt: string | null; sentAt: string | null; isRead: boolean; starred: boolean };
export type EmailThreadDetail = EmailThread & { messages: EmailMessage[] };
export type EmailDraft = { id: string; accountId: string; accountEmail?: string; threadId: string | null; source: 'manual' | 'ai' | 'automation'; status: string; to: EmailAddress[]; cc: EmailAddress[]; subject: string; bodyText: string; replyToProviderMessageId: string | null; lastErrorCode?: string | null; lastErrorMessage?: string | null; createdAt: string; updatedAt: string };
export type EmailAutomationRule = { id: string; accountId: string | null; name: string; enabled: boolean; conditions: { senderContains?: string; subjectContains?: string; bodyContains?: string; onlyUnread?: boolean }; actions: Array<{ type: 'generate_ai_draft'; tone: string; language: string } | { type: 'mark_read' } | { type: 'star' }>; lastRunAt: string | null; runCount: number; createdAt: string; updatedAt: string };
export type EmailSyncJob = { id: string; workspaceId: string; accountId: string; status: 'queued' | 'running' | 'succeeded' | 'failed'; foldersSynced: number; messagesSynced: number; errorCode?: string | null; errorMessage?: string | null; startedAt?: string | null; finishedAt?: string | null; createdAt: string; updatedAt: string };

function queryString(values: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  const result = params.toString();
  return result ? `?${result}` : '';
}

export const emailApi = {
  accounts: (workspaceId: string) => requestApi<{ items: EmailAccount[] }>({ path: `/workspaces/${workspaceId}/email/accounts` }),
  startOAuth: (workspaceId: string, provider: 'google' | 'microsoft', returnTo = '/app/email') => requestApi<{ provider: string; authorizationUrl: string }>({ path: `/workspaces/${workspaceId}/email/accounts/oauth/start`, method: 'POST', body: { provider, returnTo } }),
  connectImap: (workspaceId: string, body: { emailAddress: string; displayName?: string; password: string; imapHost: string; imapPort: number; imapSecure: boolean; smtpHost: string; smtpPort: number; smtpSecure: boolean }) => requestApi<EmailAccount>({ path: `/workspaces/${workspaceId}/email/accounts/imap`, method: 'POST', body, timeoutMs: 45_000 }),
  disconnect: (workspaceId: string, accountId: string) => requestApi<void>({ path: `/workspaces/${workspaceId}/email/accounts/${accountId}`, method: 'DELETE' }),
  startSync: (workspaceId: string, accountId: string) => requestApi<EmailSyncJob>({ path: `/workspaces/${workspaceId}/email/accounts/${accountId}/sync`, method: 'POST', body: {} }),
  syncJob: (workspaceId: string, accountId: string, jobId: string) => requestApi<EmailSyncJob>({ path: `/workspaces/${workspaceId}/email/accounts/${accountId}/sync/${jobId}` }),
  folders: (workspaceId: string, accountId?: string) => requestApi<{ items: EmailFolder[] }>({ path: `/workspaces/${workspaceId}/email/folders${queryString({ accountId })}` }),
  threads: (workspaceId: string, values: { accountId?: string; folderId?: string; q?: string; unread?: boolean; starred?: boolean; limit?: number; offset?: number } = {}) => requestApi<{ items: EmailThread[]; total: number; limit: number; offset: number }>({ path: `/workspaces/${workspaceId}/email/threads${queryString(values)}` }),
  thread: (workspaceId: string, threadId: string) => requestApi<EmailThreadDetail>({ path: `/workspaces/${workspaceId}/email/threads/${threadId}` }),
  updateMessage: (workspaceId: string, messageId: string, body: { isRead?: boolean; starred?: boolean }) => requestApi<EmailMessage>({ path: `/workspaces/${workspaceId}/email/messages/${messageId}`, method: 'PATCH', body }),
  drafts: (workspaceId: string) => requestApi<{ items: EmailDraft[] }>({ path: `/workspaces/${workspaceId}/email/drafts` }),
  createDraft: (workspaceId: string, body: { accountId: string; threadId?: string | null; to: EmailAddress[]; cc?: EmailAddress[]; subject?: string; bodyText: string; replyToProviderMessageId?: string | null }) => requestApi<EmailDraft>({ path: `/workspaces/${workspaceId}/email/drafts`, method: 'POST', body }),
  updateDraft: (workspaceId: string, draftId: string, body: Partial<{ to: EmailAddress[]; cc: EmailAddress[]; subject: string; bodyText: string; replyToProviderMessageId: string | null }>) => requestApi<EmailDraft>({ path: `/workspaces/${workspaceId}/email/drafts/${draftId}`, method: 'PATCH', body }),
  aiDraft: (workspaceId: string, threadId: string, body: { accountId: string; instruction?: string; tone: 'professional' | 'friendly' | 'concise' | 'empathetic'; language: 'en' | 'de' | 'zh-CN' }) => requestApi<EmailDraft>({ path: `/workspaces/${workspaceId}/email/threads/${threadId}/ai-draft`, method: 'POST', body, timeoutMs: 90_000 }),
  sendDraft: (workspaceId: string, draftId: string) => requestApi<EmailDraft>({ path: `/workspaces/${workspaceId}/email/drafts/${draftId}/send`, method: 'POST', body: {}, timeoutMs: 60_000 }),
  automations: (workspaceId: string) => requestApi<{ items: EmailAutomationRule[] }>({ path: `/workspaces/${workspaceId}/email/automations` }),
  createAutomation: (workspaceId: string, body: { accountId?: string | null; name: string; enabled: boolean; conditions: EmailAutomationRule['conditions']; actions: EmailAutomationRule['actions'] }) => requestApi<EmailAutomationRule>({ path: `/workspaces/${workspaceId}/email/automations`, method: 'POST', body }),
  updateAutomation: (workspaceId: string, ruleId: string, body: Partial<{ accountId: string | null; name: string; enabled: boolean; conditions: EmailAutomationRule['conditions']; actions: EmailAutomationRule['actions'] }>) => requestApi<EmailAutomationRule>({ path: `/workspaces/${workspaceId}/email/automations/${ruleId}`, method: 'PATCH', body }),
  deleteAutomation: (workspaceId: string, ruleId: string) => requestApi<void>({ path: `/workspaces/${workspaceId}/email/automations/${ruleId}`, method: 'DELETE' }),
};
