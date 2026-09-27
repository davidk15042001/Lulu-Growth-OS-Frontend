import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const distAssets = path.resolve('dist/assets');
const normalChunkLimitBytes = 550_000;
const videoChunkLimitBytes = 1_800_000;

let entries;
try {
  entries = await readdir(distAssets, { withFileTypes: true });
} catch (error) {
  throw new Error('The production build must run before the bundle audit.', { cause: error });
}

const javascriptFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
  .map((entry) => entry.name)
  .sort();

if (javascriptFiles.length === 0) {
  throw new Error('The production build did not emit JavaScript assets.');
}

const chunks = [];
for (const name of javascriptFiles) {
  const bytes = (await stat(path.join(distAssets, name))).size;
  const isVideoChunk = name.startsWith('video-calls-');
  const limitBytes = isVideoChunk ? videoChunkLimitBytes : normalChunkLimitBytes;
  chunks.push({ name, bytes, limitBytes, allowed: bytes <= limitBytes });
}

const failures = chunks
  .filter((chunk) => !chunk.allowed)
  .map((chunk) => `${chunk.name} is ${chunk.bytes} bytes; limit is ${chunk.limitBytes} bytes`);

const result = {
  javascriptAssets: javascriptFiles.length,
  normalChunkLimitBytes,
  videoChunkLimitBytes,
  largestChunks: [...chunks].sort((a, b) => b.bytes - a.bytes).slice(0, 8),
  failures,
  passed: failures.length === 0,
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
