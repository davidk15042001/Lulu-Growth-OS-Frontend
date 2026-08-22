import fs from 'node:fs';
const entries = {
  de: {
    'Loading live discount records…': 'Live-Rabattdatensätze werden geladen …',
    discounts: 'Rabatte',
    'No AI draft available': 'Kein KI-Entwurf verfügbar',
    'Live data only — not published': 'Nur Live-Daten — nicht veröffentlicht',
    'Connect an ecommerce platform to generate a draft from verified data.': 'Verbinden Sie eine E-Commerce-Plattform, um aus verifizierten Daten einen Entwurf zu erstellen.',
    'No synchronization records are available from connected ecommerce platforms yet.': 'Von verbundenen E-Commerce-Plattformen sind noch keine Synchronisationsdaten verfügbar.',
    'No discount activity is available yet. Activity will appear after a connected platform reports verified records.': 'Noch keine Rabattaktivitäten verfügbar. Aktivitäten erscheinen, sobald eine verbundene Plattform verifizierte Datensätze meldet.'
  },
  'zh-CN': {
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
