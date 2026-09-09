import { requestApi } from './client';

export type CalendarProvider = 'google' | 'microsoft' | 'calendly' | 'calcom';
export type CalendarAttendee = { name?: string | null; email?: string | null; status?: string | null };
export type CalendarAccount = {
  id: string;
  workspaceId: string;
  provider: CalendarProvider;
  externalAccountId: string | null;
  emailAddress: string | null;
  displayName: string | null;
  baseUrl: string | null;
  settings: Record<string, unknown>;
  status: string;
  lastSyncAt: string | null;
  lastErrorCode: string | null;
  lastErrorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};
export type CalendarEvent = {
  id: string;
  accountId: string;
  provider: CalendarProvider;
  providerEventId: string;
  sourceId: string | null;
  sourceName: string | null;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  timezone: string | null;
  status: string;
  location: string | null;
  meetingUrl: string | null;
  organizerName: string | null;
  organizerEmail: string | null;
  attendeeCount: number;
  attendees: CalendarAttendee[];
  rawData: Record<string, unknown>;
  lastSyncedAt: string;
  createdAt: string;
  updatedAt: string;
  accountEmail: string | null;
  accountDisplayName: string | null;
  sources?: Array<{
    accountId: string;
    provider: CalendarProvider;
    sourceName: string | null;
    accountEmail: string | null;
    accountDisplayName: string | null;
  }>;
};
export type CalendarSyncJob = {
  id: string;
  workspaceId: string;
  accountId: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  eventsSynced: number;
  errorCode?: string | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
export type NativeCalendarEvent = {
  id: string;
  workspaceId: string;
  createdBy: string | null;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  timezone: string;
  location: string | null;
  status: 'scheduled' | 'cancelled' | 'completed';
  agoraChannelName: string;
  guestJoinPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AgoraToken = {
  appId: string;
  channelName: string;
  token: string;
  userAccount: string;
  expiresAt: string;
  event: Pick<NativeCalendarEvent, 'id' | 'title' | 'startAt' | 'endAt' | 'timezone' | 'location' | 'status'>;
};

function queryString(values: Record<string, string | number | boolean | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => { if (value !== undefined && value !== '') params.set(key, String(value)); });
  const result = params.toString();
  return result ? `?${result}` : '';
}

export const calendarApi = {
  overview: (workspaceId: string, values: { accountId?: string; q?: string; from?: string; to?: string; limit?: number } = {}) => requestApi<{
    accounts: CalendarAccount[];
    events: CalendarEvent[];
    summary: { connectedAccounts: number; syncedAccounts: number; upcomingEvents: number; providers: CalendarProvider[] };
    nativeEvents: NativeCalendarEvent[];
  }>({ path: `/workspaces/${workspaceId}/calendar/overview${queryString(values)}` }),
  nativeEvents: (workspaceId: string, values: { q?: string; from?: string; to?: string; limit?: number } = {}) => requestApi<{ items: NativeCalendarEvent[] }>({ path: `/workspaces/${workspaceId}/calendar/events${queryString(values)}` }),
  createNativeEvent: (workspaceId: string, body: { title: string; description?: string; startAt: string; endAt: string; timezone?: string; location?: string }) => requestApi<NativeCalendarEvent & { guestToken: string; guestJoinPath: string }>({ path: `/workspaces/${workspaceId}/calendar/events`, method: 'POST', body }),
  deleteNativeEvent: (workspaceId: string, eventId: string) => requestApi<void>({ path: `/workspaces/${workspaceId}/calendar/events/${eventId}`, method: 'DELETE' }),
  createAgoraToken: (workspaceId: string, eventId: string, userAccount?: string) => requestApi<AgoraToken>({ path: `/workspaces/${workspaceId}/calendar/events/${eventId}/agora-token`, method: 'POST', body: userAccount ? { userAccount } : {} }),
  createGuestAgoraToken: (token: string, guestName?: string) => requestApi<Omit<AgoraToken, 'userAccount'> & { userAccount: string; workspaceName?: string }>({ path: `/public/calendar/meetings/${encodeURIComponent(token)}/agora-token`, method: 'POST', body: guestName ? { guestName } : {} }),
  accounts: (workspaceId: string) => requestApi<{ items: CalendarAccount[] }>({ path: `/workspaces/${workspaceId}/calendar/accounts` }),
  startOAuth: (workspaceId: string, provider: 'google' | 'microsoft', returnTo = '/app/calendar?section=settings') => requestApi<{ provider: string; authorizationUrl: string }>({ path: `/workspaces/${workspaceId}/calendar/accounts/oauth/start`, method: 'POST', body: { provider, returnTo } }),
  connectToken: (workspaceId: string, body: { provider: 'calendly' | 'calcom'; apiKey: string; displayName?: string; baseUrl?: string }) => requestApi<CalendarAccount>({ path: `/workspaces/${workspaceId}/calendar/accounts/token`, method: 'POST', body }),
  disconnect: (workspaceId: string, accountId: string) => requestApi<void>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}`, method: 'DELETE' }),
  startSync: (workspaceId: string, accountId: string) => requestApi<CalendarSyncJob>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}/sync`, method: 'POST', body: {} }),
  syncJob: (workspaceId: string, accountId: string, jobId: string) => requestApi<CalendarSyncJob>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}/sync/${jobId}` }),
};
