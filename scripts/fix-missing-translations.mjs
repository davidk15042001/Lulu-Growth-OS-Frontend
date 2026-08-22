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
