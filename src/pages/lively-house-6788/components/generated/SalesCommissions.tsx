import { useMemo, useState } from 'react';
import { BarChart3, Bell, Check, ChevronDown, CircleHelp, Download, Filter, MoreHorizontal, Plus, Search, Send, Sparkles, SlidersHorizontal, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type CommissionStatus = 'Paid' | 'Approved' | 'Under Review' | 'Calculated' | 'Draft' | 'Disputed' | 'Pending';
type BadgeTone = 'blue' | 'green' | 'amber' | 'indigo' | 'gray' | 'red' | 'yellow' | 'purple' | 'teal' | 'dark';
const commissionRows: Array<Record<string, any>> = [];
const kpis: any[][] = [];
const teams: string[][] = [];
const products: any[][] = [];
const months: Array<Record<string, any>> = [];
const statusMeta: Array<[string, BadgeTone]> = [['Draft', 'gray'], ['Calculated', 'indigo'], ['Under Review', 'amber'], ['Approved', 'green'], ['Scheduled', 'teal'], ['Paid', 'blue'], ['Adjusted', 'purple'], ['Disputed', 'red'], ['Cancelled', 'dark']];
const navItems = ['Overview', 'Leads', 'Opportunities', 'Commissions', 'Targets'];
export const SalesCommissions = () => {
  const [period, setPeriod] = useState('Live period');
  const [query, setQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [notice, setNotice] = useState('');
  const { items: commissionRecords, loading: commissionsLoading, error: commissionsError } = useLiveRecords('sales_commissions');
  const getCommissionField = (record: typeof commissionRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const liveCommissionRows = commissionRecords.map(record => {
    const rep = getCommissionField(record, 'rep') || getCommissionField(record, 'representative') || getCommissionField(record, 'name') || 'Commission record';
    return { ...record, rep, initials: rep.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase() || '—', plan: getCommissionField(record, 'plan') || '—', revenue: getCommissionField(record, 'revenue') || '—', rate: getCommissionField(record, 'rate') || '—', earned: getCommissionField(record, 'earned') || '—', adj: getCommissionField(record, 'adjustments') || '—', approved: getCommissionField(record, 'approved') || '—', paid: getCommissionField(record, 'paid') || '—', status: getCommissionField(record, 'status') || 'Recorded', tone: 'slate', period: getCommissionField(record, 'period') || 'Live period' };
  });
  const filteredRows = useMemo(() => liveCommissionRows.filter(row => row.rep.toLowerCase().includes(query.toLowerCase()) || row.plan.toLowerCase().includes(query.toLowerCase())), [liveCommissionRows, query]);
  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  };
  return <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <div className="flex min-h-screen">
        <aside className="hidden w-[240px] shrink-0 flex-col bg-[var(--sidebar)] text-foreground lg:flex">
          <div className="flex h-[72px] items-center gap-3 border-b border-border px-6"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] font-bold text-primary-foreground">L</div><strong className="text-[17px] tracking-[-.02em]">lulu<span className="text-[var(--foreground)]">.ai</span></strong></div>
          <div className="px-4 pt-7"><p className="px-3 text-[10px] font-bold uppercase tracking-[.18em] text-muted-foreground">Workspace</p><LuluSectionNavigation activeId="lively-house-6788" /></div>
          <div className="mt-auto border-t border-border p-4"><button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><CircleHelp size={17} /><span>Help center</span></button><button className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-secondary hover:text-foreground"><div className="grid h-7 w-7 place-items-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--primary-foreground)]">—</div><span className="flex-1 text-left">Workspace member</span><ChevronDown size={15} /></button></div>
        </aside>
        <section className="min-w-0 flex-1">
          <header className="flex min-h-[72px] items-center justify-between border-b border-[var(--border)] bg-card px-5 py-4 md:px-8"><div><div className="text-xs font-medium text-[var(--muted-foreground)]">Sales <span className="px-1.5 text-[var(--muted-foreground)]">/</span> Commissions</div><h1 className="mt-1 text-xl font-bold tracking-[-.03em] text-[var(--foreground)] md:text-2xl">Sales Commissions</h1><p className="mt-1 hidden text-sm text-[var(--muted-foreground)] sm:block">Track, calculate and manage sales commissions with complete transparency.</p></div><div className="flex items-center gap-2"><button aria-label="Notifications" className="hidden rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)] sm:block"><Bell size={18} /></button><button onClick={() => showNotice('Lulu AI is ready to help')} className="hidden items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] md:flex"><Sparkles size={15} className="text-[var(--foreground)]" />Ask Lulu AI</button><button onClick={() => showNotice('Commission plan creator opened')} className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-[var(--primary)] md:px-4"><Plus size={16} /> <span className="hidden sm:inline">Create Commission Plan</span><span className="sm:hidden">Create plan</span></button></div></header>
          <div className="mx-auto max-w-[1600px] space-y-6 p-5 md:p-8">{commissionsError && <div role="alert" className="rounded-lg border border-[var(--chart-5)]/30 bg-[var(--secondary)] px-4 py-3 text-sm text-[var(--chart-5)]">Commission data could not be loaded. Check connected sales records and try again.</div>}{!commissionsLoading && !commissionsError && liveCommissionRows.length === 0 && <></>}
            <section className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-card px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,.03)] lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Commission period</p><p className="mt-1 text-base font-semibold">Selected live period</p></div><div className="flex max-w-full gap-1 overflow-x-auto rounded-lg bg-[var(--secondary)] p-1">{['Current Month', 'Previous Month', 'Current Quarter', 'Previous Quarter', 'Current Year', 'Previous Year', 'Custom Period'].map(item => <button key={item} onClick={() => setPeriod(item)} className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition ${period === item ? 'bg-card text-[var(--foreground)] shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}>{item}</button>)}</div></section>
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">{kpis.map(([label, value, delta, type, tone]) => <article key={label} className="rounded-xl border border-[var(--border)] bg-card p-4 shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex items-start justify-between gap-2"><p className="text-xs font-medium leading-4 text-[var(--muted-foreground)]">{label}</p><span className={`h-2 w-2 shrink-0 rounded-full bg-${tone === 'blue' ? '[var(--primary)]' : tone === 'amber' ? '[var(--chart-1)]' : tone === 'green' ? '[var(--chart-4)]' : tone === 'purple' ? '[var(--primary)]' : tone === 'red' ? '[var(--chart-5)]' : '[var(--primary)]'}`} /></div><p className="mt-3 text-xl font-bold tracking-[-.04em] text-[var(--foreground)]">{value}</p><p className="mt-1 text-[11px] font-semibold text-[var(--chart-4)]">{delta}</p><span className="mt-3 inline-block rounded bg-[var(--secondary)] px-1.5 py-1 text-[10px] font-semibold text-[var(--muted-foreground)]">{type}</span></article>)}</section>
            <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-card shadow-[0_2px_8px_rgba(0,0,0,.03)]"><div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-lg font-bold tracking-[-.025em]">Commission workspace</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)]">Calculated</span></div><p className="mt-1 text-sm text-[var(--muted-foreground)]">Review every earning, adjustment and payment in one place.</p></div><div className="flex flex-wrap gap-2"><button onClick={() => showNotice('Commission calculation requested for the selected live period')} className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:bg-[var(--secondary)]">Calculate Commissions</button><button onClick={() => showNotice('Export prepared')} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"><Download size={14} />Export</button><button className="rounded-lg border border-[var(--border)] p-2 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]" aria-label="More actions"><MoreHorizontal size={17} /></button></div></div><div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 lg:flex-row"><div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search commissions..." className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] pl-9 pr-3 text-sm outline-none ring-[var(--border)] focus:ring-2" /></div><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)]"><Filter size={14} />Status <ChevronDown size={13} /></button>{['Commission Plan', 'Sales Representative', 'Team', 'Period', 'Revenue Range', 'Commission Amount'].map(filter => <button key={filter} className="hidden rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--muted-foreground)] md:flex md:items-center md:gap-1">{filter}<ChevronDown size={12} /></button>)}<button onClick={() => setQuery('')} className="rounded-lg px-2 py-2 text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)]">Clear Filters</button><button onClick={() => showNotice('Filter saved')} className="hidden rounded-lg bg-[var(--secondary)] px-3 py-2 text-xs font-bold text-[var(--foreground)] sm:block">Save Filter</button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-[.07em] text-[var(--muted-foreground)]"><tr>{['Sales Representative', 'Commission Plan', 'Eligible Revenue', 'Commission Rate', 'Earned Commission', 'Adjustments', 'Approved', 'Paid', 'Status', 'Period', 'Actions'].map(head => <th key={head} className="px-4 py-3 font-bold">{head}</th>)}</tr></thead><tbody className="divide-y divide-[var(--background)]">{filteredRows.map(row => <tr key={row.rep} className="hover:bg-[var(--card)]"><td className="px-4 py-3"><div className="flex items-center gap-2.5"><span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--secondary)] text-[10px] font-bold text-[var(--foreground)]">{row.initials}</span><strong className="font-semibold text-[var(--foreground)]">{row.rep}</strong></div></td><td className="px-4 py-3 text-[var(--muted-foreground)]">{row.plan}</td><td className="px-4 py-3 font-semibold">{row.revenue}</td><td className="px-4 py-3 text-[var(--muted-foreground)]">{row.rate}</td><td className="px-4 py-3 font-semibold">{row.earned}</td><td className={`px-4 py-3 ${row.adj.startsWith('+') ? 'text-[var(--chart-4)]' : row.adj.startsWith('-') ? 'text-[var(--chart-5)]' : 'text-[var(--muted-foreground)]'}`}>{row.adj}</td><td className="px-4 py-3 font-semibold">{row.approved}</td><td className="px-4 py-3 font-semibold">{row.paid}</td><td className="px-4 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-bold ${row.tone === 'blue' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : row.tone === 'green' ? 'bg-[var(--secondary)] text-[var(--chart-4)]' : row.tone === 'amber' ? 'bg-[var(--secondary)] text-[var(--chart-1)]' : row.tone === 'indigo' ? 'bg-[var(--secondary)] text-[var(--foreground)]' : row.tone === 'red' ? 'bg-[var(--secondary)] text-[var(--chart-5)]' : row.tone === 'yellow' ? 'bg-[var(--secondary)] text-[var(--chart-1)]' : 'bg-[var(--secondary)] text-[var(--muted-foreground)]'}`}>{row.status}</span></td><td className="px-4 py-3 text-[var(--muted-foreground)]">{period}</td><td className="px-4 py-3"><button aria-label={`Actions for ${row.rep}`} className="rounded p-1 text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"><MoreHorizontal size={16} /></button></td></tr>)}</tbody></table></div><div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-4 text-xs text-[var(--muted-foreground)]"><span>Showing {filteredRows.length} live commissions</span><div className="flex items-center gap-1"><button className="rounded border border-[var(--border)] px-2 py-1.5">‹</button><button className="rounded bg-[var(--primary)] px-2.5 py-1.5 font-bold text-primary-foreground">1</button><button className="rounded border border-[var(--border)] px-2.5 py-1.5">2</button><button className="rounded border border-[var(--border)] px-2 py-1.5">›</button></div></div></section>
            <section className="grid gap-6 xl:grid-cols-3"><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-bold">Approval Queue</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Commissions requiring review</p></div><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--chart-1)]">Live</span></div><div className="mt-4 space-y-3">{([] as string[][]).map(([rep, amount, status]) => <div key={rep} className="flex items-center justify-between border-b border-[var(--border)] pb-3"><div><p className="text-sm font-semibold">{rep}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{period} · {amount}</p></div><div className="flex gap-1"><button onClick={() => showNotice(`${rep} opened for review`)} className="rounded-md border border-[var(--border)] px-2 py-1.5 text-[10px] font-bold">Review</button><button onClick={() => showNotice(`${rep} approved`)} className="rounded-md bg-[var(--secondary)] px-2 py-1.5 text-[10px] font-bold text-[var(--chart-4)]">Approve</button></div></div>)}</div><span className="mt-4 block text-[10px] text-[var(--muted-foreground)]">Live approval records appear when commission data is available.</span></article><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-bold">Commission Adjustments</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Manual changes and corrections</p></div><button onClick={() => showNotice('Adjustment form opened')} className="flex items-center gap-1 rounded-lg bg-[var(--secondary)] px-3 py-2 text-xs font-bold text-[var(--foreground)]"><Plus size={13} />Add Adjustment</button></div><div className="mt-5 text-xs text-[var(--muted-foreground)]">Live adjustment records appear when commission data is available.</div><span className="mt-5 block text-[10px] text-[var(--muted-foreground)]">Adjustment history appears when live commission data is available.</span></article><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="font-bold">Commission Disputes</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Transparent resolution tracking</p></div><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--chart-5)]">Live</span></div><div className="mt-5 text-xs text-[var(--muted-foreground)]">Live dispute records appear when commission data is available.</div><span className="mt-5 block text-[10px] text-[var(--muted-foreground)]">Dispute history appears when live commission data is available.</span></article></section>
            <section className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><BarChart3 className="text-[var(--foreground)]" size={19} /><h2 className="font-bold">Commission Performance</h2></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">Commission trend for the selected live period</p></div><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">Live</span></div><div className="mt-6 flex h-48 items-end gap-3 border-b border-l border-[var(--border)] px-3 pb-0 pt-5 sm:gap-8">{months.map(item => <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-bold text-[var(--muted-foreground)]">€{item.value}k</span><div style={{
                  height: `${item.value * 1.55}px`
                }} className="w-full max-w-[58px] rounded-t-md bg-[var(--primary)] transition hover:bg-[var(--primary)] text-primary-foreground" /><span className="translate-y-5 text-[10px] text-[var(--muted-foreground)]">{item.month}</span></div>)}</div><div className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5 md:grid-cols-4"></div></section>
            <section className="grid gap-6 xl:grid-cols-2"><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex justify-between"><div><h2 className="font-bold">Commission by Team</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Performance by sales organization</p></div><span className="rounded bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">Calculated</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]"><tr>{['Team', 'Eligible Revenue', 'Commission', 'Avg Commission', 'Reps', 'Pending', 'Paid'].map(x => <th key={x} className="px-2 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-[var(--background)]">{teams.map(team => <tr key={team[0]}>{team.map((cell, cellIndex) => <td key={`${team[0]}-${cellIndex}`} className={`px-2 py-3 ${cellIndex === 0 ? 'font-semibold' : 'text-[var(--muted-foreground)]'}`}>{cell}</td>)}</tr>)}</tbody></table></div></article><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex justify-between"><div><h2 className="font-bold">Commission by Product / Service</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Contribution across offerings</p></div><span className="rounded bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">Calculated</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-xs"><thead className="text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]"><tr>{['Product', 'Eligible Revenue', 'Commission Rate', 'Commission', 'Deals'].map(x => <th key={x} className="px-2 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-[var(--background)]">{products.map(product => <tr key={product[0]}>{product.map((cell, cellIndex) => <td key={`${product[0]}-${cellIndex}`} className={`px-2 py-3 ${cellIndex === 0 ? 'font-semibold' : 'text-[var(--muted-foreground)]'}`}>{cell}</td>)}</tr>)}</tbody></table></div></article></section>
            <section className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Commission History</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Previous periods appear after live commission data is available.</p></div><span className="rounded bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--muted-foreground)]">Live</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="bg-[var(--card)] text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]"><tr>{['Period', 'Representative', 'Eligible Revenue', 'Commission', 'Adjustments', 'Status', 'Payment Date'].map(x => <th key={x} className="px-3 py-3">{x}</th>)}</tr></thead><tbody className="divide-y divide-[var(--background)]">{([] as string[][]).map(row => <tr key={`${row[0]}-${row[1]}`}>{row.map((cell, cellIndex) => <td key={`${row[1]}-${cellIndex}`} className={`px-3 py-3 ${cellIndex === 1 ? 'font-semibold' : 'text-[var(--muted-foreground)]'}`}>{cell}</td>)}</tr>)}</tbody></table></div></section>
            <section className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><Sparkles size={18} className="text-[var(--foreground)]" /><h2 className="font-bold">AI Commission Insights</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)]">AI-generated</span></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">Patterns detected in your commission data</p></div><button aria-label="Dismiss insights" className="text-[var(--muted-foreground)]"><X size={16} /></button></div><div className="mt-5 grid gap-3 md:grid-cols-3">{([] as string[][]).map(([title, text, chip]) => <article key={title} className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4"><Sparkles size={16} className="text-[var(--foreground)]" /><h3 className="mt-3 text-sm font-bold">{title}</h3><p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">{text}</p><span className="mt-3 inline-block rounded-full bg-card px-2 py-1 text-[10px] font-semibold text-[var(--foreground)]">{chip}</span></article>)}</div></section>
            <section className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]"><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-center gap-2"><Sparkles className="text-[var(--foreground)]" size={18} /><h2 className="font-bold">Ask Lulu AI</h2><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)]">AI-generated</span></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">Ask anything about your commission data and policies.</p><div className="mt-4 flex gap-2"><input value={aiQuery} onChange={event => setAiQuery(event.target.value)} onKeyDown={event => {
                  if (event.key === 'Enter') showNotice('Lulu AI is analyzing your question');
                }} placeholder="Ask Lulu AI about commissions..." className="h-10 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 text-sm outline-none focus:ring-2 focus:ring-[var(--border)]" /><button onClick={() => showNotice('Lulu AI is analyzing your question')} aria-label="Send question" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--primary)] text-primary-foreground"><Send size={16} /></button></div><div className="mt-4 flex flex-wrap gap-2">{([] as string[]).map(prompt => <button key={prompt} onClick={() => setAiQuery(prompt)} className="rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]">{prompt}</button>)}</div></article><article className="rounded-xl border border-[var(--border)] bg-card p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-bold">Commission Simulator</h2><p className="mt-1 text-xs text-[var(--muted-foreground)]">Model a plan before it goes live.</p></div><span className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-bold text-[var(--foreground)]">Simulation</span></div><div className="mt-4 grid grid-cols-2 gap-3">{['Commission Plan', 'Revenue', 'Deal Volume', 'Product', 'Sales Representative', 'Customer Type'].map(label => <label key={label} className="text-[11px] font-semibold text-[var(--muted-foreground)]"><span>{label}</span><div className="mt-1 flex h-9 items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs font-normal text-[var(--muted-foreground)]"><span>{label === 'Revenue' || label === 'Deal Volume' ? '—' : 'Select value'}</span>{label !== 'Revenue' && label !== 'Deal Volume' && <ChevronDown size={13} />}</div></label>)}</div><div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[var(--card)] p-3"></div><p className="mt-3 text-[10px] text-[var(--muted-foreground)]">Simulation results appear after live inputs are provided.</p><button onClick={() => showNotice('Simulation completed')} className="mt-4 w-full rounded-lg bg-[var(--primary)] py-2.5 text-xs font-bold text-primary-foreground hover:bg-[var(--primary)]">Run Simulation</button></article></section>
            <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pb-4 pt-2 text-[10px] text-[var(--muted-foreground)]"><span>Data transparency</span>{['Recorded', 'Calculated', 'Configured', 'Simulated', 'AI-generated', 'Unavailable'].map(label => <span key={label} className="rounded bg-card px-2 py-1 font-semibold">{label}</span>)}<span className="ml-auto">Sync status appears after live commission data is available.</span></footer>
          </div>
        </section>
      </div>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-10 flex items-center gap-2 rounded-lg bg-[var(--secondary)] px-4 py-3 text-sm font-semibold text-foreground shadow-xl"><Check size={16} className="text-[var(--foreground)]" />{notice}</div>}
    </main>;
};

/* Lulu dropdown navigation — intentionally isolated from page content. */
const luluDropdownNavigation = [{
  "label": "Dashboard",
  "pages": [{
    "id": "fancily-leaf-1766",
    "label": "Executive Dashboard"
  }]
}, {
  "label": "AI",
  "pages": [{
    "id": "fresh-moon-5374",
    "label": "Assistant"
  }, {
    "id": "radiant-dusk-9079",
    "label": "Agents"
  }, {
    "id": "calmly-park-3313",
    "label": "Agent Marketplace"
  }, {
    "id": "rich-field-1880",
    "label": "Knowledge"
  }, {
    "id": "wondrously-second-5656",
    "label": "Actions"
  }, {
    "id": "sunny-moon-6307",
    "label": "Conversations"
  }, {
    "id": "sparkling-cave-8456",
    "label": "Activity"
  }]
}, {
  "label": "CRM",
  "pages": [{
    "id": "bright-meadow-7537",
    "label": "Overview"
  }, {
    "id": "sturdy-month-1562",
    "label": "Contacts"
  }, {
    "id": "kindly-pool-8785",
    "label": "Companies"
  }, {
    "id": "swift-hour-7844",
    "label": "Leads"
  }, {
    "id": "smartly-shade-4619",
    "label": "Deals"
  }, {
    "id": "calmly-cloud-9988",
    "label": "Pipeline"
  }, {
    "id": "cosmic-pool-1616",
    "label": "Activities"
  }, {
    "id": "deeply-noon-9539",
    "label": "Tasks"
  }, {
    "id": "sunnily-gulf-7520",
    "label": "Customer Segments"
  }, {
    "id": "gracefully-storm-2649",
    "label": "Customer Intelligence"
  }]
}, {
  "label": "Marketing",
  "pages": [{
    "id": "dreamily-soil-9290",
    "label": "Campaigns"
  }, {
    "id": "wondrous-cloud-1355",
    "label": "Content"
  }, {
    "id": "sparklingly-home-7386",
    "label": "Strategy"
  }, {
    "id": "gently-shade-2476",
    "label": "Campaigns"
  }, {
    "id": "kind-time-4492",
    "label": "Keywords"
  }, {
    "id": "smartly-shore-1468",
    "label": "Competitors"
  }, {
    "id": "breezily-wood-5980",
    "label": "Audiences"
  }, {
    "id": "breezy-shore-6734",
    "label": "Analytics"
  }]
}, {
  "label": "Advertising",
  "pages": [{
    "id": "finely-garden-9221",
    "label": "Overview"
  }, {
    "id": "friendly-path-8200",
    "label": "Analytics"
  }, {
    "id": "wise-brook-1762",
    "label": "Campaigns"
  }, {
    "id": "softly-second-7684",
    "label": "Audiences"
  }, {
    "id": "happily-storm-2690",
    "label": "Creatives"
  }, {
    "id": "sunny-minute-1092",
    "label": "Budgets"
  }, {
    "id": "zesty-grass-9196",
    "label": "AI Optimization"
  }, {
    "id": "nicely-shade-2637",
    "label": "Tracking & Attribution"
  }, {
    "id": "nice-moon-2056",
    "label": "AI Campaign & Ad Builder"
  }, {
    "id": "sunnily-peak-7188",
    "label": "Publishing & Approval Center"
  }, {
    "id": "solid-sand-5563",
    "label": "AI Experiments & A/B Testing"
  }, {
    "id": "sunny-summer-2293",
    "label": "Ad Accounts & Platform Management"
  }]
}, {
  "label": "Intelligence",
  "pages": [{
    "id": "serene-cloud-7079",
    "label": "Intelligence Overview"
  }, {
    "id": "tender-water-4095",
    "label": "Executive Overview"
  }, {
    "id": "swiftly-cliff-4166",
    "label": "Business Health"
  }, {
    "id": "sharp-current-9677",
    "label": "Growth"
  }, {
    "id": "proudly-river-8017",
    "label": "Revenue"
  }, {
    "id": "dreamily-shade-6192",
    "label": "Customers"
  }, {
    "id": "nicely-hour-4035",
    "label": "Sales"
  }, {
    "id": "eagerly-winter-3152",
    "label": "Marketing"
  }, {
    "id": "sharply-wood-4560",
    "label": "Advertising Intelligence"
  }, {
    "id": "bold-ocean-5847",
    "label": "Ecommerce Intelligence"
  }, {
    "id": "cozily-path-5612",
    "label": "Finance Intelligence"
  }, {
    "id": "gently-light-6089",
    "label": "Operations Intelligence"
  }, {
    "id": "cool-town-1727",
    "label": "Products Intelligence"
  }, {
    "id": "swift-pool-5077",
    "label": "KPI Explorer"
  }, {
    "id": "friendly-ground-4157",
    "label": "Reports"
  }, {
    "id": "brave-stream-5322",
    "label": "Comparisons"
  }, {
    "id": "sparkling-time-5280",
    "label": "Comparisons"
  }, {
    "id": "wispy-current-7490",
    "label": "Forecasts"
  }, {
    "id": "kindly-year-8981",
    "label": "Benchmarks"
  }, {
    "id": "serenely-creek-1765",
    "label": "Trends"
  }, {
    "id": "sparklingly-light-7230",
    "label": "Anomalies"
  }, {
    "id": "clever-soil-5964",
    "label": "Attribution"
  }, {
    "id": "serenely-week-1771",
    "label": "AI Insights"
  }, {
    "id": "daring-home-4179",
    "label": "AI Recommendations"
  }, {
    "id": "wispy-leaf-3778",
    "label": "AI Tasks"
  }, {
    "id": "happily-brook-7061",
    "label": "Opportunities"
  }, {
    "id": "radiant-cave-9340",
    "label": "Decisions"
  }, {
    "id": "boldly-time-5189",
    "label": "Risk Center"
  }, {
    "id": "proud-rain-4772",
    "label": "Activity Timeline"
  }]
}, {
  "label": "Finance",
  "pages": [{
    "id": "quietly-stone-4158",
    "label": "Overview"
  }, {
    "id": "breezy-soil-2475",
    "label": "Invoices"
  }, {
    "id": "tender-creek-3139",
    "label": "Offers & Quotes"
  }, {
    "id": "cool-rain-6499",
    "label": "Income"
  }, {
    "id": "richly-land-8084",
    "label": "Transactions"
  }, {
    "id": "calm-tide-3752",
    "label": "Payments"
  }, {
    "id": "zesty-earth-3938",
    "label": "Expenses"
  }, {
    "id": "bravely-bay-4544",
    "label": "Customers"
  }, {
    "id": "eager-minute-1586",
    "label": "Vendors"
  }, {
    "id": "fair-bridge-8618",
    "label": "Accounts"
  }, {
    "id": "soft-town-3284",
    "label": "Cash Flow"
  }, {
    "id": "wisely-gate-3183",
    "label": "Budgets"
  }, {
    "id": "sharp-morning-7310",
    "label": "Financial Planning"
  }, {
    "id": "sparklingly-city-3338",
    "label": "Reconciliation"
  }, {
    "id": "radiant-hour-5376",
    "label": "Recurring Revenue"
  }, {
    "id": "lucky-park-8649",
    "label": "Payouts"
  }, {
    "id": "vibrantly-second-9428",
    "label": "Financial Automation"
  }, {
    "id": "sturdy-week-3372",
    "label": "Taxes"
  }, {
    "id": "boldly-field-4971",
    "label": "Finance Settings"
  }]
}, {
  "label": "Sales",
  "pages": [{
    "id": "fine-park-8079",
    "label": "Overview"
  }, {
    "id": "softly-autumn-9038",
    "label": "Leads"
  }, {
    "id": "wildly-sun-6424",
    "label": "Opportunities"
  }, {
    "id": "deeply-month-1392",
    "label": "Deals"
  }, {
    "id": "sweet-evening-7753",
    "label": "Pipeline"
  }, {
    "id": "warmly-road-3804",
    "label": "Activities"
  }, {
    "id": "wondrously-gate-2200",
    "label": "Tasks"
  }, {
    "id": "sharp-cliff-6925",
    "label": "Customer Segments"
  }, {
    "id": "lovingly-shore-4782",
    "label": "Forecast"
  }, {
    "id": "rich-moon-9195",
    "label": "Reports"
  }, {
    "id": "lively-house-6788",
    "label": "Commissions"
  }, {
    "id": "gentle-cliff-7133",
    "label": "Goals"
  }, {
    "id": "kindly-morning-7115",
    "label": "Territories"
  }, {
    "id": "friendly-tower-1528",
    "label": "Lead Assignment"
  }]
}, {
  "label": "Website & Commerce",
  "pages": [{
    "id": "lulu-website-portal-9012",
    "label": "Website"
  }, {
    "id": "website-wordpress-jetpack-9013",
    "label": "WordPress / Jetpack"
  }, {
    "id": "website-webflow-9014",
    "label": "Webflow"
  }, {
    "id": "website-pages-cms-9015",
    "label": "Pages & CMS"
  }, {
    "id": "website-posts-9016",
    "label": "Posts"
  }, {
    "id": "website-media-assets-9017",
    "label": "Media & Assets"
  }, {
    "id": "website-domains-9018",
    "label": "Domains"
  }, {
    "id": "sparklingly-moon-5114",
    "label": "SEO"
  }, {
    "id": "zealously-path-4224",
    "label": "GEO"
  }, {
    "id": "sunny-house-9595",
    "label": "AEO"
  }, {
    "id": "daring-brook-9034",
    "label": "Reviews"
  }, {
    "id": "smart-ocean-3898",
    "label": "Overview"
  }, {
    "id": "nice-year-6253",
    "label": "Stores"
  }, {
    "id": "nicely-ocean-1051",
    "label": "Products"
  }, {
    "id": "richly-forest-5832",
    "label": "Categories"
  }, {
    "id": "mightily-shore-7108",
    "label": "Orders"
  }, {
    "id": "fancy-ground-8040",
    "label": "Customers"
  }, {
    "id": "serenely-sand-9226",
    "label": "Carts"
  }, {
    "id": "smart-village-1099",
    "label": "Inventory"
  }, {
    "id": "dreamy-shade-5445",
    "label": "Returns & Refunds"
  }, {
    "id": "sharply-sky-4161",
    "label": "Discounts & Promotions"
  }, {
    "id": "wildly-time-4260",
    "label": "Carts & Abandoned Carts"
  }, {
    "id": "quietly-moon-4186",
    "label": "Shipping"
  }, {
    "id": "merry-castle-3260",
    "label": "Payments"
  }, {
    "id": "merry-cliff-8846",
    "label": "Coupons"
  }, {
    "id": "safely-dawn-7731",
    "label": "Subscriptions"
  }, {
    "id": "purely-dusk-2409",
    "label": "Shipping & Fulfillment"
  }, {
    "id": "soft-hill-4757",
    "label": "Taxes"
  }, {
    "id": "safely-air-9334",
    "label": "Collections"
  }, {
    "id": "merry-land-6169",
    "label": "Store Performance"
  }]
}, {
  "label": "Settings",
  "pages": [{
    "id": "nicely-land-1864",
    "label": "Settings"
  }, {
    "id": "glad-coast-1428",
    "label": "Integrations"
  }, {
    "id": "pure-minute-5446",
    "label": "Billing"
  }]
}] as const;
function LuluSectionNavigation({
  activeId
}: {
  activeId: string;
}) {
  return <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Lulu AI sections">
    {luluDropdownNavigation.map(section => {
      const isActiveSection = section.pages.some(page => page.id === activeId);
      return <details key={section.label} open={isActiveSection} className="group rounded-lg">
        <summary className={`flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2.5 text-sm transition [&::-webkit-details-marker]:hidden ${isActiveSection ? 'bg-secondary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
          <span data-lulu-section-soon={section.label !== "Website & Commerce" && section.label !== "Settings" ? "true" : undefined}>{section.label}</span>
          <span aria-hidden="true" className="text-xs transition-transform group-open:rotate-180">⌄</span>
        </summary>
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2 pb-1">
          {section.pages.map(page => {
            const isActivePage = page.id === activeId;
            return <a key={page.id} {...pageLinkProps(page.id)} aria-current={isActivePage ? 'page' : undefined} className={`block rounded-md px-3 py-2 text-xs transition ${isActivePage ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              {page.label}
              {!pageLinkProps(page.id)["data-lulu-soon"] ? null : null}
            </a>;
          })}
        </div>
      </details>;
    })}
  </nav>;
}
import { pageLinkProps } from '../../../../routing';
