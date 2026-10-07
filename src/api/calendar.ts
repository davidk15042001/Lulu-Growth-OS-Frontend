import { requestApi } from './client';

export type CalendarProvider = 'google' | 'microsoft';
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
  customerId: string | null;
  customerName: string | null;
  agoraChannelName: string;
  guestJoinPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarDeliveryTarget = {
  id: string;
  workspaceId: string;
  integrationTeamId: string;
  targetName: string;
  enabled: boolean;
  createToolSlug: string;
  createArguments: Record<string, unknown>;
  createResultEventIdPath: string;
  updateToolSlug: string;
  updateArguments: Record<string, unknown>;
  cancelToolSlug: string;
  cancelArguments: Record<string, unknown>;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarDeliveryCandidate = {
  slug: string;
  name: string;
  description: string | null;
  inputParameters: Record<string, unknown> | null;
  outputParameters: Record<string, unknown> | null;
  operations: Array<'CREATE' | 'UPDATE' | 'CANCEL'>;
};

export type CalendarDeliveryTargetInput = Pick<CalendarDeliveryTarget,
  'integrationTeamId' | 'targetName' | 'enabled' | 'createToolSlug' | 'createArguments' |
  'createResultEventIdPath' | 'updateToolSlug' | 'updateArguments' | 'cancelToolSlug' | 'cancelArguments'>;

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
  overview: (workspaceId: string, values: { accountId?: string; q?: string; from?: string; to?: string; limit?: number } = {}, signal?: AbortSignal) => requestApi<{
    accounts: CalendarAccount[];
    events: CalendarEvent[];
    summary: { connectedAccounts: number; syncedAccounts: number; upcomingEvents: number; providers: CalendarProvider[] };
    nativeEvents: NativeCalendarEvent[];
  }>({ path: `/workspaces/${workspaceId}/calendar/overview${queryString(values)}`, signal }),
  nativeEvents: (workspaceId: string, values: { q?: string; from?: string; to?: string; limit?: number } = {}) => requestApi<{ items: NativeCalendarEvent[] }>({ path: `/workspaces/${workspaceId}/calendar/events${queryString(values)}` }),
  deliveryTargets: (workspaceId: string) => requestApi<{ items: CalendarDeliveryTarget[]; limit: number }>({ path: `/workspaces/${workspaceId}/calendar/delivery-targets` }),
  deliveryTargetCandidates: (workspaceId: string, teamId: string) => requestApi<{ items: CalendarDeliveryCandidate[] }>({ path: `/workspaces/${workspaceId}/calendar/delivery-targets/candidates/${encodeURIComponent(teamId)}` }),
  createDeliveryTarget: (workspaceId: string, body: CalendarDeliveryTargetInput) => requestApi<CalendarDeliveryTarget>({ path: `/workspaces/${workspaceId}/calendar/delivery-targets`, method: 'POST', body }),
  updateDeliveryTarget: (workspaceId: string, targetId: string, body: CalendarDeliveryTargetInput) => requestApi<CalendarDeliveryTarget>({ path: `/workspaces/${workspaceId}/calendar/delivery-targets/${encodeURIComponent(targetId)}`, method: 'PATCH', body }),
  createNativeEvent: (workspaceId: string, body: { title: string; description?: string; startAt: string; endAt: string; timezone?: string; location?: string; customerId?: string }) => requestApi<NativeCalendarEvent & { guestToken: string; guestJoinPath: string }>({ path: `/workspaces/${workspaceId}/calendar/events`, method: 'POST', body }),
  updateNativeEvent: (workspaceId: string, eventId: string, body: { startAt: string; endAt: string; timezone: string }) => requestApi<NativeCalendarEvent>({ path: `/workspaces/${workspaceId}/calendar/events/${encodeURIComponent(eventId)}`, method: 'PATCH', body }),
  deleteNativeEvent: (workspaceId: string, eventId: string) => requestApi<NativeCalendarEvent>({ path: `/workspaces/${workspaceId}/calendar/events/${eventId}`, method: 'DELETE' }),
  createGuestLink: (workspaceId: string, eventId: string) => requestApi<NativeCalendarEvent & { guestToken: string; guestJoinPath: string }>({ path: `/workspaces/${workspaceId}/calendar/events/${eventId}/guest-link`, method: 'POST', body: {} }),
  createAgoraToken: (workspaceId: string, eventId: string, userAccount?: string) => requestApi<AgoraToken>({ path: `/workspaces/${workspaceId}/calendar/events/${eventId}/agora-token`, method: 'POST', body: userAccount ? { userAccount } : {} }),
  createGuestAgoraToken: (token: string, guestName?: string) => requestApi<Omit<AgoraToken, 'userAccount'> & { userAccount: string; workspaceName?: string }>({ path: `/public/calendar/meetings/${encodeURIComponent(token)}/agora-token`, method: 'POST', body: guestName ? { guestName } : {} }),
  accounts: (workspaceId: string) => requestApi<{ items: CalendarAccount[] }>({ path: `/workspaces/${workspaceId}/calendar/accounts` }),
  startOAuth: (workspaceId: string, provider: 'google' | 'microsoft', returnTo = '/app/calendar?section=settings') => requestApi<{ provider: string; authorizationUrl: string }>({ path: `/workspaces/${workspaceId}/calendar/accounts/oauth/start`, method: 'POST', body: { provider, returnTo } }),
  disconnect: (workspaceId: string, accountId: string) => requestApi<void>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}`, method: 'DELETE' }),
  startSync: (workspaceId: string, accountId: string) => requestApi<CalendarSyncJob>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}/sync`, method: 'POST', body: {} }),
  syncJob: (workspaceId: string, accountId: string, jobId: string) => requestApi<CalendarSyncJob>({ path: `/workspaces/${workspaceId}/calendar/accounts/${accountId}/sync/${jobId}` }),
};
