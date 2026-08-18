import type { ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDown, ArrowRight, ArrowUp, Bell, Bot, Check, CircleDollarSign, CreditCard, Download, HardDrive, LockKeyhole, Mail, Minus, Package, Phone, Plus, Search, ShieldCheck, UserPlus, WalletCards, Webhook, X, Zap } from 'lucide-react';
import { useLiveRecords } from '../../../../api/useLiveRecords';
type BillingTabPanelsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};
type ComparisonValue = {
  id: string;
  label: string;
  starter: string;
  business: string;
  professional: string;
  enterprise: string;
};
type UsageMetric = {
  id: string;
  label: string;
  value: string;
  limit: string;
  percent: number;
  reset?: string;
  icon: typeof Activity;
};
type ServiceUsage = {
  id: string;
  name: string;
  credits: string;
  percent: number;
  trend: string;
  direction: 'up' | 'down' | 'stable';
};
const comparisonGroups: {
  id: string;
  label: string;
  rows: ComparisonValue[];
}[] = [{
  id: 'platform',
  label: 'Platform',
  rows: [{
    id: 'users',
    label: 'Users',
    starter: '5',
    business: '25',
    professional: '75',
    enterprise: 'Unlimited'
  }, {
    id: 'teams',
    label: 'Teams',
    starter: '1',
    business: '5',
    professional: '20',
    enterprise: 'Unlimited'
  }, {
    id: 'workspaces',
    label: 'Workspaces',
    starter: '1',
    business: '3',
    professional: '10',
    enterprise: 'Unlimited'
  }]
}, {
  id: 'ai',
  label: 'AI',
  rows: [{
    id: 'ai-assistant',
    label: 'AI Assistant',
    starter: 'check',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'ai-agents',
    label: 'AI Agents',
    starter: '2',
    business: '10',
    professional: '50',
    enterprise: 'Unlimited'
  }, {
    id: 'ai-hours',
    label: 'AI Hours',
    starter: '20',
    business: '100',
    professional: '300',
    enterprise: 'Custom'
  }, {
    id: 'ai-credits',
    label: 'AI Credits',
    starter: '10,000',
    business: '50,000',
    professional: '150,000',
    enterprise: 'Custom'
  }, {
    id: 'custom-ai-models',
    label: 'Custom AI Models',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }]
}, {
  id: 'business',
  label: 'Business',
  rows: [{
    id: 'crm',
    label: 'CRM',
    starter: 'check',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'marketing-suite',
    label: 'Marketing Suite',
    starter: 'x',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'advertising',
    label: 'Advertising',
    starter: 'x',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'ecommerce',
    label: 'Ecommerce',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'finance-module',
    label: 'Finance Module',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }]
}, {
  id: 'automations',
  label: 'Automations',
  rows: [{
    id: 'automations',
    label: 'Automations',
    starter: '100',
    business: '500',
    professional: '2,000',
    enterprise: 'Unlimited'
  }, {
    id: 'api-requests',
    label: 'API Requests',
    starter: '10,000',
    business: '100,000',
    professional: '500,000',
    enterprise: 'Unlimited'
  }, {
    id: 'integrations',
    label: 'Integrations',
    starter: '3',
    business: '10',
    professional: '50',
    enterprise: 'Unlimited'
  }, {
    id: 'webhooks',
    label: 'Webhooks',
    starter: 'x',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }]
}, {
  id: 'security',
  label: 'Security',
  rows: [{
    id: 'mfa',
    label: 'MFA',
    starter: 'check',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'sso',
    label: 'SSO',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'audit-logs',
    label: 'Audit Logs',
    starter: 'x',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'advanced-permissions',
    label: 'Advanced Permissions',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }]
}, {
  id: 'support',
  label: 'Support',
  rows: [{
    id: 'standard-support',
    label: 'Standard Support',
    starter: 'check',
    business: 'check',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'priority-support',
    label: 'Priority Support',
    starter: 'x',
    business: 'add-on',
    professional: 'check',
    enterprise: 'check'
  }, {
    id: 'dedicated-csm',
    label: 'Dedicated CSM',
    starter: 'x',
    business: 'x',
    professional: 'x',
    enterprise: 'check'
  }, {
    id: 'sla',
    label: 'SLA',
    starter: 'x',
    business: 'x',
    professional: 'check',
    enterprise: 'check'
  }]
}];
const usageMetrics: UsageMetric[] = [{
  id: 'users',
  label: 'Users',
  value: '18',
  limit: '25',
  percent: 72,
  reset: 'resets Sep 1',
  icon: UserPlus
}, {
  id: 'ai-credits',
  label: 'AI Credits',
  value: '42,580',
  limit: '50,000',
  percent: 85,
  reset: 'resets Sep 1',
  icon: CircleDollarSign
}, {
  id: 'agent-runs',
  label: 'AI Agent Runs',
  value: '1,240',
  limit: '2,000',
  percent: 62,
  reset: 'resets Sep 1',
  icon: Bot
}, {
  id: 'api',
  label: 'API Requests',
  value: '82,000',
  limit: '100,000',
  percent: 82,
  reset: 'resets Sep 1',
  icon: Webhook
}, {
  id: 'integrations',
  label: 'Integrations',
  value: '8',
  limit: '10',
  percent: 80,
  icon: Package
}, {
  id: 'automations',
  label: 'Automations',
  value: '340',
  limit: '500',
  percent: 68,
  reset: 'resets Sep 1',
  icon: Zap
}];
const moduleUsage = [{
  id: 'assistant',
  name: 'AI Assistant',
  percent: 32
}, {
  id: 'agents',
  name: 'AI Agents',
  percent: 28
}, {
  id: 'marketing',
  name: 'Marketing AI',
  percent: 14
}, {
  id: 'analytics',
  name: 'Analytics AI',
  percent: 11
}, {
  id: 'automation',
  name: 'Automation AI',
  percent: 9
}, {
  id: 'other',
  name: 'Other',
  percent: 6
}];
const trendBars = [{
  id: 'd01',
  height: 22
}, {
  id: 'd03',
  height: 28
}, {
  id: 'd05',
  height: 24
}, {
  id: 'd07',
  height: 36
}, {
  id: 'd09',
  height: 34
}, {
  id: 'd11',
  height: 48
}, {
  id: 'd13',
  height: 42
}, {
  id: 'd15',
  height: 52
}, {
  id: 'd17',
  height: 58
}, {
  id: 'd19',
  height: 55
}, {
  id: 'd21',
  height: 67
}, {
  id: 'd23',
  height: 63
}, {
  id: 'd25',
  height: 74
}, {
  id: 'd27',
  height: 81
}, {
  id: 'd30',
  height: 86
}];
const usageByUser = [{
  id: 'sarah',
  user: 'Workspace owner',
  credits: '8,420',
  runs: '142',
  api: '12,400',
  last: 'Today'
}, {
  id: 'marcus',
  user: 'Marcus Okonkwo',
  credits: '6,840',
  runs: '98',
  api: '9,800',
  last: 'Today'
}, {
  id: 'elena',
  user: 'Elena Vasquez',
  credits: '5,920',
  runs: '76',
  api: '8,200',
  last: 'Yesterday'
}, {
  id: 'james',
  user: 'James Park',
  credits: '4,380',
  runs: '54',
  api: '6,100',
  last: 'Aug 28'
}, {
  id: 'lena',
  user: 'Lena Hoffmann',
  credits: '3,860',
  runs: '44',
  api: '5,400',
  last: 'Aug 27'
}];
const aiKpis = [{
  id: 'credits',
  label: 'AI Credits Used',
  value: '42,580',
  detail: '/ 50,000',
  percent: 85,
  tone: 'amber'
}, {
  id: 'requests',
  label: 'AI Requests',
  value: '18,420',
  detail: 'this period',
  percent: 0,
  tone: 'violet'
}, {
  id: 'runs',
  label: 'AI Agent Runs',
  value: '1,240',
  detail: 'this period',
  percent: 0,
  tone: 'green'
}, {
  id: 'time',
  label: 'AI Processing Time',
  value: '68',
  detail: '/ 100 hours',
  percent: 68,
  tone: 'green'
}];
const aiServiceUsage: ServiceUsage[] = [{
  id: 'assistant',
  name: 'AI Assistant',
  credits: '13,626',
  percent: 32,
  trend: 'up 12%',
  direction: 'up'
}, {
  id: 'agents',
  name: 'AI Agents',
  credits: '11,922',
  percent: 28,
  trend: 'up 24%',
  direction: 'up'
}, {
  id: 'marketing',
  name: 'Marketing AI',
  credits: '5,961',
  percent: 14,
  trend: 'up 8%',
  direction: 'up'
}, {
  id: 'analytics',
  name: 'Analytics AI',
  credits: '4,684',
  percent: 11,
  trend: 'down 3%',
  direction: 'down'
}, {
  id: 'automation',
  name: 'Automation AI',
  credits: '3,832',
  percent: 9,
  trend: 'up 5%',
  direction: 'up'
}, {
  id: 'reports',
  name: 'AI Reports',
  credits: '2,554',
  percent: 6,
  trend: 'stable',
  direction: 'stable'
}];
const agentUsage = [{
  id: 'marketing-agent',
  name: 'Marketing Campaign Agent',
  runs: '142',
  credits: '8,420',
  success: '97%',
  time: '2m 14s'
}, {
  id: 'lead-agent',
  name: 'Lead Scoring Agent',
  runs: '98',
  credits: '5,840',
  success: '99%',
  time: '0m 48s'
}, {
  id: 'content-agent',
  name: 'Content Generation Agent',
  runs: '76',
  credits: '4,520',
  success: '94%',
  time: '3m 22s'
}, {
  id: 'data-agent',
  name: 'Data Analysis Agent',
  runs: '54',
  credits: '3,210',
  success: '98%',
  time: '1m 55s'
}, {
  id: 'insight-agent',
  name: 'Customer Insight Agent',
  runs: '44',
  credits: '2,630',
  success: '96%',
  time: '4m 08s'
}];
const alertThresholds = [{
  id: '75',
  label: '75% reached',
  channels: 'In-app + Email'
}, {
  id: '90',
  label: '90% reached',
  channels: 'In-app + Email'
}, {
  id: '100',
  label: '100% reached',
  channels: 'In-app + Email + Slack'
}];
const creditPackages = [{
  id: '10k',
  credits: '10,000 credits',
  price: '€10',
  unit: '€1.00 per 1,000'
}, {
  id: '50k',
  credits: '50,000 credits',
  price: '€45',
  unit: '€0.90 per 1,000',
  badge: 'POPULAR'
}, {
  id: '100k',
  credits: '100,000 credits',
  price: '€80',
  unit: '€0.80 per 1,000',
  badge: 'BEST VALUE'
}, {
  id: '250k',
  credits: '250,000 credits',
  price: '€175',
  unit: '€0.70 per 1,000'
}];
const creditHistory = [{
  id: 'aug15',
  date: 'Aug 15',
  type: 'Purchased',
  description: 'Credit top-up',
  added: '+20,000',
  used: '-',
  balance: '42,580'
}, {
  id: 'aug01',
  date: 'Aug 1',
  type: 'Included',
  description: 'Monthly renewal',
  added: '+30,000',
  used: '-',
  balance: '30,000'
}, {
  id: 'jul31',
  date: 'Jul 31',
  type: 'Expired',
  description: 'Previous purchased credits',
  added: '-',
  used: '-5,000',
  balance: '0'
}, {
  id: 'jul15',
  date: 'Jul 15',
  type: 'Purchased',
  description: 'Credit top-up',
  added: '+20,000',
  used: '-',
  balance: '18,420'
}, {
  id: 'jul01',
  date: 'Jul 1',
  type: 'Included',
  description: 'Monthly renewal',
  added: '+30,000',
  used: '-',
  balance: '12,840'
}];
const addOnCatalog = [{
  id: 'users',
  icon: UserPlus,
  name: 'Additional Users',
  description: '+10 users · Add users beyond plan limit.',
  price: '€50',
  badge: ''
}, {
  id: 'credits',
  icon: CircleDollarSign,
  name: 'Additional AI Credits',
  description: '+50,000 credits for AI workloads.',
  price: '€45',
  badge: 'POPULAR'
}, {
  id: 'agents',
  icon: Bot,
  name: 'Advanced AI Agents',
  description: 'Unlimited agents · Remove agent run limits.',
  price: '€99',
  badge: ''
}, {
  id: 'api',
  icon: Webhook,
  name: 'Additional API Capacity',
  description: '+500k requests for integrations.',
  price: '€39',
  badge: ''
}, {
  id: 'security',
  icon: ShieldCheck,
  name: 'Advanced Security',
  description: 'SSO + SAML + SCIM for enterprise governance.',
  price: '€79',
  badge: ''
}, {
  id: 'storage',
  icon: HardDrive,
  name: 'Additional Storage',
  description: '+500 GB secure workspace storage.',
  price: '€19',
  badge: ''
}];
const billingContacts = [{
  id: 'sarah',
  name: 'Workspace owner',
  role: 'Primary Billing Contact',
  email: 'sarah.chen@acmecorp.com',
  phone: '+1 415 555 0120',
  prefs: 'Invoices: yes, Renewals: yes, Failures: yes'
}, {
  id: 'marcus',
  name: 'Marcus Okonkwo',
  role: 'Finance',
  email: 'm.okonkwo@acmecorp.com',
  phone: '+1 415 555 0198',
  prefs: 'Invoices: yes, Renewals: no, Failures: yes'
}, {
  id: 'ap',
  name: 'billing@acmecorp.com',
  role: 'AP Email',
  email: '-',
  phone: '-',
  prefs: 'Invoices: yes, Renewals: no, Failures: no'
}];
const paymentEvents = [{
  id: 'aug',
  date: 'Aug 1 2026',
  event: 'Payment successful',
  amount: '437.92 EUR',
  method: 'Visa 4242'
}, {
  id: 'jul',
  date: 'Jul 1 2026',
  event: 'Payment successful',
  amount: '418.00 EUR',
  method: 'Visa 4242'
}, {
  id: 'jun',
  date: 'Jun 1 2026',
  event: 'Payment successful',
  amount: '418.00 EUR',
  method: 'Visa 4242'
}, {
  id: 'may',
  date: 'May 1 2026',
  event: 'Payment successful',
  amount: '390.00 EUR',
  method: 'Visa 4242'
}];
const invoiceRows = [{
  id: 'INV-2026-008',
  period: 'Aug 2026',
  issue: 'Aug 1 2026',
  due: 'Aug 1 2026',
  amount: '368.00',
  tax: '69.92',
  total: '437.92'
}, {
  id: 'INV-2026-007',
  period: 'Jul 2026',
  issue: 'Jul 1 2026',
  due: 'Jul 1 2026',
  amount: '348.00',
  tax: '70.00',
  total: '418.00'
}, {
  id: 'INV-2026-006',
  period: 'Jun 2026',
  issue: 'Jun 1 2026',
  due: 'Jun 1 2026',
  amount: '348.00',
  tax: '70.00',
  total: '418.00'
}, {
  id: 'INV-2026-005',
  period: 'May 2026',
  issue: 'May 1 2026',
  due: 'May 1 2026',
  amount: '325.00',
  tax: '65.00',
  total: '390.00'
}, {
  id: 'INV-2026-004',
  period: 'Apr 2026',
  issue: 'Apr 1 2026',
  due: 'Apr 1 2026',
  amount: '325.00',
  tax: '65.00',
  total: '390.00'
}, {
  id: 'INV-2026-003',
  period: 'Mar 2026',
  issue: 'Mar 1 2026',
  due: 'Mar 1 2026',
  amount: '249.00',
  tax: '49.80',
  total: '298.80'
}, {
  id: 'INV-2026-002',
  period: 'Feb 2026',
  issue: 'Feb 1 2026',
  due: 'Feb 1 2026',
  amount: '249.00',
  tax: '49.80',
  total: '298.80'
}, {
  id: 'INV-2026-001',
  period: 'Jan 2026',
  issue: 'Jan 1 2026',
  due: 'Jan 1 2026',
  amount: '249.00',
  tax: '49.80',
  total: '298.80'
}];
const transactions = [{
  id: 'TXN-20260801-001',
  date: 'Aug 1 2026',
  type: 'Subscription',
  description: 'Business Plan - Monthly',
  amount: '437.92 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-008'
}, {
  id: 'TXN-20260715-001',
  date: 'Jul 15 2026',
  type: 'Credit Purchase',
  description: '20,000 AI Credits',
  amount: '20.00 EUR',
  method: 'Visa 4242',
  invoice: '-'
}, {
  id: 'TXN-20260701-001',
  date: 'Jul 1 2026',
  type: 'Subscription',
  description: 'Business Plan - Monthly',
  amount: '418.00 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-007'
}, {
  id: 'TXN-20260620-001',
  date: 'Jun 20 2026',
  type: 'Upgrade',
  description: 'Starter to Business Plan',
  amount: '124.52 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-006B'
}, {
  id: 'TXN-20260601-001',
  date: 'Jun 1 2026',
  type: 'Subscription',
  description: 'Starter Plan - Monthly',
  amount: '118.80 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-006'
}, {
  id: 'TXN-20260501-001',
  date: 'May 1 2026',
  type: 'Subscription',
  description: 'Starter Plan - Monthly',
  amount: '118.80 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-005'
}, {
  id: 'TXN-20260415-001',
  date: 'Apr 15 2026',
  type: 'Add-on',
  description: 'Priority Support add-on',
  amount: '29.00 EUR',
  method: 'Visa 4242',
  invoice: '-'
}, {
  id: 'TXN-20260401-001',
  date: 'Apr 1 2026',
  type: 'Subscription',
  description: 'Starter Plan - Monthly',
  amount: '118.80 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-004'
}, {
  id: 'TXN-20260301-001',
  date: 'Mar 1 2026',
  type: 'Subscription',
  description: 'Starter Plan - Monthly',
  amount: '118.80 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-003'
}, {
  id: 'TXN-20260201-001',
  date: 'Feb 1 2026',
  type: 'Subscription',
  description: 'Starter Plan - Signup',
  amount: '118.80 EUR',
  method: 'Visa 4242',
  invoice: 'INV-2026-002'
}];
const subscriptionHistory = [{
  id: 'aug-renewed',
  date: 'Aug 1 2026',
  title: 'Subscription renewed',
  detail: 'Business Plan',
  amount: '437.92 EUR'
}, {
  id: 'jul-credits',
  date: 'Jul 15 2026',
  title: 'Add-on purchased',
  detail: '20,000 AI Credits',
  amount: '20.00 EUR'
}, {
  id: 'jul-renewed',
  date: 'Jul 1 2026',
  title: 'Subscription renewed',
  detail: 'Business Plan',
  amount: '418.00 EUR'
}, {
  id: 'jun-upgraded',
  date: 'Jun 20 2026',
  title: 'Plan upgraded',
  detail: 'Starter to Business',
  amount: ''
}, {
  id: 'jun-renewed',
  date: 'Jun 1 2026',
  title: 'Subscription renewed',
  detail: 'Starter Plan',
  amount: '118.80 EUR'
}, {
  id: 'feb-started',
  date: 'Feb 1 2026',
  title: 'Subscription started',
  detail: 'Starter Plan',
  amount: ''
}];
const notificationSettings = [{
  id: 'payment-success',
  event: 'Payment successful',
  channel: 'Email + In-app'
}, {
  id: 'payment-failed',
  event: 'Payment failed',
  channel: 'Email + In-app + SMS'
}, {
  id: 'invoice-issued',
  event: 'Invoice issued',
  channel: 'Email'
}, {
  id: 'renewal',
  event: 'Renewal reminder (7 days before)',
  channel: 'Email + In-app'
}, {
  id: 'usage-75',
  event: 'Usage at 75%',
  channel: 'In-app'
}, {
  id: 'usage-90',
  event: 'Usage at 90%',
  channel: 'Email + In-app'
}, {
  id: 'usage-100',
  event: 'Usage at 100%',
  channel: 'Email + In-app + SMS'
}, {
  id: 'credit-low',
  event: 'Credit balance low (below 5000)',
  channel: 'Email + In-app'
}];
const permissionRows = [{
  id: 'owner',
  role: 'Owner',
  view: true,
  payment: true,
  plans: true,
  credits: true,
  cancel: true
}, {
  id: 'billing-admin',
  role: 'Billing Admin',
  view: true,
  payment: true,
  plans: true,
  credits: true,
  cancel: true
}, {
  id: 'finance',
  role: 'Finance Manager',
  view: true,
  payment: true,
  plans: false,
  credits: true,
  cancel: false
}, {
  id: 'admin',
  role: 'Administrator',
  view: true,
  payment: false,
  plans: false,
  credits: false,
  cancel: false
}, {
  id: 'member',
  role: 'Member',
  view: false,
  payment: false,
  plans: false,
  credits: false,
  cancel: false
}];
const auditRows = [{
  id: 'audit-1',
  timestamp: 'Aug 1 2026 09:12',
  actor: 'System',
  action: 'Subscription renewed',
  result: 'Success',
  object: 'INV-2026-008'
}, {
  id: 'audit-2',
  timestamp: 'Jul 15 2026 14:33',
  actor: 'Workspace owner',
  action: 'Credits purchased',
  result: 'Success',
  object: '+20,000 credits'
}, {
  id: 'audit-3',
  timestamp: 'Jul 1 2026 09:10',
  actor: 'System',
  action: 'Subscription renewed',
  result: 'Success',
  object: 'INV-2026-007'
}, {
  id: 'audit-4',
  timestamp: 'Jun 20 2026 11:45',
  actor: 'Workspace owner',
  action: 'Plan upgraded',
  result: 'Success',
  object: 'Business Plan'
}, {
  id: 'audit-5',
  timestamp: 'Apr 15 2026 10:22',
  actor: 'Workspace owner',
  action: 'Add-on added',
  result: 'Success',
  object: 'Priority Support'
}, {
  id: 'audit-6',
  timestamp: 'Feb 1 2026 08:00',
  actor: 'Workspace owner',
  action: 'Subscription created',
  result: 'Success',
  object: 'Starter Plan'
}];
function getProgressColor(percent: number) {
  if (percent > 90) {
    return 'bg-destructive';
  }
  if (percent >= 70) {
    return 'bg-primary';
  }
  return 'bg-chart-4';
}
function getTypeClass(type: string) {
  if (type === 'Subscription') {
    return 'bg-secondary/10 text-foreground border-border/20';
  }
  if (type === 'Credit Purchase') {
    return 'bg-secondary/10 text-foreground border-border/20';
  }
  if (type === 'Upgrade') {
    return 'bg-secondary/10 text-foreground border-border/20';
  }
  if (type === 'Add-on') {
    return 'bg-secondary/10 text-foreground border-border/20';
  }
  if (type === 'Expired') {
    return 'bg-chart-5/10 text-chart-5 border-chart-5/20';
  }
  if (type === 'Purchased') {
    return 'bg-secondary/10 text-foreground border-border/20';
  }
  return 'bg-secondary/10 text-foreground border-border/20';
}
function renderValue(value: string) {
  if (value === 'check') {
    return <span className="inline-flex items-center justify-center gap-1.5 text-foreground"><Check size={14} /><span>Included</span></span>;
  }
  if (value === 'x') {
    return <span className="inline-flex items-center justify-center gap-1.5 text-muted-foreground"><X size={14} /><span>Not included</span></span>;
  }
  if (value === 'add-on') {
    return <span className="inline-flex items-center justify-center gap-1.5 text-foreground"><Plus size={13} /><span>Add-on</span></span>;
  }
  return <span>{value}</span>;
}
function renderBooleanValue(value: boolean) {
  if (value) {
    return <span className="inline-flex items-center gap-1.5 text-foreground"><Check size={13} /><span>Yes</span></span>;
  }
  return <span className="inline-flex items-center gap-1.5 text-muted-foreground"><X size={13} /><span>No</span></span>;
}
export function BillingTabPanels({
  activeTab,
  onTabChange
}: BillingTabPanelsProps) {
  const { items: invoiceRecords, loading: invoicesLoading, error: invoicesError } = useLiveRecords('finance_invoices');
  const { items: paymentRecords, loading: paymentsLoading, error: paymentsError } = useLiveRecords('finance_payments');
  const billingDataLoading = invoicesLoading || paymentsLoading;
  const billingDataError = invoicesError || paymentsError;
  const getBillingField = (record: typeof invoiceRecords[number], key: string) => String((record as unknown as Record<string, unknown>)[key] ?? '');
  const billingStatusNotice = billingDataError ? 'Billing data could not be loaded. Check invoice and payment records and try again.' : !billingDataLoading && invoiceRecords.length === 0 && paymentRecords.length === 0 ? 'No invoice or payment records are available yet.' : '';
  let content: ReactNode = null;
  if (activeTab === 'plans') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Plans</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Compare plans and find the right fit for your organization.</p></div><div className="flex flex-col gap-2 sm:flex-row"><button type="button" className="rounded-lg border border-[var(--muted-foreground)] px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-border/60 hover:text-foreground">Contact Sales</button><button type="button" onClick={() => onTabChange('current-plan')} className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary">View Current Plan</button></div></div>
      <article className="overflow-hidden rounded-2xl border border-[var(--muted-foreground)] bg-[var(--card)] shadow-[0_24px_80px_rgba(0,0,0,0.22)]"><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-xs"><thead><tr className="border-b border-[var(--muted-foreground)]"><th className="w-[240px] px-5 py-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Feature</th><th className="px-4 py-5 text-center"><span className="block text-sm font-semibold text-foreground">Starter</span><span className="mt-1 block text-muted-foreground">€99/mo</span></th><th className="bg-secondary/[0.08] px-4 py-5 text-center"><span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-1 text-[9px] font-bold tracking-wider text-primary-foreground"><Check size={11} /><span>CURRENT</span></span><span className="mt-2 block text-sm font-semibold text-foreground">Business</span><span className="mt-1 block text-foreground">€299/mo</span></th><th className="px-4 py-5 text-center"><span className="block text-sm font-semibold text-foreground">Professional</span><span className="mt-1 block text-muted-foreground">€499/mo</span></th><th className="px-4 py-5 text-center"><span className="block text-sm font-semibold text-foreground">Enterprise</span><span className="mt-1 block text-muted-foreground">Custom</span></th></tr></thead><tbody className="divide-y divide-[var(--foreground)]"><tr><td className="px-5 py-3 font-medium text-muted-foreground">Monthly price</td><td className="px-4 py-3 text-center text-foreground">€99/mo</td><td className="bg-secondary/[0.08] px-4 py-3 text-center font-medium text-foreground">€299/mo</td><td className="px-4 py-3 text-center text-foreground">€499/mo</td><td className="px-4 py-3 text-center text-foreground">Custom</td></tr><tr><td className="px-5 py-3 font-medium text-muted-foreground">Annual price</td><td className="px-4 py-3 text-center text-foreground">€79/mo</td><td className="bg-secondary/[0.08] px-4 py-3 text-center font-medium text-foreground">€239/mo</td><td className="px-4 py-3 text-center text-foreground">€399/mo</td><td className="px-4 py-3 text-center text-foreground">Custom</td></tr></tbody>{comparisonGroups.map(group => <tbody key={group.id} className="divide-y divide-[var(--foreground)]"><tr><td colSpan={5} className="bg-[var(--background)] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</td></tr>{group.rows.map(row => <tr key={row.id} className="hover:bg-secondary"><td className="px-5 py-3 font-medium text-foreground">{row.label}</td><td className="px-4 py-3 text-center text-muted-foreground">{renderValue(row.starter)}</td><td className="bg-secondary/[0.08] px-4 py-3 text-center font-medium text-foreground">{renderValue(row.business)}</td><td className="px-4 py-3 text-center text-muted-foreground">{renderValue(row.professional)}</td><td className="px-4 py-3 text-center text-muted-foreground">{renderValue(row.enterprise)}</td></tr>)}</tbody>)}<tfoot><tr className="border-t border-[var(--muted-foreground)]"><td className="px-5 py-5 text-muted-foreground">Choose a path</td><td className="px-4 py-5"><button type="button" className="w-full rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Downgrade</button></td><td className="bg-secondary/[0.08] px-4 py-5"><button type="button" className="w-full rounded-md bg-secondary/20 px-3 py-2 text-xs font-medium text-foreground"><span>Current Plan</span></button></td><td className="px-4 py-5"><button type="button" className="w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Upgrade</button></td><td className="px-4 py-5"><button type="button" className="w-full rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Contact Sales</button></td></tr></tfoot></table></div></article>
      <p className="text-xs leading-5 text-muted-foreground">All plans billed in EUR. Annual billing saves up to 20%. Taxes applied at checkout based on billing country.</p>
    </div>;
  }
  if (activeTab === 'usage') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Usage</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Current billing period consumption: August 1 - August 31 2026.</p></div><div className="flex rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-1"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Current Period</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Previous Period</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Custom</button></div></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{usageMetrics.map(metric => {
          const Icon = metric.icon;
          return <article key={metric.id} className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{metric.label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{metric.value}<span className="text-sm font-normal text-muted-foreground">/{metric.limit}</span></p></div><Icon size={18} className="text-foreground" /></div><div className="mt-5 flex items-center justify-between text-xs"><span className="text-muted-foreground">{metric.percent}% used</span>{metric.reset && <span className="text-muted-foreground">{metric.reset}</span>}</div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]"><div className={`h-full rounded-full ${getProgressColor(metric.percent)}`} style={{
                width: `${metric.percent}%`
              }} /></div></article>;
        })}</section>
      <section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Usage by Module</h3><div className="mt-5 space-y-4">{moduleUsage.map(item => <div key={item.id} className="space-y-2"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{item.name}</span><span className="text-foreground">{item.percent}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                  width: `${item.percent}%`
                }} /></div></div>)}</div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Usage Trend</h3><span className="text-[10px] uppercase tracking-wider text-muted-foreground">30 days</span></div><p className="mt-1 text-xs text-muted-foreground">AI Credits consumed over billing period</p><div className="mt-6 flex h-56 items-end gap-2 rounded-xl border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4">{trendBars.map(bar => <div key={bar.id} className="flex flex-1 items-end"><div className="w-full rounded-t bg-gradient-to-t from-secondary/30 to-primary" style={{
                height: `${bar.height}%`
              }} /></div>)}</div></article></section>
      <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-semibold text-foreground">Usage Breakdown by User <span className="text-muted-foreground">(top 5)</span></h3></div><button type="button" className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full Usage Breakdown <ArrowRight size={13} /></button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">User</th><th className="pb-3 text-right font-medium">AI Credits Used</th><th className="pb-3 text-right font-medium">Agent Runs</th><th className="pb-3 text-right font-medium">API Requests</th><th className="pb-3 text-right font-medium">Last Active</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{usageByUser.map(user => <tr key={user.id}><td className="py-3 font-medium text-foreground">{user.user}</td><td className="py-3 text-right text-foreground">{user.credits}</td><td className="py-3 text-right text-muted-foreground">{user.runs}</td><td className="py-3 text-right text-muted-foreground">{user.api}</td><td className="py-3 text-right text-muted-foreground">{user.last}</td></tr>)}</tbody></table></div></article>
      <article className="flex flex-col gap-4 rounded-xl border border-border/20 bg-secondary/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-foreground" /><p className="text-sm leading-6 text-foreground"><strong className="font-semibold text-foreground">AI Credits at 85% of included allowance.</strong> <span>At current rate, limit may be reached before September 1.</span></p></div><div className="flex shrink-0 gap-2"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Buy Credits</button><button type="button" onClick={() => onTabChange('ai-usage')} className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">View AI Usage</button></div></article>
    </div>;
  }
  if (activeTab === 'ai-usage') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">AI Usage</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Monitor AI infrastructure consumption across your organization.</p></div><div className="flex rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-1"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Current Period</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Previous Period</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Custom</button></div></div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{aiKpis.map(kpi => <article key={kpi.id} className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><p className="text-xs text-muted-foreground">{kpi.label}</p><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{kpi.value} <span className="text-sm font-normal text-muted-foreground">{kpi.detail}</span></p>{kpi.percent > 0 && <div className="mt-5"><div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Usage</span><span className="text-foreground">{kpi.percent}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]"><div className={`h-full rounded-full ${getProgressColor(kpi.percent)}`} style={{
                width: `${kpi.percent}%`
              }} /></div></div>}</article>)}</section>
      <article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">AI Usage by Service</h3><div className="mt-5 space-y-3">{aiServiceUsage.map(service => <div key={service.id} className="grid gap-3 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4 text-xs md:grid-cols-[180px_1fr_110px_90px]"><span className="font-medium text-foreground">{service.name}</span><div className="flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full rounded-full bg-primary text-primary-foreground" style={{
                  width: `${service.percent}%`
                }} /></div><span className="w-10 text-right text-foreground">{service.percent}%</span></div><span className="text-muted-foreground">{service.credits} credits</span><span className={`inline-flex items-center gap-1 ${service.direction === 'down' ? 'text-foreground' : service.direction === 'up' ? 'text-foreground' : 'text-muted-foreground'}`}>{service.direction === 'up' && <ArrowUp size={13} />}{service.direction === 'down' && <ArrowDown size={13} />}{service.direction === 'stable' && <Minus size={13} />}<span>{service.trend}</span></span></div>)}</div></article>
      <section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">AI Usage by AI Agent</h3><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[560px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Agent Name</th><th className="pb-3 text-right font-medium">Runs</th><th className="pb-3 text-right font-medium">Credits</th><th className="pb-3 text-right font-medium">Success Rate</th><th className="pb-3 text-right font-medium">Avg Time</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{agentUsage.map(agent => <tr key={agent.id}><td className="py-3 font-medium text-foreground">{agent.name}</td><td className="py-3 text-right text-muted-foreground">{agent.runs}</td><td className="py-3 text-right text-foreground">{agent.credits}</td><td className="py-3 text-right text-chart-4">{agent.success}</td><td className="py-3 text-right text-muted-foreground">{agent.time}</td></tr>)}</tbody></table></div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Usage Alerts</h3><Bell size={17} className="text-foreground" /></div><div className="mt-5 space-y-3">{alertThresholds.map(alert => <div key={alert.id} className="flex items-center justify-between gap-4 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4 text-xs"><div><p className="font-medium text-foreground">{alert.label}</p><p className="mt-1 text-muted-foreground">{alert.channels}</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Active</span></span></div>)}</div><button type="button" className="mt-5 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Configure Alerts</button><p className="mt-5 border-t border-[var(--muted-foreground)] pt-4 text-xs leading-5 text-muted-foreground">AI usage data is visible to Billing Administrators and Owners only.</p></article></section>
    </div>;
  }
  if (activeTab === 'credits') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Credits</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage your AI credit balance, purchases and usage history.</p></div><article className="rounded-2xl border border-border/20 bg-[var(--card)] p-5 sm:p-6"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><div><p className="text-xs text-muted-foreground">Available Balance</p><p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">42,580</p></div><div><p className="text-xs text-muted-foreground">Included Credits</p><p className="mt-2 text-2xl font-semibold text-foreground">30,000</p><p className="mt-1 text-xs text-muted-foreground">from Business plan</p></div><div><p className="text-xs text-muted-foreground">Purchased Credits</p><p className="mt-2 text-2xl font-semibold text-foreground">20,000</p><p className="mt-1 text-xs text-muted-foreground">add-on</p></div><div><p className="text-xs text-muted-foreground">Used This Period</p><p className="mt-2 text-2xl font-semibold text-foreground">7,420</p><p className="mt-1 inline-flex items-center gap-1 text-xs text-foreground"><ArrowDown size={12} /><span>down 6%</span></p></div></div><div className="mt-6"><div className="mb-2 flex items-center justify-between text-xs"><span className="text-muted-foreground">7,420 / 50,000 used</span><span className="text-foreground">14.8%</span></div><div className="h-2 overflow-hidden rounded-full bg-[var(--secondary)]"><div className="h-full w-[14.8%] rounded-full bg-primary text-primary-foreground" /></div></div><div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-chart-1">10,000 purchased credits expire September 30, 2026</p><button type="button" className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Buy More Credits</button></div></article><section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Buy Credits</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{creditPackages.map(pkg => <section key={pkg.id} className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--card)] p-4"><div className="flex min-h-6 items-start justify-between gap-2"><h4 className="text-sm font-semibold text-foreground">{pkg.credits}</h4>{pkg.badge && <span className="rounded bg-primary px-2 py-1 text-[9px] font-bold text-primary-foreground">{pkg.badge}</span>}</div><p className="mt-4 text-2xl font-semibold text-foreground">{pkg.price}</p><p className="mt-1 text-xs text-muted-foreground">{pkg.unit}</p><button type="button" className="mt-5 w-full rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:border-border/60 hover:text-foreground">Select</button></section>)}</div><p className="mt-4 text-xs leading-5 text-muted-foreground">Credits are added immediately. Unused purchased credits expire after 12 months.</p></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Credit History</h3><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Description</th><th className="pb-3 text-right font-medium">Added</th><th className="pb-3 text-right font-medium">Used</th><th className="pb-3 text-right font-medium">Balance</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{creditHistory.map(row => <tr key={row.id}><td className="py-3 text-muted-foreground">{row.date}</td><td className="py-3"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${getTypeClass(row.type)}`}><Check size={10} /><span>{row.type}</span></span></td><td className="py-3 text-foreground">{row.description}</td><td className="py-3 text-right text-foreground">{row.added}</td><td className="py-3 text-right text-muted-foreground">{row.used}</td><td className="py-3 text-right text-foreground">{row.balance}</td></tr>)}</tbody></table></div><button type="button" className="mt-4 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full History <ArrowRight size={13} /></button></article></section></div>;
  }
  if (activeTab === 'add-ons') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Add-ons</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Extend your plan with optional capabilities.</p></div><section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold text-foreground">Additional AI Credits</h3><p className="mt-1 text-xs text-muted-foreground">+20,000 credits/month</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Active</span></span></div><p className="mt-5 text-2xl font-semibold text-foreground">€20<span className="text-xs font-normal text-muted-foreground">/month</span></p><p className="mt-2 text-xs text-muted-foreground">Renews: September 1 2026</p><p className="mt-4 text-xs text-muted-foreground">Usage: 20,000/20,000 included in balance</p><div className="mt-5 flex gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Manage</button><button type="button" className="rounded-md border border-chart-5/30 px-3 py-2 text-xs text-chart-5 hover:text-chart-5">Remove</button></div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-start justify-between"><div><h3 className="text-sm font-semibold text-foreground">Priority Support</h3><p className="mt-1 text-xs text-muted-foreground">Dedicated support queue, 4h response SLA</p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Active</span></span></div><p className="mt-5 text-2xl font-semibold text-foreground">€29<span className="text-xs font-normal text-muted-foreground">/month</span></p><p className="mt-2 text-xs text-muted-foreground">Renews: September 1 2026</p><div className="mt-9 flex gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Manage</button><button type="button" className="rounded-md border border-chart-5/30 px-3 py-2 text-xs text-chart-5 hover:text-chart-5">Remove</button></div></article></section><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Available Add-ons</h3><div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{addOnCatalog.map(addOn => {
            const Icon = addOn.icon;
            return <section key={addOn.id} className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--card)] p-4"><div className="flex items-start justify-between gap-3"><Icon size={18} className="text-foreground" /><span>{addOn.badge && <span className="rounded bg-primary px-2 py-1 text-[9px] font-bold text-primary-foreground">{addOn.badge}</span>}</span></div><h4 className="mt-4 text-sm font-semibold text-foreground">{addOn.name}</h4><p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground">{addOn.description}</p><p className="mt-4 text-xl font-semibold text-foreground">{addOn.price}<span className="text-xs font-normal text-muted-foreground">/month</span></p><button type="button" className="mt-5 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Add to Subscription</button></section>;
          })}</div><p className="mt-5 text-xs leading-5 text-muted-foreground">Add-ons are billed monthly and prorated to your billing cycle. Removing an add-on takes effect at next renewal.</p></article></div>;
  }
  if (activeTab === 'payments') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Payment Methods</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage payment methods and billing contacts for your subscription.</p></div><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Payment Methods</h3><div className="mt-5 grid gap-4 xl:grid-cols-2"><section className="rounded-lg border border-border/30 bg-secondary/[0.06] p-4"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><CreditCard size={22} className="text-foreground" /><div><h4 className="text-sm font-semibold text-foreground">Visa 4242</h4><p className="mt-1 text-xs text-muted-foreground">Expires 08/29</p></div></div><span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-1 text-[9px] font-bold text-primary-foreground"><Check size={10} /><span>DEFAULT</span></span></div><div className="mt-5 flex gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Edit</button><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Remove</button></div></section><section className="rounded-lg border border-[var(--muted-foreground)] bg-[var(--card)] p-4"><div className="flex items-center gap-3"><WalletCards size={22} className="text-muted-foreground" /><div><h4 className="text-sm font-semibold text-foreground">Mastercard 8731</h4><p className="mt-1 text-xs text-muted-foreground">Expires 03/28</p></div></div><div className="mt-5 flex flex-wrap gap-2"><button type="button" className="rounded-md border border-border/30 px-3 py-2 text-xs text-foreground hover:text-foreground">Set as Default</button><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Edit</button><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Remove</button></div></section></div><button type="button" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary"><Plus size={13} /><span>Add Payment Method</span></button><p className="mt-4 text-xs leading-5 text-muted-foreground">A default payment method is required while your subscription is active. Payment details are handled securely and never stored in Lulu AI.</p><p className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole size={13} className="text-chart-4" /><span>Secured by Stripe</span></p></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Billing Contacts</h3><button type="button" className="inline-flex items-center gap-2 rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground"><Plus size={13} /><span>Add Billing Contact</span></button></div><div className="mt-5 space-y-3">{billingContacts.map(contact => <div key={contact.id} className="grid gap-3 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4 text-xs lg:grid-cols-[1.2fr_1.2fr_1fr_1.5fr_auto]"><div><p className="font-semibold text-foreground">{contact.name}</p><p className="mt-1 text-muted-foreground">{contact.role}</p></div><p className="flex items-center gap-2 text-muted-foreground"><Mail size={13} className="text-muted-foreground" /><span>{contact.email}</span></p><p className="flex items-center gap-2 text-muted-foreground"><Phone size={13} className="text-muted-foreground" /><span>{contact.phone}</span></p><p className="text-muted-foreground">{contact.prefs}</p><button type="button" className="text-left text-foreground hover:text-foreground">Edit</button></div>)}</div></article><article className="rounded-xl border border-border/20 bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Payment History</h3><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Event</th><th className="pb-3 text-right font-medium">Amount</th><th className="pb-3 text-right font-medium">Method</th><th className="pb-3 text-right font-medium">Status</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{paymentEvents.map(event => <tr key={event.id}><td className="py-3 text-muted-foreground">{event.date}</td><td className="py-3 font-medium text-foreground">{event.event}</td><td className="py-3 text-right text-foreground">{event.amount}</td><td className="py-3 text-right text-muted-foreground">{event.method}</td><td className="py-3 text-right"><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Paid</span></span></td></tr>)}</tbody></table></div></article></div>;
  }
  if (activeTab === 'invoices') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Invoices</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Download and manage your billing invoices.</p></div><button type="button" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary"><Download size={15} /><span>Download All</span></button></div><div className="flex flex-col gap-3 rounded-xl border border-[var(--muted-foreground)] bg-[var(--secondary)] p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-1"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">All</button><button type="button" className="rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Paid</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Open</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Past Due</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Void</button></div><label className="flex items-center gap-2 rounded-md border border-[var(--muted-foreground)] bg-[var(--background)] px-3 py-2 text-xs text-muted-foreground"><Search size={14} /><input aria-label="Search invoices" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search invoices" /></label></div><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Invoice #</th><th className="pb-3 font-medium">Billing Period</th><th className="pb-3 font-medium">Issue Date</th><th className="pb-3 font-medium">Due Date</th><th className="pb-3 text-right font-medium">Amount</th><th className="pb-3 text-right font-medium">Tax</th><th className="pb-3 text-right font-medium">Total</th><th className="pb-3 text-right font-medium">Status</th><th className="pb-3 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{invoiceRows.map(invoice => <tr key={invoice.id}><td className="py-3 font-medium text-foreground">{invoice.id}</td><td className="py-3 text-muted-foreground">{invoice.period}</td><td className="py-3 text-muted-foreground">{invoice.issue}</td><td className="py-3 text-muted-foreground">{invoice.due}</td><td className="py-3 text-right text-muted-foreground">{invoice.amount}</td><td className="py-3 text-right text-muted-foreground">{invoice.tax}</td><td className="py-3 text-right text-foreground">{invoice.total}</td><td className="py-3 text-right"><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Paid</span></span></td><td className="py-3 text-right"><button type="button" className="mr-3 text-foreground hover:text-foreground">View</button><button type="button" className="text-foreground hover:text-foreground">PDF</button></td></tr>)}</tbody></table></div><div className="mt-5 flex flex-col gap-3 border-t border-[var(--muted-foreground)] pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted-foreground">Total shown: 8 invoices.</p><div className="flex items-center gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground">Previous</button><span className="text-xs text-muted-foreground">Page 1 of 1</span><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground">Next</button></div></div></article><p className="text-xs leading-5 text-muted-foreground">Invoices are generated automatically on each billing date. All amounts in EUR.</p></div>;
  }
  if (activeTab === 'transactions') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Transactions</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A complete record of all billing transactions.</p></div><div className="flex flex-col gap-3 rounded-xl border border-[var(--muted-foreground)] bg-[var(--secondary)] p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-1"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">All</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Subscription</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Credits</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Add-ons</button><button type="button" className="rounded-md px-3 py-2 text-xs text-foreground hover:text-foreground">Refunds</button></div><label className="flex items-center gap-2 rounded-md border border-[var(--muted-foreground)] bg-[var(--background)] px-3 py-2 text-xs text-muted-foreground"><Search size={14} /><input aria-label="Search transactions" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search transactions" /></label></div><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Transaction ID</th><th className="pb-3 font-medium">Type</th><th className="pb-3 font-medium">Description</th><th className="pb-3 text-right font-medium">Amount</th><th className="pb-3 text-right font-medium">Payment Method</th><th className="pb-3 text-right font-medium">Status</th><th className="pb-3 text-right font-medium">Invoice</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{transactions.map(txn => <tr key={txn.id}><td className="py-3 text-muted-foreground">{txn.date}</td><td className="py-3 font-medium text-foreground">{txn.id}</td><td className="py-3"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${getTypeClass(txn.type)}`}><Check size={10} /><span>{txn.type}</span></span></td><td className="py-3 text-muted-foreground">{txn.description}</td><td className="py-3 text-right text-foreground">{txn.amount}</td><td className="py-3 text-right text-muted-foreground">{txn.method}</td><td className="py-3 text-right"><span className="inline-flex items-center gap-1.5 rounded-full bg-chart-4/10 px-2 py-1 text-[10px] font-semibold text-chart-4"><Check size={11} /><span>Completed</span></span></td><td className="py-3 text-right text-foreground">{txn.invoice}</td></tr>)}</tbody></table></div><div className="mt-5 flex items-center justify-between border-t border-[var(--muted-foreground)] pt-4"><p className="text-xs text-muted-foreground">Showing 10 transactions</p><div className="flex items-center gap-2"><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground">Previous</button><span className="text-xs text-muted-foreground">Page 1 of 1</span><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground">Next</button></div></div></article></div>;
  }
  if (activeTab === 'subscription') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Subscription</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Manage your subscription, renewal, plan changes and cancellation.</p></div><article className="rounded-2xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5 sm:p-6"><div className="grid gap-6 xl:grid-cols-[1fr_260px]"><div><p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Plan</p><h3 className="mt-3 text-4xl font-semibold tracking-tight text-foreground">Business</h3><div className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3"><p><span className="block text-xs text-muted-foreground">Status</span><span className="mt-1 inline-flex items-center gap-1.5 text-chart-4"><Check size={13} /><span>Active</span></span></p><p><span className="block text-xs text-muted-foreground">Billing</span><span className="mt-1 block text-foreground">Monthly at €299/month</span></p><p><span className="block text-xs text-muted-foreground">Start</span><span className="mt-1 block text-foreground">February 1 2026</span></p><p><span className="block text-xs text-muted-foreground">Current period</span><span className="mt-1 block text-foreground">August 1 - August 31 2026</span></p><p><span className="block text-xs text-muted-foreground">Renewal</span><span className="mt-1 block text-foreground">September 1 2026</span></p><p><span className="block text-xs text-muted-foreground">Payment</span><span className="mt-1 block text-foreground">Visa 4242</span></p></div></div><div className="flex flex-col gap-2"><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Change Plan</button><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Manage Add-ons</button><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Update Payment Method</button><button type="button" className="mt-3 text-left text-xs text-chart-5 hover:text-chart-5">Cancel Subscription</button></div></div></article><section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Subscription Features</h3><div className="mt-5 space-y-5">{comparisonGroups.slice(1, 3).map(group => <section key={group.id}><h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{group.label}</h4><ul className="mt-3 space-y-2.5">{group.rows.map(row => <li key={row.id} className="flex items-center justify-between gap-3 text-xs"><span className="text-foreground">{row.label}</span><span>{renderValue(row.business)}</span></li>)}</ul></section>)}</div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Subscription Limits</h3><div className="mt-5 space-y-4">{usageMetrics.map(metric => <div key={metric.id} className="space-y-2"><div className="flex items-center justify-between gap-4 text-xs"><span className="text-muted-foreground">{metric.label}</span><span className="text-foreground">{metric.value} <span className="text-muted-foreground">/ {metric.limit}</span> <span className="text-muted-foreground">· {metric.percent}%</span></span></div><div className="h-1.5 overflow-hidden rounded-full bg-[var(--secondary)]"><div className={`h-full rounded-full ${getProgressColor(metric.percent)}`} style={{
                  width: `${metric.percent}%`
                }} /></div></div>)}</div></article></section><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5 sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm font-semibold text-foreground">Upcoming Renewal</h3><span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-foreground">ESTIMATED</span></div><p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">September 1, 2026</p><p className="mt-1 text-xs font-medium text-foreground">14 days remaining</p></div><div className="w-full lg:max-w-md"><div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Base plan</span><span className="text-foreground">€299.00</span></div><div className="flex justify-between"><span className="text-muted-foreground">Add-ons</span><span className="text-foreground">€49.00</span></div><div className="flex justify-between"><span className="text-muted-foreground">Tax 23%</span><span className="text-foreground">€69.92</span></div></div><div className="mt-5 flex items-end justify-between gap-4 border-t border-[var(--muted-foreground)] pt-4"><span className="text-xs text-muted-foreground">Estimated Total</span><strong className="text-3xl font-semibold tracking-tight text-foreground">€437.92</strong></div></div></div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Subscription History</h3><div className="mt-6 space-y-0">{subscriptionHistory.map(event => <div key={event.id} className="grid grid-cols-[120px_24px_1fr] gap-3 text-xs"><p className="pb-6 text-muted-foreground">{event.date}</p><div className="flex flex-col items-center"><span className="h-2.5 w-2.5 rounded-full bg-primary text-primary-foreground" /><span className="h-full w-px bg-[var(--card)]" /></div><div className="pb-6"><p className="font-semibold text-foreground">{event.title}</p><p className="mt-1 text-muted-foreground">{event.detail}{event.amount && <span> · {event.amount}</span>}</p></div></div>)}</div></article><article className="rounded-xl border border-chart-5/20 bg-chart-5/[0.035] p-5"><h3 className="text-sm font-semibold text-foreground">Cancel Subscription</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Canceling will schedule your subscription to end on September 1 2026. You will retain full access until then.</p><button type="button" className="mt-5 rounded-md border border-chart-5/40 px-3 py-2 text-xs font-medium text-chart-5 hover:text-chart-5">Cancel Subscription</button></article></div>;
  }
  if (activeTab === 'settings') {
    content = <div className="space-y-5 px-5 py-6 sm:px-8 lg:px-10 lg:py-8"><div><h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">Billing Settings</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Configure billing preferences, notifications, permissions and tax information.</p></div><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Organization</h3><button type="button" className="rounded-md border border-[var(--muted-foreground)] px-3 py-2 text-xs text-foreground hover:text-foreground">Edit</button></div><div className="mt-5 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-3"><p><span className="block text-xs text-muted-foreground">Legal Company Name</span><span className="mt-1 block text-foreground">Connected workspace GmbH</span></p><p><span className="block text-xs text-muted-foreground">Billing Address</span><span className="mt-1 block text-foreground">123 Enterprise Ave, Suite 400</span></p><p><span className="block text-xs text-muted-foreground">City / State</span><span className="mt-1 block text-foreground">San Francisco, CA 94105</span></p><p><span className="block text-xs text-muted-foreground">Country</span><span className="mt-1 block text-foreground">United States</span></p><p><span className="block text-xs text-muted-foreground">VAT ID</span><span className="mt-1 block text-foreground">DE123456789</span></p><p><span className="block text-xs text-muted-foreground">Tax Number</span><span className="mt-1 block text-foreground">US-98-7654321</span></p></div></article><section className="grid gap-5 xl:grid-cols-2"><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Billing</h3><div className="mt-5 space-y-4 text-sm"><p className="flex justify-between"><span className="text-muted-foreground">Currency</span><span className="text-foreground">EUR</span></p><p className="flex justify-between"><span className="text-muted-foreground">Billing Cycle</span><span className="text-foreground">Monthly <span className="text-foreground">· Switch to annual and save 20%</span></span></p><p className="flex justify-between"><span className="text-muted-foreground">Invoice Language</span><span className="text-foreground">English</span></p><p className="flex justify-between"><span className="text-muted-foreground">Invoice Delivery</span><span className="text-foreground">Email + Portal</span></p></div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Invoice Settings</h3><div className="mt-5 space-y-4 text-sm"><p><span className="block text-muted-foreground">Invoice Recipients</span><span className="mt-1 block text-foreground">Workspace billing contacts</span></p><p className="flex justify-between"><span className="text-muted-foreground">Invoice Number Prefix</span><span className="text-foreground">INV</span></p><p className="flex justify-between"><span className="text-muted-foreground">PO Number</span><span className="text-muted-foreground">Optional, empty</span></p></div></article></section><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Billing Notifications</h3><div className="mt-5 grid gap-3 md:grid-cols-2">{notificationSettings.map(setting => <div key={setting.id} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] p-4 text-xs"><div><p className="font-medium text-foreground">{setting.event}</p><p className="mt-1 text-muted-foreground">{setting.channel}</p></div><button type="button" aria-label={`${setting.event} notification on`} className="flex h-6 w-11 items-center rounded-full bg-primary p-0.5 text-primary-foreground"><span className="ml-auto h-5 w-5 rounded-full bg-card" /></button></div>)}</div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Billing Permissions</h3><button type="button" className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary">Manage Roles</button></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Role</th><th className="pb-3 text-center font-medium">View Billing</th><th className="pb-3 text-center font-medium">Manage Payment</th><th className="pb-3 text-center font-medium">Change Plans</th><th className="pb-3 text-center font-medium">Purchase Credits</th><th className="pb-3 text-center font-medium">Cancel Subscription</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{permissionRows.map(row => <tr key={row.id}><td className="py-3 font-medium text-foreground">{row.role}</td><td className="py-3 text-center">{renderBooleanValue(row.view)}</td><td className="py-3 text-center">{renderBooleanValue(row.payment)}</td><td className="py-3 text-center">{renderBooleanValue(row.plans)}</td><td className="py-3 text-center">{renderBooleanValue(row.credits)}</td><td className="py-3 text-center">{renderBooleanValue(row.cancel)}</td></tr>)}</tbody></table></div></article><article className="rounded-xl border border-[var(--muted-foreground)] bg-[var(--card)] p-5"><h3 className="text-sm font-semibold text-foreground">Billing Audit Log</h3><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[820px] text-left text-xs"><thead className="border-b border-[var(--muted-foreground)] text-[10px] uppercase tracking-wider text-muted-foreground"><tr><th className="pb-3 font-medium">Timestamp</th><th className="pb-3 font-medium">Actor</th><th className="pb-3 font-medium">Action</th><th className="pb-3 font-medium">Result</th><th className="pb-3 font-medium">Object</th></tr></thead><tbody className="divide-y divide-[var(--foreground)]">{auditRows.map(row => <tr key={row.id}><td className="py-3 text-muted-foreground">{row.timestamp}</td><td className="py-3 font-medium text-foreground">{row.actor}</td><td className="py-3 text-muted-foreground">{row.action}</td><td className="py-3"><span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2 py-1 text-[10px] font-semibold text-foreground"><Check size={11} /><span>{row.result}</span></span></td><td className="py-3 text-muted-foreground">{row.object}</td></tr>)}</tbody></table></div><button type="button" className="mt-4 flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground">View Full Audit Log <ArrowRight size={13} /></button></article></div>;
  }
  return <>{billingStatusNotice && <div role="alert" className="mx-5 mt-4 rounded-lg border border-[var(--muted-foreground)] bg-[var(--secondary)] px-4 py-3 text-xs text-[var(--foreground)] sm:mx-8 lg:mx-10">{billingStatusNotice}</div>}{content}</>;
}