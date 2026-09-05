import { BookOpen, Pencil, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getFriendlyErrorMessage } from "../api/client";
import { useLuluApp } from "../api/LuluAppContext";
import {
  onboardingApi,
  type AiBusinessProfileSuggestion,
  type AiGeneratedCustomerSegment,
  type Competitor,
  type CustomerSegment,
  type Offering,
  type OnboardingSnapshot,
  type Platform,
} from "../api/onboarding";

type OfferingDraft = {
  id: string;
  name: string;
  offeringType: "product" | "service";
  category: string;
  description: string;
  targetCustomer: string;
  valueProposition: string;
  pricingModel: string;
  priceLabel: string;
  url: string;
  differentiators: string;
};

type SegmentDraft = {
  id: string;
  name: string;
  industry: string;
  region: string;
  notes: string;
  painPoints: string;
  useCases: string;
  primarySegment: boolean;
};

type CompetitorDraft = {
  id: string;
  name: string;
  websiteUrl: string;
  competitorType: "direct" | "indirect" | "substitute" | "emerging";
  market: string;
  positioning: string;
  notes: string;
  strengths: string;
  weaknesses: string;
  differentiators: string;
};

type PlatformDraft = {
  id: string;
  name: string;
  category: string;
  integrationKey: string;
  connectionStatus: "not_connected" | "pending" | "connected" | "syncing" | "error" | "disconnected";
  externalAccountId: string;
  grantedScopes: string;
};

const inputClass = "mt-1 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary";
const textareaClass = "mt-1 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm text-foreground outline-none transition focus:border-primary";
const actionClass = "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";
const primaryActionClass = "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

function csvToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function listToCsv(value: string[] | null | undefined) {
  return Array.isArray(value) ? value.join(", ") : "";
}

function nullable(value: string) {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function appendCsvItem(value: string, nextItem: string) {
  const trimmed = nextItem.trim();
  if (!trimmed) return value;
  const items = csvToList(value);
  if (!items.some((item) => item.toLowerCase() === trimmed.toLowerCase())) items.push(trimmed);
  return items.join(", ");
}

function offeringDraftFrom(item?: Offering | null): OfferingDraft {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    offeringType: item?.offeringType ?? "product",
    category: item?.category ?? "",
    description: item?.description ?? "",
    targetCustomer: item?.targetCustomer ?? "",
    valueProposition: item?.valueProposition ?? "",
    pricingModel: item?.pricingModel ?? "",
    priceLabel: item?.priceLabel ?? "",
    url: item?.url ?? "",
    differentiators: listToCsv(item?.differentiators),
  };
}

function segmentDraftFrom(item?: CustomerSegment | null): SegmentDraft {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    industry: item?.industry ?? "",
    region: item?.region ?? "",
    notes: item?.notes ?? "",
    painPoints: listToCsv(item?.painPoints),
    useCases: listToCsv(item?.useCases),
    primarySegment: item?.primarySegment ?? false,
  };
}

function segmentDraftFromAi(item: AiGeneratedCustomerSegment): SegmentDraft {
  return {
    id: "",
    name: item.name,
    industry: item.industry ?? "",
    region: item.region ?? "",
    notes: item.notes ?? item.whyItFits,
    painPoints: listToCsv(item.painPoints),
    useCases: listToCsv(item.useCases),
    primarySegment: item.primarySegment,
  };
}

function competitorDraftFrom(item?: Competitor | null): CompetitorDraft {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    websiteUrl: item?.websiteUrl ?? "",
    competitorType: item?.competitorType ?? "direct",
    market: item?.market ?? "",
    positioning: item?.positioning ?? "",
    notes: item?.notes ?? "",
    strengths: listToCsv(item?.strengths),
    weaknesses: listToCsv(item?.weaknesses),
    differentiators: listToCsv(item?.differentiators),
  };
}

function platformDraftFrom(item?: Platform | null): PlatformDraft {
  return {
    id: item?.id ?? "",
    name: item?.name ?? "",
    category: item?.category ?? "",
    integrationKey: item?.integrationKey ?? "",
    connectionStatus: (item?.connectionStatus as PlatformDraft["connectionStatus"]) ?? "not_connected",
    externalAccountId: item?.externalAccountId ?? "",
    grantedScopes: listToCsv(item?.grantedScopes),
  };
}

type SuggestionFieldCardProps = {
  title: string;
  description: string;
  suggestions: AiBusinessProfileSuggestion[];
  onUse: (value: string) => void;
  disabled: boolean;
  actionLabel?: string;
};

function SuggestionFieldCard({ title, description, suggestions, onUse, disabled, actionLabel = "Use in form" }: SuggestionFieldCardProps) {
  return (
    <article className="rounded-xl border border-border bg-card p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">AI Suggestions</p>
        <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 grid gap-3">
        {suggestions.map((item, index) => (
          <div key={`${title}-${index}-${item.value}`} className="rounded-lg border border-border bg-background/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">#{index + 1}</span>
                  <span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-foreground">Score {item.score}</span>
                </div>
                <div className="mt-3 text-sm font-medium text-foreground">{item.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{item.whyItFits}</p>
                <p className="mt-2 text-xs text-muted-foreground">Competitor gap: {item.competitorGap}</p>
              </div>
              <button type="button" disabled={disabled} onClick={() => onUse(item.value)} className={actionClass}>
                <Sparkles size={14} />
                {actionLabel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export function KnowledgeBaseWorkspace() {
  const { selectedWorkspace, can } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const canEdit = can("edit");
  const [snapshot, setSnapshot] = useState<OnboardingSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    countryRegion: "",
  });
  const [businessForm, setBusinessForm] = useState({
    businessDescription: "",
    valueProposition: "",
    vision: "",
    targetMarket: "",
    shortBrandDescription: "",
    primaryIcp: "",
    usp: "",
    positioningTags: "",
    primaryChallenges: "",
    languages: "",
  });
  const [offeringDraft, setOfferingDraft] = useState<OfferingDraft>(offeringDraftFrom());
  const [segmentDraft, setSegmentDraft] = useState<SegmentDraft>(segmentDraftFrom());
  const [competitorDraft, setCompetitorDraft] = useState<CompetitorDraft>(competitorDraftFrom());
  const [platformDraft, setPlatformDraft] = useState<PlatformDraft>(platformDraftFrom());

  const refresh = async () => {
    if (!workspaceId) {
      setSnapshot(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await onboardingApi.snapshot(workspaceId);
      setSnapshot(response.data);
      setCompanyForm({
        companyName: response.data.workspace.companyName ?? "",
        industry: response.data.workspace.industry ?? "",
        companySize: response.data.workspace.companySize ?? "",
        countryRegion: response.data.workspace.countryRegion ?? "",
      });
      setBusinessForm({
        businessDescription: response.data.workspace.businessDescription ?? "",
        valueProposition: response.data.workspace.valueProposition ?? "",
        vision: response.data.workspace.vision ?? "",
        targetMarket: response.data.workspace.targetMarket ?? "",
        shortBrandDescription: response.data.workspace.shortBrandDescription ?? "",
        primaryIcp: response.data.workspace.primaryIcp ?? "",
        usp: response.data.workspace.usp ?? "",
        positioningTags: listToCsv(response.data.workspace.positioningTags),
        primaryChallenges: listToCsv(response.data.workspace.primaryChallenges),
        languages: listToCsv(response.data.workspace.languages),
      });
      setOfferingDraft(offeringDraftFrom());
      setSegmentDraft(segmentDraftFrom());
      setCompetitorDraft(competitorDraftFrom());
      setPlatformDraft(platformDraftFrom());
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Knowledge Base konnte nicht geladen werden."));
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [workspaceId]);

  const counts = useMemo(() => ({
    offerings: snapshot?.offerings.length ?? 0,
    segments: snapshot?.customerSegments.length ?? 0,
    competitors: snapshot?.competitors.length ?? 0,
    platforms: snapshot?.platforms.length ?? 0,
  }), [snapshot]);
  const aiBusinessProfile = snapshot?.aiBusinessProfile ?? null;
  const recommendedAiProfile = aiBusinessProfile?.payload.recommendedProfile ?? null;

  async function runAction(key: string, successMessage: string, action: () => Promise<void>) {
    setBusyKey(key);
    setError(null);
    setNotice(null);
    try {
      await action();
      setNotice(successMessage);
      await refresh();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Aktion konnte nicht gespeichert werden."));
    } finally {
      setBusyKey(null);
    }
  }

  async function saveBusinessProfileDraft(override?: Partial<{
    valueProposition: string;
    vision: string;
    targetMarket: string;
    shortBrandDescription: string;
    primaryIcp: string;
    usp: string;
    primaryChallenges: string[];
    languages: string[];
  }>) {
    if (!workspaceId) return;
    const workspace = snapshot?.workspace;
    await onboardingApi.saveBusinessDescription(workspaceId, {
      businessDescription: nullable(businessForm.businessDescription),
      valueProposition: nullable(override?.valueProposition ?? businessForm.valueProposition),
      targetMarket: nullable(override?.targetMarket ?? businessForm.targetMarket),
      shortBrandDescription: nullable(override?.shortBrandDescription ?? businessForm.shortBrandDescription),
      positioningTags: csvToList(businessForm.positioningTags),
      legalForm: workspace?.legalForm ?? null,
      foundingYear: workspace?.foundingYear ?? null,
      employeeCount: workspace?.employeeCount ?? null,
      annualRevenueRange: workspace?.annualRevenueRange ?? null,
      businessModelType: workspace?.businessModelType ?? null,
      companyStage: workspace?.companyStage ?? null,
      salesModel: workspace?.salesModel ?? null,
      salesCycleDays: workspace?.salesCycleDays ?? null,
      primaryIcp: nullable(override?.primaryIcp ?? businessForm.primaryIcp),
      usp: nullable(override?.usp ?? businessForm.usp),
      mission: workspace?.mission ?? null,
      vision: nullable(override?.vision ?? businessForm.vision),
      primaryChallenges: override?.primaryChallenges ?? csvToList(businessForm.primaryChallenges),
      languages: override?.languages ?? csvToList(businessForm.languages),
      regulatedIndustries: workspace?.regulatedIndustries ?? [],
    });
  }

  if (loading) {
    return <section className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">Loading onboarding knowledge...</section>;
  }

  if (!workspaceId) {
    return <section className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">No workspace selected.</section>;
  }

  return (
    <div className="grid gap-6">
      {error ? <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      {notice ? <div className="rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">{notice}</div> : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Offerings</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{counts.offerings}</p>
        </article>
        <article className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Customer Segments</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{counts.segments}</p>
        </article>
        <article className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Competitors</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{counts.competitors}</p>
        </article>
        <article className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Connected Platforms</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{counts.platforms}</p>
        </article>
      </section>

      <section className="grid gap-6">
        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={17} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">AI Knowledge Draft</p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">Generated Positioning, Customer Segments & Competitor Comparison</h2>
                </div>
              </div>
              <p className="mt-4 max-w-4xl text-sm text-muted-foreground">
                Generate one high-quality value proposition, one durable vision and five ranked target markets, plus the best 20 AI-ranked customer segments. The draft uses your current onboarding data and compares it against the top 10 competitors used for this workspace.
              </p>
              {aiBusinessProfile?.generatedAt ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  Last generated {new Date(aiBusinessProfile.generatedAt).toLocaleString()} {aiBusinessProfile.model ? `· ${aiBusinessProfile.model}` : ""}
                </p>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
              {recommendedAiProfile ? (
                <button
                  type="button"
                  disabled={!canEdit || busyKey === "apply-ai-profile"}
                  onClick={() => void runAction("apply-ai-profile", "Recommended AI profile applied.", async () => {
                    await saveBusinessProfileDraft({
                      valueProposition: recommendedAiProfile.valueProposition,
                      vision: recommendedAiProfile.vision,
                      targetMarket: recommendedAiProfile.targetMarket,
                      shortBrandDescription: recommendedAiProfile.shortBrandDescription,
                      primaryIcp: recommendedAiProfile.primaryIcp,
                      usp: recommendedAiProfile.usp,
                      primaryChallenges: recommendedAiProfile.primaryChallenges,
                      languages: recommendedAiProfile.languages,
                    });
                  })}
                  className={actionClass}
                >
                  <Save size={15} />
                  Apply Recommended Set
                </button>
              ) : null}
            </div>
          </div>

          {aiBusinessProfile ? (
              <div className="mt-6 grid gap-6">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{aiBusinessProfile.payload.summary}</p>
              </div>

              {recommendedAiProfile ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Recommended Best Set</p>
                    <div className="mt-3 grid gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Value Proposition</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.valueProposition}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vision</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.vision}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Target Market</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.targetMarket}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Primary ICP</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.primaryIcp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">USP</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.usp}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Short Brand Description</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{recommendedAiProfile.shortBrandDescription}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Recommended Lists</p>
                      <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Primary Challenges</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recommendedAiProfile.primaryChallenges.map((item) => (
                          <span key={item} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground">Languages</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recommendedAiProfile.languages.map((item) => (
                          <span key={item} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="grid gap-6 xl:grid-cols-2">
                <SuggestionFieldCard
                  title="Value Proposition"
                  description="One AI-generated business promise grounded in the workspace context."
                  suggestions={aiBusinessProfile.payload.suggestions.valuePropositions}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, valueProposition: value }))}
                />
                <SuggestionFieldCard
                  title="Vision"
                  description="One AI-generated long-term direction for the business."
                  suggestions={aiBusinessProfile.payload.suggestions.visions ?? []}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, vision: value }))}
                />
                <SuggestionFieldCard
                  title="Target Market"
                  description="Five AI-ranked market opportunities with clearer competitive whitespace."
                  suggestions={aiBusinessProfile.payload.suggestions.targetMarkets}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, targetMarket: value }))}
                />
                <SuggestionFieldCard
                  title="Primary ICP"
                  description="Sharper ideal-customer definitions for strategy and messaging."
                  suggestions={aiBusinessProfile.payload.suggestions.primaryIcps}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, primaryIcp: value }))}
                />
                <SuggestionFieldCard
                  title="USP"
                  description="Differentiators designed to win against the competitor set."
                  suggestions={aiBusinessProfile.payload.suggestions.usps}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, usp: value }))}
                />
                <SuggestionFieldCard
                  title="Short Brand Description"
                  description="Condensed brand narratives you can immediately use on the page."
                  suggestions={aiBusinessProfile.payload.suggestions.shortBrandDescriptions}
                  disabled={!canEdit}
                  onUse={(value) => setBusinessForm((current) => ({ ...current, shortBrandDescription: value }))}
                />
                <SuggestionFieldCard
                  title="Primary Challenges"
                  description="Top challenge angles worth capturing in the workspace profile."
                  suggestions={aiBusinessProfile.payload.suggestions.primaryChallenges}
                  disabled={!canEdit}
                  actionLabel="Add to list"
                  onUse={(value) => setBusinessForm((current) => ({ ...current, primaryChallenges: appendCsvItem(current.primaryChallenges, value) }))}
                />
                <SuggestionFieldCard
                  title="Languages"
                  description="Strategic language priorities inferred from context and competition."
                  suggestions={aiBusinessProfile.payload.suggestions.languages}
                  disabled={!canEdit}
                  actionLabel="Add to list"
                  onUse={(value) => setBusinessForm((current) => ({ ...current, languages: appendCsvItem(current.languages, value) }))}
                />
              </div>

              <div className="rounded-xl border border-border bg-background/30 p-4 sm:p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Top 10 Competitor Comparison</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">Where the workspace can win</h3>
                </div>
                <div className="mt-4 grid gap-4">
                  {aiBusinessProfile.payload.competitorComparison.map((competitor) => (
                    <div key={competitor.name} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground">{competitor.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {[competitor.competitorType, competitor.market, competitor.websiteUrl].filter(Boolean).join(" · ") || "Competitor context"}
                          </div>
                          {competitor.positioning ? <p className="mt-3 text-sm text-muted-foreground">{competitor.positioning}</p> : null}
                        </div>
                        <div className="w-full max-w-xl rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
                          <span className="font-medium">Why you can win:</span> {competitor.whyYouCanWin}
                        </div>
                      </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Strengths</p>
                          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                            {competitor.strengths.map((item) => <li key={`${competitor.name}-strength-${item}`}>• {item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Weaknesses</p>
                          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                            {competitor.weaknesses.map((item) => <li key={`${competitor.name}-weakness-${item}`}>• {item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Whitespace</p>
                          <ul className="mt-2 grid gap-2 text-sm text-muted-foreground">
                            {competitor.whitespace.map((item) => <li key={`${competitor.name}-whitespace-${item}`}>• {item}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-background/20 p-8 text-center">
              <Sparkles className="mx-auto text-muted-foreground" size={32} />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No AI business profile generated yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the Update button in the navigation bar to generate the draft with positioning, ICP, USP, brand description, challenges, languages, the top 20 customer segments, and the full comparison against the top 10 competitors.
              </p>
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Workspace Profile</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Company Information</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-muted-foreground">Company Name<input disabled={!canEdit} className={inputClass} value={companyForm.companyName} onChange={(event) => setCompanyForm((current) => ({ ...current, companyName: event.target.value }))} /></label>
            <label className="text-sm text-muted-foreground">Industry<input disabled={!canEdit} className={inputClass} value={companyForm.industry} onChange={(event) => setCompanyForm((current) => ({ ...current, industry: event.target.value }))} /></label>
            <label className="text-sm text-muted-foreground">Company Size<input disabled={!canEdit} className={inputClass} value={companyForm.companySize} onChange={(event) => setCompanyForm((current) => ({ ...current, companySize: event.target.value }))} /></label>
            <label className="text-sm text-muted-foreground">Country / Region<input disabled={!canEdit} className={inputClass} value={companyForm.countryRegion} onChange={(event) => setCompanyForm((current) => ({ ...current, countryRegion: event.target.value }))} /></label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!canEdit || busyKey === "company"}
              onClick={() => void runAction("company", "Company information saved.", async () => {
                await onboardingApi.saveCompanyInformation(workspaceId, {
                  companyName: companyForm.companyName.trim(),
                  industry: nullable(companyForm.industry),
                  companySize: nullable(companyForm.companySize),
                  countryRegion: nullable(companyForm.countryRegion),
                });
              })}
              className={primaryActionClass}
            >
              <Save size={15} />
              Save
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Business Context</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Description & Positioning</h2>
          </div>
          <div className="mt-4 grid gap-4">
            <label className="text-sm text-muted-foreground">Business Description<textarea disabled={!canEdit} className={textareaClass} value={businessForm.businessDescription} onChange={(event) => setBusinessForm((current) => ({ ...current, businessDescription: event.target.value }))} /></label>
            <label className="text-sm text-muted-foreground">Value Proposition<textarea disabled={!canEdit} className={textareaClass} value={businessForm.valueProposition} onChange={(event) => setBusinessForm((current) => ({ ...current, valueProposition: event.target.value }))} /></label>
            <label className="text-sm text-muted-foreground">Vision<textarea disabled={!canEdit} className={textareaClass} value={businessForm.vision} onChange={(event) => setBusinessForm((current) => ({ ...current, vision: event.target.value }))} /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted-foreground">Target Market<input disabled={!canEdit} className={inputClass} value={businessForm.targetMarket} onChange={(event) => setBusinessForm((current) => ({ ...current, targetMarket: event.target.value }))} /></label>
              <label className="text-sm text-muted-foreground">Primary ICP<input disabled={!canEdit} className={inputClass} value={businessForm.primaryIcp} onChange={(event) => setBusinessForm((current) => ({ ...current, primaryIcp: event.target.value }))} /></label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted-foreground">USP<input disabled={!canEdit} className={inputClass} value={businessForm.usp} onChange={(event) => setBusinessForm((current) => ({ ...current, usp: event.target.value }))} /></label>
              <label className="text-sm text-muted-foreground">Short Brand Description<input disabled={!canEdit} className={inputClass} value={businessForm.shortBrandDescription} onChange={(event) => setBusinessForm((current) => ({ ...current, shortBrandDescription: event.target.value }))} /></label>
            </div>
            <label className="text-sm text-muted-foreground">Positioning Tags (comma-separated)<input disabled={!canEdit} className={inputClass} value={businessForm.positioningTags} onChange={(event) => setBusinessForm((current) => ({ ...current, positioningTags: event.target.value }))} /></label>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-muted-foreground">Primary Challenges (comma-separated)<textarea disabled={!canEdit} className={textareaClass} value={businessForm.primaryChallenges} onChange={(event) => setBusinessForm((current) => ({ ...current, primaryChallenges: event.target.value }))} /></label>
              <label className="text-sm text-muted-foreground">Languages (comma-separated)<textarea disabled={!canEdit} className={textareaClass} value={businessForm.languages} onChange={(event) => setBusinessForm((current) => ({ ...current, languages: event.target.value }))} /></label>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              disabled={!canEdit || busyKey === "business"}
              onClick={() => void runAction("business", "Business context saved.", async () => {
                await saveBusinessProfileDraft();
              })}
              className={primaryActionClass}
            >
              <Save size={15} />
              Save
            </button>
          </div>
        </article>
      </section>

      <section className="grid gap-6">
        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Products & Services</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Offerings</h2>
            </div>
            <button type="button" disabled={!canEdit} onClick={() => setOfferingDraft(offeringDraftFrom())} className={actionClass}><Plus size={15} />New</button>
          </div>
          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <div className="grid gap-3">
              {(snapshot?.offerings ?? []).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.description || item.valueProposition || "No detail yet"}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{item.offeringType} · {item.category || "No category"} · {item.pricingModel || "No pricing model"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={!canEdit} onClick={() => setOfferingDraft(offeringDraftFrom(item))} className={actionClass}><Pencil size={14} /></button>
                      <button type="button" disabled={!canEdit || busyKey === `delete-offering-${item.id}`} onClick={() => void runAction(`delete-offering-${item.id}`, "Offering removed.", async () => { await onboardingApi.deleteOffering(workspaceId, item.id); })} className={actionClass}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {snapshot && snapshot.offerings.length === 0 ? <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">No offerings stored yet.</div> : null}
            </div>
            <div className="order-first rounded-lg border border-border bg-background/40 p-4 xl:order-none">
              <h3 className="text-sm font-semibold text-foreground">{offeringDraft.id ? "Edit offering" : "Add offering"}</h3>
              <div className="mt-4 grid gap-3">
                <label className="text-sm text-muted-foreground">Name<input className={inputClass} disabled={!canEdit} value={offeringDraft.name} onChange={(event) => setOfferingDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-muted-foreground">Type<select className={inputClass} disabled={!canEdit} value={offeringDraft.offeringType} onChange={(event) => setOfferingDraft((current) => ({ ...current, offeringType: event.target.value as OfferingDraft["offeringType"] }))}><option value="product">Product</option><option value="service">Service</option></select></label>
                  <label className="text-sm text-muted-foreground">Category<input className={inputClass} disabled={!canEdit} value={offeringDraft.category} onChange={(event) => setOfferingDraft((current) => ({ ...current, category: event.target.value }))} /></label>
                </div>
                <label className="text-sm text-muted-foreground">Description<textarea className={textareaClass} disabled={!canEdit} value={offeringDraft.description} onChange={(event) => setOfferingDraft((current) => ({ ...current, description: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Target Customer<input className={inputClass} disabled={!canEdit} value={offeringDraft.targetCustomer} onChange={(event) => setOfferingDraft((current) => ({ ...current, targetCustomer: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Value Proposition<textarea className={textareaClass} disabled={!canEdit} value={offeringDraft.valueProposition} onChange={(event) => setOfferingDraft((current) => ({ ...current, valueProposition: event.target.value }))} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-muted-foreground">Pricing Model<input className={inputClass} disabled={!canEdit} value={offeringDraft.pricingModel} onChange={(event) => setOfferingDraft((current) => ({ ...current, pricingModel: event.target.value }))} /></label>
                  <label className="text-sm text-muted-foreground">Price Label<input className={inputClass} disabled={!canEdit} value={offeringDraft.priceLabel} onChange={(event) => setOfferingDraft((current) => ({ ...current, priceLabel: event.target.value }))} /></label>
                </div>
                <label className="text-sm text-muted-foreground">URL<input className={inputClass} disabled={!canEdit} value={offeringDraft.url} onChange={(event) => setOfferingDraft((current) => ({ ...current, url: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Differentiators (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={offeringDraft.differentiators} onChange={(event) => setOfferingDraft((current) => ({ ...current, differentiators: event.target.value }))} /></label>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {offeringDraft.id ? <button type="button" disabled={!canEdit} onClick={() => setOfferingDraft(offeringDraftFrom())} className={actionClass}><X size={14} />Cancel</button> : null}
                <button
                  type="button"
                  disabled={!canEdit || !offeringDraft.name.trim() || busyKey === "save-offering"}
                  onClick={() => void runAction("save-offering", offeringDraft.id ? "Offering updated." : "Offering added.", async () => {
                    const payload = {
                      name: offeringDraft.name.trim(),
                      offeringType: offeringDraft.offeringType,
                      category: nullable(offeringDraft.category),
                      description: nullable(offeringDraft.description),
                      targetCustomer: nullable(offeringDraft.targetCustomer),
                      valueProposition: nullable(offeringDraft.valueProposition),
                      pricingModel: nullable(offeringDraft.pricingModel),
                      priceLabel: nullable(offeringDraft.priceLabel),
                      url: nullable(offeringDraft.url),
                      differentiators: csvToList(offeringDraft.differentiators),
                    };
                    if (offeringDraft.id) await onboardingApi.updateOffering(workspaceId, offeringDraft.id, payload);
                    else await onboardingApi.createOffering(workspaceId, { ...payload, offeringType: offeringDraft.offeringType });
                  })}
                  className={primaryActionClass}
                >
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Customer Intelligence</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Customer Segments</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {aiBusinessProfile?.payload.customerSegments?.length ? (
                <button
                  type="button"
                  disabled={!canEdit || busyKey === "apply-ai-customer-segments"}
                  onClick={() => void runAction("apply-ai-customer-segments", "AI customer segments applied.", async () => {
                    await onboardingApi.applyAiCustomerSegments(workspaceId);
                  })}
                  className={actionClass}
                >
                  <Sparkles size={15} />
                  Apply Top 20 AI Segments
                </button>
              ) : null}
              <button type="button" disabled={!canEdit} onClick={() => setSegmentDraft(segmentDraftFrom())} className={actionClass}><Plus size={15} />New</button>
            </div>
          </div>
          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <div className="grid gap-3">
              {aiBusinessProfile?.payload.customerSegments?.length ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">AI Top 20</p>
                      <h3 className="mt-1 text-sm font-semibold text-foreground">Best-ranked customer segments for this workspace</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        These 20 segments are AI-ranked by strategic fit, revenue potential, and competitor whitespace. You can open one in the editor or replace the current segment list with all 20 at once.
                      </p>
                    </div>
                    <div className="rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs text-foreground">
                      {aiBusinessProfile.payload.customerSegments.length} generated
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3">
                    {aiBusinessProfile.payload.customerSegments.map((item, index) => (
                      <div key={`${item.name}-${index}`} className="rounded-lg border border-border bg-card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">#{index + 1}</span>
                              <span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-foreground">Score {item.score}</span>
                              {item.primarySegment ? <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-700">Primary</span> : null}
                            </div>
                            <div className="mt-3 text-sm font-medium text-foreground">{item.name}</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {[item.industry, item.companySize, item.region, item.maturityLevel].filter(Boolean).join(" · ") || "Customer segment"}
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{item.whyItFits}</p>
                            <div className="mt-3 grid gap-3 lg:grid-cols-2">
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Pain Points</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {item.painPoints.slice(0, 5).map((pain) => (
                                    <span key={`${item.name}-pain-${pain}`} className="rounded-full border border-border bg-background px-2 py-1 text-[11px] text-foreground">{pain}</span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Use Cases</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {item.useCases.slice(0, 5).map((useCase) => (
                                    <span key={`${item.name}-use-${useCase}`} className="rounded-full border border-border bg-background px-2 py-1 text-[11px] text-foreground">{useCase}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={!canEdit}
                            onClick={() => setSegmentDraft(segmentDraftFromAi(item))}
                            className={actionClass}
                          >
                            <Sparkles size={14} />
                            Use in form
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              {(snapshot?.customerSegments ?? []).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.notes || item.industry || "No detail yet"}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{item.region || "No region"} · {item.primarySegment ? "Primary segment" : "Secondary segment"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={!canEdit} onClick={() => setSegmentDraft(segmentDraftFrom(item))} className={actionClass}><Pencil size={14} /></button>
                      <button type="button" disabled={!canEdit || busyKey === `delete-segment-${item.id}`} onClick={() => void runAction(`delete-segment-${item.id}`, "Segment removed.", async () => { await onboardingApi.deleteCustomerSegment(workspaceId, item.id); })} className={actionClass}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {snapshot && snapshot.customerSegments.length === 0 ? <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">No customer segments stored yet.</div> : null}
            </div>
            <div className="order-first rounded-lg border border-border bg-background/40 p-4 xl:order-none">
              <h3 className="text-sm font-semibold text-foreground">{segmentDraft.id ? "Edit segment" : "Add segment"}</h3>
              <div className="mt-4 grid gap-3">
                <label className="text-sm text-muted-foreground">Name<input className={inputClass} disabled={!canEdit} value={segmentDraft.name} onChange={(event) => setSegmentDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-muted-foreground">Industry<input className={inputClass} disabled={!canEdit} value={segmentDraft.industry} onChange={(event) => setSegmentDraft((current) => ({ ...current, industry: event.target.value }))} /></label>
                  <label className="text-sm text-muted-foreground">Region<input className={inputClass} disabled={!canEdit} value={segmentDraft.region} onChange={(event) => setSegmentDraft((current) => ({ ...current, region: event.target.value }))} /></label>
                </div>
                <label className="text-sm text-muted-foreground">Pain Points (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={segmentDraft.painPoints} onChange={(event) => setSegmentDraft((current) => ({ ...current, painPoints: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Use Cases (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={segmentDraft.useCases} onChange={(event) => setSegmentDraft((current) => ({ ...current, useCases: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Notes<textarea className={textareaClass} disabled={!canEdit} value={segmentDraft.notes} onChange={(event) => setSegmentDraft((current) => ({ ...current, notes: event.target.value }))} /></label>
                <label className="inline-flex items-center gap-2 text-sm text-foreground"><input type="checkbox" disabled={!canEdit} checked={segmentDraft.primarySegment} onChange={(event) => setSegmentDraft((current) => ({ ...current, primarySegment: event.target.checked }))} />Primary segment</label>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {segmentDraft.id ? <button type="button" disabled={!canEdit} onClick={() => setSegmentDraft(segmentDraftFrom())} className={actionClass}><X size={14} />Cancel</button> : null}
                <button
                  type="button"
                  disabled={!canEdit || !segmentDraft.name.trim() || busyKey === "save-segment"}
                  onClick={() => void runAction("save-segment", segmentDraft.id ? "Segment updated." : "Segment added.", async () => {
                    const payload = {
                      name: segmentDraft.name.trim(),
                      industry: nullable(segmentDraft.industry),
                      region: nullable(segmentDraft.region),
                      painPoints: csvToList(segmentDraft.painPoints),
                      useCases: csvToList(segmentDraft.useCases),
                      notes: nullable(segmentDraft.notes),
                      primarySegment: segmentDraft.primarySegment,
                    };
                    if (segmentDraft.id) await onboardingApi.updateCustomerSegment(workspaceId, segmentDraft.id, payload);
                    else await onboardingApi.createCustomerSegment(workspaceId, payload);
                  })}
                  className={primaryActionClass}
                >
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Market View</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Competitors</h2>
            </div>
            <button type="button" disabled={!canEdit} onClick={() => setCompetitorDraft(competitorDraftFrom())} className={actionClass}><Plus size={15} />New</button>
          </div>
          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <div className="grid gap-3">
              {(snapshot?.competitors ?? []).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.positioning || item.notes || "No detail yet"}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{item.competitorType} · {item.market || "No market"} · {item.websiteUrl || "No URL"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={!canEdit} onClick={() => setCompetitorDraft(competitorDraftFrom(item))} className={actionClass}><Pencil size={14} /></button>
                      <button type="button" disabled={!canEdit || busyKey === `delete-competitor-${item.id}`} onClick={() => void runAction(`delete-competitor-${item.id}`, "Competitor removed.", async () => { await onboardingApi.deleteCompetitor(workspaceId, item.id); })} className={actionClass}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {snapshot && snapshot.competitors.length === 0 ? <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">No competitors stored yet.</div> : null}
            </div>
            <div className="order-first rounded-lg border border-border bg-background/40 p-4 xl:order-none">
              <h3 className="text-sm font-semibold text-foreground">{competitorDraft.id ? "Edit competitor" : "Add competitor"}</h3>
              <div className="mt-4 grid gap-3">
                <label className="text-sm text-muted-foreground">Name<input className={inputClass} disabled={!canEdit} value={competitorDraft.name} onChange={(event) => setCompetitorDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-muted-foreground">Type<select className={inputClass} disabled={!canEdit} value={competitorDraft.competitorType} onChange={(event) => setCompetitorDraft((current) => ({ ...current, competitorType: event.target.value as CompetitorDraft["competitorType"] }))}><option value="direct">Direct</option><option value="indirect">Indirect</option><option value="substitute">Substitute</option><option value="emerging">Emerging</option></select></label>
                  <label className="text-sm text-muted-foreground">Market<input className={inputClass} disabled={!canEdit} value={competitorDraft.market} onChange={(event) => setCompetitorDraft((current) => ({ ...current, market: event.target.value }))} /></label>
                </div>
                <label className="text-sm text-muted-foreground">Website URL<input className={inputClass} disabled={!canEdit} value={competitorDraft.websiteUrl} onChange={(event) => setCompetitorDraft((current) => ({ ...current, websiteUrl: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Positioning<textarea className={textareaClass} disabled={!canEdit} value={competitorDraft.positioning} onChange={(event) => setCompetitorDraft((current) => ({ ...current, positioning: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Strengths (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={competitorDraft.strengths} onChange={(event) => setCompetitorDraft((current) => ({ ...current, strengths: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Weaknesses (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={competitorDraft.weaknesses} onChange={(event) => setCompetitorDraft((current) => ({ ...current, weaknesses: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Differentiators (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={competitorDraft.differentiators} onChange={(event) => setCompetitorDraft((current) => ({ ...current, differentiators: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Notes<textarea className={textareaClass} disabled={!canEdit} value={competitorDraft.notes} onChange={(event) => setCompetitorDraft((current) => ({ ...current, notes: event.target.value }))} /></label>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {competitorDraft.id ? <button type="button" disabled={!canEdit} onClick={() => setCompetitorDraft(competitorDraftFrom())} className={actionClass}><X size={14} />Cancel</button> : null}
                <button
                  type="button"
                  disabled={!canEdit || !competitorDraft.name.trim() || busyKey === "save-competitor"}
                  onClick={() => void runAction("save-competitor", competitorDraft.id ? "Competitor updated." : "Competitor added.", async () => {
                    const payload = {
                      name: competitorDraft.name.trim(),
                      websiteUrl: nullable(competitorDraft.websiteUrl),
                      competitorType: competitorDraft.competitorType,
                      market: nullable(competitorDraft.market),
                      positioning: nullable(competitorDraft.positioning),
                      notes: nullable(competitorDraft.notes),
                      strengths: csvToList(competitorDraft.strengths),
                      weaknesses: csvToList(competitorDraft.weaknesses),
                      differentiators: csvToList(competitorDraft.differentiators),
                    };
                    if (competitorDraft.id) await onboardingApi.updateCompetitor(workspaceId, competitorDraft.id, payload);
                    else await onboardingApi.createCompetitor(workspaceId, payload);
                  })}
                  className={primaryActionClass}
                >
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Connected Sources</p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">Platforms</h2>
            </div>
            <button type="button" disabled={!canEdit} onClick={() => setPlatformDraft(platformDraftFrom())} className={actionClass}><Plus size={15} />New</button>
          </div>
          <div className="mt-4 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <div className="grid gap-3">
              {(snapshot?.platforms ?? []).map((item) => (
                <div key={item.id} className="rounded-lg border border-border bg-background/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-foreground">{item.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{item.category} · {item.connectionStatus}</div>
                      <div className="mt-2 text-xs text-muted-foreground">{item.integrationKey || "No integration key"} · {item.lastSyncedAt || "Never synced"}</div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" disabled={!canEdit} onClick={() => setPlatformDraft(platformDraftFrom(item))} className={actionClass}><Pencil size={14} /></button>
                      <button type="button" disabled={!canEdit || busyKey === `delete-platform-${item.id}`} onClick={() => void runAction(`delete-platform-${item.id}`, "Platform removed.", async () => { await onboardingApi.deletePlatform(workspaceId, item.id); })} className={actionClass}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {snapshot && snapshot.platforms.length === 0 ? <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">No platforms stored yet.</div> : null}
            </div>
            <div className="order-first rounded-lg border border-border bg-background/40 p-4 xl:order-none">
              <h3 className="text-sm font-semibold text-foreground">{platformDraft.id ? "Edit platform" : "Add platform"}</h3>
              <div className="mt-4 grid gap-3">
                <label className="text-sm text-muted-foreground">Name<input className={inputClass} disabled={!canEdit} value={platformDraft.name} onChange={(event) => setPlatformDraft((current) => ({ ...current, name: event.target.value }))} /></label>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm text-muted-foreground">Category<input className={inputClass} disabled={!canEdit} value={platformDraft.category} onChange={(event) => setPlatformDraft((current) => ({ ...current, category: event.target.value }))} /></label>
                  <label className="text-sm text-muted-foreground">Integration Key<input className={inputClass} disabled={!canEdit} value={platformDraft.integrationKey} onChange={(event) => setPlatformDraft((current) => ({ ...current, integrationKey: event.target.value }))} /></label>
                </div>
                <label className="text-sm text-muted-foreground">Connection Status<select className={inputClass} disabled={!canEdit} value={platformDraft.connectionStatus} onChange={(event) => setPlatformDraft((current) => ({ ...current, connectionStatus: event.target.value as PlatformDraft["connectionStatus"] }))}><option value="not_connected">Not connected</option><option value="pending">Pending</option><option value="connected">Connected</option><option value="syncing">Syncing</option><option value="error">Error</option><option value="disconnected">Disconnected</option></select></label>
                <label className="text-sm text-muted-foreground">External Account ID<input className={inputClass} disabled={!canEdit} value={platformDraft.externalAccountId} onChange={(event) => setPlatformDraft((current) => ({ ...current, externalAccountId: event.target.value }))} /></label>
                <label className="text-sm text-muted-foreground">Granted Scopes (comma-separated)<textarea className={textareaClass} disabled={!canEdit} value={platformDraft.grantedScopes} onChange={(event) => setPlatformDraft((current) => ({ ...current, grantedScopes: event.target.value }))} /></label>
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {platformDraft.id ? <button type="button" disabled={!canEdit} onClick={() => setPlatformDraft(platformDraftFrom())} className={actionClass}><X size={14} />Cancel</button> : null}
                <button
                  type="button"
                  disabled={!canEdit || !platformDraft.name.trim() || busyKey === "save-platform"}
                  onClick={() => void runAction("save-platform", platformDraft.id ? "Platform updated." : "Platform added.", async () => {
                    const payload = {
                      name: platformDraft.name.trim(),
                      category: platformDraft.category.trim() || "general",
                      integrationKey: nullable(platformDraft.integrationKey),
                      connectionStatus: platformDraft.connectionStatus,
                      externalAccountId: nullable(platformDraft.externalAccountId),
                      grantedScopes: csvToList(platformDraft.grantedScopes),
                    };
                    if (platformDraft.id) await onboardingApi.updatePlatform(workspaceId, platformDraft.id, payload);
                    else await onboardingApi.createPlatform(workspaceId, payload);
                  })}
                  className={primaryActionClass}
                >
                  <Save size={15} />
                  Save
                </button>
              </div>
            </div>
          </div>
        </article>
      </section>

      {!canEdit ? (
        <section className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          You can view the onboarding knowledge here, but editing requires workspace edit access.
        </section>
      ) : null}

      {!snapshot ? (
        <section className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <BookOpen className="mx-auto text-muted-foreground" size={34} />
          <h2 className="mt-4 text-lg font-semibold text-foreground">No onboarding knowledge loaded</h2>
          <p className="mt-2 text-sm text-muted-foreground">Refresh the page after onboarding data becomes available.</p>
        </section>
      ) : null}
    </div>
  );
}
