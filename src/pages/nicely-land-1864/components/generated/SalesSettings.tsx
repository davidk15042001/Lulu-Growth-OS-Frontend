import { useState } from 'react';
import { Activity, BarChart3, Bell, Bot, BriefcaseBusiness, Building2, Check, ChevronDown, CircleHelp, ClipboardList, Database, FileCog, Gem, Globe2, Home, Layers3, ListChecks, LockKeyhole, Menu, MoreHorizontal, Network, PanelLeft, PanelTop, Pencil, Plus, RotateCcw, Search, Settings2, ShieldCheck, Sparkles, Target, UserRound, UsersRound, X, Zap } from 'lucide-react';
type IconType = typeof Home;
type SettingItem = {
  label: string;
  icon: IconType;
};
type Pipeline = {
  name: string;
  description: string;
  stages: string;
  default?: boolean;
};
type AuditEntry = {
  setting: string;
  previous: string;
  next: string;
  user: string;
  time: string;
};
const platformNav: SettingItem[] = [{
  label: 'Overview',
  icon: Home
}, {
  label: 'Inbox',
  icon: BriefcaseBusiness
}, {
  label: 'Sales',
  icon: BarChart3
}, {
  label: 'Marketing',
  icon: Target
}, {
  label: 'Customers',
  icon: UsersRound
}, {
  label: 'Reports',
  icon: PanelTop
}];
const settingNav: SettingItem[] = [{
  label: 'General',
  icon: Settings2
}, {
  label: 'Pipelines',
  icon: Network
}, {
  label: 'Stages',
  icon: Layers3
}, {
  label: 'Activities',
  icon: Activity
}, {
  label: 'Tasks',
  icon: ListChecks
}, {
  label: 'Forecast',
  icon: BarChart3
}, {
  label: 'Teams',
  icon: UsersRound
}, {
  label: 'Territories',
  icon: Globe2
}, {
  label: 'Assignment',
  icon: UserRound
}, {
  label: 'Scoring',
  icon: Gem
}, {
  label: 'Automation',
  icon: Zap
}, {
  label: 'Notifications',
  icon: Bell
}, {
  label: 'Permissions',
  icon: LockKeyhole
}, {
  label: 'Fields',
  icon: FileCog
}, {
  label: 'AI Settings',
  icon: Bot
}, {
  label: 'Data Management',
  icon: Database
}];
const pipelines: Pipeline[] = [{
  name: 'New Business',
  description: 'Standard new customer acquisition pipeline',
  stages: '7 stages',
  default: true
}, {
  name: 'Enterprise',
  description: 'Large enterprise deals pipeline',
  stages: '6 stages'
}, {
  name: 'Renewals',
  description: 'Customer renewal opportunities',
  stages: '5 stages'
}, {
  name: 'Expansion',
  description: 'Upsell and expansion deals',
  stages: '5 stages'
}];
const audits: AuditEntry[] = [{
  setting: 'Forecast methodology changed',
  previous: 'Stage Probability',
  next: 'Weighted Pipeline',
  user: 'Sarah Chen',
  time: 'Today 2:14 PM'
}, {
  setting: 'Stage probability updated',
  previous: '60%',
  next: '65%',
  user: 'Marcus Liu',
  time: 'Today 11:30 AM'
}, {
  setting: 'Pipeline created',
  previous: '—',
  next: 'Enterprise',
  user: 'Admin',
  time: 'Yesterday 4:05 PM'
}, {
  setting: 'Assignment rule activated',
  previous: 'Inactive',
  next: 'Active',
  user: 'Sarah Chen',
  time: 'Yesterday 9:22 AM'
}];
function PlatformSidebar() {
  return <aside className="flex w-[232px] shrink-0 flex-col bg-[var(--sidebar)] px-4 py-5 text-foreground">
      <div className="mb-9 flex items-center gap-3 px-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] shadow-[0_6px_18px_rgba(0,0,0,.34)] text-primary-foreground"><Sparkles size={18} strokeWidth={2.3} /></div>
        <div><p className="text-[15px] font-bold tracking-tight">LULU AI</p><p className="text-[10px] font-medium uppercase tracking-[.2em] text-[var(--muted-foreground)]">Core platform</p></div>
      </div>
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--muted-foreground)]">Workspace</div>
      <nav aria-label="Platform navigation" className="space-y-1">
        {platformNav.map(({
        label,
        icon: Icon
      }) => {
        const active = label === 'Sales';
        return <button key={label} className={'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-[var(--border)] ' + (active ? 'bg-secondary text-foreground' : 'text-[var(--muted-foreground)]')}>
              <Icon size={17} className="text-[var(--foreground)]" />
              <span>{label}</span>
              {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--primary)] text-primary-foreground" /> : null}
            </button>;
      })}
      </nav>
      <div className="my-7 h-px bg-secondary" />
      <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--muted-foreground)]">Manage</div>
      <button className="flex w-full items-center gap-3 rounded-lg bg-[var(--primary)] px-3 py-2.5 text-left text-[13px] font-semibold text-primary-foreground shadow-[0_8px_20px_rgba(0,0,0,.22)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><Settings2 size={17} /><span>Sales settings</span></button>
      <div className="mt-auto rounded-xl border border-border/[.09] bg-secondary p-3.5">
        <div className="mb-3 flex items-center justify-between"><span className="text-[11px] font-semibold text-[var(--muted-foreground)]">Need a hand?</span><CircleHelp size={15} className="text-[var(--muted-foreground)]" /></div>
        <p className="mb-3 text-[11px] leading-5 text-[var(--muted-foreground)]">Ask Lulu to help configure your workspace.</p>
        <button className="flex items-center gap-2 text-[11px] font-semibold text-[var(--foreground)] hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><Sparkles size={13} /> Ask Lulu AI <span>→</span></button>
      </div>
      <div className="mt-5 flex items-center gap-3 px-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--muted)] text-[11px] font-bold text-[var(--muted-foreground)]">SC</div><div className="min-w-0"><p className="truncate text-[12px] font-semibold">Sarah Chen</p><p className="text-[10px] text-[var(--muted-foreground)]">Administrator</p></div><MoreHorizontal size={16} className="ml-auto text-[var(--muted-foreground)]" /></div>
    </aside>;
}
function Toggle({
  label,
  enabled,
  onToggle
}: {
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return <div className="flex items-center justify-between border-b border-[var(--border)] py-3.5 last:border-0"><span className="text-[13px] font-medium text-[var(--muted-foreground)]">{label}</span><button type="button" aria-label={`${label}: ${enabled ? 'On' : 'Off'}`} aria-pressed={enabled} onClick={onToggle} className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2 ${enabled ? 'bg-[var(--primary)]' : 'bg-[var(--secondary)]'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-card shadow-sm transition-transform ${enabled ? 'left-6' : 'left-1'}`} /></button></div>;
}
export function SalesSettings() {
  const [activeSetting, setActiveSetting] = useState('General');
  const [unsaved, setUnsaved] = useState(true);
  const [toggles, setToggles] = useState({
    module: true,
    ai: true,
    notifications: true,
    tracking: true
  });
  const [notice, setNotice] = useState('');
  const setToggle = (key: keyof typeof toggles) => {
    setToggles(current => ({
      ...current,
      [key]: !current[key]
    }));
    setUnsaved(true);
  };
  const save = () => {
    setUnsaved(false);
    setNotice('Sales settings saved just now.');
    window.setTimeout(() => setNotice(''), 3000);
  };
  const discard = () => {
    setUnsaved(false);
    setNotice('Changes discarded.');
    window.setTimeout(() => setNotice(''), 3000);
  };
  return <div className="flex min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
      <PlatformSidebar />
      <main className="min-w-0 flex-1 overflow-auto">
        <header className="flex items-start justify-between border-b border-[var(--border)] bg-card px-10 pb-7 pt-8">
          <div><div className="mb-4 flex items-center gap-2 text-[12px] font-medium text-[var(--muted-foreground)]"><span>Sales</span><span className="text-[var(--muted-foreground)">/</span><span className="text-[var(--muted-foreground)]">Settings</span></div><h1 className="text-[28px] font-bold tracking-[-.035em] text-[var(--foreground)]">Sales Settings</h1><p className="mt-1.5 text-[13px] text-[var(--muted-foreground)]">Configure sales processes, forecasting, permissions and automation.</p></div>
          <div className="flex items-center gap-2 pt-7"><button onClick={save} className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-[12px] font-semibold text-primary-foreground shadow-sm transition hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2">Save Changes</button><button onClick={() => setUnsaved(true)} className="rounded-lg border border-[var(--border)] bg-card px-4 py-2.5 text-[12px] font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2">Reset Changes</button><button onClick={() => setNotice('Lulu is ready to help with Sales settings.')} className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-card px-4 py-2.5 text-[12px] font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2"><Sparkles size={14} className="text-[var(--foreground)]" /> Ask Lulu AI</button></div>
        </header>
        <div className="flex items-start gap-8 px-10 py-6">
          <aside className="w-[205px] shrink-0" aria-label="Sales settings sections"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Sales settings</p><nav className="space-y-0.5">{settingNav.map(({
              label,
              icon: Icon
            }) => <button key={label} onClick={() => setActiveSetting(label)} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[12px] font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--border)] ${activeSetting === label ? 'bg-[var(--primary)] font-semibold text-primary-foreground shadow-sm' : 'text-[var(--primary-foreground)] hover:bg-card hover:text-[var(--primary-foreground)]'}`}><Icon size={15} strokeWidth={activeSetting === label ? 2.3 : 1.8} /><span>{label}</span></button>)}</nav></aside>
          <section className="min-w-0 flex-1 pb-12">
            {unsaved ? <div className="mb-5 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[12px] text-[var(--foreground)]"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" /><span><strong className="font-semibold">You have unsaved changes.</strong> Review and save when you’re ready.</span></div><div className="flex items-center gap-3"><button onClick={save} className="font-bold text-[var(--foreground)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--border)]">Save Changes</button><button onClick={discard} className="font-semibold text-[var(--foreground)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--border)]">Discard</button></div></div> : null}
            {notice ? <div role="status" className="mb-5 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-4 py-3 text-[12px] font-medium text-[var(--foreground)]">{notice}</div> : null}
            {activeSetting !== 'General' ? <div className="mb-5 rounded-xl border border-[var(--border)] bg-card p-8"><h2 className="text-[17px] font-bold text-[var(--foreground)]">{activeSetting}</h2><p className="mt-2 text-[13px] text-[var(--muted-foreground)]">Configure your {activeSetting.toLowerCase()} settings here.</p><div className="mt-6 rounded-lg border border-dashed border-[var(--border)] bg-[var(--card)] p-5 text-[12px] text-[var(--muted-foreground)]">No {activeSetting.toLowerCase()} configured — Create your first sales {activeSetting.toLowerCase()} to begin managing opportunities and deals.</div></div> : null}
            {activeSetting === 'General' ? <div className="space-y-5">
              <article className="rounded-xl border border-[var(--border)] bg-card p-6 shadow-[0_1px_2px_rgba(0,0,0,.02)]"><div className="mb-6 flex items-start justify-between"><div><h2 className="text-[17px] font-bold text-[var(--foreground)]">General Sales Settings</h2><p className="mt-1 text-[12px] text-[var(--muted-foreground)]">Set the defaults for your Sales workspace.</p></div><span className="rounded-md bg-[var(--secondary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-[var(--foreground)]">Core</span></div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-5">{[['Sales Module Name', 'Sales', 'text'], ['Default Currency', 'USD — US Dollar', 'select'], ['Default Time Zone', 'UTC-5 Eastern Time', 'select'], ['Default Language', 'English (US)', 'select'], ['Default Date Format', 'MM/DD/YYYY', 'select'], ['Default Number Format', '1,234.56', 'select']].map(([label, value, kind]) => <label key={label} className="block"><span className="mb-2 block text-[12px] font-semibold text-[var(--muted-foreground)]">{label}</span><div className="relative"><input aria-label={label} defaultValue={value} onChange={() => setUnsaved(true)} className="h-10 w-full rounded-lg border border-[var(--border)] bg-card px-3 text-[13px] font-medium text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]" />{kind === 'select' ? <ChevronDown size={15} className="pointer-events-none absolute right-3 top-3 text-[var(--muted-foreground)]" /> : null}</div></label>)}</div>
                <div className="my-6 h-px bg-[var(--secondary)]" /><div><h3 className="mb-1 text-[13px] font-bold text-[var(--muted-foreground)]">Sales capabilities</h3><p className="mb-1 text-[12px] text-[var(--muted-foreground)]">Control which features are available to your team.</p><div className="grid grid-cols-2 gap-x-12">{[['module', 'Enable Sales Module'], ['ai', 'Enable AI Sales Assistance'], ['notifications', 'Enable Sales Notifications'], ['tracking', 'Enable Sales Activity Tracking']].map(([key, label]) => <Toggle key={key} label={label} enabled={toggles[key as keyof typeof toggles]} onToggle={() => setToggle(key as keyof typeof toggles)} />)}</div></div>
              </article>
              <article className="rounded-xl border border-[var(--border)] bg-card p-6 opacity-[.88]"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[17px] font-bold text-[var(--foreground)]">Sales Pipelines</h2><p className="mt-1 text-[12px] text-[var(--muted-foreground)]">Manage the paths your opportunities follow.</p></div><button className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-[11px] font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><Plus size={14} /> Create Pipeline</button></div><div className="overflow-hidden rounded-lg border border-[var(--border)]"><table className="w-full text-left"><thead className="bg-[var(--card)] text-[10px] font-bold uppercase tracking-[.07em] text-[var(--muted-foreground)]"><tr><th className="px-4 py-3">Pipeline Name</th><th className="px-4 py-3">Description</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Default</th><th className="px-3 py-3">Currency</th><th className="px-3 py-3">Stages</th><th className="px-3 py-3">Actions</th></tr></thead><tbody className="divide-y divide-[var(--background)]">{pipelines.map(pipeline => <tr key={pipeline.name} className="text-[11px] text-[var(--muted-foreground)] transition hover:bg-[var(--card)]"><td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[var(--foreground)]">{pipeline.name}</td><td className="px-4 py-3.5 text-[var(--muted-foreground)]">{pipeline.description}</td><td className="px-3 py-3.5"><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-semibold text-[var(--chart-4)]">Active</span></td><td className="px-3 py-3.5">{pipeline.default ? <span className="flex items-center gap-1 font-semibold text-[var(--foreground)]"><Check size={13} /> Default</span> : '—'}</td><td className="px-3 py-3.5">USD</td><td className="px-3 py-3.5">{pipeline.stages}</td><td className="px-3 py-3.5"><div className="flex items-center gap-2"><button aria-label={`Edit ${pipeline.name}`} className="text-[11px] font-semibold text-[var(--foreground)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><Pencil size={13} /></button><button aria-label={`More actions for ${pipeline.name}`} className="text-[var(--muted-foreground)] hover:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><MoreHorizontal size={15} /></button></div></td></tr>)}</tbody></table></div></article>
              <article className="rounded-xl border border-[var(--border)] bg-card p-6"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-[17px] font-bold text-[var(--foreground)]">Sales Configuration Activity</h2><p className="mt-1 text-[12px] text-[var(--muted-foreground)]">A record of the latest changes made to Sales settings.</p></div><button aria-label="Search activity" className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><Search size={15} /></button></div><div className="mb-4 flex gap-2">{['User', 'Setting', 'Date', 'Action'].map(filter => <button key={filter} className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-card px-3 py-2 text-[11px] font-medium text-[var(--muted-foreground)] hover:bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--border)]"><span>{filter}</span><ChevronDown size={13} /></button>)}</div><div className="overflow-hidden rounded-lg border border-[var(--border)]"><table className="w-full text-left"><thead className="bg-[var(--card)] text-[10px] font-bold uppercase tracking-[.07em] text-[var(--muted-foreground)]"><tr><th className="px-4 py-3">Setting Changed</th><th className="px-4 py-3">Previous Value</th><th className="px-4 py-3">New Value</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Timestamp</th></tr></thead><tbody className="divide-y divide-[var(--background)]">{audits.map(entry => <tr key={`${entry.setting}-${entry.time}`} className="text-[11px] text-[var(--muted-foreground)] transition hover:bg-[var(--card)]"><td className="px-4 py-3.5 font-semibold text-[var(--muted-foreground)]">{entry.setting}</td><td className="px-4 py-3.5">{entry.previous}</td><td className="px-4 py-3.5 font-medium text-[var(--muted-foreground)]">{entry.next}</td><td className="px-4 py-3.5">{entry.user}</td><td className="px-4 py-3.5 text-[var(--muted-foreground)]">{entry.time}</td></tr>)}</tbody></table></div></article>
            </div> : null}
          </section>
        </div>
      </main>
    </div>;
}