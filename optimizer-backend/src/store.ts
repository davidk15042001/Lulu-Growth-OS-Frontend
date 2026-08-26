import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
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

async function writeState(state: AppState) {
  const absolutePath = await ensureStoreFile();
  await writeFile(absolutePath, JSON.stringify(state, null, 2), 'utf8');
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
  const state = await readState();
  const index = state.sites.findIndex((entry) => entry.id === site.id);
  if (index === -1) {
    state.sites.push(site);
  } else {
    state.sites[index] = site;
  }
  await writeState(state);
  return site;
}

export async function saveRun(run: SiteRun) {
  const state = await readState();
  const index = state.runs.findIndex((entry) => entry.id === run.id);
  if (index === -1) {
    state.runs.push(run);
  } else {
    state.runs[index] = run;
  }
  await writeState(state);
  return run;
}

export async function seedDemoDataIfEmpty(seedSites: SiteConnection[]) {
  const state = await readState();
  if (state.sites.length > 0) return;
  state.sites = seedSites;
  await writeState(state);
}
