import fs from 'node:fs/promises';
import path from 'node:path';

const file = path.resolve('src/components/ApiWalletPanel.tsx');
const source = await fs.readFile(file, 'utf8');
const failures = [];

const packagesMatch = source.match(/const packages\s*=\s*\[([^\]]+)\]/);
const packages = packagesMatch
  ? [...packagesMatch[1].matchAll(/\b\d+(?:\.\d+)?\b/g)].map((match) => Number(match[0]))
  : [];
if (JSON.stringify(packages) !== JSON.stringify([500, 1000])) {
  failures.push('AI wallet packages must be exactly 500 and 1000 CNY');
}

const methodsMatch = source.match(/const methods:[\s\S]*?=\s*\[([\s\S]*?)\];/);
const methods = methodsMatch?.[1] ?? '';
for (const method of ['alipaycn', 'wechatpay']) {
  if (!methods.includes(`id: "${method}"`)) failures.push(`AI wallet must expose ${method}`);
}
if (methods.includes('id: "card"') || /\bBank card\b/i.test(methods)) {
  failures.push('AI wallet must not expose bank-card payment');
}
if (/\b250\b/.test(source)) failures.push('AI wallet must not expose the retired 250 CNY package');

const result = { file: path.relative(process.cwd(), file), packages, failures };
console.log(JSON.stringify({ ...result, passed: failures.length === 0 }, null, 2));
if (failures.length) process.exitCode = 1;
