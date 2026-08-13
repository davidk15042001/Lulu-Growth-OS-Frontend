import { useState } from 'react';
import { AlertCircle, Check, ChevronDown, CircleHelp, Ellipsis, Info, LockKeyhole, RotateCcw, Save, Search, Sparkles, X } from 'lucide-react';
const navGroups = [{
  label: 'General',
  items: ['General', 'Currencies', 'Fiscal Year', 'Financial Periods']
}, {
  label: 'Documents',
  items: ['Invoice Settings', 'Offer / Quote Settings', 'Numbering']
}, {
  label: 'Taxes',
  items: ['Tax Settings', 'Tax Defaults']
}, {
  label: 'Payments',
  items: ['Payment Terms', 'Payment Settings']
}, {
  label: 'Accounts',
  items: ['Account Defaults', 'Categories']
}, {
  label: 'Workflows',
  items: ['Approval Workflows', 'Reconciliation', 'Financial Automation']
}, {
  label: 'Notifications',
  items: ['Finance Notifications']
}, {
  label: 'Permissions',
  items: ['Finance Permissions']
}, {
  label: 'Data',
  items: ['Data Synchronization', 'Data Retention']
}, {
  label: 'Reporting',
  items: ['Financial Reporting']
}, {
  label: 'Security',
  items: ['Audit & Activity']
}];
const fields = [{
  label: 'Default Currency',
  value: 'USD — US Dollar',
  description: 'Used for your primary financial reporting.'
}, {
  label: 'Default Country',
  value: 'United States',
  description: 'Determines regional defaults and tax behavior.'
}, {
  label: 'Default Business Entity',
  value: 'Lulu AI Inc.',
  description: 'The entity used on new financial documents.'
}, {
  label: 'Default Financial Account',
  value: 'Primary Operating Account',
  description: 'Account used for default transaction categorization.'
}, {
  label: 'Default Language for Financial Documents',
  value: 'English (US)',
  description: 'Language applied to generated documents.'
}, {
  label: 'Date Format',
  value: 'MM/DD/YYYY',
  description: 'How dates appear throughout Finance.'
}, {
  label: 'Number Format',
  value: '1,234,567.89',
  description: 'How currencies and amounts are displayed.'
}, {
  label: 'Decimal Precision',
  value: '2 decimal places',
  description: 'Precision used for financial calculations.'
}];
const prompts = ['What finance settings should I review?', 'Which settings are currently incomplete?', 'Are there configuration issues?'];
export const LuluFinanceSettings = () => {
  const [active, setActive] = useState('General');
  const [hasChanges, setHasChanges] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [ask, setAsk] = useState('');
  const [notice, setNotice] = useState('');
  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  };
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 overflow-y-auto border-r border-[var(--border)] bg-card px-4 py-6 lg:block" aria-label="Finance settings navigation">
          <div className="mb-7 flex items-center gap-2.5 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--primary)] text-sm font-bold text-primary-foreground">L</div>
            <div><p className="text-[14px] font-bold tracking-[-0.02em] text-[var(--foreground)]">Lulu AI</p><p className="text-[11px] text-[var(--muted-foreground)]">Finance workspace</p></div>
          </div>
          <div className="mb-5 flex items-center gap-2 border-b border-[var(--border)] px-2 pb-4 text-[12px] text-[var(--muted-foreground)]"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary)] text-[var(--foreground)]">$</span><span>Finance</span><ChevronDown className="ml-auto h-3.5 w-3.5" /></div>
          <nav className="space-y-5">
            {navGroups.map(group => <section key={group.label} aria-labelledby={`group-${group.label}`}>
                <h2 id={`group-${group.label}`} className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">{group.label}</h2>
                <ul className="space-y-0.5">
                  {group.items.map(item => <li key={item}><button type="button" onClick={() => {
                  setActive(item);
                  if (item !== 'General') announce(`${item} is ready to configure`);
                }} className={`flex h-8 w-full items-center rounded-md px-2.5 text-left text-[12px] transition-colors ${active === item ? 'bg-[var(--primary)] font-semibold text-primary-foreground shadow-sm' : 'text-[var(--primary-foreground)] hover:bg-[var(--card)] hover:text-[var(--primary-foreground)]'}`} aria-current={active === item ? 'page' : undefined}>{item}</button></li>)}
                </ul>
              </section>)}
          </nav>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b border-[var(--border)] bg-card px-5 py-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-[1240px]">
              <div className="mb-5 flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]"><span>Finance</span><span className="text-[var(--muted-foreground)]">/</span><strong className="font-medium text-[var(--muted-foreground)]">Finance Settings</strong></div>
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div><div className="mb-2 flex items-center gap-2"><h1 className="text-[26px] font-bold tracking-[-0.04em] text-[var(--foreground)]">Finance Settings</h1><span className="rounded-full border border-[var(--border)] bg-[var(--card)] px-2 py-0.5 text-[10px] font-semibold text-[var(--foreground)]">ADMIN</span></div><p className="text-[14px] text-[var(--muted-foreground)]">Configure financial preferences, workflows, documents, permissions and data behavior.</p></div>
                <div className="flex flex-wrap items-center gap-2.5"><div className="mr-1 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-[12px] font-medium text-[var(--foreground)]" aria-label={hasChanges ? 'Unsaved changes' : 'Changes saved'}><span className="h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Unsaved changes</div><button type="button" onClick={() => {
                  setHasChanges(false);
                  announce('Changes saved successfully');
                }} className="flex h-9 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-[12px] font-semibold text-primary-foreground shadow-sm transition hover:bg-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border)] focus:ring-offset-2"><Save className="h-3.5 w-3.5" />Save Changes</button><button type="button" onClick={() => {
                  setHasChanges(true);
                  announce('Changes reset');
                }} className="flex h-9 items-center gap-2 rounded-md border border-[var(--border)] bg-card px-3.5 text-[12px] font-semibold text-[var(--muted-foreground)] transition hover:bg-[var(--card)]"><RotateCcw className="h-3.5 w-3.5" />Reset Changes</button><div className="relative"><button type="button" onClick={() => setShowMore(!showMore)} aria-label="More actions" className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--card)]"><Ellipsis className="h-4 w-4" /></button>{showMore && <div className="absolute right-0 top-11 z-10 w-40 rounded-lg border border-[var(--border)] bg-card p-1.5 text-[12px] shadow-lg"><button type="button" className="w-full rounded px-2.5 py-2 text-left text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" onClick={() => announce('Activity log opened')}>View activity log</button><button type="button" className="w-full rounded px-2.5 py-2 text-left text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" onClick={() => announce('Settings export prepared')}>Export settings</button></div>}</div></div>
              </div>
            </div>
          </header>

          <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-7 sm:px-8 lg:flex-row lg:px-10">
            <div className="w-full shrink-0 lg:w-[188px]"><div className="mb-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--muted-foreground)] lg:hidden">Settings sections</div><div className="flex gap-1 overflow-x-auto pb-1 lg:hidden">{navGroups[0].items.map(item => <button key={item} type="button" onClick={() => setActive(item)} className={`whitespace-nowrap rounded-md px-3 py-2 text-xs ${active === item ? 'bg-[var(--primary)] text-primary-foreground' : 'bg-card text-[var(--primary-foreground)]'}`}>{item}</button>)}</div><div className="sticky top-6 hidden lg:block"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[var(--muted-foreground)]">Selected section</p><div className="rounded-lg border border-[var(--border)] bg-card p-3"><p className="text-[13px] font-semibold text-[var(--foreground)]">{active}</p><p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">Manage how your finance workspace behaves.</p></div></div></div>

            <div className="min-w-0 flex-1 space-y-5">
              <article className="rounded-lg border border-[var(--border)] bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]"><div className="border-b border-[var(--border)] px-6 py-5"><h2 className="text-[16px] font-semibold text-[var(--foreground)]">General Finance Settings</h2><p className="mt-1 text-[12px] text-[var(--muted-foreground)]">Configure base financial preferences for your organization.</p></div><div className="px-6 py-2">{fields.map((field, index) => <div key={field.label} className={`grid grid-cols-1 gap-2 py-3.5 sm:grid-cols-[minmax(230px,0.8fr)_minmax(260px,1.2fr)] sm:items-center ${index !== fields.length - 1 ? 'border-b border-[var(--border)]' : ''}`}><div><label htmlFor={`field-${index}`} className="block text-[13px] font-medium text-[var(--muted-foreground)]">{field.label}</label><p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">{field.description}</p></div><div className="relative"><select id={`field-${index}`} defaultValue={field.value} onChange={() => setHasChanges(true)} className="h-10 w-full appearance-none rounded-md border border-[var(--border)] bg-card px-3 text-[13px] text-[var(--muted-foreground)] outline-none transition focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]"><option>{field.value}</option><option>Not configured</option><option>Use organization default</option></select>{index === 0 && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">🇺🇸</span>}{index === 0 ? <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 text-[13px] text-[var(--muted-foreground)]">{field.value}</span> : null}<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" /></div></div>)}</div><div className="mx-6 border-t border-[var(--border)] py-4"><div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-[var(--muted-foreground)]"><span className="mr-1 font-semibold text-[var(--muted-foreground)]">Data transparency</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Configured</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-sm border border-[var(--border)] bg-card" />Default</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--primary)] text-primary-foreground" />Inherited</span><span><span className="mr-1.5 text-[var(--foreground)]">✦</span>AI Insight</span></div></div></article>

              <section className="grid gap-5 xl:grid-cols-[1fr_1.05fr]">
                <article className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-5"><div className="mb-4 flex items-start justify-between"><div><div className="mb-1 flex items-center gap-2"><Sparkles className="h-4 w-4 text-[var(--foreground)]" /><h2 className="text-[15px] font-semibold text-[var(--foreground)]">Ask Lulu AI</h2></div><p className="text-[12px] leading-5 text-[var(--muted-foreground)]">Get a little help understanding your finance configuration.</p></div><CircleHelp className="h-4 w-4 text-[var(--foreground)]" /></div><div className="relative"><input value={ask} onChange={event => setAsk(event.target.value)} onKeyDown={event => {
                    if (event.key === 'Enter' && ask.trim()) announce('Lulu AI is reviewing your settings');
                  }} placeholder="Ask Lulu AI about Finance Settings..." className="h-10 w-full rounded-md border border-[var(--border)] bg-card pl-3 pr-9 text-[12px] text-[var(--muted-foreground)] outline-none placeholder:text-[var(--muted-foreground)] focus:border-[var(--border)] focus:ring-2 focus:ring-[var(--border)]" /><Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" /></div><div className="mt-3 flex flex-wrap gap-2">{prompts.map(prompt => <button key={prompt} type="button" onClick={() => setAsk(prompt)} className="rounded-full border border-[var(--border)] bg-card px-2.5 py-1.5 text-left text-[11px] text-[var(--foreground)] transition hover:border-[var(--border)] hover:text-[var(--foreground)]">{prompt}</button>)}</div></article>
                <article className="rounded-lg border border-[var(--border)] bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)]"><div className="border-b border-[var(--border)] px-5 py-4"><div className="flex items-center gap-2"><h2 className="text-[15px] font-semibold text-[var(--foreground)]">Configuration Warnings</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--chart-1)]">2 items</span></div><p className="mt-1 text-[12px] text-[var(--muted-foreground)]">A few things may need your attention.</p></div><div className="divide-y divide-[var(--foreground)]"><div className="flex gap-3 border-l-[3px] border-[var(--chart-1)] px-5 py-3.5"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--chart-1)]"><Info className="h-3 w-3" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[var(--chart-1)]">Warning</span><strong className="text-[12px] font-semibold text-[var(--muted-foreground)]">Approval workflow</strong></div><p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">No approval workflow configured for high-value expenses</p></div><button type="button" onClick={() => announce('Approval workflow opened')} className="self-center text-[11px] font-semibold text-[var(--foreground)] hover:underline">Configure</button></div><div className="flex gap-3 border-l-[3px] border-[var(--chart-5)] px-5 py-3.5"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--chart-5)]"><AlertCircle className="h-3 w-3" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded bg-[var(--secondary)] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[var(--chart-5)]">Alert</span><strong className="text-[12px] font-semibold text-[var(--muted-foreground)]">Financial source sync</strong></div><p className="mt-1 text-[11px] leading-4 text-[var(--muted-foreground)]">A connected financial source has not synchronized recently</p></div><button type="button" onClick={() => announce('Data synchronization opened')} className="self-center text-[11px] font-semibold text-[var(--foreground)] hover:underline">Review</button></div></div></article>
              </section>
              <footer className="flex items-center justify-between border-t border-[var(--border)] py-4 text-[11px] text-[var(--muted-foreground)]"><span className="flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5" />Only authorized finance admins can edit these settings.</span><span>Last updated today at 09:42 AM</span></footer>
            </div>
          </div>
        </section>
      </div>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-4 py-3 text-[12px] font-medium text-foreground shadow-xl"><Check className="h-4 w-4 text-[var(--foreground)]" />{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><X className="h-3.5 w-3.5 text-[var(--muted-foreground)]" /></button></div>}
    </main>;
};