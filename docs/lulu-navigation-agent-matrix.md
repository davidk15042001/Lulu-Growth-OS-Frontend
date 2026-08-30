# Lulu Navigation Agent Matrix

This document defines the current Lulu sidebar as an agentic operating model.
Each visible page in the navigation is not just a screen. It represents a
specialized AI employee with a clear domain, mission, inputs, outputs,
automation scope, and approval boundary.

## Product principle

Lulu is designed so that a user should primarily:

1. connect systems via OAuth or direct integrations,
2. define basic business context, goals, and constraints,
3. review important outputs and approve sensitive actions when needed.

After that, the page-level agents should do the operational work:

- ingest data,
- monitor changes,
- detect issues and opportunities,
- prepare recommendations,
- draft or execute actions,
- report progress back to the user.

## Autonomy scale

- `A1` Observation only: analyze and report, no user-facing action execution.
- `A2` Drafting: prepare tasks, content, replies, workflows, or decisions.
- `A3` Guardrailed execution: execute reversible or low-risk actions.
- `A4` Full domain autonomy: continuous optimization within defined limits.

## Approval rules

As a default, approval is required for:

- publishing external content,
- sending outbound communication,
- changing budget or money movement,
- changing live site structure or store data,
- deleting or archiving data,
- changing integrations, credentials, or settings,
- performing user-impersonating actions in third-party systems.

## Navigation source of truth

The current visible sidebar is based on:

- `src/pages/fancily-leaf-1766/components/generated/LuluExecutiveDashboard.tsx`
- `src/components/LuluGlobalNavigation.tsx`
- `src/routing.ts`

Unavailable or removed pages are filtered out before render. Google Business is
inserted as its own section in the global navigation.

## Dashboard

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Executive Dashboard | CEO Agent | Run the company at the highest level and prioritize cross-functional work. | All workspace metrics, alerts, goals, approvals, recent changes | Top priorities, executive summary, escalation list, cross-agent directives | A2 | Cross-domain execution and major business changes |
| Intelligence Overview | Chief Intelligence Agent | Merge signals from all domains into one business picture. | Data from marketing, sales, finance, operations, website, CRM | Unified insight feed, linked causes, confidence levels | A2 | None by default |
| Executive Overview | Management Briefing Agent | Prepare a concise management-ready operating brief. | KPI snapshots, anomalies, open risks, opportunities | Daily or weekly briefing, key decisions, summary deck | A2 | External sharing |
| Business Health | Business Health Agent | Detect overall health issues early. | Revenue, churn, traffic, CSAT, operational incidents, payment issues | Health score, problem clusters, warnings | A2 | None by default |
| Growth | Growth Agent | Find and prioritize the best growth levers. | Funnel data, channel performance, audience behavior, product mix | Growth plays, experiments, opportunity ranking | A3 | Live rollout of major initiatives |
| Revenue | Revenue Agent | Monitor and improve revenue generation. | Sales, subscriptions, orders, refunds, pricing, marketing attribution | Revenue drivers, leakage analysis, forecast deltas | A2 | Pricing or monetization changes |
| Customers | Customer Understanding Agent | Explain customer quality, behavior, and changes. | CRM, orders, reviews, support, retention, segmentation | Segments, value signals, churn risks, customer narratives | A2 | Direct outbound action |
| Sales | Sales Oversight Agent | Supervise sales health and next-win actions. | Leads, pipeline, activities, close rates, forecast | Pipeline risks, rep guidance, next actions | A3 | Direct CRM mutations beyond guardrails |
| Marketing | Marketing Oversight Agent | Coordinate demand generation and content performance. | Campaigns, content, SEO, audience data, traffic, conversions | Marketing priorities, content plans, campaign suggestions | A3 | Publishing or spend changes |
| Advertising Intelligence | Ads Intelligence Agent | Explain paid media performance and waste. | Ad spend, campaign metrics, audience data, attribution | Channel diagnostics, waste alerts, optimization ideas | A3 | Budget changes |
| Ecommerce Intelligence | Commerce Intelligence Agent | Understand store performance and buying behavior. | Store, product, order, cart, conversion, refund data | Conversion blockers, assortment signals, cart issues | A3 | Live store edits |
| Finance Intelligence | Finance Intelligence Agent | Interpret the financial state of the company. | Transactions, invoices, cash flow, budgets, recurring revenue | Financial insights, liquidity alerts, planning suggestions | A2 | Any financial execution |
| Operations Intelligence | Operations Agent | Surface operating inefficiencies and service bottlenecks. | Delivery, fulfillment, internal workflow, tasks, incidents | Bottleneck map, optimization backlog, automation ideas | A3 | Workflow changes with external effects |
| Products Intelligence | Product Intelligence Agent | Connect product demand with performance and feedback. | Product catalog, sales, reviews, support, returns | Product opportunities, improvement priorities, assortment signals | A3 | Live product changes |
| KPI Explorer | KPI Agent | Explain metrics, drivers, and trend changes. | KPI history, attribution, dimensions, benchmarks | KPI drilldowns, plain-language explanations, driver trees | A2 | None by default |
| Reports | Reporting Agent | Generate recurring business reports automatically. | Cross-domain metrics, prior reports, report schedules | Board reports, operator reports, status updates | A3 | External delivery |
| Comparisons | Comparison Agent | Compare periods, segments, channels, or entities. | Time windows, cohorts, teams, channels, products | Delta reports, comparative insight cards | A2 | None by default |
| Forecasts | Forecast Agent | Predict likely future performance. | Historical KPIs, seasonality, pipeline, campaigns, cash data | Forecasts, scenario ranges, confidence bands | A2 | Financial commitment decisions |
| Benchmarks | Benchmark Agent | Measure performance against baselines and targets. | Internal history, targets, external standards | Benchmark scorecards, gap analysis | A2 | None by default |
| Trends | Trend Agent | Identify directional movement and momentum shifts. | Time series from all major systems | Trend summaries, sustained shifts, inflection notices | A2 | None by default |
| Anomalies | Anomaly Agent | Catch unusual behavior quickly. | Real-time or batch domain events and metrics | Alert feed, anomaly explanations, suspected causes | A2 | Auto-remediation if enabled |
| Attribution | Attribution Agent | Connect outcomes to the real source. | Traffic, conversions, spend, CRM, ecommerce events | Attribution models, contribution view, channel credit | A2 | Budget reallocation |
| AI Insights | Insight Agent | Convert raw signals into high-value insights. | Cross-domain events, metrics, context | Ranked insight list with reasoning and confidence | A2 | None by default |
| AI Recommendations | Recommendation Agent | Turn insights into proposed action. | Insights, business goals, limits, prior outcomes | Recommended actions, expected impact, urgency | A2 | Execution of proposed actions |
| AI Tasks | Task Orchestrator | Break recommendations into executable work. | Recommendations, workflows, teams, due dates | Task plans, owners, dependencies, follow-ups | A3 | Cross-system writes if enabled |
| Opportunities | Opportunity Agent | Identify upside across channels and processes. | Revenue, growth, product, audience, competitive signals | Ranked opportunities, expected value, dependencies | A2 | Major launches or live execution |
| Decisions | Decision Agent | Prepare and track important business decisions. | Recommendations, approvals, risks, outcomes | Decision memos, status, owner, rationale | A2 | Final decision confirmation |
| Risk Center | Risk Agent | Centralize, prioritize, and monitor risk. | Incidents, anomalies, compliance gaps, cash alerts | Risk register, severity, mitigation plans | A2 | Auto-remediation and policy changes |
| Activity Timeline | Activity Chronicle Agent | Keep a transparent record of meaningful change. | Agent actions, user approvals, syncs, deployments, events | Timeline, audit history, cause-effect chain | A2 | None by default |

## Finance

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Finance Overview | CFO Agent | Run the finance domain end-to-end. | All finance records, billing systems, bank events, forecasts | Finance summary, priorities, alerts, recommendations | A2 | Any money-moving action |
| Finance Invoices | Invoice Agent | Create, track, and optimize invoices. | Invoice records, customer data, payment status | Invoice drafts, overdue alerts, reminder workflows | A3 | Sending invoices if not pre-approved |
| Finance Offers & Quotes | Quote Agent | Prepare and improve offers and quotes. | Pricing, products, customer context, sales stage | Quote drafts, pricing suggestions, conversion tips | A2 | Sending or approving commercial terms |
| Finance Income | Income Agent | Track revenue inflow and anomalies. | Orders, invoices, subscriptions, payouts | Income summaries, leakage alerts, income trends | A2 | None by default |
| Finance Transactions | Transaction Agent | Classify and interpret transaction flows. | Payment processor data, bank movements, ledger entries | Categorized transactions, exception flags | A3 | Ledger write-backs |
| Finance Payments | Payment Agent | Monitor incoming and outgoing payments. | Processor events, settlement data, invoices | Failed payment alerts, payment recovery suggestions | A3 | Retrying or altering payment actions |
| Finance Expenses | Expense Agent | Control spend and find efficiency. | Expense records, vendor bills, card transactions | Cost analysis, savings ideas, anomaly flags | A2 | Expense approval or vendor payment |
| Finance Customers | Debtor Agent | Manage customer payment quality and receivables. | Customer balances, aging data, disputes | AR risk view, collection priorities | A3 | Outbound dunning actions |
| Finance Vendors | Creditor Agent | Manage vendor obligations and supplier finance hygiene. | Vendor records, invoices, payout schedules | Payment calendar, vendor risk view | A2 | Paying vendors |
| Finance Accounts | Account Agent | Keep account structure and balances coherent. | Bank, processor, ledger, chart of accounts | Account health, balance reconciliation status | A2 | Structural account changes |
| Finance Cash Flow | Cash Flow Agent | Prevent liquidity issues before they happen. | Cash balances, receivables, payables, forecast | Cash runway view, crunch alerts, mitigation options | A2 | Emergency cash actions |
| Finance Budgets | Budget Agent | Plan and enforce budget discipline. | Actuals, plans, team targets, spend requests | Budget plans, burn alerts, reallocation proposals | A3 | Budget changes |
| Finance Financial Planning | Planning Agent | Model future financial scenarios. | Forecasts, budget plans, revenue assumptions | Base/best/worst case scenarios | A2 | Strategic commitment decisions |
| Finance Reconciliation | Reconciliation Agent | Match records across systems and find mismatches. | Orders, invoices, payments, payouts, ledger | Reconciliation queue, mismatch explanations | A3 | Auto-fixes in source systems |
| Finance Recurring Revenue | Recurring Revenue Agent | Track MRR/ARR and subscription economics. | Subscription events, churn, upgrades, downgrades | MRR movement, retention signals, cohort changes | A2 | Pricing or plan changes |
| Finance Payouts | Payout Agent | Monitor payout timing and correctness. | Processor settlements, bank arrivals, payout schedules | Payout status, missing payout alerts | A2 | Payout rule changes |
| Finance Financial Automation | Finance Automation Agent | Automate repetitive finance workflows. | Rules, events, records, approvals | Automated reminders, routing, classification flows | A4 | New automation rules that alter money flows |
| Finance Taxes | Tax Agent | Guard tax correctness and obligations. | Sales tax, VAT, invoices, jurisdiction mappings | Tax summaries, mismatch alerts, filing support | A2 | Filing or legal submission |
| Finance Settings | Finance Config Agent | Hold finance-specific operating rules. | Thresholds, tax settings, account mappings, defaults | Config audit, rule recommendations | A2 | Settings changes |
| Sales Overview | CSO Agent | Run the sales domain at an overview level. | Pipeline, rep performance, lead flow, close data | Sales summary, bottlenecks, coaching priorities | A2 | None by default |
| Sales Leads | Lead Agent | Qualify and prioritize inbound leads. | Forms, CRM, enrichment, behavior, source data | Lead scores, routing suggestions, next actions | A3 | Auto-contacting leads |
| Sales Opportunities | Opportunity Agent | Advance promising pipeline opportunities. | Leads, meetings, deal notes, product fit | Opportunity briefs, action plans, risk flags | A3 | Offer or negotiation actions |
| Sales Deals | Deal Agent | Increase close probability on active deals. | Deal stage, contacts, activity history, objections | Deal strategy, next best action, close blockers | A3 | Sending pricing or contract changes |
| Sales Pipeline | Pipeline Agent | Keep the pipeline healthy and moving. | Stages, aging, conversion, rep activity | Pipeline diagnostics, stuck-stage alerts | A2 | Bulk stage edits |
| Sales Activities | Sales Activity Agent | Evaluate the effectiveness of sales activity. | Calls, emails, meetings, task completion | Activity quality analysis, coaching prompts | A2 | Auto-sending messages |
| Sales Tasks | Sales Task Agent | Coordinate sales follow-up with discipline. | Pipeline state, SLAs, contact changes | Task creation, reminders, sequencing | A3 | Outbound execution |
| Sales Customer Segments | Sales Segmentation Agent | Group buyers into actionable sales segments. | CRM, revenue, product usage, firmographics | Segment definitions, targeting guidance | A2 | None by default |
| Sales Forecast | Sales Forecast Agent | Predict likely future bookings. | Pipeline weights, stage history, rep trends | Forecast by period and confidence | A2 | Financial planning commitments |
| Sales Reports | Sales Reporting Agent | Generate recurring sales reporting. | Pipeline, activity, win-loss, rep data | Team reports, executive views | A3 | External delivery |
| Sales Commissions | Commission Agent | Calculate and audit commission logic. | Deals, payouts, plan rules, credits | Commission statements, discrepancy alerts | A2 | Final payout approval |
| Sales Goals | Goal Agent | Track quota and goal attainment. | Targets, actuals, rep/team structures | Goal progress, intervention suggestions | A2 | Goal changes |
| Sales Territories | Territory Agent | Optimize territory and ownership coverage. | Geo, firmographic, account and rep data | Territory suggestions, imbalance alerts | A2 | Reassignments |
| Sales Lead Assignment | Lead Routing Agent | Assign leads to the best owner. | Lead score, territory, capacity, expertise | Auto-routing suggestions or assignments | A4 | Changing routing rules |

## AI

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Assistant | Universal Assistant Agent | Act as the user's direct operating copilot. | User prompts, workspace context, tool access | Answers, plans, drafts, delegated work | A3 | Any high-impact execution |
| Agents | Agent Manager | Show all active Lulu employees and their scope. | Agent registry, health, permissions, logs | Agent catalog, status, workload, ownership | A2 | Agent creation or permission changes |
| Agent Marketplace | Capability Agent | Add new specialized capabilities to Lulu. | Available agent templates, installed modules, needs gaps | Recommendations for new agents, install options | A2 | Installing new capabilities |
| Knowledge | Knowledge Agent | Store, structure, and retrieve business memory. | Docs, interactions, synced data, prior decisions | Knowledge graph, summaries, reusable memory | A3 | Sharing or deleting knowledge |
| Actions | Action Agent | Execute approved cross-system actions. | Recommendations, workflows, integrations, permissions | Executed actions, run logs, rollback options | A4 | Sensitive or irreversible actions |
| Conversations | Conversation Agent | Manage AI conversation threads and context. | Chat history, related artifacts, agent outputs | Thread summaries, handoffs, context continuity | A2 | External messaging |
| Activity | AI Audit Agent | Audit what agents did and why. | Agent logs, tasks, actions, approvals | Activity feed, rationale, status trail | A2 | None by default |

## CRM

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | CRM Lead Agent | Oversee the CRM domain as one relationship system. | Contacts, companies, leads, deals, activities | CRM summary, hygiene alerts, pipeline signals | A2 | Bulk CRM edits |
| Contacts | Contact Agent | Maintain accurate person-level relationship data. | Contact records, conversations, enrichment, activities | Contact updates, missing data prompts, next steps | A3 | Contact deletion or external outreach |
| Companies | Company Agent | Maintain account-level business context. | Company records, firmographics, deals, revenue | Account health, enrichment, whitespace opportunities | A3 | Account merges or deletions |
| Leads | CRM Lead Agent | Qualify new lead records quickly. | Forms, imports, behavior, enrichment | Lead scoring, qualification state, routing | A3 | Auto-contacting leads |
| Deals | CRM Deal Agent | Move deals forward with context-aware guidance. | Deal stage, notes, contacts, meetings | Next actions, risk flags, stage suggestions | A3 | Commercial commitments |
| Pipeline | CRM Pipeline Agent | Keep deal flow visible and healthy. | Stage history, conversion, aging, ownership | Stuck deal alerts, pipeline coverage, bottlenecks | A2 | Bulk stage movement |
| Activities | CRM Activity Agent | Track interactions and follow-through. | Calls, notes, meetings, emails | Activity summaries, follow-up prompts | A2 | External sends |
| Tasks | CRM Task Agent | Ensure no important follow-up is missed. | Open records, SLAs, prior activities | Tasks, reminders, dependency tracking | A3 | Auto-creating external tasks |
| Customer Segments | CRM Segmentation Agent | Build operational customer groupings. | Contact, company, order, deal, engagement data | Segment definitions, targeting lists | A2 | Exporting or activating audiences |
| Customer Intelligence | Customer Intelligence Agent | Explain account and customer behavior deeply. | CRM, ecommerce, finance, support, reviews | Customer narratives, value/risk scores, insights | A2 | Direct customer-facing action |

## Email

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Inbox | Inbox Agent | Triage incoming mail and surface what matters. | Connected inboxes, threads, contacts, CRM context | Priority labels, draft replies, summaries | A3 | Sending replies if not pre-approved |
| Starred | Priority Mail Agent | Protect and manage high-priority conversations. | Starred threads, VIP lists, deadlines | Urgency queue, suggested follow-up | A2 | Sending messages |
| Sent | Sent Mail Agent | Audit outbound communication quality and impact. | Sent threads, opens, replies, outcomes | Follow-up suggestions, performance notes | A2 | None by default |
| Drafts | Drafting Agent | Prepare strong outbound messages quickly. | Templates, CRM context, prior threads, objectives | Draft emails, subject lines, CTA variants | A3 | Sending messages |
| Automations | Email Automation Agent | Run recurring email workflows. | Triggers, contact rules, templates, cadence logic | Automated sequences, performance reports | A4 | Activating new automations |
| Email Settings | Email Config Agent | Manage sending rules and account settings. | Sender identities, preferences, signatures, policies | Config audit, recommended changes | A2 | Settings changes |

## Calendar

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | Calendar Agent | Coordinate time, meetings, and calendar health. | Connected calendars, invites, priorities, tasks | Scheduling suggestions, conflict detection, summaries | A3 | Sending invites or moving meetings |
| Calendar Settings | Calendar Config Agent | Control booking rules and sync settings. | Calendar integrations, availability rules, preferences | Config recommendations, sync status | A2 | Settings changes |

## Marketing

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Campaigns | Campaign Agent | Plan and operate marketing campaigns. | Goals, audiences, channels, content, timing | Campaign plans, launch checklists, health updates | A3 | Launching live campaigns |
| Content | Content Agent | Create and optimize marketing content. | Brand context, channel needs, keyword data, performance | Content drafts, content calendar, refresh suggestions | A3 | Publishing |
| Strategy | Strategy Agent | Translate business goals into a marketing strategy. | Business goals, market data, competitor data, performance | Strategic priorities, channel mix, roadmap | A2 | Strategic commitment |
| Campaign Tracker | Campaign Tracking Agent | Monitor active campaign execution. | Campaign plans, events, spend, conversions | Status, blockers, pacing alerts | A2 | None by default |
| Keywords | Keyword Agent | Discover and prioritize high-value search topics. | Search demand, rankings, content gaps, competitors | Keyword clusters, priorities, briefs | A2 | Publishing actions |
| Competitors | Competitor Agent | Watch the market and identify strategic gaps. | Competitor websites, content, messaging, offers, SERPs | Competitor dossiers, gap analysis, reaction ideas | A2 | None by default |
| Audiences | Audience Agent | Build and continuously refine target audiences. | Onboarding data, CRM, traffic, SEO/GEO/AEO, purchase behavior | Audience dossiers, scoring, targeting suggestions | A4 | Activating audiences in paid systems |
| Analytics | Marketing Analytics Agent | Explain what is and is not working in marketing. | Traffic, attribution, campaign performance, engagement | Channel diagnostics, conversion insights, weekly summaries | A2 | Budget reallocation |
| Overview | CMO Agent | Oversee the marketing function as a whole. | All marketing pages and cross-channel data | Summary, priorities, escalations, strategy updates | A2 | Major changes across channels |
| Advertising Analytics | Ads Analytics Agent | Measure the effectiveness of paid campaigns. | Spend, CPM, CPC, ROAS, conversions, creative data | Performance explanations, waste alerts | A3 | Budget changes |
| Advertising Campaigns | Ads Campaign Agent | Operate and improve paid campaigns. | Ad account data, objectives, audiences, performance | Campaign changes, pacing notes, action plans | A3 | Publishing or scaling spend |
| Creatives | Creative Agent | Generate and improve ad creatives. | Brand assets, offer context, performance, audience data | Creative drafts, test angles, refresh suggestions | A3 | Publishing creatives |
| Budgets | Media Budget Agent | Allocate ad spend efficiently. | Targets, performance, CAC, ROAS, runway | Budget plans, budget shifts, spend controls | A3 | Budget changes |
| AI Optimization | Ads Optimization Agent | Continuously improve ad performance within rules. | Campaign performance, cost, conversion, fatigue signals | Bid/budget suggestions, pausing recommendations, optimizations | A4 | Major spend shifts |
| Tracking & Attribution | Measurement Agent | Keep ad measurement trustworthy. | Pixels, events, UTM data, conversions, platform sync | Tracking QA, attribution gaps, repair suggestions | A3 | Modifying live tracking setup |
| AI Campaign & Ad Builder | Ad Builder Agent | Create campaigns, ad sets, and ads from intent. | Product context, audience, offer, channel, goals | Ready-to-publish paid campaign structures | A3 | Publishing assets or campaigns |
| Publishing & Approval Center | Approval Agent | Control what gets published and when. | Draft campaigns, policies, brand constraints, approvals | Approval queue, publish plan, release log | A3 | Final publish confirmation |
| AI Experiments & A/B Testing | Experiment Agent | Design and run paid media experiments. | Hypotheses, campaign data, creative variants | Experiment plans, test reads, winner recommendations | A4 | Launching new experiments |
| Ad Accounts & Platform Management | Ad Platform Agent | Manage connected ad platforms safely. | OAuth connections, ad accounts, permissions, sync health | Connection status, account registry, sync alerts | A2 | Credential, account, or permission changes |

## Website & Commerce

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Website | Website Manager Agent | Operate the full website presence as a system. | Connected CMS/platforms, SEO data, page performance | Site health, change plans, generation status | A3 | Publishing structural site changes |
| WordPress / Jetpack | WordPress Agent | Operate WordPress-specific content and integrations. | WP content, plugins, sync status, analytics | WP change suggestions, sync diagnostics | A3 | Publishing live WP changes |
| Webflow | Webflow Agent | Operate Webflow-specific pages and CMS. | Webflow collections, pages, publish state | Webflow change plans, CMS updates | A3 | Publishing live Webflow changes |
| Pages & CMS | CMS Agent | Maintain site structure and managed page content. | Page tree, CMS entries, templates, internal links | Content updates, structural recommendations | A3 | Publishing or deleting pages |
| Posts | Publishing Agent | Manage article and post workflows. | Content calendar, drafts, SEO topics, authoring rules | Post drafts, schedules, refresh opportunities | A3 | Publishing posts |
| Media & Assets | Asset Agent | Keep media organized and reusable. | Images, videos, documents, metadata, usage maps | Asset tags, cleanup proposals, missing-asset alerts | A2 | Deleting assets |
| Domains | Domain Agent | Monitor domain health and routing. | DNS, SSL, provider state, site mappings | Domain alerts, expiry warnings, config suggestions | A2 | DNS or domain changes |
| SEO | SEO Agent | Improve classic organic visibility. | Rankings, crawl data, page content, internal links | SEO backlog, optimization suggestions, technical issues | A4 | Publishing content or technical changes |
| GEO | GEO Agent | Improve visibility in generative answer systems. | Brand facts, citations, web structure, answer presence | GEO opportunities, answer-surface guidance | A3 | Publishing source changes |
| AEO | AEO Agent | Improve answer engine and featured-answer readiness. | FAQ content, structured content, search intent, snippets | Answer-focused optimizations, FAQ drafts | A3 | Publishing content changes |
| Reviews | Reputation Agent | Manage website and local review reputation. | Review feeds, sentiment, locations, products, support data | Response drafts, escalation, reputation insights | A4 | Posting public replies if not pre-approved |
| Overview | Commerce Overview Agent | Oversee website and commerce performance together. | Web analytics, store data, content performance, reviews | Domain summary, top blockers, next actions | A2 | Major cross-domain changes |
| Stores | Store Agent | Manage connected storefronts and channel coverage. | Store connections, channel config, store performance | Store status, gaps, configuration suggestions | A2 | Store configuration changes |
| Products | Product Agent | Improve product records, merchandising, and performance. | Catalog, pricing, orders, inventory, reviews | Product optimizations, copy drafts, product alerts | A3 | Publishing product changes |
| Categories | Category Agent | Structure assortments for discoverability and sales. | Catalog hierarchy, demand data, SEO, conversion data | Category recommendations, navigation improvements | A3 | Live taxonomy changes |
| Orders | Order Agent | Keep order handling visible and healthy. | Order events, fulfillment state, payment state | Delay alerts, order issue triage, workflow suggestions | A3 | Customer-facing order intervention |
| Customers | Commerce Customer Agent | Understand buyers and lifetime value in commerce. | Orders, returns, sessions, CRM, support | Value segments, churn and loyalty insights | A2 | Outbound customer action |
| Carts | Cart Agent | Watch cart creation and loss points. | Cart events, device data, product mix, checkout flow | Cart friction insights, recovery triggers | A3 | Activating cart recovery |
| Inventory | Inventory Agent | Prevent stock issues and bad assortment timing. | Stock levels, velocity, returns, supplier timing | Reorder alerts, stockout risk, dead-stock flags | A3 | Purchase-order or stock changes |
| Returns & Refunds | Returns Agent | Reduce refund pain and identify product/service issues. | Return reasons, refund events, product data, logistics | Refund analysis, root causes, prevention ideas | A3 | Issuing refunds automatically |
| Discounts & Promotions | Promotion Agent | Plan promotions without damaging margin. | Margin, inventory, seasonality, campaign goals | Promo suggestions, discount guardrails, results | A3 | Launching promotions |
| Carts & Abandoned Carts | Recovery Agent | Recover lost purchase intent. | Abandoned cart events, customer context, timing | Recovery workflows, message drafts, save analysis | A4 | Sending recovery messages |
| Shipping | Shipping Agent | Monitor shipment quality and delivery issues. | Carrier feeds, shipping status, address errors | Delay alerts, delivery risk, support suggestions | A3 | Customer-facing shipment intervention |
| Payments | Commerce Payment Agent | Protect checkout conversion and payment reliability. | Processor status, checkout funnel, failure codes | Payment issue alerts, retry suggestions, checkout fixes | A3 | Processor or checkout changes |
| Coupons | Coupon Agent | Keep coupon usage effective and controlled. | Coupon rules, usage, abuse patterns, campaign links | Coupon performance, abuse alerts, new coupon ideas | A3 | Issuing or changing coupons |
| Subscriptions | Subscription Agent | Manage recurring purchase health. | Subscription events, churn, skips, retries, billing | Save offers, churn alerts, retention ideas | A4 | Billing changes or customer communication |
| Shipping & Fulfillment | Fulfillment Agent | Coordinate operational delivery after purchase. | Orders, warehouse state, pick-pack-ship data | Fulfillment bottlenecks, SLA alerts, action suggestions | A3 | Live fulfillment rule changes |
| Taxes | Commerce Tax Agent | Keep tax handling correct in commerce flows. | Checkout tax config, jurisdictions, order data | Tax issue alerts, config suggestions | A2 | Tax settings changes |
| Collections | Merchandising Agent | Build collections that improve discovery and sales. | Product data, demand, seasonality, inventory | Collection ideas, collection updates, merchandising plans | A3 | Publishing collections |
| Store Performance | Store Performance Agent | Improve end-to-end store conversion and throughput. | Traffic, cart, checkout, AOV, refund and margin data | Store scorecards, bottleneck analysis, test ideas | A4 | Live conversion tests |

## Google Business

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Reviews | Google Reputation Agent | Manage Google review response and reputation quality. | Google reviews, sentiment, location data, service context | Reply drafts, sentiment trends, priority queue | A4 | Posting replies if not pre-approved |
| Connection Setup | Google OAuth Agent | Connect Google Business safely and completely. | OAuth state, scopes, account/location lists | Connection status, scope errors, next setup steps | A2 | Final account linking |
| Integrations | Google Integration Agent | Keep Google Business sync healthy. | Sync jobs, credentials, mappings, API errors | Integration health, retry suggestions, sync audit | A3 | Re-auth or mapping changes |

## Settings

| Page | Agent | Core mission | Typical inputs | Typical outputs | Autonomy | Approval needed for |
| --- | --- | --- | --- | --- | --- | --- |
| Settings | Workspace Admin Agent | Hold workspace-level operating rules and defaults. | Workspace profile, permissions, automation settings | Config audit, recommended defaults, change queue | A2 | Settings changes |
| Integrations | Integration Control Agent | Manage all connected systems and sync rules. | OAuth connections, provider mappings, sync health | Connection registry, broken sync alerts, setup guidance | A3 | Credential and provider changes |
| Billing | Billing Agent | Manage Lulu plan, usage, and account billing state. | Subscription state, invoices, usage, payment methods | Billing status, plan recommendations, invoice summaries | A2 | Plan or payment changes |

## Operating implications

This matrix implies the following product behavior:

1. Every page should show what the agent is doing, not just static data.
2. Every agent should have explicit inputs, job status, outputs, and a visible
   next action.
3. Integrations are the intake layer. The user should not need to manually copy
   data between systems.
4. Approval UX should appear only at meaningful boundaries, not for every small
   internal step.
5. The long-term product goal is that each page behaves like a real employee:
   monitoring, thinking, preparing, acting, and reporting back.

## Recommended next artifact

The next useful artifact is a page contract per navigation page:

- agent objective,
- connected systems,
- data model,
- recurring jobs,
- approval checkpoints,
- execution permissions,
- visible UI states,
- success metrics.
