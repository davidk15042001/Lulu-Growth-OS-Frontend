import { useState } from 'react';
import { Activity, ArrowRight, BarChart3, Bot, Check, ChevronDown, CircleDollarSign, CreditCard, FileText, Gauge, LayoutDashboard, LineChart, LockKeyhole, MessageCircle, Package, Receipt, Settings, ShieldCheck, Sparkles, Users, WalletCards, Zap } from 'lucide-react';
import { BillingTabPanels } from './BillingTabPanels';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type Tab = {
  id: string;
  label: string;
};
type Invoice = {
  id: string;
  date: string;
  amount: string;
};
type Insight = {
  icon: typeof BarChart3;
  title: string;
  detail: string;
};
const tabs: Tab[] = [{
  id: 'overview',
  label: 'Overview'
}, {
  id: 'current-plan',
  label: 'Current Plan'
}, {
  id: 'plans',
  label: 'Plans'
}, {
  id: 'usage',
  label: 'Usage'
}, {
  id: 'ai-usage',
  label: 'AI Usage'
}, {
  id: 'credits',
  label: 'Credits'
}, {
  id: 'add-ons',
  label: 'Add-ons'
}, {
  id: 'payments',
  label: 'Payments'
}, {
  id: 'invoices',
  label: 'Invoices'
}, {
  id: 'transactions',
  label: 'Transactions'
}, {
  id: 'subscription',
  label: 'Subscription'
}, {
  id: 'settings',
  label: 'Settings'
}];
const invoices: Invoice[] = [];
const insights: Insight[] = [];
const currentPlanUsage: Array<Record<string, any>> = [];
const entitlementPills: Array<Record<string, any>> = [];
type FeatureGroup = { id: string; label: string; items: Array<{ id: string; label: string; included: boolean; detail?: string }> };
const featureGroups: FeatureGroup[] = [];
const activeAddOns: Array<Record<string, any>> = [];
const renewalLines: Array<Record<string, any>> = [];
const comparisonPlans: Array<{ id: string; name: string; price: string; cadence?: string; current?: boolean; features: string[]; action?: string }> = [];
const billingActivity: Array<Record<string, any>> = [];
const navItems = [{
  label: 'Overview',
  icon: LayoutDashboard
}, {
  label: 'Workspace',
  icon: Package
}, {
  label: 'AI Operations',
  icon: Bot
}, {
  label: 'Analytics',
  icon: LineChart
}, {
  label: 'Team',
  icon: Users
}, {
  label: 'Billing',
  icon: CreditCard
}];
function StatusPill({
  label,
  status,
  tone
}: {
  label: string;
  status: string;
  tone: 'green' | 'blue' | 'amber';
}) {
  const dot = tone === 'green' ? 'bg-chart-4' : tone === 'blue' ? 'bg-primary' : 'bg-primary';
  return <div className="flex items-center gap-2 rounded-full border border-[var(--muted-foreground)] bg-[var(--secondary)] px-3 py-1.5 text-xs text-muted-foreground"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} /><span>{label}</span><strong className="font-medium text-foreground">{status}</strong></div>;
}
function ProgressLine({
  label,
  value,
  amount,
  percent,
  warning = false
}: {
  label: string;
  value: string;
  amount: string;
  percent: number;
  warning?: boolean;
}) {
  const color = percent > 90 ? 'bg-destructive' : warning || percent >= 70 ? 'bg-chart-1' : 'bg-primary';
  return <div className="space-y-2"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{label}</span><span className="text-foreground">{value} <span className="text-muted-foreground">/ {amount}</span></span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]"><div className={`h-full rounded-full ${color}`} style={{
        width: `${percent}%`
      }} /></div></div>;
}
export function LuluBilling() {
  const [activeTab, setActiveTab] = useState('plans');
  const [assistantOpen, setAssistantOpen] = useState(false);
  const { items: invoiceRecords, loading: invoicesLoading, error: invoicesError } = useLiveRecords('finance_invoices');
  const { items: paymentRecords, loading: paymentsLoading, error: paymentsError } = useLiveRecords('finance_payments');
  const billingLoading = invoicesLoading || paymentsLoading;
  const billingError = invoicesError || paymentsError;
  const liveInvoices: Invoice[] = invoiceRecords.map(record => ({ id: record.name || record.id, date: record.updatedAt || '—', amount: record.valueAmount || '—' }));
  const liveBillingActivity = paymentRecords.map(record => ({ id: record.id, date: record.updatedAt || '—', event: record.status ? `Payment ${record.status}` : 'Payment recorded', amount: record.valueAmount || '—', status: record.status || 'Recorded' }));
  return <main className="min-h-screen bg-[var(--background)] text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-[228px] border-r border-[var(--muted-foreground)] bg-[var(--sidebar)] px-4 py-5 lg:block">
        <div className="mb-10 flex items-center gap-3 px-2"><img src="/branding/lulu-intelligence-logo.png" alt="Lulu AI" className="h-8 w-8 shrink-0 object-contain" translate="no" /><span className="text-[15px] font-semibold tracking-tight text-foreground" translate="no">Lulu AI</span></div>
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
        <LuluSectionNavigation activeId="pure-minute-5446" />
        <div className="mt-auto absolute bottom-5 left-4 right-4 space-y-1"><button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground hover:text-foreground"><Settings size={16} /><span>Settings</span></button><div className="mt-4 flex items-center gap-3 border-t border-[var(--muted-foreground)] px-2 pt-4"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--secondary)] text-xs font-semibold text-foreground">AS</div><div className="min-w-0"><p className="truncate text-xs font-medium text-foreground">Workspace billing</p><p className="truncate text-[11px] text-muted-foreground">Billing administrator</p></div><ChevronDown size={14} className="ml-auto text-muted-foreground" /></div></div>
      </aside>

      <section className="lg:ml-[228px]">{billingError && <div role="alert" className="mx-5 mt-4 rounded-lg border border-chart-5/30 bg-chart-5/10 px-4 py-3 text-sm text-chart-5 sm:mx-8 lg:mx-10">Billing data could not be loaded. Check invoices and payments, then try again.</div>}{!billingLoading && !billingError && liveInvoices.length === 0 && liveBillingActivity.length === 0 && <></>}
        <header className="flex flex-col gap-5 border-b border-[var(--muted-foreground)] px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10"><div><div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"><span>Workspace</span><span>/</span><span className="text-muted-foreground">Billing</span></div><h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]">Billing</h1><p className="mt-1 text-sm text-muted-foreground">Manage your subscription, usage, payments and billing.</p></div><div className="flex items-center gap-3"><button type="button" className="rounded-lg border border-[var(--muted-foreground)] px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-border/60 hover:text-foreground">Manage Subscription</button><button type="button" className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-[0_0_18px_rgba(0,0,0,0.18)] transition hover:bg-primary">Upgrade Plan <ArrowRight size={15} /></button></div></header>

        <div className="border-b border-[var(--muted-foreground)] px-5 sm:px-8 lg:px-10"><div className="flex gap-1 overflow-x-auto py-3 [scrollbar-width:none]">{tabs.map(tab => <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`shrink-0 border-b-2 px-3 py-2 text-xs font-medium transition ${activeTab === tab.id ? 'border-border text-foreground' : 'border-transparent text-foreground hover:text-foreground'}`}>{tab.label}</button>)}</div></div>

        {activeTab === 'current-plan' && <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Current Plan</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Your active subscription details, included features, limits and renewal information.</p></div><div className="flex flex-col gap-2 sm:flex-row"><button type="button" className="rounded-lg border border-[var(--muted-foreground)] px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-border/60 hover:text-foreground">Manage Plan</button><button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_0_18px_rgba(0,0,0,0.18)] transition hover:bg-primary">Upgrade Plan <ArrowRight size={15} /></button></div></div>

          <article className="rounded-2xl border border-[var(--muted-foreground)] border-l-4 border-l-border bg-[var(--card)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-6"><div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between"><div className="max-w-3xl"><div className="flex flex-wrap items-center gap-3"><p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Active subscription</p><span className="flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2.5 py-1 text-[11px] font-semibold text-chart-4"><Check size={12} /><span className="h-1.5 w-1.5 rounded-full bg-chart-4" /><span>Active</span></span></div><h3 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">Business</h3><p className="mt-3 text-lg font-medium text-foreground">— <span className="text-sm font-normal text-muted-foreground">per month · Monthly billing</span></p><div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3"><p><span className="block text-xs text-muted-foreground">Start date</span><span className="mt-1 block text-foreground">February 1, 2026</span></p><p><span className="block text-xs text-muted-foreground">Next billing</span><span className="mt-1 block text-foreground">September 1, 2026</span></p><p><span className="block text-xs text-muted-foreground">Payment method</span><span className="mt-1 flex items-center gap-2 text-foreground"><CreditCard size={14} className="text-foreground" />Visa ···· 4242</span></p></div></div><div className="flex shrink-0 flex-col gap-2 sm:flex-row xl:flex-col"><button type="button" className="rounded-lg border border-[var(--muted-foreground)] px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-border/60 hover:text-foreground">Manage Plan</button><button type="button" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary">Upgrade <ArrowRight size={14} /></button></div></div><div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--muted-foreground)] pt-5">{entitlementPills.map(pill => <span key={pill.id} className="rounded-full border border-border/20 bg-secondary/[0.08] px-3 py-1.5 text-xs font-medium text-foreground">{pill.label}</span>)}</div></article>

          <div className="grid gap-5 xl:grid-cols-3"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold text-foreground">Usage vs Limits</h3><p className="mt-1 text-xs text-muted-foreground">Resets September 1, 2026</p></div><Activity size={17} className="text-muted-foreground" /></div><div className="mt-5 space-y-4">{currentPlanUsage.map(item => <div key={item.id} className="space-y-2"><div className="flex items-center justify-between gap-4 text-xs"><span className="font-medium text-muted-foreground">{item.label}</span><span className="text-foreground">{item.value} <span className="text-muted-foreground">/ {item.amount}</span> <span className="text-muted-foreground">· {item.percent}%</span></span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]" aria-label={`${item.label} usage ${item.percent}%`}><div className={`h-full rounded-full ${item.percent > 90 ? 'bg-destructive' : item.percent >= 70 ? 'bg-primary' : 'bg-primary'}`} style={{
                    width: `${item.percent}%`
                  }} /></div></div>)}</div><button type="button" className="mt-5 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full Usage <ArrowRight size={13} /></button></article>

            <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold text-foreground">Plan Features</h3><p className="mt-1 text-xs text-muted-foreground">Included features and enterprise-only controls</p></div><ShieldCheck size={17} className="text-muted-foreground" /></div><div className="mt-5 space-y-5">{featureGroups.map(group => <section key={group.id} aria-label={`${group.label} features`}><h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</h4><ul className="mt-3 space-y-2.5">{group.items.map(feature => <li key={feature.id} className="flex items-start justify-between gap-3 text-xs"><span className="flex items-center gap-2 text-foreground">{feature.included ? <Check size={14} className="mt-0.5 shrink-0 text-foreground" /> : <LockKeyhole size={14} className="mt-0.5 shrink-0 text-muted-foreground" />}<span>{feature.label}</span></span>{!feature.included && <span className="shrink-0 rounded-full bg-[var(--card)] px-2 py-0.5 text-[10px] text-muted-foreground">{feature.detail}</span>}</li>)}</ul></section>)}</div><button type="button" className="mt-5 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">Explore Upgrade for locked features <ArrowRight size={13} /></button></article>

            <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-sm font-semibold text-foreground">Active Add-ons</h3><p className="mt-1 text-xs text-muted-foreground">Extra capacity attached to Business</p></div><WalletCards size={17} className="text-muted-foreground" /></div><div className="mt-5 space-y-3">{activeAddOns.map(addOn => <div key={addOn.id} className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4"><div className="flex items-start justify-between gap-3"><div><h4 className="text-sm font-semibold text-foreground">{addOn.name}</h4><p className="mt-1 text-xs text-muted-foreground">{addOn.description}</p></div><span className="flex items-center gap-1 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Active</span></span></div><p className="mt-4 text-sm font-medium text-foreground">{addOn.price}</p><p className="mt-1 text-xs text-muted-foreground">{addOn.renews}</p></div>)}</div><div className="mt-5 flex gap-2"><button type="button" className="flex-1 rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Manage Add-ons</button><button type="button" className="flex-1 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Browse Add-ons</button></div></article></div>

          <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-foreground">Upcoming Renewal</h3><span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-foreground">ESTIMATED</span></div><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">September 1, 2026</p><p className="mt-1 text-xs font-medium text-foreground">14 days remaining</p></div><div className="w-full lg:max-w-md"><div className="space-y-3 text-sm">{renewalLines.map(line => <div key={line.id} className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{line.label}</span><span className="text-foreground">{line.amount}</span></div>)}</div><div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--muted-foreground)] pt-4"><span className="text-xs text-muted-foreground">Estimated Total</span><strong className="text-3xl font-semibold tracking-tight text-foreground">—</strong></div><p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CreditCard size={14} className="text-foreground" /><span>Payment: Visa ···· 4242, Expires 08/29</span></p></div></div><div className="mt-6 flex flex-col gap-3 border-t border-[var(--muted-foreground)] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-muted-foreground">Estimated amount. Final invoice generated on renewal date.</p><div className="flex flex-col gap-2 sm:flex-row"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Update Payment Method</button><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">View Renewal Details</button></div></div></article>

          <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-semibold text-foreground">Plan Comparison</h3><p className="mt-1 text-xs text-muted-foreground">A quick look at the next subscription paths.</p></div><button type="button" className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full Plan Comparison <ArrowRight size={13} /></button></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{comparisonPlans.map(plan => <section key={plan.id} className={`rounded-xl border p-4 ${plan.current ? 'border-border/60 bg-secondary/[0.08]' : 'border-[var(--muted-foreground)] bg-[var(--card)]'}`}><div className="flex min-h-[34px] items-start justify-between gap-3"><h4 className="text-sm font-semibold text-foreground">{plan.name}</h4>{plan.current && <span className="rounded-full bg-primary px-2 py-1 text-[9px] font-bold tracking-wider text-primary-foreground">CURRENT PLAN</span>}</div><p className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{plan.price}{plan.cadence && <span className="text-xs font-normal text-muted-foreground">{plan.cadence}</span>}</p><ul className="mt-4 space-y-2">{plan.features.map(feature => <li key={`${plan.id}-${feature}`} className="flex items-center gap-2 text-xs text-muted-foreground"><Check size={13} className="text-foreground" /><span>{feature}</span></li>)}</ul>{plan.action && <button type="button" className={`mt-5 w-full rounded-md px-3 py-2 text-xs font-medium transition ${plan.id === 'professional' ? 'bg-primary text-primary-foreground hover:bg-primary' : 'border border-[var(--muted-foreground)] text-primary-foreground hover:text-primary-foreground'}`}>{plan.action}</button>}</section>)}</div></article>

          <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-semibold text-foreground">Recent Billing Activity</h3><p className="mt-1 text-xs text-muted-foreground">Billing activity from connected records.</p></div><FileText size={17} className="text-muted-foreground" /></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Activity</th><th className="pb-3 text-right font-medium">Amount</th><th className="pb-3 text-right font-medium">Status</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{(billingLoading ? [] : liveBillingActivity).map(activity => <tr key={activity.id}><td className="py-3 text-muted-foreground">{activity.date}</td><td className="py-3 font-medium text-foreground">{activity.event}</td><td className="py-3 text-right text-foreground">{activity.amount}</td><td className="py-3 text-right"><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-foreground"><Check size={11} /><span>{activity.status}</span></span></td></tr>)}</tbody></table></div><button type="button" className="mt-5 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View All Billing History <ArrowRight size={13} /></button></article>
        </div>}

        {activeTab === 'overview' && <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <div className="flex flex-wrap gap-2"><StatusPill label="Subscription" status="Active" tone="green" /><StatusPill label="Payment" status="Paid" tone="green" /><StatusPill label="Usage" status="Within Limits" tone="blue" /><StatusPill label="Credits" status="Healthy" tone="green" /></div>
          <div className="grid gap-4 xl:grid-cols-4">
            <article className="rounded-xl border border-border/25 bg-gradient-to-br from-[var(--card)] to-[var(--card)] p-5 xl:col-span-1"><div className="mb-4 flex items-start justify-between"><div><p className="text-xs text-muted-foreground">Current plan</p><h2 className="mt-1 text-xl font-semibold text-foreground">Business</h2></div><span className="flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-chart-4"><span className="h-1.5 w-1.5 rounded-full bg-chart-4" />Active</span></div><p className="text-sm font-medium text-foreground">— <span className="text-xs font-normal text-muted-foreground">/ month · Monthly billing</span></p><p className="mt-2 text-xs text-muted-foreground">Next billing: September 1, 2026</p><div className="mt-5 border-t border-border pt-4"><p className="mb-2 text-[11px] text-muted-foreground">Included</p><p className="text-xs leading-6 text-foreground">25 Users · 100 AI Hours<br />50,000 Credits · 10 Integrations</p></div><div className="mt-5 flex gap-2"><button type="button" className="flex-1 rounded-md border border-[var(--muted-foreground)] px-2 py-2 text-[11px] text-foreground hover:text-foreground">Manage Plan</button><button type="button" className="flex-1 rounded-md bg-primary px-2 py-2 text-[11px] font-medium text-primary-foreground hover:bg-primary">Upgrade <ArrowRight size={12} className="ml-1 inline" /></button></div></article>
            <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><p className="text-xs text-muted-foreground">Billing summary</p><div className="mt-4 space-y-3 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">Current subscription</span><span>—</span></div><div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span>—</span></div><div className="flex justify-between"><span className="text-muted-foreground">Usage charges</span><span>—</span></div><div className="flex justify-between"><span className="text-muted-foreground">Credits purchased</span><span>—</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax (—)</span><span>—</span></div></div><div className="mt-5 border-t border-[var(--muted-foreground)] pt-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Estimated next invoice</span><span className="rounded bg-secondary/10 px-1.5 py-1 text-[9px] font-semibold tracking-wider text-foreground">ESTIMATED</span></div><p className="mt-1 text-2xl font-semibold text-foreground">—</p></div></article>
            <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between"><p className="text-xs text-muted-foreground">Credits</p><CircleDollarSign size={17} className="text-foreground" /></div><p className="mt-4 text-2xl font-semibold text-foreground">42,580</p><p className="mt-1 text-xs text-muted-foreground">available credits</p><div className="mt-5 h-1.5 rounded-full bg-[var(--secondary)]"><div className="h-full w-[85%] rounded-full bg-primary text-primary-foreground" /></div><div className="mt-2 flex justify-between text-[11px] text-muted-foreground"><span>Used 7,420</span><span>50,000 total</span></div><div className="mt-4 flex gap-3 text-[11px]"><span className="text-muted-foreground">Included <strong className="font-medium text-foreground">30,000</strong></span><span className="text-muted-foreground">Purchased <strong className="font-medium text-foreground">20,000</strong></span></div><button type="button" className="mt-5 w-full rounded-md border border-[var(--muted-foreground)] py-2 text-xs text-foreground hover:border-border/60 hover:text-foreground">Buy Credits</button></article>
            <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between"><p className="text-xs text-muted-foreground">Renewal</p><Zap size={17} className="text-foreground" /></div><p className="mt-4 text-lg font-semibold text-foreground">September 1, 2026</p><p className="mt-1 text-xs text-foreground">14 days remaining</p><div className="mt-5 space-y-2 text-xs"><div className="flex justify-between"><span className="text-muted-foreground">Payment method</span><span className="text-foreground">Visa ···· 4242</span></div><div className="flex justify-between"><span className="text-muted-foreground">Renewal amount</span><span className="text-foreground">~—</span></div></div><button type="button" className="mt-5 w-full rounded-md border border-[var(--muted-foreground)] py-2 text-xs text-foreground hover:border-border/60 hover:text-foreground">Update Payment</button></article>
          </div>

          <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-foreground">Next Billing Event <span className="font-normal text-muted-foreground">· September 1, 2026</span></h2><p className="mt-1 text-xs text-muted-foreground">Projected charges for your upcoming renewal</p></div><span className="rounded bg-secondary/10 px-2 py-1 text-[10px] font-semibold tracking-wider text-foreground">ESTIMATED</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[540px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-muted-foreground"><tr><th className="pb-3 font-medium">Line item</th><th className="pb-3 text-right font-medium">Amount</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{[{
                  name: 'Base Plan',
                  amount: '—'
                }, {
                  name: 'Add-ons',
                  amount: '—'
                }, {
                  name: 'Usage',
                  amount: '—'
                }, {
                  name: 'Credits',
                  amount: '—'
                }, {
                  name: 'Tax',
                  amount: '—'
                }].map(line => <tr key={line.name}><td className="py-3 text-muted-foreground">{line.name}</td><td className="py-3 text-right text-foreground">{line.amount}</td></tr>)}</tbody></table></div><div className="mt-4 flex items-center justify-end gap-5 border-t border-[var(--muted-foreground)] pt-4"><span className="text-xs text-muted-foreground">Estimated total</span><strong className="text-lg text-foreground">—</strong></div></article>

          <div className="grid gap-5 xl:grid-cols-5"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5 xl:col-span-3"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold text-foreground">Usage — Current Billing Period</h2><p className="mt-1 text-xs text-muted-foreground">Resets September 1</p></div><Activity size={17} className="text-muted-foreground" /></div><div className="mt-5 space-y-4"><ProgressLine label="Users" value="18" amount="25" percent={72} /><ProgressLine label="AI Credits" value="42,580" amount="50,000" percent={85} warning /><ProgressLine label="AI Agent Runs" value="1,240" amount="2,000" percent={62} /><ProgressLine label="API Requests" value="82,000" amount="100,000" percent={82} warning /><ProgressLine label="Integrations" value="8" amount="10" percent={80} warning /></div><button type="button" className="mt-5 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full Usage <ArrowRight size={13} /></button></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5 xl:col-span-2"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-foreground">Recent Invoices</h2><Receipt size={17} className="text-muted-foreground" /></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[320px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Invoice</th><th className="pb-3 font-medium">Date</th><th className="pb-3 text-right font-medium">Amount</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{(billingLoading ? [] : liveInvoices).map(invoice => <tr key={invoice.id}><td className="py-3 font-medium text-foreground">{invoice.id}</td><td className="py-3 text-muted-foreground">{invoice.date}</td><td className="py-3 text-right"><span className="block text-foreground">{invoice.amount}</span><span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-chart-4"><Check size={11} />Paid</span></td></tr>)}</tbody></table></div><button type="button" className="mt-4 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View All Invoices <ArrowRight size={13} /></button></article></div>

          <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center gap-2"><Sparkles size={17} className="text-foreground" /><div><h2 className="text-sm font-semibold text-foreground">AI Cost Insights <span className="font-normal text-muted-foreground">· Powered by Lulu AI</span></h2></div></div><div className="mt-4 grid gap-3 lg:grid-cols-3">{insights.map(insight => {
              const Icon = insight.icon;
              return <div key={insight.title} className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4"><Icon size={18} className="mb-3 text-foreground" /><p className="text-sm leading-5 text-foreground">{insight.title}</p><p className="mt-3 text-[11px] text-muted-foreground">Based on current billing period data</p></div>;
            })}</div></article>
          <article className="flex flex-col gap-5 rounded-xl border border-border/20 bg-secondary/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><Sparkles size={16} className="text-foreground" /><h2 className="text-sm font-semibold text-foreground">AI Plan Advisor</h2></div><p className="mt-3 max-w-3xl text-sm leading-6 text-foreground">Your current AI credit usage is consistently above — of the included allowance. The Professional plan may provide more capacity at —/month.</p><p className="mt-2 text-[11px] text-muted-foreground">AI recommendation based on recorded usage data — not a final billing determination.</p></div><div className="flex shrink-0 gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Compare Plans</button><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Explore Upgrade</button></div></article>
        </div>}
        {activeTab !== 'overview' && activeTab !== 'current-plan' && <BillingTabPanels activeTab={activeTab} onTabChange={setActiveTab} />}
      </section>

      <button type="button" onClick={() => setAssistantOpen(!assistantOpen)} className="fixed bottom-5 right-5 z-10 flex items-center gap-2 rounded-full border border-border/30 bg-[var(--primary)] px-4 py-3 text-xs font-medium text-primary-foreground shadow-2xl shadow-black/40 transition hover:border-border hover:bg-[var(--primary)]" aria-label="Ask Lulu AI about billing"><MessageCircle size={16} className="text-foreground" /><span className="hidden sm:inline">Ask Lulu AI about billing...</span></button>
      {assistantOpen && <div className="fixed bottom-[72px] right-5 z-10 w-[280px] rounded-xl border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4 shadow-2xl"><div className="flex items-center gap-2 text-sm font-medium text-foreground"><Sparkles size={15} className="text-foreground" />Lulu AI Billing Assistant</div><p className="mt-3 text-xs leading-5 text-muted-foreground">I can help explain your upcoming invoice, usage, or plan options.</p><button type="button" onClick={() => setAssistantOpen(false)} className="mt-3 text-xs text-foreground">Got it</button></div>}
    </main>;
}

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
