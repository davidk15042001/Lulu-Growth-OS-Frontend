import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CircleDashed,
  Clock3,
  FilePenLine,
  Image,
  Link2,
  LoaderCircle,
  Megaphone,
  PencilLine,
  Plus,
  RefreshCw,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unplug,
  X,
  XCircle,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ApiError, getFriendlyErrorMessage } from "../../api/client";
import { useLuluApp } from "../../api/LuluAppContext";
import { providerControlApi, type ProviderConnection } from "../../api/providers";
import {
  createSocialIdempotencyKey,
  socialPublishingApi,
  type SocialAccount,
  type SocialContent,
  type SocialContentStatus,
  type SocialContentType,
  type SocialProvider,
  type SocialPublicationJob,
  type SocialPublicationStatus,
} from "../../api/social-publishing";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import { navigateApp, routes } from "../../routing";

type WorkspaceTab = "accounts" | "content" | "publications";

const ACTIVE_PUBLICATION_STATES: readonly SocialPublicationStatus[] = ["SCHEDULED", "QUEUED", "PUBLISHING"];
const CANCELLABLE_PUBLICATION_STATES: readonly SocialPublicationStatus[] = ["DRAFT", "SCHEDULED", "QUEUED", "FAILED", "BLOCKED"];
const REQUIRED_SCOPES: Record<SocialProvider, readonly string[]> = {
  FACEBOOK: ["pages_manage_posts", "pages_read_engagement"],
  INSTAGRAM: ["instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"],
};
const PUBLISH_CAPABILITY: Record<SocialProvider, string> = {
  FACEBOOK: "facebook.pages.publish",
  INSTAGRAM: "instagram.content.publish",
};

function isWorkspaceTab(value: string | null): value is WorkspaceTab {
  return value === "accounts" || value === "content" || value === "publications";
}

function formatDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  }).format(date);
}

function shortId(value: string) {
  return value.length > 15 ? `${value.slice(0, 7)}…${value.slice(-5)}` : value;
}

function isPublicHttps(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.port && !url.hash;
  } catch {
    return false;
  }
}

function messageFor(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.code === "SOCIAL_VERSION_CONFLICT") {
    return "This item changed in another session. Lulu reloaded the current server state; review it before trying again.";
  }
  return getFriendlyErrorMessage(error, fallback);
}

function toneFor(status: string) {
  if (["AVAILABLE", "READY", "PUBLISHED", "SUCCEEDED"].includes(status)) return "good";
  if (["BLOCKED", "FAILED", "DEAD_LETTER", "UNAVAILABLE"].includes(status)) return "bad";
  if (["SCHEDULED", "QUEUED", "PUBLISHING", "RUNNING"].includes(status)) return "live";
  return "neutral";
}

function StatusBadge({ status }: { status: string }) {
  const tone = toneFor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wide ${
      tone === "good"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : tone === "bad"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : tone === "live"
            ? "border-sky-200 bg-sky-50 text-sky-800"
            : "border-[var(--border)] bg-[var(--secondary)] text-[var(--muted-foreground)]"
    }`}>
      {tone === "good" ? <CheckCircle2 size={11} /> : tone === "bad" ? <AlertCircle size={11} /> : tone === "live" ? <CircleDashed size={11} /> : null}
      {status.replaceAll("_", " ")}
    </span>
  );
}

function ProviderMark({ provider }: { provider: SocialProvider }) {
  return (
    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-black text-white shadow-sm ${provider === "FACEBOOK" ? "bg-[#1877f2]" : "bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]"}`}>
      {provider === "FACEBOOK" ? "f" : "◎"}
    </span>
  );
}

function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm ${className}`}>{children}</section>;
}

function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid min-h-64 place-items-center p-8 text-center">
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--secondary)] text-[var(--muted-foreground)]">{icon}</span>
        <h3 className="mt-4 text-sm font-semibold">{title}</h3>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[var(--muted-foreground)]">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

function connectionReadiness(connection: ProviderConnection, provider: SocialProvider) {
  if (connection.providerKey.toUpperCase() !== provider) return "Provider does not match.";
  if (connection.status !== "CONNECTED" || connection.authorizationState !== "AUTHORIZED") return "Connection is not connected and authorized.";
  if (!connection.hasCredentialReference) return "Publishing credential is unavailable.";
  const missingScopes = REQUIRED_SCOPES[provider].filter((scope) => !connection.grantedScopes.includes(scope));
  if (missingScopes.length) return `Missing Meta scopes: ${missingScopes.join(", ")}.`;
  if (connection.scopeType !== "WORKSPACE" && connection.sharedGrantedCapabilities && !connection.sharedGrantedCapabilities.includes(PUBLISH_CAPABILITY[provider])) {
    return "The shared connection has not granted publishing to this workspace.";
  }
  return null;
}

type AccountDraft = {
  providerConnectionId: string;
  provider: SocialProvider;
  displayName: string;
  facebookPageId: string;
  instagramBusinessAccountId: string;
};

const EMPTY_ACCOUNT_DRAFT: AccountDraft = {
  providerConnectionId: "",
  provider: "FACEBOOK",
  displayName: "",
  facebookPageId: "",
  instagramBusinessAccountId: "",
};

type ContentDraft = {
  contentType: SocialContentType;
  status: "DRAFT" | "READY";
  message: string;
  linkUrl: string;
  mediaUrl: string;
  altText: string;
};

const EMPTY_CONTENT_DRAFT: ContentDraft = {
  contentType: "TEXT",
  status: "DRAFT",
  message: "",
  linkUrl: "",
  mediaUrl: "",
  altText: "",
};

export default function SocialPublishingPage() {
  const { selectedWorkspace, permissions } = useLuluApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const workspaceId = selectedWorkspace?.id ?? null;
  const activeWorkspaceId = useRef<string | null>(workspaceId);
  const coreRequestId = useRef(0);
  const connectionRequestId = useRef(0);
  activeWorkspaceId.current = workspaceId;
  const requestedTab = searchParams.get("section");
  const tab: WorkspaceTab = isWorkspaceTab(requestedTab) ? requestedTab : "publications";
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [content, setContent] = useState<SocialContent[]>([]);
  const [publications, setPublications] = useState<SocialPublicationJob[]>([]);
  const [connections, setConnections] = useState<ProviderConnection[]>([]);
  const [selectedPublication, setSelectedPublication] = useState<SocialPublicationJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coreState, setCoreState] = useState<"loading" | "refreshing" | "ready" | "stale" | "error">("loading");
  const verifiedWorkspaceRef = useRef<string | null>(null);
  const [error, setError] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [showAccountComposer, setShowAccountComposer] = useState(false);
  const [accountDraft, setAccountDraft] = useState<AccountDraft>(EMPTY_ACCOUNT_DRAFT);
  const [contentDraft, setContentDraft] = useState<ContentDraft>(EMPTY_CONTENT_DRAFT);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [publicationAccountId, setPublicationAccountId] = useState("");
  const [publicationContentId, setPublicationContentId] = useState("");
  const [publicationExecution, setPublicationExecution] = useState<"DRAFT" | "QUEUE">("QUEUE");
  const [publicationSchedule, setPublicationSchedule] = useState("");
  const accountKey = useRef<string | null>(null);
  const contentKey = useRef<string | null>(null);
  const publicationKey = useRef<string | null>(null);
  const canManageSocial = permissions.capabilities.includes("social.manage");
  const canPublishSocial = permissions.capabilities.includes("social.publish");

  const selectedAccountId = searchParams.get("accountId");
  const selectedContentId = searchParams.get("contentId");
  const selectedPublicationId = searchParams.get("publicationId");
  const selectedAccount = accounts.find((item) => item.id === selectedAccountId) ?? null;
  const selectedContent = content.find((item) => item.id === selectedContentId) ?? null;

  const socialConnections = useMemo(
    () => connections.filter((item) => item.providerKey === "facebook" || item.providerKey === "instagram"),
    [connections],
  );
  const availableAccounts = useMemo(() => accounts.filter((item) => {
    if (item.status !== "AVAILABLE") return false;
    const connection = connections.find((entry) => entry.id === item.providerConnectionId);
    return Boolean(connection && !connectionReadiness(connection, item.provider));
  }), [accounts, connections]);
  const readyContent = useMemo(() => content.filter((item) => item.status === "READY"), [content]);
  const selectedPublishAccount = availableAccounts.find((item) => item.id === publicationAccountId) ?? null;
  const publishableContent = useMemo(
    () => readyContent.filter((item) => selectedPublishAccount?.provider !== "INSTAGRAM" || item.contentType === "IMAGE"),
    [readyContent, selectedPublishAccount],
  );

  const updateLocation = useCallback((nextTab: WorkspaceTab, selection?: { key: "accountId" | "contentId" | "publicationId"; id: string } | null) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", nextTab);
    next.delete("accountId");
    next.delete("contentId");
    next.delete("publicationId");
    next.delete("recordId");
    if (selection) next.set(selection.key, selection.id);
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const loadCore = useCallback(async (options: { quiet?: boolean } = {}) => {
    if (!workspaceId) return;
    const requestId = ++coreRequestId.current;
    const hasVerifiedData = verifiedWorkspaceRef.current === workspaceId;
    if (options.quiet || hasVerifiedData) { setRefreshing(true); setCoreState("refreshing"); }
    else { setLoading(true); setCoreState("loading"); }
    setError("");
    const controller = new AbortController();
    try {
      const [accountResult, contentResult, publicationResult] = await Promise.all([
        socialPublishingApi.listAccounts(workspaceId, controller.signal),
        socialPublishingApi.listContent(workspaceId, undefined, controller.signal),
        socialPublishingApi.listPublications(workspaceId, undefined, controller.signal),
      ]);
      if (activeWorkspaceId.current !== workspaceId || coreRequestId.current !== requestId) return;
      setAccounts(accountResult.data.items);
      setContent(contentResult.data.items);
      setPublications(publicationResult.data.items);
      verifiedWorkspaceRef.current = workspaceId;
      setCoreState("ready");
    } catch (cause) {
      if (activeWorkspaceId.current !== workspaceId || coreRequestId.current !== requestId) return;
      const message = messageFor(cause, "Social publishing could not be loaded. No provider action was attempted.");
      const stale = verifiedWorkspaceRef.current === workspaceId;
      setCoreState(stale ? "stale" : "error");
      setError(stale ? `Showing the last successfully loaded publishing state. ${message}` : message);
    } finally {
      if (activeWorkspaceId.current === workspaceId && coreRequestId.current === requestId) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [workspaceId]);

  const loadConnections = useCallback(async () => {
    if (!workspaceId) return;
    const requestId = ++connectionRequestId.current;
    setConnectionError("");
    try {
      const result = await providerControlApi.connections(workspaceId);
      if (activeWorkspaceId.current !== workspaceId || connectionRequestId.current !== requestId) return;
      setConnections(result.data.connections);
    } catch (cause) {
      if (activeWorkspaceId.current !== workspaceId || connectionRequestId.current !== requestId) return;
      setConnections([]);
      setConnectionError(messageFor(cause, "Provider connections are unavailable. Account configuration and publishing remain disabled."));
    }
  }, [workspaceId]);

  useEffect(() => () => {
    activeWorkspaceId.current = null;
    coreRequestId.current += 1;
    connectionRequestId.current += 1;
  }, []);

  useEffect(() => {
    setAccounts([]);
    setContent([]);
    setPublications([]);
    verifiedWorkspaceRef.current = null;
    setCoreState("loading");
    setSelectedPublication(null);
    setNotice("");
    if (!workspaceId) return;
    void loadCore();
    void loadConnections();
  }, [loadConnections, loadCore, workspaceId]);

  useEffect(() => {
    const recordId = searchParams.get("recordId");
    if (!recordId) return;
    if (accounts.some((item) => item.id === recordId)) updateLocation("accounts", { key: "accountId", id: recordId });
    else if (content.some((item) => item.id === recordId)) updateLocation("content", { key: "contentId", id: recordId });
    else if (publications.some((item) => item.id === recordId)) updateLocation("publications", { key: "publicationId", id: recordId });
  }, [accounts, content, publications, searchParams, updateLocation]);

  useEffect(() => {
    if (!workspaceId || !selectedPublicationId) {
      setSelectedPublication(null);
      return;
    }
    setSelectedPublication(null);
    const controller = new AbortController();
    void socialPublishingApi.getPublication(workspaceId, selectedPublicationId, controller.signal)
      .then((result) => setSelectedPublication(result.data))
      .catch((cause) => {
        if (!controller.signal.aborted) setError(messageFor(cause, "The publication detail could not be loaded."));
      });
    return () => controller.abort();
  }, [selectedPublicationId, workspaceId]);

  const hasActivePublication = publications.some((item) => ACTIVE_PUBLICATION_STATES.includes(item.status));
  useEffect(() => {
    if (!workspaceId || !hasActivePublication) return;
    const timer = window.setInterval(() => {
      void socialPublishingApi.listPublications(workspaceId).then((result) => {
        setPublications(result.data.items);
        if (selectedPublicationId) {
          void socialPublishingApi.getPublication(workspaceId, selectedPublicationId).then((detail) => setSelectedPublication(detail.data)).catch(() => undefined);
        }
      }).catch(() => undefined);
    }, 7_000);
    return () => window.clearInterval(timer);
  }, [hasActivePublication, selectedPublicationId, workspaceId]);

  useEffect(() => {
    if (selectedContentId && content.some((item) => item.id === selectedContentId)) setEditingContentId(selectedContentId);
  }, [content, selectedContentId]);

  useEffect(() => {
    if (!editingContentId) return;
    const item = content.find((entry) => entry.id === editingContentId);
    if (!item) return;
    setContentDraft({
      contentType: item.contentType,
      status: item.status === "READY" ? "READY" : "DRAFT",
      message: item.message,
      linkUrl: item.linkUrl ?? "",
      mediaUrl: item.mediaUrl ?? "",
      altText: item.altText ?? "",
    });
  }, [content, editingContentId]);

  useEffect(() => { accountKey.current = null; }, [accountDraft]);
  useEffect(() => { contentKey.current = null; }, [contentDraft]);
  useEffect(() => { publicationKey.current = null; }, [publicationAccountId, publicationContentId, publicationExecution, publicationSchedule]);

  useEffect(() => {
    if (!availableAccounts.some((item) => item.id === publicationAccountId)) setPublicationAccountId(availableAccounts[0]?.id ?? "");
  }, [availableAccounts, publicationAccountId]);

  useEffect(() => {
    if (!publishableContent.some((item) => item.id === publicationContentId)) setPublicationContentId(publishableContent[0]?.id ?? "");
  }, [publicationContentId, publishableContent]);

  const runMutation = async (key: string, permitted: boolean, action: () => Promise<void>) => {
    if (!workspaceId || !permitted) return;
    setBusy(key);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (cause) {
      setError(messageFor(cause, "The action could not be completed. No success was assumed."));
      if (cause instanceof ApiError && cause.code === "SOCIAL_VERSION_CONFLICT") await loadCore({ quiet: true });
    } finally {
      setBusy("");
    }
  };

  const createAccount = (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId) return;
    const connection = socialConnections.find((item) => item.id === accountDraft.providerConnectionId);
    const readiness = connection ? connectionReadiness(connection, accountDraft.provider) : "Choose an authorized Meta connection.";
    if (readiness) {
      setError(`${readiness} Lulu did not create or verify a publishing account.`);
      return;
    }
    void runMutation("create-account", canManageSocial, async () => {
      const result = await socialPublishingApi.createAccount(workspaceId, {
        providerConnectionId: accountDraft.providerConnectionId,
        provider: accountDraft.provider,
        displayName: accountDraft.displayName.trim(),
        facebookPageId: accountDraft.facebookPageId.trim(),
        instagramBusinessAccountId: accountDraft.provider === "INSTAGRAM" ? accountDraft.instagramBusinessAccountId.trim() : null,
        idempotencyKey: accountKey.current ??= createSocialIdempotencyKey("account"),
      });
      accountKey.current = null;
      setAccounts((items) => [result.data, ...items.filter((item) => item.id !== result.data.id)]);
      setShowAccountComposer(false);
      setAccountDraft(EMPTY_ACCOUNT_DRAFT);
      setNotice("Account configuration saved. Provider identity must still be verified before Lulu can publish.");
      updateLocation("accounts", { key: "accountId", id: result.data.id });
    });
  };

  const verifyAccount = (account: SocialAccount) => {
    if (!workspaceId) return;
    void runMutation(`verify:${account.id}`, canManageSocial, async () => {
      const result = await socialPublishingApi.verifyAccount(workspaceId, account.id, account.version);
      setAccounts((items) => items.map((item) => item.id === result.data.id ? result.data : item));
      setNotice(result.data.status === "AVAILABLE"
        ? "Meta verified the exact Page identity and publishing credential."
        : `Verification did not pass: ${result.data.statusReason}`);
    });
  };

  const saveContent = (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId) return;
    const linkUrl = contentDraft.contentType === "LINK" ? contentDraft.linkUrl.trim() : null;
    const mediaUrl = contentDraft.contentType === "IMAGE" ? contentDraft.mediaUrl.trim() : null;
    if ((linkUrl && !isPublicHttps(linkUrl)) || (mediaUrl && !isPublicHttps(mediaUrl))) {
      setError("Publishing URLs must be public HTTPS URLs without credentials, a custom port or fragment.");
      return;
    }
    void runMutation("save-content", canManageSocial, async () => {
      let saved: SocialContent;
      const existing = content.find((item) => item.id === editingContentId);
      if (existing) {
        const result = await socialPublishingApi.updateContent(workspaceId, existing.id, {
          expectedVersion: existing.version,
          status: contentDraft.status,
          message: contentDraft.message,
          linkUrl,
          mediaUrl,
          altText: contentDraft.contentType === "IMAGE" ? contentDraft.altText.trim() || null : null,
        });
        saved = result.data;
      } else {
        const result = await socialPublishingApi.createContent(workspaceId, {
          contentType: contentDraft.contentType,
          status: contentDraft.status,
          message: contentDraft.message,
          linkUrl,
          mediaUrl,
          altText: contentDraft.contentType === "IMAGE" ? contentDraft.altText.trim() || null : null,
          metadata: { source: "workspace" },
          idempotencyKey: contentKey.current ??= createSocialIdempotencyKey("content"),
        });
        contentKey.current = null;
        saved = result.data;
      }
      setContent((items) => [saved, ...items.filter((item) => item.id !== saved.id)]);
      setEditingContentId(saved.id);
      setNotice(saved.status === "READY" ? "Content is ready for verified channels." : "Draft saved without publishing.");
      updateLocation("content", { key: "contentId", id: saved.id });
    });
  };

  const createPublication = (event: FormEvent) => {
    event.preventDefault();
    if (!workspaceId) return;
    const scheduledAt = publicationExecution === "QUEUE" && publicationSchedule ? new Date(publicationSchedule).toISOString() : null;
    void runMutation("create-publication", canPublishSocial, async () => {
      const result = await socialPublishingApi.createPublication(workspaceId, {
        socialAccountId: publicationAccountId,
        contentId: publicationContentId,
        execution: publicationExecution,
        scheduledAt,
        maxAttempts: 5,
        idempotencyKey: publicationKey.current ??= createSocialIdempotencyKey("publication"),
      });
      publicationKey.current = null;
      setPublications((items) => [result.data, ...items.filter((item) => item.id !== result.data.id)]);
      setSelectedPublication(result.data);
      setPublicationSchedule("");
      setNotice(result.data.status === "BLOCKED"
        ? `Publication was blocked before provider execution: ${result.data.blockMessage ?? "provider requirements were not satisfied"}`
        : result.data.status === "DRAFT"
          ? "Publication draft created. Nothing was sent to Meta."
          : result.data.status === "SCHEDULED"
            ? "Publication scheduled. The backend will execute it at the saved time."
            : "Publication accepted by Lulu's worker. Published status will appear only after Meta confirms it.");
      updateLocation("publications", { key: "publicationId", id: result.data.id });
    });
  };

  const transitionPublication = (action: "queue" | "retry" | "cancel", job: SocialPublicationJob) => {
    if (!workspaceId) return;
    void runMutation(`${action}:${job.id}`, canPublishSocial, async () => {
      const result = action === "cancel"
        ? await socialPublishingApi.cancelPublication(workspaceId, job.id, job.version)
        : action === "retry"
          ? await socialPublishingApi.retryPublication(workspaceId, job.id, job.version)
          : await socialPublishingApi.queuePublication(workspaceId, job.id, job.version);
      setPublications((items) => items.map((item) => item.id === result.data.id ? result.data : item));
      const detail = await socialPublishingApi.getPublication(workspaceId, job.id);
      setSelectedPublication(detail.data);
      setNotice(action === "cancel"
        ? "Publication cancelled before another provider attempt."
        : "Publication accepted by Lulu's worker. Delivery is not shown as successful until Meta confirms it.");
    });
  };

  const startNewContent = () => {
    setEditingContentId(null);
    setContentDraft(EMPTY_CONTENT_DRAFT);
    contentKey.current = null;
    updateLocation("content", null);
  };

  const startEditContent = (item: SocialContent) => {
    setEditingContentId(item.id);
    updateLocation("content", { key: "contentId", id: item.id });
  };

  const accountDraftConnection = socialConnections.find((item) => item.id === accountDraft.providerConnectionId) ?? null;
  const accountDraftIssue = accountDraftConnection ? connectionReadiness(accountDraftConnection, accountDraft.provider) : null;
  const contentValid = contentDraft.contentType === "TEXT"
    ? Boolean(contentDraft.message.trim())
    : contentDraft.contentType === "LINK"
      ? Boolean(contentDraft.message.trim()) && isPublicHttps(contentDraft.linkUrl.trim())
      : isPublicHttps(contentDraft.mediaUrl.trim());
  const publishValid = !connectionError && Boolean(publicationAccountId && publicationContentId)
    && (publicationExecution === "DRAFT" || !publicationSchedule || new Date(publicationSchedule).getTime() > Date.now());

  if (!selectedWorkspace) {
    return <WorkspaceSurfaceShell activeSlug="wondrous-cloud-1355"><main className="page-frame grid min-h-screen place-items-center p-8 text-sm text-[var(--muted-foreground)]">Choose a workspace to manage social publishing.</main></WorkspaceSurfaceShell>;
  }

  return (
    <WorkspaceSurfaceShell activeSlug="wondrous-cloud-1355">
      <main className="page-frame min-h-screen bg-[var(--background)] px-4 py-6 sm:px-7 sm:py-8">
        <div className="mx-auto max-w-[1500px] space-y-5">
          <header className="relative overflow-hidden rounded-3xl border border-slate-800 bg-[radial-gradient(circle_at_85%_0%,rgba(37,199,214,.24),transparent_30%),radial-gradient(circle_at_0%_100%,rgba(124,58,237,.28),transparent_36%),#0b1020] p-6 text-white shadow-xl sm:p-8">
            <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.18em] text-cyan-200"><Sparkles size={14} /> Social distribution</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Verified publishing. Real outcomes.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Lulu turns verified brand knowledge into channel-ready content, schedules real provider jobs and records success only after Meta confirms the publication.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:min-w-[430px]">
                <HeroMetric label="Verified channels" value={coreState === "loading" || coreState === "error" ? "—" : String(availableAccounts.length)} />
                <HeroMetric label="Ready assets" value={coreState === "loading" || coreState === "error" ? "—" : String(readyContent.length)} />
                <HeroMetric label="Published" value={coreState === "loading" || coreState === "error" ? "—" : String(publications.filter((item) => item.status === "PUBLISHED").length)} />
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-sm lg:w-auto" aria-label="Social publishing sections">
              {([
                ["publications", "Publications", Send],
                ["content", "Content studio", FilePenLine],
                ["accounts", "Channels", ShieldCheck],
              ] as const).map(([key, label, Icon]) => (
                <button key={key} type="button" onClick={() => updateLocation(key, null)} aria-current={tab === key ? "page" : undefined} className={`inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-xs font-semibold transition ${tab === key ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm" : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"}`}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </nav>
            <button type="button" onClick={() => { void loadCore({ quiet: true }); void loadConnections(); }} disabled={refreshing} className="inline-flex min-h-10 items-center justify-center gap-2 self-end rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-xs font-semibold text-[var(--foreground)] shadow-sm disabled:opacity-60">
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh server state
            </button>
          </div>

          {error ? <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"><ShieldAlert className="mt-0.5 shrink-0" size={18} /><div><strong className="block">Action stopped safely</strong><span className="mt-1 block text-xs leading-5">{error}</span></div></div> : null}
          {connectionError ? <div role="alert" className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><Unplug className="mt-0.5 shrink-0" size={18} /><div><strong className="block">Provider state unavailable</strong><span className="mt-1 block text-xs leading-5">{connectionError}</span></div></div> : null}
          {notice ? <div role="status" className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900"><BadgeCheck className="mt-0.5 shrink-0" size={18} /><span className="text-xs leading-5">{notice}</span></div> : null}
          {!canManageSocial && !canPublishSocial ? <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><ShieldAlert className="mt-0.5 shrink-0" size={18} /><span>You have read-only social access. Lulu will show real state, but management and publishing controls are disabled.</span></div> : null}

          {(coreState === "loading" || coreState === "refreshing") && !accounts.length && !content.length && !publications.length ? (
            <Surface className="grid min-h-[480px] place-items-center"><div className="flex items-center gap-3 text-sm text-[var(--muted-foreground)]"><LoaderCircle className="animate-spin" size={19} /> Loading canonical publishing state…</div></Surface>
          ) : (coreState === "error" || coreState === "stale") && !accounts.length && !content.length && !publications.length ? (
            <Surface className="grid min-h-[480px] place-items-center"><EmptyState icon={<ShieldAlert size={22}/>} title="Publishing state unavailable" description="Lulu could not verify channels, content or publication jobs. Refresh server state to try again." /></Surface>
          ) : tab === "accounts" ? (
            <AccountsWorkspace
              accounts={accounts}
              connections={socialConnections}
              selected={selectedAccount}
              selectedId={selectedAccountId}
              connectionError={connectionError}
              canEdit={canManageSocial}
              busy={busy}
              composerOpen={showAccountComposer}
              draft={accountDraft}
              draftIssue={accountDraftIssue}
              onSelect={(id) => updateLocation("accounts", { key: "accountId", id })}
              onOpenComposer={() => { setShowAccountComposer(true); setAccountDraft(EMPTY_ACCOUNT_DRAFT); accountKey.current = null; }}
              onCloseComposer={() => setShowAccountComposer(false)}
              onDraftChange={(next) => setAccountDraft(next)}
              onSubmit={createAccount}
              onVerify={verifyAccount}
            />
          ) : tab === "content" ? (
            <ContentWorkspace
              items={content}
              selected={selectedContent}
              editingId={editingContentId}
              draft={contentDraft}
              valid={contentValid}
              canEdit={canManageSocial}
              busy={busy}
              onSelect={startEditContent}
              onNew={startNewContent}
              onDraftChange={setContentDraft}
              onSubmit={saveContent}
            />
          ) : (
            <PublicationsWorkspace
              jobs={publications}
              accounts={accounts}
              eligibleAccounts={availableAccounts}
              content={content}
              selected={selectedPublication}
              selectedId={selectedPublicationId}
              accountId={publicationAccountId}
              contentId={publicationContentId}
              execution={publicationExecution}
              schedule={publicationSchedule}
              publishableContent={publishableContent}
              valid={publishValid}
              canEdit={canPublishSocial}
              busy={busy}
              onSelect={(id) => updateLocation("publications", { key: "publicationId", id })}
              onAccountChange={setPublicationAccountId}
              onContentChange={setPublicationContentId}
              onExecutionChange={setPublicationExecution}
              onScheduleChange={setPublicationSchedule}
              onSubmit={createPublication}
              onTransition={transitionPublication}
            />
          )}
        </div>
      </main>
    </WorkspaceSurfaceShell>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[.07] p-3 backdrop-blur"><span className="block text-[9px] font-semibold uppercase tracking-[.12em] text-slate-400">{label}</span><strong className="mt-2 block text-2xl tracking-tight text-white">{value}</strong></div>;
}

function AccountsWorkspace(props: {
  accounts: SocialAccount[];
  connections: ProviderConnection[];
  selected: SocialAccount | null;
  selectedId: string | null;
  connectionError: string;
  canEdit: boolean;
  busy: string;
  composerOpen: boolean;
  draft: AccountDraft;
  draftIssue: string | null;
  onSelect: (id: string) => void;
  onOpenComposer: () => void;
  onCloseComposer: () => void;
  onDraftChange: (draft: AccountDraft) => void;
  onSubmit: (event: FormEvent) => void;
  onVerify: (account: SocialAccount) => void;
}) {
  const selectedConnection = props.connections.find((item) => item.id === props.draft.providerConnectionId) ?? null;
  const usableConnections = props.connections.filter((item) => !connectionReadiness(item, item.providerKey.toUpperCase() as SocialProvider));
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,.95fr)]">
      <Surface className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] p-5">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Provider identity</p><h2 className="mt-1 text-lg font-semibold">Verified channels</h2></div>
          <button type="button" onClick={props.onOpenComposer} disabled={!props.canEdit} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 text-xs font-semibold text-[var(--background)] disabled:opacity-50"><Plus size={15} /> Add channel</button>
        </div>
        {props.connectionError ? <div className="m-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800"><Unplug size={16} className="mt-0.5 shrink-0" />{props.connectionError}</div> : null}
        {!props.connections.length && !props.connectionError ? <div className="mx-4 mt-4 flex items-start justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"><span>No Facebook or Instagram provider connection is available. Lulu cannot configure or publish a channel.</span><button type="button" onClick={() => navigateApp(routes.app.connections)} className="inline-flex shrink-0 items-center gap-1 font-semibold">Connections <ArrowUpRight size={13} /></button></div> : null}
        {!props.accounts.length ? (
          <EmptyState icon={<ShieldCheck size={22} />} title="No publishing identity yet" description="Connect an exact Facebook Page or Instagram Business account. Lulu verifies provider ownership and required scopes before a post can run." />
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {props.accounts.map((account) => (
              <button key={account.id} type="button" onClick={() => props.onSelect(account.id)} className={`flex w-full items-start gap-3 p-4 text-left transition hover:bg-[var(--secondary)]/60 sm:p-5 ${props.selectedId === account.id ? "bg-[var(--secondary)]" : ""}`}>
                <ProviderMark provider={account.provider} />
                <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="truncate text-sm">{account.displayName}</strong><StatusBadge status={account.status} /></span><span className="mt-1 block truncate text-xs text-[var(--muted-foreground)]">{account.provider === "INSTAGRAM" && account.providerUsername ? `@${account.providerUsername}` : `${account.provider === "FACEBOOK" ? "Page" : "Business account"} · ${shortId(account.provider === "FACEBOOK" ? account.facebookPageId : account.instagramBusinessAccountId ?? account.facebookPageId)}`}</span></span>
              </button>
            ))}
          </div>
        )}
      </Surface>

      <Surface className="self-start overflow-hidden xl:sticky xl:top-24">
        {props.composerOpen ? (
          <form onSubmit={props.onSubmit}>
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-violet-600">Exact Meta identity</p><h2 className="mt-1 text-lg font-semibold">Add publishing channel</h2></div><button type="button" onClick={props.onCloseComposer} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--secondary)]"><X size={16} /></button></div>
            <div className="space-y-4 p-5">
              <Field label="Authorized provider connection"><select value={props.draft.providerConnectionId} onChange={(event) => { const connection = props.connections.find((item) => item.id === event.target.value); props.onDraftChange({ ...props.draft, providerConnectionId: event.target.value, provider: connection?.providerKey === "instagram" ? "INSTAGRAM" : "FACEBOOK", instagramBusinessAccountId: connection?.providerKey === "instagram" ? props.draft.instagramBusinessAccountId : "" }); }} className={inputClass}><option value="">Choose a verified connection</option>{props.connections.map((connection) => <option key={connection.id} value={connection.id}>{connection.displayName} · {connection.providerKey} · {connection.status}</option>)}</select></Field>
              {selectedConnection ? <div className={`rounded-xl border p-3 text-xs leading-5 ${props.draftIssue ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}><strong className="block">{props.draftIssue ? "Connection cannot publish" : "Connection prerequisites present"}</strong>{props.draftIssue ?? "The backend will still verify the exact Page identity with Meta."}</div> : null}
              <Field label="Display name"><input required maxLength={200} value={props.draft.displayName} onChange={(event) => props.onDraftChange({ ...props.draft, displayName: event.target.value })} placeholder="Brand or Page name" className={inputClass} /></Field>
              <Field label="Facebook Page ID"><input required inputMode="numeric" pattern="[0-9]{2,40}" value={props.draft.facebookPageId} onChange={(event) => props.onDraftChange({ ...props.draft, facebookPageId: event.target.value.replace(/\D/g, "") })} placeholder="Exact numeric Page ID" className={inputClass} /><small>Instagram publishing also requires the Facebook Page that owns the Business account.</small></Field>
              {props.draft.provider === "INSTAGRAM" ? <Field label="Instagram Business account ID"><input required inputMode="numeric" pattern="[0-9]{2,40}" value={props.draft.instagramBusinessAccountId} onChange={(event) => props.onDraftChange({ ...props.draft, instagramBusinessAccountId: event.target.value.replace(/\D/g, "") })} placeholder="Exact numeric Business account ID" className={inputClass} /></Field> : null}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-3 text-xs leading-5 text-[var(--muted-foreground)]"><ShieldCheck size={15} className="mr-2 inline text-emerald-600" />Saving does not imply verification. Publishing stays blocked until Meta validates the identity, token and required scopes.</div>
              <button type="submit" disabled={!props.canEdit || props.busy === "create-account" || !props.draft.providerConnectionId || !props.draft.displayName.trim() || props.draft.facebookPageId.length < 2 || (props.draft.provider === "INSTAGRAM" && props.draft.instagramBusinessAccountId.length < 2) || Boolean(props.draftIssue)} className={primaryButtonClass}>{props.busy === "create-account" ? <LoaderCircle size={15} className="animate-spin" /> : <ShieldCheck size={15} />} Save unverified channel</button>
            </div>
          </form>
        ) : props.selected ? (
          <div>
            <div className="border-b border-[var(--border)] p-5"><div className="flex items-start gap-3"><ProviderMark provider={props.selected.provider} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold">{props.selected.displayName}</h2><StatusBadge status={props.selected.status} /></div><p className="mt-1 text-xs text-[var(--muted-foreground)]">{props.selected.provider} publishing identity</p></div></div></div>
            <div className="space-y-4 p-5">
              <Definition label="Status reason" value={props.selected.statusReason} />
              <div className="grid gap-3 sm:grid-cols-2"><Definition label="Facebook Page ID" value={props.selected.facebookPageId} mono /><Definition label="Instagram Business ID" value={props.selected.instagramBusinessAccountId ?? "Not configured"} mono /></div>
              <div className="grid gap-3 sm:grid-cols-2"><Definition label="Verified at" value={formatDate(props.selected.verifiedAt)} /><Definition label="Provider connection" value={shortId(props.selected.providerConnectionId)} mono /></div>
              {props.selected.lastErrorCode ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800"><strong className="block">{props.selected.lastErrorCode}</strong>{props.selected.lastErrorMessage ?? "Provider verification failed."}</div> : null}
              <button type="button" onClick={() => props.onVerify(props.selected!)} disabled={!props.canEdit || props.busy === `verify:${props.selected.id}`} className={primaryButtonClass}>{props.busy === `verify:${props.selected.id}` ? <LoaderCircle className="animate-spin" size={15} /> : <ShieldCheck size={15} />}{props.selected.status === "AVAILABLE" ? "Verify with Meta again" : "Verify exact identity with Meta"}</button>
            </div>
          </div>
        ) : (
          <EmptyState icon={<ShieldCheck size={22} />} title="Select a channel" description="Inspect the exact Page identity, verification result and current provider error before publishing." action={usableConnections.length && props.canEdit ? <button type="button" onClick={props.onOpenComposer} className={secondaryButtonClass}><Plus size={14} /> Add channel</button> : undefined} />
        )}
      </Surface>
    </div>
  );
}

function ContentWorkspace(props: {
  items: SocialContent[];
  selected: SocialContent | null;
  editingId: string | null;
  draft: ContentDraft;
  valid: boolean;
  canEdit: boolean;
  busy: string;
  onSelect: (item: SocialContent) => void;
  onNew: () => void;
  onDraftChange: (draft: ContentDraft) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(320px,.75fr)_minmax(0,1.25fr)]">
      <Surface className="overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] p-5"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Canonical assets</p><h2 className="mt-1 text-lg font-semibold">Content library</h2></div><button type="button" onClick={props.onNew} disabled={!props.canEdit} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--foreground)] px-4 text-xs font-semibold text-[var(--background)] disabled:opacity-50"><Plus size={15} /> New</button></div>
        {!props.items.length ? <EmptyState icon={<FilePenLine size={22} />} title="No content yet" description="Lulu-created assets and manual drafts share this canonical library. A READY status means structurally ready—not provider-published." /> : <div className="max-h-[760px] divide-y divide-[var(--border)] overflow-auto">{props.items.map((item) => <button key={item.id} type="button" onClick={() => props.onSelect(item)} className={`w-full p-4 text-left transition hover:bg-[var(--secondary)]/60 ${props.editingId === item.id ? "bg-[var(--secondary)]" : ""}`}><span className="flex items-start justify-between gap-3"><span className="flex min-w-0 items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--secondary)] text-violet-600">{item.contentType === "IMAGE" ? <Image size={17} /> : item.contentType === "LINK" ? <Link2 size={17} /> : <FilePenLine size={17} />}</span><span className="min-w-0"><strong className="line-clamp-2 text-xs leading-5">{item.message || item.altText || item.mediaUrl || "Untitled media asset"}</strong><span className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[var(--muted-foreground)]"><span>{item.contentType}</span><span>·</span><span>{item.createdByActorType === "AI_AGENT" || item.createdByActorType === "WORKFLOW" ? "Created by Lulu" : "Created manually"}</span><span>·</span><span>{formatDate(item.updatedAt)}</span></span></span></span><StatusBadge status={item.status} /></span></button>)}</div>}
      </Surface>

      <Surface className="self-start overflow-hidden xl:sticky xl:top-24">
        <form onSubmit={props.onSubmit}>
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-violet-600">{props.editingId ? "Canonical content version" : "New canonical asset"}</p><h2 className="mt-1 text-lg font-semibold">{props.editingId ? "Edit content" : "Create content"}</h2>{props.selected ? <p className="mt-1 text-[10px] text-[var(--muted-foreground)]">Version {props.selected.version} · {shortId(props.selected.id)}</p> : null}</div><div className="flex rounded-xl border border-[var(--border)] bg-[var(--secondary)] p-1">{(["DRAFT", "READY"] as const).map((status) => <button key={status} type="button" onClick={() => props.onDraftChange({ ...props.draft, status })} className={`rounded-lg px-3 py-2 text-[10px] font-semibold ${props.draft.status === status ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)]"}`}>{status}</button>)}</div></div>
          <div className="space-y-4 p-5">
            <div className="grid grid-cols-3 gap-2">{([[
              "TEXT", FilePenLine, "Text"], ["LINK", Link2, "Link"], ["IMAGE", Image, "Image"]] as const).map(([type, Icon, label]) => <button key={type} type="button" disabled={Boolean(props.editingId && props.selected?.contentType !== type)} onClick={() => props.onDraftChange({ ...props.draft, contentType: type, linkUrl: type === "LINK" ? props.draft.linkUrl : "", mediaUrl: type === "IMAGE" ? props.draft.mediaUrl : "", altText: type === "IMAGE" ? props.draft.altText : "" })} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${props.draft.contentType === type ? "border-violet-300 bg-violet-50 text-violet-800" : "border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"}`}><Icon size={15} />{label}</button>)}</div>
            <Field label={props.draft.contentType === "IMAGE" ? "Caption" : "Message"}><textarea required={props.draft.contentType !== "IMAGE"} value={props.draft.message} onChange={(event) => props.onDraftChange({ ...props.draft, message: event.target.value })} maxLength={63206} placeholder={props.draft.contentType === "IMAGE" ? "Caption for the image…" : "Write the channel message…"} className={`${inputClass} min-h-40 resize-y`} /><small>{props.draft.message.length.toLocaleString()} characters · Instagram captions are limited to 2,200 characters when you create a publication.</small></Field>
            {props.draft.contentType === "LINK" ? <Field label="Public destination URL"><input required type="url" value={props.draft.linkUrl} onChange={(event) => props.onDraftChange({ ...props.draft, linkUrl: event.target.value })} placeholder="https://example.com/offer" className={inputClass} /><small>A public HTTPS URL is required. The backend rejects private or credentialed addresses.</small></Field> : null}
            {props.draft.contentType === "IMAGE" ? <><Field label="Public image URL"><input required type="url" value={props.draft.mediaUrl} onChange={(event) => props.onDraftChange({ ...props.draft, mediaUrl: event.target.value })} placeholder="https://cdn.example.com/image.jpg" className={inputClass} /><small>Meta must be able to fetch this image from a public HTTPS address.</small></Field><Field label="Alternative text"><input maxLength={1000} value={props.draft.altText} onChange={(event) => props.onDraftChange({ ...props.draft, altText: event.target.value })} placeholder="Describe the image for accessibility" className={inputClass} /></Field></> : null}
            {props.editingId ? <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><ShieldAlert size={15} className="mt-0.5 shrink-0" />Once this content is queued in a publication, it becomes immutable. Create a new content version for later changes.</div> : null}
            <button type="submit" disabled={!props.canEdit || !props.valid || props.busy === "save-content"} className={primaryButtonClass}>{props.busy === "save-content" ? <LoaderCircle className="animate-spin" size={15} /> : <PencilLine size={15} />}{props.editingId ? "Save canonical content" : "Create canonical content"}</button>
          </div>
        </form>
      </Surface>
    </div>
  );
}

function PublicationsWorkspace(props: {
  jobs: SocialPublicationJob[];
  accounts: SocialAccount[];
  eligibleAccounts: SocialAccount[];
  content: SocialContent[];
  selected: SocialPublicationJob | null;
  selectedId: string | null;
  accountId: string;
  contentId: string;
  execution: "DRAFT" | "QUEUE";
  schedule: string;
  publishableContent: SocialContent[];
  valid: boolean;
  canEdit: boolean;
  busy: string;
  onSelect: (id: string) => void;
  onAccountChange: (id: string) => void;
  onContentChange: (id: string) => void;
  onExecutionChange: (value: "DRAFT" | "QUEUE") => void;
  onScheduleChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onTransition: (action: "queue" | "retry" | "cancel", job: SocialPublicationJob) => void;
}) {
  const accountsById = useMemo(() => new Map(props.accounts.map((item) => [item.id, item])), [props.accounts]);
  const contentById = useMemo(() => new Map(props.content.map((item) => [item.id, item])), [props.content]);
  const availableAccounts = props.eligibleAccounts;
  const selectedAccount = accountsById.get(props.accountId) ?? null;
  const selectedContent = contentById.get(props.contentId) ?? null;
  const ambiguous = props.selected?.blockCode === "META_PUBLISH_RESULT_UNKNOWN" || props.selected?.lastErrorCode === "META_PUBLISH_RESULT_UNKNOWN";
  const retryable = Boolean(props.selected && ["FAILED", "BLOCKED"].includes(props.selected.status) && !ambiguous);
  const queueable = props.selected?.status === "DRAFT";
  const cancellable = Boolean(props.selected && CANCELLABLE_PUBLICATION_STATES.includes(props.selected.status));
  return (
    <div className="grid gap-5 2xl:grid-cols-[minmax(290px,.7fr)_minmax(430px,1fr)_minmax(360px,.8fr)]">
      <Surface className="overflow-hidden">
        <div className="border-b border-[var(--border)] p-5"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Provider jobs</p><h2 className="mt-1 text-lg font-semibold">Publication ledger</h2></div>
        {!props.jobs.length ? <EmptyState icon={<Send size={22} />} title="No publications yet" description="Create a draft, schedule a future run or queue a verified channel now. Each provider attempt is recorded separately." /> : <div className="max-h-[820px] divide-y divide-[var(--border)] overflow-auto">{props.jobs.map((job) => { const account = accountsById.get(job.socialAccountId); const asset = contentById.get(job.contentId); return <button key={job.id} type="button" onClick={() => props.onSelect(job.id)} className={`w-full p-4 text-left transition hover:bg-[var(--secondary)]/60 ${props.selectedId === job.id ? "bg-[var(--secondary)]" : ""}`}><div className="flex items-start gap-3">{account ? <ProviderMark provider={account.provider} /> : <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--secondary)]"><Unplug size={16} /></span>}<div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><strong className="truncate text-xs">{account?.displayName ?? "Missing account"}</strong><StatusBadge status={job.status} /></div><p className="mt-1 line-clamp-2 text-[11px] leading-4 text-[var(--muted-foreground)]">{asset?.message || asset?.altText || asset?.mediaUrl || "Missing canonical content"}</p><span className="mt-2 flex items-center gap-1 text-[10px] text-[var(--muted-foreground)]">{job.scheduledAt ? <CalendarClock size={11} /> : <Clock3 size={11} />}{job.scheduledAt ? formatDate(job.scheduledAt) : formatDate(job.createdAt)}</span></div></div></button>; })}</div>}
      </Surface>

      <Surface className="self-start overflow-hidden">
        <form onSubmit={props.onSubmit}>
          <div className="border-b border-[var(--border)] p-5"><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-violet-600">Manual control · same canonical engine</p><h2 className="mt-1 text-lg font-semibold">Create publication</h2><p className="mt-2 text-xs leading-5 text-[var(--muted-foreground)]">Lulu's autonomous workflows use the same accounts, content and server-side publication worker.</p></div>
          <div className="space-y-4 p-5">
            {!availableAccounts.length ? <div className="flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><span>No verified channel is available. Publishing is disabled.</span><button type="button" onClick={() => navigateApp("/app/wondrous-cloud-1355?section=accounts")} className="inline-flex shrink-0 items-center gap-1 font-semibold">Channels <ArrowUpRight size={12} /></button></div> : null}
            <Field label="Verified channel"><select value={props.accountId} onChange={(event) => props.onAccountChange(event.target.value)} className={inputClass}><option value="">Choose a channel</option>{availableAccounts.map((account) => <option key={account.id} value={account.id}>{account.displayName} · {account.provider}</option>)}</select></Field>
            <Field label="Ready canonical content"><select value={props.contentId} onChange={(event) => props.onContentChange(event.target.value)} className={inputClass}><option value="">Choose ready content</option>{props.publishableContent.map((item) => <option key={item.id} value={item.id}>{item.contentType} · {(item.message || item.altText || item.mediaUrl || item.id).slice(0, 72)}</option>)}</select>{selectedAccount?.provider === "INSTAGRAM" ? <small>Instagram is fail-closed to verified single-image content in the current production connector.</small> : null}</Field>
            {selectedContent ? <article className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/60 p-4"><div className="flex items-center justify-between gap-2"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">Provider payload preview</span><StatusBadge status={selectedContent.status} /></div><p className="mt-3 whitespace-pre-wrap text-xs leading-5">{selectedContent.message || "No caption"}</p>{selectedContent.mediaUrl ? <p className="mt-2 truncate text-[10px] text-[var(--muted-foreground)]">Image: {selectedContent.mediaUrl}</p> : null}{selectedContent.linkUrl ? <p className="mt-2 truncate text-[10px] text-[var(--muted-foreground)]">Link: {selectedContent.linkUrl}</p> : null}{selectedAccount?.provider === "INSTAGRAM" && selectedContent.message.length > 2200 ? <p className="mt-3 text-xs font-medium text-rose-700">Instagram caption exceeds 2,200 characters. The server will reject this publication.</p> : null}</article> : null}
            <div className="grid grid-cols-2 gap-2">{(["QUEUE", "DRAFT"] as const).map((value) => <button key={value} type="button" onClick={() => props.onExecutionChange(value)} className={`min-h-11 rounded-xl border px-3 text-xs font-semibold ${props.execution === value ? "border-violet-300 bg-violet-50 text-violet-800" : "border-[var(--border)] text-[var(--muted-foreground)]"}`}>{value === "QUEUE" ? "Queue / schedule" : "Save job as draft"}</button>)}</div>
            {props.execution === "QUEUE" ? <Field label="Publish time (optional)"><input type="datetime-local" value={props.schedule} min={new Date(Date.now() + 60_000).toISOString().slice(0, 16)} onChange={(event) => props.onScheduleChange(event.target.value)} className={inputClass} /><small>Leave empty to queue immediately. The worker records Meta confirmation before showing PUBLISHED.</small></Field> : null}
            <button type="submit" disabled={!props.canEdit || !props.valid || props.busy === "create-publication" || Boolean(selectedAccount?.provider === "INSTAGRAM" && (selectedContent?.contentType !== "IMAGE" || selectedContent.message.length > 2200))} className={primaryButtonClass}>{props.busy === "create-publication" ? <LoaderCircle className="animate-spin" size={15} /> : props.execution === "DRAFT" ? <FilePenLine size={15} /> : props.schedule ? <CalendarClock size={15} /> : <Send size={15} />}{props.execution === "DRAFT" ? "Create publication draft" : props.schedule ? "Schedule publication" : "Queue verified publication"}</button>
          </div>
        </form>
      </Surface>

      <Surface className="self-start overflow-hidden 2xl:sticky 2xl:top-24">
        {props.selected ? <div><div className="border-b border-[var(--border)] p-5"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">Execution evidence</p><h2 className="mt-1 text-lg font-semibold">Publication detail</h2></div><StatusBadge status={props.selected.status} /></div><p className="mt-2 font-mono text-[10px] text-[var(--muted-foreground)]">{props.selected.id}</p></div><div className="space-y-4 p-5">
          {props.selected.blockCode || props.selected.lastErrorCode ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-5 text-rose-800"><strong className="block">{props.selected.blockCode ?? props.selected.lastErrorCode}</strong>{props.selected.blockMessage ?? props.selected.lastErrorMessage ?? "Provider execution stopped."}</div> : null}
          {ambiguous ? <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950"><strong className="block">Manual reconciliation required</strong>Meta did not return a definitive result after delivery began. Check the Page directly before any retry; Lulu disables blind retry here to prevent a duplicate post.</div> : null}
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1"><Definition label="Channel" value={props.selected.account?.displayName ?? accountsById.get(props.selected.socialAccountId)?.displayName ?? shortId(props.selected.socialAccountId)} /><Definition label="Scheduled" value={formatDate(props.selected.scheduledAt)} /><Definition label="Attempts" value={`${props.selected.attemptCount} / ${props.selected.maxAttempts}`} /><Definition label="Published" value={formatDate(props.selected.publishedAt)} /></div>
          {props.selected.providerPublicationId ? <Definition label="Provider publication ID" value={props.selected.providerPublicationId} mono /> : null}
          {props.selected.providerPermalink && isPublicHttps(props.selected.providerPermalink) ? <a href={props.selected.providerPermalink} target="_blank" rel="noreferrer" className={`${secondaryButtonClass} w-full`}><ArrowUpRight size={14} /> Open confirmed provider publication</a> : null}
          <div className="flex flex-wrap gap-2">{queueable ? <button type="button" onClick={() => props.onTransition("queue", props.selected!)} disabled={!props.canEdit || Boolean(props.busy)} className={secondaryButtonClass}><Send size={14} /> Queue draft</button> : null}{retryable ? <button type="button" onClick={() => props.onTransition("retry", props.selected!)} disabled={!props.canEdit || Boolean(props.busy)} className={secondaryButtonClass}><RotateCcw size={14} /> Retry safely</button> : null}{cancellable ? <button type="button" onClick={() => props.onTransition("cancel", props.selected!)} disabled={!props.canEdit || Boolean(props.busy)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-xs font-semibold text-rose-700 disabled:opacity-50"><XCircle size={14} /> Cancel</button> : null}</div>
          <div><div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold">Provider attempts</h3><span className="text-[10px] text-[var(--muted-foreground)]">Immutable execution trail</span></div>{!props.selected.attempts?.length ? <p className="mt-3 rounded-xl border border-dashed border-[var(--border)] p-4 text-xs leading-5 text-[var(--muted-foreground)]">No provider attempt has started. A draft or future schedule does not count as delivery.</p> : <ol className="mt-3 space-y-2">{props.selected.attempts.map((attempt) => <li key={attempt.id} className="rounded-xl border border-[var(--border)] p-3"><div className="flex items-center justify-between gap-2"><strong className="text-xs">Attempt {attempt.attemptNumber}</strong><StatusBadge status={attempt.status} /></div><p className="mt-2 text-[10px] text-[var(--muted-foreground)]">Started {formatDate(attempt.startedAt)}</p>{attempt.errorCode ? <p className="mt-2 text-xs leading-5 text-rose-700"><strong>{attempt.errorCode}</strong><br />{attempt.errorMessage}</p> : null}{attempt.providerRequestId ? <p className="mt-2 font-mono text-[9px] text-[var(--muted-foreground)]">Provider request {attempt.providerRequestId}</p> : null}</li>)}</ol>}</div>
        </div></div> : <EmptyState icon={<Megaphone size={22} />} title="Select a publication" description="Inspect provider attempts, exact error codes and canonical delivery state. Lulu never turns a queued job into a visual success without provider confirmation." />}
      </Surface>
    </div>
  );
}

const inputClass = "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50";
const primaryButtonClass = "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--foreground)] px-4 text-xs font-semibold text-[var(--background)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-45";
const secondaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--secondary)] disabled:opacity-50";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-semibold text-[var(--foreground)]">{label}</span>{children}</label>;
}

function Definition({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/45 p-3"><span className="block text-[9px] font-semibold uppercase tracking-[.12em] text-[var(--muted-foreground)]">{label}</span><strong className={`mt-1.5 block break-words text-xs leading-5 ${mono ? "font-mono" : "font-medium"}`}>{value}</strong></div>;
}
