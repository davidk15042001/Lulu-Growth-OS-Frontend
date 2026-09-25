import { useEffect, useState } from 'react';
import { Link2, LoaderCircle, Megaphone, RefreshCw, Search, Unlink } from 'lucide-react';
import { getFriendlyErrorMessage, requestApi } from '../../api/client';
import { useLuluApp } from '../../api/LuluAppContext';

type Provider = 'google-ads' | 'meta';
type Campaign = {
  id: string;
  provider: Provider;
  externalAccountId: string;
  externalCampaignId: string;
  name: string;
  status: string;
  objective: string | null;
  channelType: string | null;
  assignedWorkspaceId: string | null;
  assignedWorkspaceName: string | null;
  lastSyncedAt: string;
  updatedAt: string;
};
type WorkspaceOption = { id: string; companyName: string };

function providerLabel(provider: Provider) {
  return provider === 'meta' ? 'Meta Ads' : 'Google Ads';
}

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (/active|enabled|published/.test(normalized)) return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (/paused|draft|pending/.test(normalized)) return 'border-amber-200 bg-amber-50 text-amber-700';
  if (/removed|deleted|error|failed/.test(normalized)) return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-slate-200 bg-slate-50 text-slate-600';
}

export default function AdminAdCampaignsPage({ onError }: { onError: (message: string) => void }) {
  const { currentUser } = useLuluApp();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<'all' | Provider>('all');
  const [syncProvider, setSyncProvider] = useState<Provider>('google-ads');
  const [metaAccountId, setMetaAccountId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [busyCampaign, setBusyCampaign] = useState<string | null>(null);
  const canManage = Boolean(
    currentUser?.adminCapabilities?.includes('providers.manage')
      && currentUser.adminCapabilities.includes('workspaces.manage'),
  );

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (providerFilter !== 'all') params.set('provider', providerFilter);
      if (search.trim()) params.set('search', search.trim());
      const query = params.toString();
      const result = await requestApi<{ campaigns: Campaign[] }>({ path: `/admin/ad-campaigns${query ? `?${query}` : ''}` });
      setCampaigns(result.data.campaigns);
    } catch (error) {
      onError(getFriendlyErrorMessage(error, 'Advertising campaigns could not be loaded.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void requestApi<{ workspaces: WorkspaceOption[] }>({ path: '/admin/workspaces?limit=500' })
      .then((result) => setWorkspaces(result.data.workspaces))
      .catch((error) => onError(getFriendlyErrorMessage(error, 'Customer workspaces could not be loaded.')));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadCampaigns(); }, 180);
    return () => window.clearTimeout(timer);
  }, [providerFilter, search]);

  const sync = async () => {
    if (!canManage || syncing) return;
    if (syncProvider === 'meta' && !metaAccountId.trim()) {
      onError('Enter a Meta ad account ID before synchronizing Meta campaigns.');
      return;
    }
    setSyncing(true);
    onError('');
    try {
      await requestApi({
        path: '/admin/ad-campaigns',
        method: 'POST',
        body: { provider: syncProvider, ...(syncProvider === 'meta' ? { externalAccountId: metaAccountId.trim() } : {}) },
      });
      await loadCampaigns();
    } catch (error) {
      onError(getFriendlyErrorMessage(error, `${providerLabel(syncProvider)} campaigns could not be synchronized.`));
    } finally {
      setSyncing(false);
    }
  };

  const assign = async (campaign: Campaign, workspaceId: string) => {
    if (!canManage || busyCampaign) return;
    setBusyCampaign(campaign.id);
    onError('');
    try {
      await requestApi({
        path: `/admin/ad-campaigns/${campaign.id}/assignment`,
        method: 'PUT',
        body: { workspaceId: workspaceId || null },
      });
      await loadCampaigns();
    } catch (error) {
      onError(getFriendlyErrorMessage(error, 'The campaign assignment could not be saved.'));
    } finally {
      setBusyCampaign(null);
    }
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-900"><Megaphone size={19} className="text-indigo-600" /><h1 className="text-xl font-semibold">Ad Campaign Assignments</h1></div>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">Synchronize existing campaigns from the central advertising accounts and attach them to the correct customer workspace.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">{campaigns.length} campaigns</div>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-1 text-xs font-medium text-slate-600">Provider
            <select className="h-10 min-w-40 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800" value={syncProvider} onChange={(event) => setSyncProvider(event.target.value as Provider)}>
              <option value="google-ads">Google Ads</option>
              <option value="meta">Meta Ads</option>
            </select>
          </label>
          {syncProvider === 'meta' ? (
            <label className="grid min-w-64 flex-1 gap-1 text-xs font-medium text-slate-600">Meta ad account ID
              <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="act_123456789" value={metaAccountId} onChange={(event) => setMetaAccountId(event.target.value)} />
            </label>
          ) : <div className="flex-1 text-xs text-slate-500">Uses the configured Lulu-managed Google Ads advertiser account.</div>}
          <button type="button" disabled={!canManage || syncing} onClick={() => void sync()} title="Synchronize campaigns" className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
            {syncing ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Sync campaigns
          </button>
        </div>
        {!canManage ? <p className="mt-3 text-xs text-amber-700">Read-only administrator access: campaign synchronization and assignment require provider and workspace management permissions.</p> : null}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
          <div className="relative min-w-64 flex-1 max-w-md"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder="Search campaigns or customers" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
          <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700" value={providerFilter} onChange={(event) => setProviderFilter(event.target.value as 'all' | Provider)}>
            <option value="all">All providers</option>
            <option value="google-ads">Google Ads</option>
            <option value="meta">Meta Ads</option>
          </select>
          <button type="button" onClick={() => void loadCampaigns()} title="Refresh campaign list" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><RefreshCw size={15} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/70 text-left text-slate-600"><tr><th className="px-4 py-3 font-medium">Campaign</th><th className="px-4 py-3 font-medium">Provider</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">External ID</th><th className="px-4 py-3 font-medium">Customer workspace</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Loading…</td></tr> : campaigns.length === 0 ? <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No campaigns found. Synchronize a provider to load existing campaigns.</td></tr> : campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3"><div className="font-medium text-slate-900">{campaign.name}</div><div className="mt-0.5 text-xs text-slate-500">{campaign.objective ?? campaign.channelType ?? '—'}</div></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 text-slate-700">{campaign.provider === 'meta' ? <Link2 size={14} /> : <Megaphone size={14} />}{providerLabel(campaign.provider)}</span></td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${statusClass(campaign.status)}`}>{campaign.status}</span></td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{campaign.externalAccountId}:{campaign.externalCampaignId}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><select disabled={!canManage || busyCampaign === campaign.id} className="h-9 min-w-64 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 disabled:bg-slate-50" value={campaign.assignedWorkspaceId ?? ''} onChange={(event) => void assign(campaign, event.target.value)}><option value="">Unassigned</option>{workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.companyName}</option>)}</select>{busyCampaign === campaign.id ? <LoaderCircle size={15} className="animate-spin text-slate-400" /> : campaign.assignedWorkspaceId ? <button type="button" disabled={!canManage} onClick={() => void assign(campaign, '')} title="Unassign campaign" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"><Unlink size={15} /></button> : null}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
