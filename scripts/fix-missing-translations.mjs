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
