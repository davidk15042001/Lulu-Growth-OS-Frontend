import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from './config.js';
import type { AppState, SiteConnection, SiteRun } from './types.js';

const DEFAULT_STATE: AppState = {
  sites: [],
  runs: [],
};

async function ensureStoreFile() {
  const absolutePath = path.resolve(process.cwd(), config.STORE_PATH);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  try {
    await readFile(absolutePath, 'utf8');
  } catch {
    await writeFile(absolutePath, JSON.stringify(DEFAULT_STATE, null, 2), 'utf8');
  }
  return absolutePath;
}

async function readState(): Promise<AppState> {
  const absolutePath = await ensureStoreFile();
  const raw = await readFile(absolutePath, 'utf8');
  return JSON.parse(raw) as AppState;
}

let writeQueue = Promise.resolve();

async function writeStateAtomically(state: AppState) {
  const absolutePath = await ensureStoreFile();
  const tempPath = `${absolutePath}.${randomUUID()}.tmp`;
  await writeFile(tempPath, JSON.stringify(state, null, 2), 'utf8');
  await rename(tempPath, absolutePath);
}

function queueWrite<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation);
  writeQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

async function mutateState<T>(mutation: (state: AppState) => Promise<T> | T): Promise<T> {
  return queueWrite(async () => {
    const state = await readState();
    const result = await mutation(state);
    await writeStateAtomically(state);
    return result;
  });
}

export async function listSites() {
  const state = await readState();
  return state.sites;
}

export async function listRuns(siteId?: string) {
  const state = await readState();
  const runs = siteId ? state.runs.filter((run) => run.siteId === siteId) : state.runs;
  return runs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getSite(siteId: string) {
  const state = await readState();
  return state.sites.find((site) => site.id === siteId) ?? null;
}

export async function getRun(runId: string) {
  const state = await readState();
  return state.runs.find((run) => run.id === runId) ?? null;
}

export async function saveSite(site: SiteConnection) {
  return mutateState(async (state) => {
    const index = state.sites.findIndex((entry) => entry.id === site.id);
    if (index === -1) {
      state.sites.push(site);
    } else {
      state.sites[index] = site;
    }
    return site;
  });
}

export async function saveRun(run: SiteRun) {
  return mutateState(async (state) => {
    const index = state.runs.findIndex((entry) => entry.id === run.id);
    if (index === -1) {
      state.runs.push(run);
    } else {
      state.runs[index] = run;
    }
    return run;
  });
}

export async function seedDemoDataIfEmpty(seedSites: SiteConnection[]) {
  await mutateState(async (state) => {
    if (state.sites.length > 0) return;
    state.sites = seedSites;
  });
}

export async function resetStateForTests() {
  await queueWrite(async () => {
    await writeStateAtomically(DEFAULT_STATE);
  });
}
