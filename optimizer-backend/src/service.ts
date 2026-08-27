import { randomUUID } from 'node:crypto';
import { analyzeSite } from './analysis.js';
import { buildDefaultMarketTargets } from './markets.js';
import { getRun, getSite, listRuns, listSites, saveRun, saveSite } from './store.js';
import type { CreateSiteInput, SiteConnection, SiteRun, UpdateSiteInput } from './types.js';

function nowIso() {
  return new Date().toISOString();
}

export async function createSite(input: CreateSiteInput) {
  const timestamp = nowIso();
  const site: SiteConnection = {
    id: randomUUID(),
    name: input.name,
    websiteUrl: input.websiteUrl,
    provider: input.provider,
    targetKeywords: input.targetKeywords,
    companyGoals: input.companyGoals,
    automationEnabled: input.automationEnabled,
    automationHourUtc: input.automationHourUtc,
    targetCountries: input.targetCountries,
    marketTargets: input.marketTargets ?? buildDefaultMarketTargets(input.targetCountries),
    mode: input.mode ?? 'mock',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  await saveSite(site);
  return site;
}

export async function updateSite(siteId: string, input: UpdateSiteInput) {
  const existing = await getSite(siteId);
  if (!existing) return null;
  const updated: SiteConnection = {
    ...existing,
    ...input,
    marketTargets:
      input.marketTargets
      ?? (input.targetCountries ? buildDefaultMarketTargets(input.targetCountries) : existing.marketTargets),
    updatedAt: nowIso(),
  };
  await saveSite(updated);
  return updated;
}

export async function listSitesWithRuns() {
  const [sites, runs] = await Promise.all([listSites(), listRuns()]);
  return sites.map((site) => ({
    ...site,
    lastRun: runs.find((run) => run.siteId === site.id) ?? null,
  }));
}

export async function executeRun(siteId: string, type: SiteRun['type']) {
  const site = await getSite(siteId);
  if (!site) return null;

  const run: SiteRun = {
    id: randomUUID(),
    siteId: site.id,
    type,
    status: 'running',
    mode: site.mode,
    createdAt: nowIso(),
    startedAt: nowIso(),
  };
  await saveRun(run);

  try {
    const analysis = await analyzeSite(site);
    const completed: SiteRun = {
      ...run,
      status: 'completed',
      finishedAt: nowIso(),
      summary: analysis.summary,
      analysis,
    };
    await saveRun(completed);
    await saveSite({
      ...site,
      lastRunId: completed.id,
      updatedAt: nowIso(),
    });
    return completed;
  } catch (error) {
    const failed: SiteRun = {
      ...run,
      status: 'failed',
      finishedAt: nowIso(),
      error: error instanceof Error ? error.message : 'Unknown execution error',
    };
    await saveRun(failed);
    return failed;
  }
}

export async function getSiteWithRuns(siteId: string) {
  const site = await getSite(siteId);
  if (!site) return null;
  const runs = await listRuns(siteId);
  const lastRun = site.lastRunId ? await getRun(site.lastRunId) : runs[0] ?? null;
  return { site, lastRun, runs };
}

export async function runDueAutomations(currentDate = new Date()) {
  const sites = await listSites();
  const currentHour = currentDate.getUTCHours();
  const todayKey = currentDate.toISOString().slice(0, 10);

  for (const site of sites) {
    if (!site.automationEnabled || site.automationHourUtc !== currentHour) continue;
    const runs = await listRuns(site.id);
    const alreadyRanToday = runs.some(
      (run) => run.type === 'full_cycle' && run.createdAt.slice(0, 10) === todayKey,
    );
    if (!alreadyRanToday) {
      await executeRun(site.id, 'full_cycle');
    }
  }
}
