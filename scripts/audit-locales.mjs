import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/i18n');
const localeDir = path.join(root, 'locales');
const overrideDir = path.join(root, 'runtime-overrides');
const localeFiles = fs.readdirSync(localeDir).filter((name) => name.endsWith('.json')).sort();
const base = JSON.parse(fs.readFileSync(path.join(localeDir, 'en.json'), 'utf8'));
const keys = Object.keys(base);
const flatten = (value, prefix = '') => {
  const result = {};
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) Object.assign(result, flatten(child, prefix ? `${prefix}.${key}` : key));
  } else result[prefix] = value;
  return result;
};
const baseFlat = flatten(base);
console.log(`BASE_KEYS=${keys.length}`);
for (const file of localeFiles) {
  const code = file.replace(/\.json$/, '');
  const data = JSON.parse(fs.readFileSync(path.join(localeDir, file), 'utf8'));
  const flat = flatten(data);
  const missing = Object.keys(baseFlat).filter((key) => !(key in flat));
  const extra = Object.keys(flat).filter((key) => !(key in baseFlat));
  const sameAsEnglish = code === 'en' ? [] : Object.keys(baseFlat).filter((key) => key in flat && flat[key] === baseFlat[key] && typeof flat[key] === 'string');
  const overridePath = path.join(overrideDir, file);
  const overrides = fs.existsSync(overridePath) ? flatten(JSON.parse(fs.readFileSync(overridePath, 'utf8'))) : {};
  console.log(`${code} keys=${Object.keys(flat).length} missing=${missing.length} extra=${extra.length} same_as_en=${sameAsEnglish.length} overrides=${Object.keys(overrides).length}`);
  if (missing.length) console.log(`  MISSING ${missing.slice(0, 12).join(' | ')}`);
  if (sameAsEnglish.length) console.log(`  SAME ${sameAsEnglish.slice(0, 12).join(' | ')}`);
}
