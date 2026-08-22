import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const de = {
  "Workspace update status unavailable": "Status der Workspace-Aktualisierung nicht verfügbar",
  "Workspace update could not be started": "Workspace-Aktualisierung konnte nicht gestartet werden",
  "The workspace update could not be started.": "Die Workspace-Aktualisierung konnte nicht gestartet werden.",
  "The workspace update status could not be loaded.": "Der Status der Workspace-Aktualisierung konnte nicht geladen werden.",
  "Update workspace content": "Workspace-Inhalte aktualisieren",
  "Update workspace": "Workspace aktualisieren",
  "Workspace content is up to date.": "Die Workspace-Inhalte sind aktuell.",
  "Workspace update failed.": "Die Workspace-Aktualisierung ist fehlgeschlagen.",
  "Loading live marketing campaigns…": "Live-Marketingkampagnen werden geladen…",
  "No live marketing campaigns are available yet. Create a campaign after connecting verified workspace data.": "Es sind noch keine Live-Marketingkampagnen verfügbar. Erstellen Sie eine Kampagne, nachdem verifizierte Workspace-Daten verbunden wurden.",
  "live campaign": "Live-Kampagne",
  "in this workspace": "in diesem Workspace",
  "campaigns": "Kampagnen",
  "No live marketing data is available yet. Connect a marketing platform or add verified campaign records before reviewing performance.": "Es sind noch keine Live-Marketingdaten verfügbar. Verbinden Sie eine Marketingplattform oder fügen Sie verifizierte Kampagnendatensätze hinzu, bevor Sie die Leistung prüfen.",
  "No live advertising data is available yet. Connect an advertising platform or add a verified advertising record to begin.": "Es sind noch keine Live-Werbedaten verfügbar. Verbinden Sie eine Werbeplattform oder fügen Sie einen verifizierten Werbedatensatz hinzu, um zu beginnen.",
  "Loading live creatives…": "Live-Creatives werden geladen…",
  "No live creative assets are available yet. Connect a verified advertising platform before creating or syncing creatives.": "Es sind noch keine Live-Creative-Assets verfügbar. Verbinden Sie eine verifizierte Werbeplattform, bevor Sie Creatives erstellen oder synchronisieren.",
  "Loading live benchmark data…": "Live-Benchmarkdaten werden geladen…",
  "No verified benchmark data is available yet. Connect a data source or add reference records before comparing performance.": "Es sind noch keine verifizierten Benchmarkdaten verfügbar. Verbinden Sie eine Datenquelle oder fügen Sie Referenzdatensätze hinzu, bevor Sie die Leistung vergleichen.",
  "Die WordPress-Websites konnten nicht synchronisiert werden.": "Die WordPress-Websites konnten nicht synchronisiert werden.",
  "Der Generation-Job ist auf dem Server nicht mehr vorhanden. Die alte Planung wurde aus dieser Sitzung entfernt.": "Der Generierungsjob ist auf dem Server nicht mehr vorhanden. Die alte Planung wurde aus dieser Sitzung entfernt.",
  "Loading live campaign data…": "Live-Kampagnendaten werden geladen…",
  "Campaign Builder": "Kampagnen-Builder",
  "No live campaign data is available yet. Connect a verified marketing platform or add a campaign before building a new campaign.": "Es sind noch keine Live-Kampagnendaten verfügbar. Verbinden Sie eine verifizierte Marketingplattform oder fügen Sie eine Kampagne hinzu, bevor Sie eine neue Kampagne erstellen.",
  "No live attribution data is available yet. Connect a verified advertising source before running tracking checks.": "Es sind noch keine Live-Attributionsdaten verfügbar. Verbinden Sie eine verifizierte Werbequelle, bevor Sie Tracking-Prüfungen ausführen.",
  "No live finance data is available yet. Connect a finance platform or add verified records before reviewing financial metrics.": "Es sind noch keine Live-Finanzdaten verfügbar. Verbinden Sie eine Finanzplattform oder fügen Sie verifizierte Datensätze hinzu, bevor Sie Finanzkennzahlen prüfen.",
  "Loading live growth data…": "Live-Wachstumsdaten werden geladen…",
  "No live growth data is available yet. Connect verified CRM, commerce or marketing sources before reviewing growth metrics.": "Es sind noch keine Live-Wachstumsdaten verfügbar. Verbinden Sie verifizierte CRM-, Commerce- oder Marketingquellen, bevor Sie Wachstumskennzahlen prüfen.",
  "No live advertising data is available yet. Connect a verified advertising platform before reviewing spend, ROAS or conversion metrics.": "Es sind noch keine Live-Werbedaten verfügbar. Verbinden Sie eine verifizierte Werbeplattform, bevor Sie Ausgaben, ROAS oder Conversion-Kennzahlen prüfen.",
  "No live advertising audiences are available yet. Connect a verified platform before creating audience records.": "Es sind noch keine Live-Werbezielgruppen verfügbar. Verbinden Sie eine verifizierte Plattform, bevor Sie Zielgruppendatensätze erstellen.",
  "Loading live experiments…": "Live-Experimente werden geladen…",
  "No live experiments are available yet. Connect verified advertising data before creating or evaluating experiments.": "Es sind noch keine Live-Experimente verfügbar. Verbinden Sie verifizierte Werbedaten, bevor Sie Experimente erstellen oder bewerten.",
  "Loading live publishing data…": "Live-Publishingdaten werden geladen…",
  "No live publishing operations are available yet. Connect and verify an advertising platform before reviewing or publishing campaigns.": "Es sind noch keine Live-Publishing-Vorgänge verfügbar. Verbinden und verifizieren Sie eine Werbeplattform, bevor Sie Kampagnen prüfen oder veröffentlichen.",
  "Loading live budgets…": "Live-Budgets werden geladen…",
  "No live advertising budget data is available yet. Connect a verified platform before managing budgets.": "Es sind noch keine Live-Werbebudgetdaten verfügbar. Verbinden Sie eine verifizierte Plattform, bevor Sie Budgets verwalten."
};
const zh = {
  "Workspace update status unavailable": "工作区更新状态不可用",
  "Workspace update could not be started": "无法启动工作区更新",
  "The workspace update could not be started.": "无法启动工作区更新。",
  "The workspace update status could not be loaded.": "无法加载工作区更新状态。",
  "Update workspace content": "更新工作区内容",
  "Update workspace": "更新工作区",
  "Workspace content is up to date.": "工作区内容已是最新。",
  "Workspace update failed.": "工作区更新失败。",
  "Loading live marketing campaigns…": "正在加载实时营销活动…",
  "No live marketing campaigns are available yet. Create a campaign after connecting verified workspace data.": "目前没有可用的实时营销活动。连接经过验证的工作区数据后即可创建活动。",
  "live campaign": "实时营销活动",
  "in this workspace": "在此工作区中",
  "campaigns": "营销活动",
  "No live marketing data is available yet. Connect a marketing platform or add verified campaign records before reviewing performance.": "目前没有可用的实时营销数据。连接营销平台或添加经过验证的活动记录后再查看表现。",
  "No live advertising data is available yet. Connect an advertising platform or add a verified advertising record to begin.": "目前没有可用的实时广告数据。连接广告平台或添加经过验证的广告记录后即可开始。",
  "Loading live creatives…": "正在加载实时创意素材…",
  "No live creative assets are available yet. Connect a verified advertising platform before creating or syncing creatives.": "目前没有可用的实时创意素材。创建或同步素材前，请先连接经过验证的广告平台。",
  "Loading live benchmark data…": "正在加载实时基准数据…",
  "No verified benchmark data is available yet. Connect a data source or add reference records before comparing performance.": "目前没有可用的经过验证的基准数据。比较表现前，请先连接数据源或添加参考记录。",
  "Die WordPress-Websites konnten nicht synchronisiert werden.": "无法同步 WordPress 网站。",
  "Der Generation-Job ist auf dem Server nicht mehr vorhanden. Die alte Planung wurde aus dieser Sitzung entfernt.": "服务器上已不存在该生成任务。旧计划已从本次会话中移除。",
  "Loading live campaign data…": "正在加载实时活动数据…",
  "Campaign Builder": "活动构建器",
  "No live campaign data is available yet. Connect a verified marketing platform or add a campaign before building a new campaign.": "目前没有可用的实时活动数据。创建新活动前，请先连接经过验证的营销平台或添加活动。",
  "No live attribution data is available yet. Connect a verified advertising source before running tracking checks.": "目前没有可用的实时归因数据。运行跟踪检查前，请先连接经过验证的广告来源。",
  "No live finance data is available yet. Connect a finance platform or add verified records before reviewing financial metrics.": "目前没有可用的实时财务数据。查看财务指标前，请先连接财务平台或添加经过验证的记录。",
  "Loading live growth data…": "正在加载实时增长数据…",
  "No live growth data is available yet. Connect verified CRM, commerce or marketing sources before reviewing growth metrics.": "目前没有可用的实时增长数据。查看增长指标前，请先连接经过验证的 CRM、电商或营销来源。",
  "No live advertising data is available yet. Connect a verified advertising platform before reviewing spend, ROAS or conversion metrics.": "目前没有可用的实时广告数据。查看支出、ROAS 或转化指标前，请先连接经过验证的广告平台。",
  "No live advertising audiences are available yet. Connect a verified platform before creating audience records.": "目前没有可用的实时广告受众。创建受众记录前，请先连接经过验证的平台。",
  "Loading live experiments…": "正在加载实时实验…",
  "No live experiments are available yet. Connect verified advertising data before creating or evaluating experiments.": "目前没有可用的实时实验。创建或评估实验前，请先连接经过验证的广告数据。",
  "Loading live publishing data…": "正在加载实时发布数据…",
  "No live publishing operations are available yet. Connect and verify an advertising platform before reviewing or publishing campaigns.": "目前没有可用的实时发布操作。查看或发布活动前，请先连接并验证广告平台。",
  "Loading live budgets…": "正在加载实时预算…",
  "No live advertising budget data is available yet. Connect a verified platform before managing budgets.": "目前没有可用的实时广告预算数据。管理预算前，请先连接经过验证的平台。"
};
Object.assign(de, {
  "Loading live SEO data…": "Live-SEO-Daten werden geladen…",
  "Marketing / SEO": "Marketing / SEO",
  "SEO Workspace": "SEO-Workspace",
  "Verified SEO records from the connected workspace. Rankings, issues and recommendations appear only after the backend provides them.": "Verifizierte SEO-Datensätze aus dem verbundenen Workspace. Rankings, Probleme und Empfehlungen werden nur angezeigt, wenn das Backend sie bereitstellt.",
  "No verified SEO data yet": "Noch keine verifizierten SEO-Daten",
  "Connect a verified SEO or Search Console source, or add SEO records through the workspace API before reviewing keyword performance.": "Verbinden Sie eine verifizierte SEO- oder Search-Console-Quelle oder fügen Sie SEO-Datensätze über die Workspace-API hinzu, bevor Sie die Keyword-Leistung prüfen.",
  "Search live SEO records": "Live-SEO-Datensätze durchsuchen"
});
Object.assign(zh, {
  "Loading live SEO data…": "正在加载实时 SEO 数据…",
  "Marketing / SEO": "营销 / SEO",
  "SEO Workspace": "SEO 工作区",
  "Verified SEO records from the connected workspace. Rankings, issues and recommendations appear only after the backend provides them.": "来自已连接工作区的已验证 SEO 记录。只有后端提供数据后，才会显示排名、问题和建议。",
  "No verified SEO data yet": "暂时没有已验证的 SEO 数据",
  "Connect a verified SEO or Search Console source, or add SEO records through the workspace API before reviewing keyword performance.": "查看关键词表现前，请连接已验证的 SEO 或 Search Console 来源，或通过工作区 API 添加 SEO 记录。",
  "Search live SEO records": "搜索实时 SEO 记录"
});
Object.assign(de, {
  "Verified financial records from the connected workspace. Totals are calculated only from records returned by the backend.": "Verifizierte Finanzdatensätze aus dem verbundenen Workspace. Summen werden ausschließlich aus den vom Backend zurückgegebenen Datensätzen berechnet.",
  "Search live finance records": "Live-Finanzdatensätze durchsuchen"
});
Object.assign(zh, {
  "Verified financial records from the connected workspace. Totals are calculated only from records returned by the backend.": "来自已连接工作区的已验证财务记录。总额仅根据后端返回的记录计算。",
  "Search live finance records": "搜索实时财务记录"
});
Object.assign(de, {
  "Loading live sales goals…": "Live-Verkaufsziele werden geladen…",
  "Verified sales goals from the connected workspace. Progress is shown only when returned by the backend.": "Verifizierte Verkaufsziele aus dem verbundenen Workspace. Fortschritte werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified sales goals yet": "Noch keine verifizierten Verkaufsziele",
  "Create or import a sales goal through a connected CRM or the workspace API before reviewing target progress.": "Erstellen oder importieren Sie ein Verkaufsziel über ein verbundenes CRM oder die Workspace-API, bevor Sie den Zielfortschritt prüfen.",
  "Search live sales goals": "Live-Verkaufsziele durchsuchen"
});
Object.assign(zh, {
  "Loading live sales goals…": "正在加载实时销售目标…",
  "Verified sales goals from the connected workspace. Progress is shown only when returned by the backend.": "来自已连接工作区的已验证销售目标。只有后端返回数据时才会显示进度。",
  "No verified sales goals yet": "暂时没有已验证的销售目标",
  "Create or import a sales goal through a connected CRM or the workspace API before reviewing target progress.": "查看目标进度前，请通过已连接的 CRM 或工作区 API 创建或导入销售目标。",
  "Search live sales goals": "搜索实时销售目标"
});
Object.assign(de, {
  "Loading live sales opportunities…": "Live-Verkaufschancen werden geladen…",
  "Verified sales opportunities from the connected workspace. Pipeline values and statuses are shown only from backend records.": "Verifizierte Verkaufschancen aus dem verbundenen Workspace. Pipeline-Werte und Status werden nur aus Backend-Datensätzen angezeigt.",
  "No verified sales opportunities yet": "Noch keine verifizierten Verkaufschancen",
  "Connect a verified CRM or add opportunity records through the workspace API before reviewing pipeline health.": "Verbinden Sie ein verifiziertes CRM oder fügen Sie Verkaufschancen über die Workspace-API hinzu, bevor Sie die Pipeline prüfen.",
  "Search live sales opportunities": "Live-Verkaufschancen durchsuchen"
});
Object.assign(zh, {
  "Loading live sales opportunities…": "正在加载实时销售机会…",
  "Verified sales opportunities from the connected workspace. Pipeline values and statuses are shown only from backend records.": "来自已连接工作区的已验证销售机会。管道价值和状态仅显示后端记录中的数据。",
  "No verified sales opportunities yet": "暂时没有已验证的销售机会",
  "Connect a verified CRM or add opportunity records through the workspace API before reviewing pipeline health.": "查看管道健康状况前，请连接已验证的 CRM 或通过工作区 API 添加销售机会记录。",
  "Search live sales opportunities": "搜索实时销售机会"
});
Object.assign(de, {
  "Advertising / Budgets": "Werbung / Budgets",
  "Verified budget records from the connected workspace. Spend, utilization and forecasts appear only when supported by backend data.": "Verifizierte Budgetdatensätze aus dem verbundenen Workspace. Ausgaben, Auslastung und Prognosen werden nur angezeigt, wenn sie durch Backend-Daten belegt sind.",
  "Search live budget records": "Live-Budgetdatensätze durchsuchen"
});
Object.assign(zh, {
  "Advertising / Budgets": "广告 / 预算",
  "Verified budget records from the connected workspace. Spend, utilization and forecasts appear only when supported by backend data.": "来自已连接工作区的已验证预算记录。只有后端数据支持时才会显示支出、利用率和预测。",
  "Search live budget records": "搜索实时预算记录"
});
Object.assign(de, {
  "Advertising / Audiences": "Werbung / Zielgruppen",
  "Verified audience records from the connected workspace. Platform metrics appear only when returned by the backend.": "Verifizierte Zielgruppendatensätze aus dem verbundenen Workspace. Plattformmetriken werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "Search live audiences": "Live-Zielgruppen durchsuchen"
});
Object.assign(zh, {
  "Advertising / Audiences": "广告 / 受众",
  "Verified audience records from the connected workspace. Platform metrics appear only when returned by the backend.": "来自已连接工作区的已验证受众记录。只有后端返回数据时才会显示平台指标。",
  "Search live audiences": "搜索实时受众"
});
Object.assign(de, {
  "Advertising / Creatives": "Werbung / Creatives",
  "Verified creative records from the connected workspace. Platform performance appears only when returned by the backend.": "Verifizierte Creative-Datensätze aus dem verbundenen Workspace. Plattformleistung wird nur angezeigt, wenn sie vom Backend zurückgegeben wird.",
  "Search live creatives": "Live-Creatives durchsuchen",
  "Creative": "Creative"
});
Object.assign(zh, {
  "Advertising / Creatives": "广告 / 创意素材",
  "Verified creative records from the connected workspace. Platform performance appears only when returned by the backend.": "来自已连接工作区的已验证创意记录。只有后端返回数据时才会显示平台表现。",
  "Search live creatives": "搜索实时创意素材",
  "Creative": "创意素材"
});
Object.assign(de, {
  "Advertising / Tracking": "Werbung / Tracking",
  "Verified attribution records from the connected workspace. Conversion events and health signals appear only when returned by the backend.": "Verifizierte Attributionsdatensätze aus dem verbundenen Workspace. Conversion-Events und Gesundheitssignale werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "Search live attribution records": "Live-Attributionsdatensätze durchsuchen"
});
Object.assign(zh, {
  "Advertising / Tracking": "广告 / 跟踪",
  "Verified attribution records from the connected workspace. Conversion events and health signals appear only when returned by the backend.": "来自已连接工作区的已验证归因记录。只有后端返回数据时才会显示转化事件和健康信号。",
  "Search live attribution records": "搜索实时归因记录"
});
Object.assign(de, {
  "No live ecommerce data is available yet. Connect a verified store before reviewing orders, customers or revenue.": "Noch keine Live-E-Commerce-Daten verfügbar. Verbinden Sie einen verifizierten Shop, bevor Sie Bestellungen, Kunden oder Umsatz prüfen.",
  "Commerce / Overview": "Commerce / Übersicht",
  "Verified ecommerce records from the connected workspace. Revenue, orders, customers and stores appear only when returned by the backend.": "Verifizierte E-Commerce-Datensätze aus dem verbundenen Workspace. Umsatz, Bestellungen, Kunden und Shops werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "Search live ecommerce records": "Live-E-Commerce-Datensätze durchsuchen"
});
Object.assign(zh, {
  "No live ecommerce data is available yet. Connect a verified store before reviewing orders, customers or revenue.": "暂时没有实时电商数据。查看订单、客户或收入前，请连接已验证的商店。",
  "Commerce / Overview": "商务 / 概览",
  "Verified ecommerce records from the connected workspace. Revenue, orders, customers and stores appear only when returned by the backend.": "来自已连接工作区的已验证电商记录。只有后端返回数据时才会显示收入、订单、客户和商店。",
  "Search live ecommerce records": "搜索实时电商记录"
});
Object.assign(de, {
  "Loading live ecommerce data…": "Live-E-Commerce-Daten werden geladen…",
  "Intelligence / Ecommerce": "Intelligence / E-Commerce",
  "Verified ecommerce product records from the connected workspace.": "Verifizierte E-Commerce-Produktdatensätze aus dem verbundenen Workspace."
});
Object.assign(zh, {
  "Loading live ecommerce data…": "正在加载实时电商数据…",
  "Intelligence / Ecommerce": "智能 / 电商",
  "Verified ecommerce product records from the connected workspace.": "来自已连接工作区的已验证电商产品记录。"
});
Object.assign(de, {
  "Intelligence / Overview": "Intelligence / Übersicht",
  "Verified intelligence records from the connected workspace. Scores, changes and recommendations appear only when returned by the backend.": "Verifizierte Intelligence-Datensätze aus dem verbundenen Workspace. Scores, Änderungen und Empfehlungen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified intelligence insights yet": "Noch keine verifizierten Intelligence-Erkenntnisse",
  "Refresh after connected workspace data has been analyzed. No health score, trend or recommendation is inferred without a verified record.": "Aktualisieren Sie nach der Analyse der verbundenen Workspace-Daten. Ohne verifizierten Datensatz werden kein Health-Score, Trend oder Empfehlung abgeleitet.",
  "Sources:": "Quellen:"
});
Object.assign(zh, {
  "Intelligence / Overview": "智能 / 概览",
  "Verified intelligence records from the connected workspace. Scores, changes and recommendations appear only when returned by the backend.": "来自已连接工作区的已验证智能记录。只有后端返回数据时才会显示评分、变化和建议。",
  "No verified intelligence insights yet": "暂时没有已验证的智能洞察",
  "Refresh after connected workspace data has been analyzed. No health score, trend or recommendation is inferred without a verified record.": "连接的工作区数据分析完成后请刷新。没有经过验证的记录时，不会推断健康评分、趋势或建议。",
  "Sources:": "来源："
});
Object.assign(de, {
  "Loading live trends…": "Live-Trends werden geladen…",
  "Intelligence / Trends": "Intelligence / Trends",
  "Verified trend signals from the connected workspace. Direction, confidence and change are shown only when returned by the backend.": "Verifizierte Trendsignale aus dem verbundenen Workspace. Richtung, Konfidenz und Veränderung werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified trends yet": "Noch keine verifizierten Trends",
  "Refresh after connected workspace data has been analyzed. No trend direction, percentage or chart is inferred without a verified insight.": "Aktualisieren Sie nach der Analyse der verbundenen Workspace-Daten. Ohne verifizierte Erkenntnis werden keine Trendrichtung, Prozentzahl oder Grafik abgeleitet.",
  "Search live trends": "Live-Trends durchsuchen"
});
Object.assign(zh, {
  "Loading live trends…": "正在加载实时趋势…",
  "Intelligence / Trends": "智能 / 趋势",
  "Verified trend signals from the connected workspace. Direction, confidence and change are shown only when returned by the backend.": "来自已连接工作区的已验证趋势信号。只有后端返回数据时才会显示方向、置信度和变化。",
  "No verified trends yet": "暂时没有已验证的趋势",
  "Refresh after connected workspace data has been analyzed. No trend direction, percentage or chart is inferred without a verified insight.": "连接的工作区数据分析完成后请刷新。没有经过验证的洞察时，不会推断趋势方向、百分比或图表。",
  "Search live trends": "搜索实时趋势"
});
Object.assign(de, {
  "Loading live KPIs…": "Live-KPIs werden geladen…",
  "Intelligence / KPI Explorer": "Intelligence / KPI-Explorer",
  "Verified KPI definitions from the connected workspace. Values, changes and status appear only when returned by the backend.": "Verifizierte KPI-Definitionen aus dem verbundenen Workspace. Werte, Änderungen und Status werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified KPIs yet": "Noch keine verifizierten KPIs",
  "Connect and analyze a verified data source before reviewing KPI values, comparisons or forecasts.": "Verbinden und analysieren Sie eine verifizierte Datenquelle, bevor Sie KPI-Werte, Vergleiche oder Prognosen prüfen.",
  "Search live KPIs": "Live-KPIs durchsuchen"
});
Object.assign(zh, {
  "Loading live KPIs…": "正在加载实时 KPI…",
  "Intelligence / KPI Explorer": "智能 / KPI 探索器",
  "Verified KPI definitions from the connected workspace. Values, changes and status appear only when returned by the backend.": "来自已连接工作区的已验证 KPI 定义。只有后端返回数据时才会显示数值、变化和状态。",
  "No verified KPIs yet": "暂时没有已验证的 KPI",
  "Connect and analyze a verified data source before reviewing KPI values, comparisons or forecasts.": "查看 KPI 数值、比较或预测前，请连接并分析已验证的数据源。",
  "Search live KPIs": "搜索实时 KPI"
});
Object.assign(de, {
  "Loading live forecasts…": "Live-Prognosen werden geladen…",
  "Intelligence / Forecasts": "Intelligence / Prognosen",
  "Verified forecast records from the connected workspace. Projections and confidence appear only when returned by the backend.": "Verifizierte Prognosedatensätze aus dem verbundenen Workspace. Projektionen und Konfidenz werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified forecasts yet": "Noch keine verifizierten Prognosen",
  "Connect historical records and generate a forecast before reviewing projections, scenarios or confidence ranges.": "Verbinden Sie historische Datensätze und erstellen Sie eine Prognose, bevor Sie Projektionen, Szenarien oder Konfidenzbereiche prüfen."
});
Object.assign(zh, {
  "Loading live forecasts…": "正在加载实时预测…",
  "Intelligence / Forecasts": "智能 / 预测",
  "Verified forecast records from the connected workspace. Projections and confidence appear only when returned by the backend.": "来自已连接工作区的已验证预测记录。只有后端返回数据时才会显示预测和置信度。",
  "No verified forecasts yet": "暂时没有已验证的预测",
  "Connect historical records and generate a forecast before reviewing projections, scenarios or confidence ranges.": "查看预测、情景或置信区间前，请连接历史记录并生成预测。"
});
Object.assign(de, {
  "Loading live comparisons…": "Live-Vergleiche werden geladen…",
  "Intelligence / Comparisons": "Intelligence / Vergleiche",
  "Verified KPI records available for comparison. Results appear only after the backend returns compatible comparison data.": "Verifizierte KPI-Datensätze für den Vergleich verfügbar. Ergebnisse werden erst angezeigt, wenn das Backend kompatible Vergleichsdaten zurückgibt.",
  "No compatible comparison data yet": "Noch keine kompatiblen Vergleichsdaten",
  "At least two compatible verified KPI records are required. No differences, scores or trends are inferred without backend data.": "Mindestens zwei kompatible, verifizierte KPI-Datensätze sind erforderlich. Ohne Backend-Daten werden keine Unterschiede, Scores oder Trends abgeleitet.",
  "2 verified KPI records available for comparison.": "2 verifizierte KPI-Datensätze für den Vergleich verfügbar."
});
Object.assign(zh, {
  "Loading live comparisons…": "正在加载实时比较…",
  "Intelligence / Comparisons": "智能 / 比较",
  "Verified KPI records available for comparison. Results appear only after the backend returns compatible comparison data.": "已有可用于比较的已验证 KPI 记录。只有后端返回兼容的比较数据时才会显示结果。",
  "No compatible comparison data yet": "暂时没有兼容的比较数据",
  "At least two compatible verified KPI records are required. No differences, scores or trends are inferred without backend data.": "至少需要两条兼容的已验证 KPI 记录。没有后端数据时，不会推断差异、评分或趋势。",
  "2 verified KPI records available for comparison.": "有 2 条已验证 KPI 记录可供比较。"
});
Object.assign(de, {
  "verified KPI records available for comparison.": "verifizierte KPI-Datensätze für den Vergleich verfügbar."
});
Object.assign(zh, {
  "verified KPI records available for comparison.": "条已验证 KPI 记录可供比较。"
});
Object.assign(de, {
  "Loading live anomalies…": "Live-Anomalien werden geladen…",
  "Intelligence / Anomalies": "Intelligence / Anomalien",
  "Verified anomaly records from connected workspace data. Severity, deviation and evidence appear only when returned by the backend.": "Verifizierte Anomalie-Datensätze aus verbundenen Workspace-Daten. Schweregrad, Abweichung und Belege werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified anomalies yet": "Noch keine verifizierten Anomalien",
  "Connect and analyze a verified data source before reviewing anomaly charts, causes or recommended actions.": "Verbinden und analysieren Sie eine verifizierte Datenquelle, bevor Sie Anomalie-Charts, Ursachen oder empfohlene Maßnahmen prüfen.",
  "Anomaly": "Anomalie"
});
Object.assign(zh, {
  "Loading live anomalies…": "正在加载实时异常…",
  "Intelligence / Anomalies": "智能 / 异常",
  "Verified anomaly records from connected workspace data. Severity, deviation and evidence appear only when returned by the backend.": "来自已连接工作区数据的已验证异常记录。只有后端返回数据时才会显示严重程度、偏差和证据。",
  "No verified anomalies yet": "暂时没有已验证的异常",
  "Connect and analyze a verified data source before reviewing anomaly charts, causes or recommended actions.": "查看异常图表、原因或建议操作前，请连接并分析已验证的数据源。",
  "Anomaly": "异常"
});
Object.assign(de, {
  "Loading live advertising accounts…": "Live-Werbekonten werden geladen…",
  "Advertising / Accounts": "Werbung / Konten",
  "Verified advertising account records from connected providers. Permissions and publishing capabilities appear only when returned by the backend.": "Verifizierte Werbekonto-Datensätze verbundener Anbieter. Berechtigungen und Veröffentlichungsfunktionen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No advertising accounts connected": "Keine Werbekonten verbunden",
  "Connect a supported advertising provider before reviewing account permissions, publishing capabilities or spend data.": "Verbinden Sie einen unterstützten Werbeanbieter, bevor Sie Kontoberechtigungen, Veröffentlichungsfunktionen oder Ausgabendaten prüfen."
});
Object.assign(zh, {
  "Loading live advertising accounts…": "正在加载实时广告账户…",
  "Advertising / Accounts": "广告 / 账户",
  "Verified advertising account records from connected providers. Permissions and publishing capabilities appear only when returned by the backend.": "来自已连接提供商的已验证广告账户记录。只有后端返回数据时才会显示权限和发布功能。",
  "No advertising accounts connected": "尚未连接广告账户",
  "Connect a supported advertising provider before reviewing account permissions, publishing capabilities or spend data.": "请先连接受支持的广告提供商，再查看账户权限、发布功能或支出数据。"
});
Object.assign(de, {
  "Advertising / Campaigns": "Werbung / Kampagnen",
  "Verified advertising campaign records from connected providers. Performance metrics and publishing actions appear only when returned by the backend.": "Verifizierte Werbekampagnen-Datensätze verbundener Anbieter. Leistungskennzahlen und Veröffentlichungsaktionen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified campaigns yet": "Noch keine verifizierten Kampagnen",
  "Connect an advertising provider and synchronize campaign records before reviewing spend, performance or publishing actions.": "Verbinden Sie einen Werbeanbieter und synchronisieren Sie Kampagnendaten, bevor Sie Ausgaben, Leistung oder Veröffentlichungsaktionen prüfen."
});
Object.assign(zh, {
  "Advertising / Campaigns": "广告 / 活动",
  "Verified advertising campaign records from connected providers. Performance metrics and publishing actions appear only when returned by the backend.": "来自已连接提供商的已验证广告活动记录。只有后端返回数据时才会显示绩效指标和发布操作。",
  "No verified campaigns yet": "暂时没有已验证的广告活动",
  "Connect an advertising provider and synchronize campaign records before reviewing spend, performance or publishing actions.": "请先连接广告提供商并同步活动记录，再查看支出、绩效或发布操作。"
});
Object.assign(de, {
  "Loading live opportunities…": "Live-Chancen werden geladen…",
  "Intelligence / Opportunities": "Intelligence / Chancen",
  "Verified growth opportunity records from connected workspace data. Potential, confidence and recommendations appear only when returned by the backend.": "Verifizierte Wachstumschancen aus verbundenen Workspace-Daten. Potenzial, Konfidenz und Empfehlungen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified opportunities yet": "Noch keine verifizierten Chancen",
  "Connect and analyze verified workspace data before reviewing opportunity potential or AI recommendations.": "Verbinden und analysieren Sie verifizierte Workspace-Daten, bevor Sie Chancenpotenzial oder AI-Empfehlungen prüfen."
});
Object.assign(zh, {
  "Loading live opportunities…": "正在加载实时机会…",
  "Intelligence / Opportunities": "智能 / 机会",
  "Verified growth opportunity records from connected workspace data. Potential, confidence and recommendations appear only when returned by the backend.": "来自已连接工作区数据的已验证增长机会记录。只有后端返回数据时才会显示潜力、置信度和建议。",
  "No verified opportunities yet": "暂时没有已验证的机会",
  "Connect and analyze verified workspace data before reviewing opportunity potential or AI recommendations.": "请先连接并分析已验证的工作区数据，再查看机会潜力或 AI 建议。"
});
Object.assign(de, {
  "Loading live conversations…": "Live-Unterhaltungen werden geladen…",
  "AI / Conversations": "AI / Unterhaltungen",
  "Verified conversation records from this workspace. Messages and assistant output appear only when returned by the backend.": "Verifizierte Unterhaltungsdatensätze dieses Workspaces. Nachrichten und Assistant-Ausgaben werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No conversations yet": "Noch keine Unterhaltungen",
  "Start a conversation after the workspace is connected. No example messages or AI conclusions are shown.": "Starten Sie eine Unterhaltung, nachdem der Workspace verbunden wurde. Es werden keine Beispielnachrichten oder AI-Schlussfolgerungen angezeigt."
});
Object.assign(zh, {
  "Loading live conversations…": "正在加载实时对话…",
  "AI / Conversations": "AI / 对话",
  "Verified conversation records from this workspace. Messages and assistant output appear only when returned by the backend.": "此工作区的已验证对话记录。只有后端返回数据时才会显示消息和助手输出。",
  "No conversations yet": "暂时没有对话",
  "Start a conversation after the workspace is connected. No example messages or AI conclusions are shown.": "连接工作区后即可开始对话。不会显示示例消息或 AI 结论。"
});
Object.assign(de, {
  "Loading live shipping records…": "Live-Versanddaten werden geladen…",
  "Ecommerce / Shipping": "E-Commerce / Versand",
  "Verified shipping and fulfillment records from connected stores. Delivery status and exceptions appear only when returned by the backend.": "Verifizierte Versand- und Fulfillment-Datensätze verbundener Shops. Lieferstatus und Ausnahmen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified shipping records yet": "Noch keine verifizierten Versanddaten",
  "Connect a store and synchronize fulfillment data before reviewing delivery performance or exceptions.": "Verbinden Sie einen Shop und synchronisieren Sie Fulfillment-Daten, bevor Sie Lieferleistung oder Ausnahmen prüfen.",
  "Shipping": "Versand"
});
Object.assign(zh, {
  "Loading live shipping records…": "正在加载实时配送记录…",
  "Ecommerce / Shipping": "电子商务 / 配送",
  "Verified shipping and fulfillment records from connected stores. Delivery status and exceptions appear only when returned by the backend.": "来自已连接商店的已验证配送和履约记录。只有后端返回数据时才会显示配送状态和异常。",
  "No verified shipping records yet": "暂时没有已验证的配送记录",
  "Connect a store and synchronize fulfillment data before reviewing delivery performance or exceptions.": "请先连接商店并同步履约数据，再查看配送表现或异常。",
  "Shipping": "配送"
});
Object.assign(de, { "Shipment": "Sendung" });
Object.assign(zh, { "Shipment": "货件" });
Object.assign(de, {
  "Loading live inventory records…": "Live-Bestandsdaten werden geladen…",
  "Ecommerce / Inventory": "E-Commerce / Bestand",
  "Verified inventory records from connected stores. Stock levels and warnings appear only when returned by the backend.": "Verifizierte Bestandsdatensätze verbundener Shops. Lagerbestände und Warnungen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified inventory records yet": "Noch keine verifizierten Bestandsdaten",
  "Connect a store and synchronize product inventory before reviewing stock levels or inventory warnings.": "Verbinden Sie einen Shop und synchronisieren Sie den Produktbestand, bevor Sie Lagerbestände oder Bestandswarnungen prüfen.",
  "Item": "Artikel"
});
Object.assign(zh, {
  "Loading live inventory records…": "正在加载实时库存记录…",
  "Ecommerce / Inventory": "电子商务 / 库存",
  "Verified inventory records from connected stores. Stock levels and warnings appear only when returned by the backend.": "来自已连接商店的已验证库存记录。只有后端返回数据时才会显示库存水平和警告。",
  "No verified inventory records yet": "暂时没有已验证的库存记录",
  "Connect a store and synchronize product inventory before reviewing stock levels or inventory warnings.": "请先连接商店并同步商品库存，再查看库存水平或库存警告。",
  "Item": "商品"
});
Object.assign(de, {
  "Loading live payment records…": "Live-Zahlungsdaten werden geladen…",
  "Ecommerce / Payments": "E-Commerce / Zahlungen",
  "Verified payment records from connected stores. Status, provider and issue data appear only when returned by the backend.": "Verifizierte Zahlungsdatensätze verbundener Shops. Status, Anbieter und Problemdaten werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified payment records yet": "Noch keine verifizierten Zahlungsdaten",
  "Connect a store and synchronize payment data before reviewing transactions, refunds or payment issues.": "Verbinden Sie einen Shop und synchronisieren Sie Zahlungsdaten, bevor Sie Transaktionen, Erstattungen oder Zahlungsprobleme prüfen."
});
Object.assign(zh, {
  "Loading live payment records…": "正在加载实时支付记录…",
  "Ecommerce / Payments": "电子商务 / 支付",
  "Verified payment records from connected stores. Status, provider and issue data appear only when returned by the backend.": "来自已连接商店的已验证支付记录。只有后端返回数据时才会显示状态、提供商和问题数据。",
  "No verified payment records yet": "暂时没有已验证的支付记录",
  "Connect a store and synchronize payment data before reviewing transactions, refunds or payment issues.": "请先连接商店并同步支付数据，再查看交易、退款或支付问题。"
});
Object.assign(de, {
  "Loading live return records…": "Live-Rückgabedaten werden geladen…",
  "Ecommerce / Returns & Refunds": "E-Commerce / Rückgaben und Erstattungen",
  "Returns & Refunds": "Rückgaben und Erstattungen",
  "Verified return and refund records from connected stores. Customer, status and issue data appear only when returned by the backend.": "Verifizierte Rückgabe- und Erstattungsdatensätze verbundener Shops. Kunden-, Status- und Problemdaten werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified return records yet": "Noch keine verifizierten Rückgabedaten",
  "Connect a store and synchronize returns before reviewing refunds, reasons or customer issues.": "Verbinden Sie einen Shop und synchronisieren Sie Rückgaben, bevor Sie Erstattungen, Gründe oder Kundenprobleme prüfen."
});
Object.assign(zh, {
  "Loading live return records…": "正在加载实时退货记录…",
  "Ecommerce / Returns & Refunds": "电子商务 / 退货与退款",
  "Returns & Refunds": "退货与退款",
  "Verified return and refund records from connected stores. Customer, status and issue data appear only when returned by the backend.": "来自已连接商店的已验证退货和退款记录。只有后端返回数据时才会显示客户、状态和问题数据。",
  "No verified return records yet": "暂时没有已验证的退货记录",
  "Connect a store and synchronize returns before reviewing refunds, reasons or customer issues.": "请先连接商店并同步退货数据，再查看退款、原因或客户问题。"
});
Object.assign(de, { "Ecommerce / Returns &amp; Refunds": "E-Commerce / Rückgaben und Erstattungen", "Returns &amp; Refunds": "Rückgaben und Erstattungen" });
Object.assign(zh, { "Ecommerce / Returns &amp; Refunds": "电子商务 / 退货与退款", "Returns &amp; Refunds": "退货与退款" });
Object.assign(de, {
  "Ecommerce / Taxes": "E-Commerce / Steuern",
  "Verified tax records from connected finance sources. Rates, jurisdictions and obligations appear only when returned by the backend.": "Verifizierte Steuerdatensätze verbundener Finanzquellen. Sätze, Rechtsgebiete und Verpflichtungen werden nur angezeigt, wenn sie vom Backend zurückgegeben werden.",
  "No verified tax records yet": "Noch keine verifizierten Steuerdaten",
  "Connect a finance platform and synchronize tax data before reviewing rates, jurisdictions or obligations.": "Verbinden Sie eine Finanzplattform und synchronisieren Sie Steuerdaten, bevor Sie Sätze, Rechtsgebiete oder Verpflichtungen prüfen.",
  "Tax record": "Steuerdatensatz"
});
Object.assign(zh, {
  "Ecommerce / Taxes": "电子商务 / 税务",
  "Verified tax records from connected finance sources. Rates, jurisdictions and obligations appear only when returned by the backend.": "来自已连接财务来源的已验证税务记录。只有后端返回数据时才会显示税率、管辖区和义务。",
  "No verified tax records yet": "暂时没有已验证的税务记录",
  "Connect a finance platform and synchronize tax data before reviewing rates, jurisdictions or obligations.": "请先连接财务平台并同步税务数据，再查看税率、管辖区或义务。",
  "Tax record": "税务记录"
});
const update = (code, values) => {
  const path = join(root, "src", "i18n", "locales", `${code}.json`);
  const current = JSON.parse(readFileSync(path, "utf8"));
  writeFileSync(path, `${JSON.stringify({ ...current, ...values }, null, 2)}\n`);
};
update("de", de);
update("zh-CN", zh);
update("en", {
  "Die WordPress-Websites konnten nicht synchronisiert werden.": "The WordPress websites could not be synchronized.",
  "Der Generation-Job ist auf dem Server nicht mehr vorhanden. Die alte Planung wurde aus dieser Sitzung entfernt.": "The generation job is no longer available on the server. The previous plan was removed from this session."
});
console.log(`Updated ${Object.keys(de).length} German keys, ${Object.keys(zh).length} Chinese keys, and 2 English keys.`);
