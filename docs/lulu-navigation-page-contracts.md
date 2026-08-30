# Lulu Navigation Page Contracts

This document turns the Lulu sidebar into implementation-ready page contracts.
Each visible navigation page is defined as an agent workspace with a concrete
objective, required systems, recurring jobs, approval gates, UI states, and
success metrics.

It complements:

- `docs/lulu-navigation-agent-matrix.md`

## Contract fields

- `Objective`: what the agent is supposed to achieve continuously.
- `Systems`: the main data or execution systems the page depends on.
- `Jobs`: recurring background work the agent should perform.
- `Approval gates`: moments where explicit user approval is required.
- `UI states`: minimum user-visible states for the page.
- `Success metrics`: how we know the page-agent is doing a good job.

## Global UI states

Every page-agent should support these baseline states:

- `Connecting`: integrations or permissions are not ready.
- `Syncing`: data is actively being imported or refreshed.
- `Monitoring`: the agent is watching the domain.
- `Analyzing`: the agent is forming conclusions.
- `Needs approval`: the agent is ready to act but needs a decision.
- `Executing`: the agent is carrying out an approved action.
- `Completed`: the current workflow finished successfully.
- `Attention required`: the agent is blocked by missing data, errors, or policy.

## Dashboard

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Executive Dashboard | Run the workspace from one command center. | All connected systems | roll up signals, reprioritize work, escalate blockers | cross-domain execution | monitoring, analyzing, needs approval | issue detection speed, task throughput, business outcome lift |
| Intelligence Overview | Merge all business signals into one coherent model. | All domain data stores | aggregate signals, cluster themes, score confidence | none by default | syncing, analyzing, completed | insight quality, confidence accuracy, duplicate reduction |
| Executive Overview | Produce a concise operator brief. | All major metrics, approvals, risks | prepare daily brief, summarize changes, surface decisions | external distribution | analyzing, completed | briefing usefulness, executive response time |
| Business Health | Detect health deterioration early. | Revenue, support, ops, traffic, finance | compute health score, watch trend shifts, create alerts | auto-remediation | monitoring, attention required | alert precision, time-to-detection |
| Growth | Continuously find growth levers. | Marketing, sales, product, website, finance | identify bottlenecks, propose plays, score opportunities | launching major growth actions | analyzing, needs approval | qualified opportunities, revenue impact |
| Revenue | Explain and improve revenue performance. | Orders, subscriptions, invoices, attribution | detect leakage, forecast deltas, trace drivers | pricing or monetization changes | monitoring, analyzing | revenue retention, leakage reduction |
| Customers | Explain who the best customers are and how they change. | CRM, ecommerce, support, reviews | build segments, score value, detect churn risk | outbound customer activation | analyzing, completed | LTV prediction quality, churn-risk coverage |
| Sales | Keep sales performance healthy. | CRM, pipeline, activities, forecast | inspect pipeline, rank deals, create next steps | external sales communication | monitoring, needs approval | pipeline velocity, win-rate lift |
| Marketing | Coordinate the marketing system. | Campaign tools, web analytics, SEO, content | rank priorities, detect channel shifts, generate plans | campaign launches | analyzing, needs approval | traffic growth, conversion lift |
| Advertising Intelligence | Explain paid media health. | Ad platforms, attribution, spend data | detect waste, monitor ROAS, find underperformers | budget reallocations | monitoring, analyzing | ROAS improvement, wasted spend reduction |
| Ecommerce Intelligence | Explain store performance. | Storefronts, catalog, orders, carts | detect conversion leaks, identify product patterns | live commerce changes | analyzing, needs approval | conversion rate, AOV, refund reduction |
| Finance Intelligence | Explain financial condition. | Finance records, billing, bank-like feeds | model trends, detect risk, summarize cash position | any money movement | analyzing, attention required | liquidity visibility, forecast accuracy |
| Operations Intelligence | Improve operational throughput. | Tasks, fulfillment, incidents, internal workflows | find bottlenecks, spot delay patterns, suggest automations | process changes with external effects | monitoring, analyzing | SLA compliance, bottleneck resolution |
| Products Intelligence | Improve product quality and demand fit. | Catalog, returns, reviews, sales | rank product issues, find winners/losers, suggest fixes | live catalog changes | analyzing, needs approval | product margin lift, return reduction |
| KPI Explorer | Explain KPI changes in plain language. | Metric warehouse, dimensions, benchmarks | compute deltas, generate driver trees, compare slices | none | analyzing, completed | explanation usefulness, diagnostic speed |
| Reports | Auto-generate recurring reporting. | All reporting sources | build scheduled reports, refresh narratives, distribute drafts | external sending | syncing, completed | report latency, manual reporting reduction |
| Comparisons | Compare entities and periods precisely. | Time-series and dimensional data | compute deltas, highlight change drivers | none | analyzing, completed | comparison clarity, decision support value |
| Forecasts | Predict future outcomes with uncertainty. | Historical metrics, pipeline, seasonality | refresh forecasts, run scenarios, track error | budget or commitment decisions | analyzing, completed | forecast error, scenario usefulness |
| Benchmarks | Measure against targets and norms. | Internal targets, historical baselines, external refs | refresh benchmark sets, compute gaps | none | monitoring, completed | benchmark coverage, target adherence |
| Trends | Find sustained directional changes. | Historical performance series | detect emerging trends, label significance | none | monitoring, analyzing | early trend detection rate |
| Anomalies | Catch unusual behavior fast. | Event streams and KPI streams | run anomaly checks, score severity, route incidents | automatic intervention | attention required, needs approval | precision and recall of alerts |
| Attribution | Map outcomes to causes. | Web analytics, ads, CRM, ecommerce | update contribution models, reconcile conversion paths | budget reallocation | analyzing, completed | attribution trust, channel decision quality |
| AI Insights | Turn raw data into useful insights. | All domain signals | cluster signals, generate insights, rank importance | none | analyzing, completed | insight adoption rate |
| AI Recommendations | Turn insights into next actions. | Insights, goals, constraints | generate recommendations, estimate impact, prioritize | action execution | needs approval, completed | recommendation acceptance rate |
| AI Tasks | Convert strategy into tasks. | Recommendations, task systems, workflows | create tasks, sequence dependencies, follow up | cross-system writes | executing, completed | task completion rate |
| Opportunities | Maintain a ranked opportunity backlog. | Growth, sales, marketing, product, finance data | identify upside, score value, track status | launching major opportunities | analyzing, needs approval | opportunity realization rate |
| Decisions | Support structured decision making. | Recommendations, approvals, historical outcomes | draft decision memos, track owners, record rationale | final decision sign-off | needs approval, completed | decision cycle time |
| Risk Center | Centralize risks and mitigation. | Alerts, anomalies, finance, compliance, ops | maintain risk register, score severity, monitor mitigation | remediation steps | attention required, needs approval | prevented incidents, mitigation coverage |
| Activity Timeline | Preserve an explainable history of action. | Agent logs, sync logs, approvals, events | append events, correlate cause and effect | none | syncing, completed | audit completeness |

## Finance

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Finance Overview | Operate the finance function as a whole. | Finance stack, billing, revenue systems | summarize finance status, rank issues, propose actions | all financial execution | analyzing, needs approval | finance issue resolution speed |
| Finance Invoices | Keep invoicing accurate and timely. | Invoices, CRM, payments | generate drafts, chase overdue items, detect anomalies | sending invoices | drafting, needs approval | DSO, invoice error rate |
| Finance Offers & Quotes | Produce better commercial quotes faster. | Products, pricing, CRM, finance rules | assemble quote drafts, check margin, suggest improvements | sending quotes | drafting, needs approval | quote turnaround, quote win rate |
| Finance Income | Monitor and explain incoming revenue. | Orders, subscriptions, invoices | roll up income, detect drops, explain changes | none | monitoring, analyzing | revenue visibility |
| Finance Transactions | Keep transaction data categorized and trustworthy. | Payments, bank-like feeds, ledger | classify transactions, flag exceptions, reconcile feeds | writing back corrections | syncing, attention required | classification accuracy |
| Finance Payments | Guard payment collection quality. | Processor data, invoices, subscriptions | detect failures, suggest retries, watch settlement lag | retrying or changing payment actions | monitoring, needs approval | payment success rate |
| Finance Expenses | Control spend and waste. | Expense tools, cards, vendors | categorize spend, find anomalies, recommend savings | approving spend | analyzing, needs approval | spend reduction, anomaly detection |
| Finance Customers | Manage receivables risk. | AR, invoices, customer balances | build aging views, flag debtor risk, draft reminders | dunning outreach | analyzing, needs approval | overdue reduction |
| Finance Vendors | Manage vendor obligations cleanly. | AP, contracts, payout schedules | watch due dates, detect overcharges, prep payments | paying vendors | monitoring, needs approval | missed payment reduction |
| Finance Accounts | Keep accounts structurally consistent. | Accounts, ledger, mappings | watch account health, detect orphan mappings | changing account structure | monitoring, attention required | reconciliation readiness |
| Finance Cash Flow | Prevent cash crunches. | Balances, AR, AP, subscriptions, forecast | project runway, flag shortfalls, suggest mitigation | emergency cash actions | analyzing, attention required | runway visibility, surprise reduction |
| Finance Budgets | Plan and control budget allocation. | Actuals, plans, team budgets | compare plan vs actual, propose shifts, enforce limits | budget changes | monitoring, needs approval | budget adherence |
| Finance Financial Planning | Model future financial scenarios. | Forecasts, budgets, revenue assumptions | run scenarios, update assumptions, track variance | strategic commitment | analyzing, completed | scenario usefulness |
| Finance Reconciliation | Match records across finance systems. | Orders, invoices, payouts, payments, ledger | detect mismatches, suggest fixes, maintain queue | auto-fixes | syncing, attention required | reconciliation completion rate |
| Finance Recurring Revenue | Protect recurring revenue quality. | Subscription systems, churn, upgrades | compute movement, detect churn patterns, flag expansion | pricing changes | monitoring, analyzing | net revenue retention |
| Finance Payouts | Keep payouts visible and correct. | Processor payouts, bank arrivals | detect missing payouts, track timing | payout configuration changes | monitoring, attention required | payout accuracy |
| Finance Financial Automation | Automate repetitive finance work. | Finance workflows, triggers, approval rules | run automations, route exceptions, log outcomes | enabling new automation rules | executing, needs approval | manual finance work reduction |
| Finance Taxes | Reduce tax mistakes. | Tax settings, invoices, orders, jurisdictions | detect mismatches, flag filing risk, recommend configs | filing or tax submission | attention required, needs approval | tax error reduction |
| Finance Settings | Hold finance rules and defaults. | Configurations, mappings, roles | validate config, suggest corrections | settings changes | completed, needs approval | config correctness |
| Sales Overview | Run the sales domain from finance/sales view. | CRM, finance, pipeline | summarize sales health, rank gaps | external sales action | analyzing, needs approval | sales visibility |
| Sales Leads | Qualify sales leads effectively. | CRM, lead sources, enrichment | score leads, route leads, prepare next steps | external outreach | analyzing, needs approval | lead-to-opportunity rate |
| Sales Opportunities | Develop qualified opportunities. | CRM, meeting notes, fit signals | update opportunity briefs, flag blockers | offer changes | monitoring, needs approval | opportunity conversion |
| Sales Deals | Improve deal progression. | CRM, pricing, notes, stakeholder data | create deal plans, surface objections | commitments to buyer | analyzing, needs approval | close rate |
| Sales Pipeline | Keep pipeline flowing. | Stages, activities, rep data | detect stuck stages, rebalance focus | bulk pipeline edits | monitoring, attention required | pipeline velocity |
| Sales Activities | Measure sales activity quality. | Emails, calls, meetings, CRM events | score activity quality, suggest cadence changes | auto-outreach | analyzing, needs approval | activity effectiveness |
| Sales Tasks | Enforce disciplined follow-up. | CRM, tasks, communication history | auto-create follow-ups, remind owners | external communication | executing, needs approval | task SLA compliance |
| Sales Customer Segments | Build actionable sales segments. | CRM, revenue, product fit | generate segments, refresh labels | activating segments externally | completed, needs approval | segment usefulness |
| Sales Forecast | Predict bookings. | Pipeline, stage history, seasonality | refresh forecast, compare forecast to actual | plan changes | analyzing, completed | forecast accuracy |
| Sales Reports | Generate sales reporting automatically. | CRM, rep activity, deal data | produce reports, summarize changes | external delivery | completed, needs approval | reporting latency |
| Sales Commissions | Keep commission logic trusted. | Deals, payout logic, rep plans | compute commissions, flag discrepancies | commission payout | analyzing, needs approval | commission dispute reduction |
| Sales Goals | Track goal progress. | Targets, actuals, teams | watch attainment, suggest interventions | changing goals | monitoring, needs approval | quota attainment visibility |
| Sales Territories | Optimize territory design. | Accounts, geo, firmographics, reps | detect imbalance, suggest territory changes | reassignment | analyzing, needs approval | coverage quality |
| Sales Lead Assignment | Route leads to the best owner. | Lead data, territories, rep capacity | auto-assign leads, watch fairness, rebalance rules | rule changes | executing, needs approval | routing speed, lead response time |

## AI

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Assistant | Let the user command the business in natural language. | All accessible tools and memory | answer, orchestrate, draft, execute approved work | sensitive execution | analyzing, executing | user task completion time |
| Agents | Show and manage the active Lulu workforce. | Agent registry, permissions, logs | health checks, workload summaries, agent discovery | permission changes | monitoring, completed | agent uptime, clarity of ownership |
| Agent Marketplace | Expand available agent capabilities. | Template catalog, installed modules | match capability gaps, recommend additions | installation | analyzing, needs approval | capability coverage |
| Knowledge | Store reusable business memory. | Docs, notes, synced data, chat history | ingest knowledge, summarize, link entities | deletion or sharing | syncing, completed | retrieval quality |
| Actions | Execute approved tasks across systems. | Integrations, workflows, task definitions | perform actions, log runs, expose rollback | irreversible actions | executing, needs approval | successful action rate |
| Conversations | Preserve thread continuity across agents. | Chats, artifacts, memories | summarize threads, route context, attach outputs | external sending | completed, needs approval | context retention quality |
| Activity | Make agent work inspectable. | Logs, run history, approvals | render activity feed, explain why actions happened | none | completed | audit completeness |

## CRM

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | Keep the CRM healthy as one operating system. | CRM records, tasks, activities, pipeline | audit hygiene, summarize state, rank priorities | bulk edits | monitoring, analyzing | CRM completeness |
| Contacts | Maintain reliable person records. | CRM, enrichment, communication history | enrich contacts, dedupe, surface missing data | external outreach or deletion | syncing, needs approval | contact completeness |
| Companies | Maintain reliable company records. | CRM, enrichment, deal data | enrich companies, detect duplicates, surface whitespace | merge/delete operations | syncing, needs approval | account completeness |
| Leads | Turn inbound contacts into qualified leads. | Forms, imports, enrichment, CRM | score, classify, route leads | external outreach | analyzing, needs approval | lead qualification speed |
| Deals | Improve CRM deal execution. | Pipeline, contacts, notes, tasks | update next steps, flag blockers, estimate close risk | sending offers/commitments | monitoring, needs approval | deal progression speed |
| Pipeline | Preserve a clean, useful pipeline. | CRM stages, owner data, activities | detect stagnation, suggest stage moves | bulk stage changes | monitoring, attention required | stalled-deal reduction |
| Activities | Keep relationship activity complete and useful. | Email, meetings, calls, CRM logs | summarize activity, create follow-ups | auto-sending | completed, needs approval | activity logging completeness |
| Tasks | Ensure follow-up discipline. | CRM tasks, SLAs, records | create reminders, sequence tasks, detect missed follow-ups | external writes | executing, needs approval | follow-up compliance |
| Customer Segments | Create usable CRM segments. | Contacts, companies, revenue, behavior | compute segments, keep them fresh | external activation | completed, needs approval | segmentation adoption |
| Customer Intelligence | Explain account and customer behavior deeply. | CRM, sales, commerce, support | produce account briefs, score risk/value | customer-facing action | analyzing, needs approval | account insight quality |

## Email

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Inbox | Triage and draft responses for inbound mail. | Connected inboxes, CRM, calendar | summarize threads, classify urgency, draft replies | sending replies | monitoring, needs approval | inbox zero speed |
| Starred | Protect the highest-priority threads. | Mail provider, starred labels | maintain VIP queue, detect overdue responses | sending replies | monitoring, needs approval | VIP response time |
| Sent | Review outbound quality and response patterns. | Sent mail, reply data | detect follow-up needs, summarize performance | none | analyzing, completed | reply rate visibility |
| Drafts | Produce high-quality drafts quickly. | Mail context, templates, CRM | generate drafts, refine tone, personalize content | sending drafts | drafting, needs approval | draft acceptance rate |
| Automations | Run recurring email programs. | Mail provider, workflow engine, CRM | execute sequences, stop on replies, report results | activating new automations | executing, needs approval | automation performance |
| Email Settings | Manage email account rules. | Sender config, signatures, routing rules | validate settings, expose errors | settings changes | completed, needs approval | config health |

## Calendar

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Overview | Coordinate time and scheduling intelligently. | Connected calendars, tasks, email | detect conflicts, propose slots, summarize day | sending invites or rescheduling | monitoring, needs approval | conflict reduction |
| Calendar Settings | Hold calendar operating rules. | Calendar providers, booking preferences | validate sync state, recommend defaults | settings changes | completed, needs approval | sync reliability |

## Marketing

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Campaigns | Design and run marketing campaigns. | Campaign tools, analytics, content systems | generate campaign plans, monitor execution, report results | launching campaigns | drafting, needs approval | campaign ROI |
| Content | Produce and improve marketing content. | CMS, brand assets, SEO data, analytics | create drafts, refresh old content, score quality | publishing | drafting, needs approval | content production velocity |
| Strategy | Convert goals into a marketing plan. | Business context, channel data, competition | define priorities, recommend channel mix, update roadmap | strategic approval | analyzing, needs approval | strategy adoption |
| Campaign Tracker | Monitor campaign execution health. | Campaign systems, analytics, spend data | pacing checks, milestone tracking, blocker detection | none | monitoring, attention required | campaign visibility |
| Keywords | Maintain a prioritized keyword map. | Search data, ranking tools, competitor signals | cluster keywords, detect opportunities, map intent | publishing content | analyzing, needs approval | keyword opportunity capture |
| Competitors | Track competitors continuously. | Websites, SERPs, ads, content, offers | refresh competitor dossiers, detect changes, map gaps | none | monitoring, completed | competitor coverage |
| Audiences | Build living target audiences for the business. | Onboarding, CRM, website, SEO/GEO/AEO, commerce | enrich segments, score fit, detect new audiences | activating in ad/email systems | analyzing, needs approval | audience quality, segment lift |
| Analytics | Explain marketing performance. | Web analytics, attribution, campaign data | channel analysis, funnel diagnostics, weekly summaries | budget reallocation | analyzing, needs approval | insight-to-action rate |
| Overview | Operate the whole marketing function. | All marketing systems | summarize domain status, prioritize work, escalate blockers | major channel changes | monitoring, needs approval | channel coordination quality |
| Advertising Analytics | Explain ad performance clearly. | Ad platforms, spend, attribution | detect fatigue, track efficiency, map winners | budget changes | analyzing, needs approval | cost efficiency |
| Advertising Campaigns | Operate paid campaigns. | Ad accounts, campaign data, conversion data | adjust campaigns, pause weak assets, scale winners | publishing changes | executing, needs approval | campaign performance lift |
| Creatives | Generate and test better ad creatives. | Brand assets, product data, performance data | draft creatives, rotate angles, retire fatigue | publishing creatives | drafting, needs approval | creative refresh performance |
| Budgets | Allocate paid media budget intelligently. | Spend, ROAS, CAC, business constraints | rebalance spend, hold caps, detect overburn | changing budgets | monitoring, needs approval | spend efficiency |
| AI Optimization | Continuously optimize ads under constraints. | Campaign metrics, bids, budgets, fatigue signals | propose or apply optimizations, learn from outcomes | major scaling or pausing | executing, needs approval | incremental ROAS gain |
| Tracking & Attribution | Maintain measurement integrity. | Pixels, events, UTM rules, analytics | check tracking health, detect missing events, suggest repairs | altering live tracking | attention required, needs approval | measurement completeness |
| AI Campaign & Ad Builder | Generate ready-to-launch ad structures. | Offer context, audiences, products, brand constraints | build campaigns, ad sets, ad copy, creative briefs | publishing | drafting, needs approval | launch preparation speed |
| Publishing & Approval Center | Manage final launch control. | Draft assets, approval queue, policy rules | validate readiness, present approval queue, publish on approval | final publish | needs approval, executing | publishing error reduction |
| AI Experiments & A/B Testing | Systematically run experiments. | Campaign performance, hypotheses, variants | design tests, evaluate winners, retire losers | launching tests | executing, needs approval | experiment velocity |
| Ad Accounts & Platform Management | Keep ad platform connectivity stable. | OAuth, ad account configs, permissions | monitor connection health, sync accounts, surface scope issues | permission/account changes | syncing, needs approval | integration uptime |

## Website & Commerce

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Website | Operate the web presence as one managed system. | CMS platforms, website generation, analytics | monitor generation jobs, plan changes, summarize site health | publishing site structure | syncing, needs approval | site health and delivery speed |
| WordPress / Jetpack | Manage WordPress operations. | WordPress, Jetpack, analytics | sync content, inspect publishing health, detect plugin/content issues | publishing | syncing, needs approval | WP sync success |
| Webflow | Manage Webflow operations. | Webflow CMS, publishing, analytics | sync collections, prep content, inspect publish state | publishing | syncing, needs approval | Webflow publish reliability |
| Pages & CMS | Maintain site structure and page content. | CMS, page tree, templates | create page drafts, link optimization, stale-page detection | publishing or deleting pages | drafting, needs approval | content freshness |
| Posts | Run editorial publishing. | CMS, content calendar, SEO data | generate posts, schedule posts, refresh content | publishing posts | drafting, needs approval | content cadence |
| Media & Assets | Keep assets organized and useful. | Media library, CDN, CMS | tag assets, detect duplicates, flag missing variants | deleting assets | syncing, needs approval | asset reuse rate |
| Domains | Guard domain and SSL health. | DNS, registrar, SSL, routing | detect expiry, SSL issues, broken mappings | DNS/domain changes | monitoring, attention required | domain uptime |
| SEO | Improve classic search visibility. | Search data, page content, technical site data | prioritize fixes, optimize pages, monitor rank changes | publishing technical/content changes | analyzing, needs approval | organic traffic growth |
| GEO | Improve generative search visibility. | Brand knowledge, citations, site structure | generate citation tasks, improve entity clarity, track coverage | publishing source changes | analyzing, needs approval | generative visibility growth |
| AEO | Improve answer-engine readiness. | FAQs, structured content, page content | generate answer blocks, identify snippet opportunities | publishing answer content | drafting, needs approval | answer capture rate |
| Reviews | Protect reputation via public review handling. | Google and site reviews, sentiment, support context | classify reviews, draft replies, escalate critical feedback | posting replies | needs approval, executing | response time, sentiment lift |
| Overview | Oversee website and commerce together. | Web analytics, store data, review data | summarize status, rank blockers, align priorities | major cross-domain changes | monitoring, needs approval | overall web commerce health |
| Stores | Manage connected storefronts. | Store platforms, configs, catalogs | audit store health, detect missing syncs | store config changes | syncing, needs approval | store uptime |
| Products | Keep product data and performance strong. | Catalog, pricing, inventory, reviews | update product drafts, detect underperformers, improve copy | publishing product changes | drafting, needs approval | product conversion rate |
| Categories | Maintain useful catalog structure. | Catalog hierarchy, SEO, conversion data | detect messy taxonomy, suggest reorganizations | changing categories live | analyzing, needs approval | category discoverability |
| Orders | Watch order processing health. | Orders, shipping, payments, support | flag delays, detect exceptions, summarize backlog | customer-facing intervention | monitoring, needs approval | order resolution speed |
| Customers | Understand buyers in the store context. | Orders, CRM, sessions, support | segment buyers, score loyalty, detect risk | outbound lifecycle actions | analyzing, needs approval | repeat purchase rate |
| Carts | Monitor cart creation and drop-off. | Cart events, site analytics, products | detect friction, rank cart blockers, prep recovery actions | starting recovery actions | monitoring, needs approval | cart recovery rate |
| Inventory | Keep stock aligned with demand. | Inventory, sales velocity, supplier timing | detect stockouts, overstock, reorder needs | stock or PO changes | monitoring, needs approval | stockout reduction |
| Returns & Refunds | Reduce costly returns and refund pain. | Returns, refunds, orders, product data | classify return reasons, detect bad SKUs, suggest fixes | issuing refunds automatically | analyzing, needs approval | return rate reduction |
| Discounts & Promotions | Run profitable promotions. | Discount rules, margin, campaigns, inventory | propose promos, measure results, detect abuse | launching promos | drafting, needs approval | promo margin quality |
| Carts & Abandoned Carts | Recover lost checkout intent. | Cart abandonment events, CRM, email | trigger recovery flows, personalize saves, monitor win-back | sending recovery messages | executing, needs approval | recovered revenue |
| Shipping | Maintain delivery reliability. | Carriers, shipments, order events | flag late shipments, detect address issues, support escalation | customer-facing changes | monitoring, needs approval | on-time delivery rate |
| Payments | Protect checkout payment quality. | Checkout, processor events, failure codes | detect failure spikes, propose fixes, trace payment drops | payment config changes | attention required, needs approval | checkout success rate |
| Coupons | Keep coupon strategy effective and clean. | Coupon rules, order data, campaigns | detect abuse, score usage, suggest new offers | issuing/changing coupons | monitoring, needs approval | coupon profitability |
| Subscriptions | Maintain recurring commerce health. | Subscription platform, billing, churn signals | detect churn risk, trigger save flows, monitor retries | billing changes or messages | executing, needs approval | subscription retention |
| Shipping & Fulfillment | Keep post-purchase operations healthy. | Warehouse, shipping, OMS | detect bottlenecks, watch SLAs, coordinate fixes | workflow changes | monitoring, needs approval | fulfillment SLA performance |
| Taxes | Maintain correct commerce tax setup. | Tax config, checkout, orders | detect tax mismatches, validate setup | changing tax config | attention required, needs approval | tax correctness |
| Collections | Curate high-performing groupings. | Catalog, inventory, seasonality, demand | build collections, rotate merchandising, test groupings | publishing collections | drafting, needs approval | collection conversion |
| Store Performance | Improve end-to-end store output. | Web analytics, checkout, orders, margin | identify bottlenecks, propose experiments, monitor improvements | launching live tests | analyzing, needs approval | store conversion and margin lift |

## Google Business

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Reviews | Operate Google review management. | Google Business Profile APIs, sentiment, workspace context | sync reviews, classify sentiment, draft replies, escalate urgent items | posting public replies | syncing, needs approval | response time, review sentiment |
| Connection Setup | Connect the account safely via OAuth. | OAuth, Google Business account/location selection | start auth, validate scopes, map locations, confirm readiness | final connect | connecting, completed | successful connection rate |
| Integrations | Keep Google sync healthy. | OAuth credentials, sync jobs, API status | monitor token health, retry syncs, report failures | remapping or reconnecting | syncing, attention required | sync uptime |

## Settings

| Page | Objective | Systems | Jobs | Approval gates | UI states | Success metrics |
| --- | --- | --- | --- | --- | --- | --- |
| Settings | Hold workspace-wide defaults and operating rules. | Workspace profile, permissions, automation settings | audit config, detect risky settings, suggest defaults | changing settings | completed, needs approval | config quality |
| Integrations | Manage all connected systems in one place. | OAuth providers, platform mappings, sync jobs | list connections, flag broken syncs, guide setup | changing credentials or mappings | syncing, needs approval | integration health |
| Billing | Keep the Lulu account commercially healthy. | Subscription, invoices, payment method, usage | summarize billing state, detect payment issues, propose plan changes | plan/payment changes | completed, needs approval | billing issue resolution |

## Implementation rules implied by these contracts

1. Every page should show active agent work, not just static tables.
2. Every page needs at least one recurring background job.
3. Connected systems must be explicit in the UI so users know what the agent can
   see and do.
4. Approval gates should be tied to business sensitivity, not to internal
   computation steps.
5. Success metrics should be visible enough that each page can prove its value.

## Recommended next step

Build a machine-readable registry from this file for the frontend and backend,
for example:

- `pageId`
- `agentName`
- `objective`
- `integrations`
- `jobs`
- `approvalPolicy`
- `uiStates`
- `successMetrics`

That would let the product render consistent agent headers, status panels,
approval drawers, and execution controls automatically across the app.
