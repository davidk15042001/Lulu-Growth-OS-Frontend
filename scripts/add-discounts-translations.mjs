import fs from 'node:fs';
const entries = {
  de: {
    'Lulu AI Assistant': 'Lulu AI-Assistent',
    'Ask Lulu about your workspace': 'Fragen Sie Lulu zu Ihrem Workspace',
    'Answers are generated from your selected workspace and connected records. No example conversations or business metrics are displayed.': 'Antworten werden aus Ihrem ausgewählten Workspace und verbundenen Datensätzen erzeugt. Es werden keine Beispielunterhaltungen oder Geschäftsmetriken angezeigt.',
    'Ask Lulu AI about your workspace…': 'Lulu AI zu Ihrem Workspace fragen …',
    'Working…': 'Wird verarbeitet …',
    'Loading live decisions…': 'Live-Entscheidungen werden geladen …',
    'Intelligence / Decisions': 'Intelligence / Entscheidungen',
    'Verified decision records from the selected workspace. Evidence and recommendations appear only when returned by the backend.': 'Verifizierte Entscheidungsdatensätze aus dem ausgewählten Workspace. Belege und Empfehlungen werden nur angezeigt, wenn sie vom Backend geliefert werden.',
    'No verified decisions yet': 'Noch keine verifizierten Entscheidungen',
    'Create or connect a real workspace decision before reviewing evidence, scenarios, risk or AI recommendations. No example decisions are displayed.': 'Erstellen oder verbinden Sie zuerst eine echte Workspace-Entscheidung, bevor Sie Belege, Szenarien, Risiken oder KI-Empfehlungen prüfen. Es werden keine Beispielentscheidungen angezeigt.',
    'decisions': 'Entscheidungen',
    Decision: 'Entscheidung',
    'Loading live AI activity…': 'Live-AI-Aktivitäten werden geladen …',
    'AI / Activity': 'AI / Aktivitäten',
    'Verified AI activity records from the selected workspace. No system events or AI conclusions are inferred without backend data.': 'Verifizierte AI-Aktivitätsdatensätze aus dem ausgewählten Workspace. Ohne Backend-Daten werden keine Systemereignisse oder KI-Schlussfolgerungen angenommen.',
    'No verified AI activity yet': 'Noch keine verifizierten AI-Aktivitäten',
    'AI activity will appear after connected workspace actions are recorded by the backend. No example events are displayed.': 'AI-Aktivitäten erscheinen, sobald verbundene Workspace-Aktionen vom Backend aufgezeichnet wurden. Es werden keine Beispielereignisse angezeigt.',
    'Loading live discount records…': 'Live-Rabattdatensätze werden geladen …',
    discounts: 'Rabatte',
    'No AI draft available': 'Kein KI-Entwurf verfügbar',
    'Live data only — not published': 'Nur Live-Daten — nicht veröffentlicht',
    'Connect an ecommerce platform to generate a draft from verified data.': 'Verbinden Sie eine E-Commerce-Plattform, um aus verifizierten Daten einen Entwurf zu erstellen.',
    'No synchronization records are available from connected ecommerce platforms yet.': 'Von verbundenen E-Commerce-Plattformen sind noch keine Synchronisationsdaten verfügbar.',
    'No discount activity is available yet. Activity will appear after a connected platform reports verified records.': 'Noch keine Rabattaktivitäten verfügbar. Aktivitäten erscheinen, sobald eine verbundene Plattform verifizierte Datensätze meldet.'
  },
  'zh-CN': {
    'Lulu AI Assistant': 'Lulu AI 助手',
    'Ask Lulu about your workspace': '询问 Lulu 关于您的工作区',
    'Answers are generated from your selected workspace and connected records. No example conversations or business metrics are displayed.': '答案将根据您选择的工作区和已连接的记录生成。不会显示示例对话或业务指标。',
    'Ask Lulu AI about your workspace…': '询问 Lulu AI 关于您的工作区…',
    'Working…': '处理中…',
    'Loading live decisions…': '正在加载实时决策…',
    'Intelligence / Decisions': '智能分析 / 决策',
    'Verified decision records from the selected workspace. Evidence and recommendations appear only when returned by the backend.': '来自所选工作区的已验证决策记录。仅当后端返回时才显示证据和建议。',
    'No verified decisions yet': '暂无已验证的决策',
    'Create or connect a real workspace decision before reviewing evidence, scenarios, risk or AI recommendations. No example decisions are displayed.': '请先创建或连接真实的工作区决策，再查看证据、场景、风险或 AI 建议。不会显示示例决策。',
    'decisions': '决策',
    Decision: '决策',
    'Loading live AI activity…': '正在加载实时 AI 活动…',
    'AI / Activity': 'AI / 活动',
    'Verified AI activity records from the selected workspace. No system events or AI conclusions are inferred without backend data.': '来自所选工作区的已验证 AI 活动记录。没有后端数据时，不会推断系统事件或 AI 结论。',
    'No verified AI activity yet': '暂无已验证的 AI 活动',
    'AI activity will appear after connected workspace actions are recorded by the backend. No example events are displayed.': '连接的工作区操作由后端记录后，AI 活动将显示在此处。不会显示示例事件。',
    'Loading live discount records…': '正在加载实时折扣记录…',
    discounts: '折扣',
    'No AI draft available': '暂无 AI 草稿',
    'Live data only — not published': '仅显示实时数据 — 尚未发布',
    'Connect an ecommerce platform to generate a draft from verified data.': '连接电商平台，以便根据已验证的数据生成草稿。',
    'No synchronization records are available from connected ecommerce platforms yet.': '连接的电商平台暂时没有同步记录。',
    'No discount activity is available yet. Activity will appear after a connected platform reports verified records.': '暂时没有折扣活动。连接的平台报告已验证记录后，活动会显示在这里。'
  }
};
for (const [language, additions] of Object.entries(entries)) {
  const path = `/home/ubuntu/lulu-growth-frontend/src/i18n/runtime-overrides/${language}.json`;
  const current = JSON.parse(fs.readFileSync(path, 'utf8'));
  fs.writeFileSync(path, `${JSON.stringify({ ...current, ...additions }, null, 2)}\n`);
}
