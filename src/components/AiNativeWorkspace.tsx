import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  Activity,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  CircleAlert,
  Clock3,
  Database,
  FileText,
  History,
  Image,
  Link,
  LoaderCircle,
  Mic,
  Paperclip,
  PanelTopOpen,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  aiApi,
  type AiMessage,
  type AssistantPendingAction,
  type AssistantToolCall,
  type Conversation,
} from "../api/ai";
import { getFriendlyErrorMessage } from "../api/client";
import { ingestRecord, type WorkspaceRecord } from "../api/records";
import { useLuluApp } from "../api/LuluAppContext";
import { workspaceApi } from "../api/workspaces";
import type { WorkspaceBootstrap } from "../api/types";
import { routes } from "../routing";

type CoreState = "idle" | "listening" | "thinking" | "working" | "completed" | "needs-confirmation" | "attention";
type ComposeMode = "Chat" | "Analysis" | "Action" | "Automation";
type Attachment = { id: string; name: string; resourceType: string; uploadedAt: string };
type WorkspaceMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  toolCalls?: AssistantToolCall[];
  pendingActions?: AssistantPendingAction[];
  attachments?: Attachment[];
};

type SpeechResultEvent = Event & {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognizer = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognizerConstructor = new () => SpeechRecognizer;

const modes: ComposeMode[] = ["Chat", "Analysis", "Action", "Automation"];

const workspaceSurfaces = [
  { label: "Growth system", detail: "Website, organic, content and paid growth", route: routes.app.growth },
  { label: "Company brain", detail: "Knowledge, sources and imported files", route: routes.app.knowledgeBase },
  { label: "Customer system", detail: "CRM, relationships and follow-up work", route: routes.app.crmCompanies },
  { label: "Financial control", detail: "Funding, risk and business records", route: routes.app.finance },
] as const;

const starterIntents = [
  "Build the highest-leverage growth plan for this week.",
  "Show the operating risks that need attention now.",
  "Review the company memory and identify what is missing.",
] as const;

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function toolCallsFromMetadata(metadata: Record<string, unknown>): AssistantToolCall[] {
  const calls = metadata.toolCalls;
  if (!Array.isArray(calls)) return [];
  return calls.flatMap((entry) => {
    const item = asRecord(entry);
    return item && typeof item.name === "string" && asRecord(item.args)
      ? [{ name: item.name, args: item.args as Record<string, unknown>, result: item.result }]
      : [];
  });
}

function pendingActionsFromMetadata(metadata: Record<string, unknown>): AssistantPendingAction[] {
  const actions = metadata.pendingActions;
  if (!Array.isArray(actions)) return [];
  return actions.flatMap((entry) => {
    const item = asRecord(entry);
    return item && typeof item.id === "string" && typeof item.type === "string" && typeof item.summary === "string"
      && typeof item.status === "string" && typeof item.requiresApproval === "boolean"
      ? [{
          id: item.id,
          conversationId: typeof item.conversationId === "string" ? item.conversationId : "",
          type: item.type,
          summary: item.summary,
          payload: asRecord(item.payload) ?? {},
          status: item.status as AssistantPendingAction["status"],
          approvalId: typeof item.approvalId === "string" ? item.approvalId : null,
          requiresApproval: item.requiresApproval,
          result: asRecord(item.result),
          errorCode: typeof item.errorCode === "string" ? item.errorCode : null,
          errorMessage: typeof item.errorMessage === "string" ? item.errorMessage : null,
          expiresAt: typeof item.expiresAt === "string" ? item.expiresAt : null,
        }]
      : [];
  });
}

function attachmentsFromMetadata(metadata: Record<string, unknown>): Attachment[] {
  const attachments = metadata.attachments;
  if (!Array.isArray(attachments)) return [];
  return attachments.flatMap((entry) => {
    const item = asRecord(entry);
    return item && typeof item.id === "string" && typeof item.name === "string" && typeof item.resourceType === "string" && typeof item.uploadedAt === "string"
      ? [{ id: item.id, name: item.name, resourceType: item.resourceType, uploadedAt: item.uploadedAt }]
      : [];
  });
}

function historyToMessages(items: AiMessage[]): WorkspaceMessage[] {
  return items
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: message.content,
      createdAt: message.createdAt,
      toolCalls: toolCallsFromMetadata(message.metadata),
      pendingActions: pendingActionsFromMetadata(message.metadata),
      attachments: attachmentsFromMetadata(message.metadata),
    }));
}

function titleForTool(name: string) {
  if (name === "list_records") return "Live records";
  if (name === "get_knowledge") return "Company memory";
  if (name === "get_agent_health") return "Digital employee health";
  if (name === "request_action") return "Action package";
  return name.replaceAll("_", " ");
}

function statusLabel(status: AssistantPendingAction["status"]) {
  return status.replaceAll("_", " ");
}

function shortValue(value: unknown) {
  if (value == null) return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `${value.length} items`;
  return "Available";
}

type ChartSpec = { type?: "line" | "bar"; title?: string; labels?: string[]; values?: number[] };

function ChartSurface({ spec }: { spec: ChartSpec }) {
  const labels = Array.isArray(spec.labels) ? spec.labels : [];
  const values = Array.isArray(spec.values) ? spec.values : [];
  const data = labels.map((label, index) => ({ label, value: typeof values[index] === "number" ? values[index] : 0 }));
  if (data.length === 0) return null;
  return (
    <figure className="lulu-ai-native__chart-surface">
      {spec.title && <figcaption>{spec.title}</figcaption>}
      <div>
        <ResponsiveContainer width="100%" height="100%">
          {spec.type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="#294138" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#91aaa0" fontSize={11} tickLine={false} />
              <YAxis stroke="#91aaa0" fontSize={11} tickLine={false} />
              <Tooltip cursor={{ stroke: "#70e4d0" }} />
              <Line type="monotone" dataKey="value" stroke="#70e4d0" strokeWidth={2} dot={false} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid stroke="#294138" strokeDasharray="3 3" />
              <XAxis dataKey="label" stroke="#91aaa0" fontSize={11} tickLine={false} />
              <YAxis stroke="#91aaa0" fontSize={11} tickLine={false} />
              <Tooltip cursor={{ fill: "#15231e" }} />
              <Bar dataKey="value" fill="#70e4d0" radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </figure>
  );
}

function responseContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let lineIndex = 0;
  let key = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex] ?? "";
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim().toLowerCase();
      const source: string[] = [];
      lineIndex += 1;
      while (lineIndex < lines.length && !(lines[lineIndex] ?? "").trim().startsWith("```")) {
        source.push(lines[lineIndex] ?? "");
        lineIndex += 1;
      }
      lineIndex += 1;
      if (language === "chart") {
        try {
          const chart = JSON.parse(source.join("\n")) as ChartSpec;
          blocks.push(<ChartSurface key={key++} spec={chart} />);
          continue;
        } catch {
          // Fall through to the safe code representation below.
        }
      }
      blocks.push(<pre key={key++} className="lulu-ai-native__code-surface"><code>{source.join("\n")}</code></pre>);
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      const rows: string[][] = [];
      while (lineIndex < lines.length && /^\s*\|.*\|\s*$/.test(lines[lineIndex] ?? "")) {
        rows.push((lines[lineIndex] ?? "").split("|").slice(1, -1).map((cell) => cell.trim()));
        lineIndex += 1;
      }
      const header = rows[0] ?? [];
      const body = rows.slice(1).filter((row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)));
      if (header.length && body.length) {
        blocks.push(<div key={key++} className="lulu-ai-native__markdown-table"><table><thead><tr>{header.map((cell, index) => <th key={index}>{cell}</th>)}</tr></thead><tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>);
      }
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      blocks.push(<h3 key={key++}>{heading[2]}</h3>);
      lineIndex += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (lineIndex < lines.length && /^\s*[-*]\s+/.test(lines[lineIndex] ?? "")) {
        items.push((lines[lineIndex] ?? "").replace(/^\s*[-*]\s+/, ""));
        lineIndex += 1;
      }
      blocks.push(<ul key={key++}>{items.map((item, index) => <li key={index}>{item.replace(/\*\*/g, "")}</li>)}</ul>);
      continue;
    }

    if (line.trim() === "") {
      lineIndex += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (lineIndex < lines.length && (lines[lineIndex] ?? "").trim() !== "" && !/^\s*\|.*\|\s*$/.test(lines[lineIndex] ?? "") && !(lines[lineIndex] ?? "").trim().startsWith("```") && !/^(#{1,3})\s+/.test(lines[lineIndex] ?? "") && !/^\s*[-*]\s+/.test(lines[lineIndex] ?? "")) {
      paragraph.push(lines[lineIndex] ?? "");
      lineIndex += 1;
    }
    blocks.push(<p key={key++}>{paragraph.join(" ").replace(/\*\*/g, "")}</p>);
  }
  return blocks;
}

function ToolSurface({ call }: { call: AssistantToolCall }) {
  const result = asRecord(call.result);
  const items = Array.isArray(result?.items) ? result.items.map(asRecord).filter((item): item is Record<string, unknown> => Boolean(item)) : [];
  const visibleItems = items.slice(0, 5);
  const columns = visibleItems.length ? Object.keys(visibleItems[0] ?? {}).filter((key) => ["name", "status", "stage", "valueAmount", "updatedAt", "createdAt", "id"].includes(key)).slice(0, 4) : [];
  const summaryEntries = result ? Object.entries(result).filter(([key]) => key !== "items").slice(0, 4) : [];

  return (
    <section className="lulu-ai-native__tool-surface" aria-label={titleForTool(call.name)}>
      <div className="lulu-ai-native__surface-heading">
        <span><Database aria-hidden="true" size={15} /> {titleForTool(call.name)}</span>
        <small>Verified tool output</small>
      </div>
      {visibleItems.length > 0 && columns.length > 0 ? (
        <div className="lulu-ai-native__table-scroll">
          <table>
            <thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
            <tbody>{visibleItems.map((item, index) => <tr key={String(item.id ?? index)}>{columns.map((column) => <td key={column}>{shortValue(item[column])}</td>)}</tr>)}</tbody>
          </table>
        </div>
      ) : summaryEntries.length > 0 ? (
        <dl className="lulu-ai-native__tool-summary">
          {summaryEntries.map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{shortValue(value)}</dd></div>)}
        </dl>
      ) : (
        <p className="lulu-ai-native__empty-surface">The tool returned no displayable records.</p>
      )}
    </section>
  );
}

function ActionSurface({
  action,
  executing,
  onExecute,
}: {
  action: AssistantPendingAction;
  executing: boolean;
  onExecute: (action: AssistantPendingAction) => void;
}) {
  const canRun = action.status === "ready" && !action.requiresApproval;
  return (
    <section className={`lulu-ai-native__action-surface is-${action.status}`} aria-label={action.summary}>
      <div className="lulu-ai-native__surface-heading">
        <span><ShieldCheck aria-hidden="true" size={15} /> Action package</span>
        <small>{statusLabel(action.status)}</small>
      </div>
      <h3>{action.summary}</h3>
      <p>{action.requiresApproval ? "This action is held by workspace governance until its approval is recorded." : "This action is persisted in the workspace and checked by the canonical service before it runs."}</p>
      <div className="lulu-ai-native__action-meta">
        <span>{action.type.replaceAll("_", " ")}</span>
        {action.expiresAt && <span>Expires {new Date(action.expiresAt).toLocaleString()}</span>}
        {action.errorMessage && <span>{action.errorMessage}</span>}
      </div>
      {canRun && (
        <button type="button" className="lulu-ai-native__execute-action" disabled={executing} onClick={() => onExecute(action)}>
          {executing ? <LoaderCircle aria-hidden="true" size={15} className="animate-spin" /> : <ArrowUpRight aria-hidden="true" size={15} />}
          Run checked action
        </button>
      )}
    </section>
  );
}

export function AiNativeWorkspace() {
  const navigate = useNavigate();
  const { selectedWorkspace, permissions, refresh } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const recognitionRef = useRef<SpeechRecognizer | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const [coreState, setCoreState] = useState<CoreState>("idle");
  const [mode, setMode] = useState<ComposeMode>("Chat");
  const [input, setInput] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [showReferenceUrl, setShowReferenceUrl] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [actions, setActions] = useState<AssistantPendingAction[]>([]);
  const [snapshot, setSnapshot] = useState<WorkspaceBootstrap | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const response = await aiApi.conversations(workspaceId, "limit=40&archived=false");
      setConversations(response.data.items);
    } catch {
      // Conversation history is supplemental; the live conversation remains usable.
    }
  }, [workspaceId]);

  const loadWorkspaceState = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const response = await workspaceApi.bootstrap(workspaceId);
      setSnapshot(response.data);
    } catch {
      setSnapshot(null);
    }
  }, [workspaceId]);

  useEffect(() => {
    setActiveConversationId(null);
    setMessages([]);
    setActions([]);
    setError("");
    void loadConversations();
    void loadWorkspaceState();
  }, [loadConversations, loadWorkspaceState]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) timeline.scrollTop = timeline.scrollHeight;
  }, [messages, processing]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const selectConversation = async (conversationId: string) => {
    if (!workspaceId || processing) return;
    setError("");
    setCoreState("working");
    try {
      const [messagesResult, actionsResult] = await Promise.all([
        aiApi.messages(workspaceId, conversationId),
        aiApi.actions(workspaceId, conversationId),
      ]);
      setActiveConversationId(conversationId);
      setMessages(historyToMessages(messagesResult.data.items));
      setActions(actionsResult.data);
      setHistoryOpen(false);
      setCoreState(actionsResult.data.some((action) => action.requiresApproval || action.status === "pending_approval") ? "needs-confirmation" : "idle");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The selected conversation could not be loaded."));
      setCoreState("attention");
    }
  };

  const newConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setActions([]);
    setInput("");
    setReferenceUrl("");
    setPendingFiles([]);
    setError("");
    setCoreState("idle");
  };

  const beginListening = () => {
    if (processing) return;
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const voiceWindow = window as Window & { SpeechRecognition?: SpeechRecognizerConstructor; webkitSpeechRecognition?: SpeechRecognizerConstructor };
    const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError("Voice dictation is not available in this browser. You can still type or attach context.");
      setCoreState("attention");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0]?.transcript ?? "").join(" ").trim();
      if (transcript) setInput((current) => `${current}${current ? " " : ""}${transcript}`);
    };
    recognition.onerror = () => setError("Voice dictation ended before Lulu received a transcript.");
    recognition.onend = () => {
      recognitionRef.current = null;
      setCoreState((current) => current === "listening" ? "idle" : current);
    };
    recognitionRef.current = recognition;
    setCoreState("listening");
    recognition.start();
  };

  const uploadFiles = async (): Promise<Attachment[]> => {
    const imported: Attachment[] = [];
    for (const file of pendingFiles) {
      const form = new FormData();
      form.append("name", file.name);
      form.append("text", "");
      form.append("files", file, file.name);
      const response = await ingestRecord("ai_knowledge", form);
      const record: WorkspaceRecord = response.data;
      imported.push({ id: record.id, name: record.name, resourceType: record.resourceType, uploadedAt: record.createdAt });
    }
    return imported;
  };

  const send = async () => {
    const trimmed = input.trim();
    const cleanReferenceUrl = referenceUrl.trim();
    if ((!trimmed && pendingFiles.length === 0 && !cleanReferenceUrl) || !workspaceId || processing) return;

    setError("");
    setProcessing(true);
    setCoreState(pendingFiles.length ? "working" : "thinking");
    const localId = `local-${Date.now()}`;
    const visibleContent = trimmed || (pendingFiles.length ? "Review the files I added to the Company Brain." : `Review this reference: ${cleanReferenceUrl}`);

    try {
      const attachments = pendingFiles.length ? await uploadFiles() : [];
      const promptSections = [visibleContent];
      if (mode !== "Chat") promptSections.unshift(`Operating mode: ${mode}.`);
      if (attachments.length) promptSections.push(`Imported workspace knowledge for this request: ${attachments.map((attachment) => attachment.name).join(", ")}.`);
      if (cleanReferenceUrl) promptSections.push(`Reference link supplied by the user: ${cleanReferenceUrl}`);
      const content = promptSections.join("\n\n");
      const localMessage: WorkspaceMessage = {
        id: localId,
        role: "user",
        content: visibleContent,
        createdAt: new Date().toISOString(),
        attachments,
      };
      setMessages((current) => [...current, localMessage]);
      setInput("");
      setReferenceUrl("");
      setShowReferenceUrl(false);
      setPendingFiles([]);
      setCoreState("thinking");

      let conversationId = activeConversationId;
      if (!conversationId) {
        const conversation = await aiApi.createConversation(workspaceId, { title: visibleContent.slice(0, 80), metadata: { origin: "lulu_core" } });
        conversationId = conversation.data.id;
        setActiveConversationId(conversationId);
      }

      const response = await aiApi.respond(workspaceId, conversationId, content, {
        origin: "lulu_core",
        mode,
        attachments,
        referenceUrl: cleanReferenceUrl || undefined,
      });
      const nextActions = response.data.pendingActions ?? [];
      setMessages((current) => [...current, {
        id: response.data.assistantMessage.id,
        role: "assistant",
        content: response.data.assistantMessage.content,
        createdAt: response.data.assistantMessage.createdAt,
        toolCalls: response.data.toolCalls,
        pendingActions: nextActions,
      }]);
      setActions((current) => {
        const known = new Map(current.map((action) => [action.id, action]));
        nextActions.forEach((action) => known.set(action.id, action));
        return [...known.values()];
      });
      setCoreState(nextActions.some((action) => action.requiresApproval || action.status === "pending_approval") ? "needs-confirmation" : "completed");
      void loadConversations();
      void loadWorkspaceState();
    } catch (cause) {
      setMessages((current) => current.filter((message) => message.id !== localId));
      setError(getFriendlyErrorMessage(cause, "Lulu could not complete this request. No unverified action was assumed."));
      setCoreState("attention");
    } finally {
      setProcessing(false);
    }
  };

  const executeAction = async (action: AssistantPendingAction) => {
    if (!workspaceId || !activeConversationId || action.requiresApproval || action.status !== "ready") return;
    setExecutingActionId(action.id);
    setError("");
    setCoreState("working");
    try {
      const response = await aiApi.executeAction(workspaceId, activeConversationId, action.id);
      setActions((current) => current.map((item) => item.id === action.id ? response.data : item));
      setCoreState(response.data.status === "succeeded" ? "completed" : response.data.status === "pending_approval" ? "needs-confirmation" : "attention");
      void loadWorkspaceState();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "The action could not be executed. Its current workspace state was preserved."));
      setCoreState("attention");
    } finally {
      setExecutingActionId(null);
    }
  };

  const latestSurfaces = useMemo(() => messages.slice().reverse().find((message) => message.role === "assistant" && ((message.toolCalls?.length ?? 0) > 0 || (message.pendingActions?.length ?? 0) > 0)), [messages]);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
  const stateCopy: Record<CoreState, { title: string; detail: string }> = {
    idle: { title: "Ready for intent", detail: "Company memory, workspace records and governed actions are available." },
    listening: { title: "Listening", detail: "Lulu is turning your voice into a draft before anything is sent." },
    thinking: { title: "Reasoning with context", detail: "Lulu is retrieving scoped context and selecting the right tools." },
    working: { title: "Working through verified systems", detail: "Lulu is importing context or completing an allowed workspace operation." },
    completed: { title: "Outcome recorded", detail: "The response, evidence and any action packages are now part of the conversation." },
    "needs-confirmation": { title: "Confirmation required", detail: "A governed action is waiting for its workspace approval." },
    attention: { title: "Needs attention", detail: "Lulu stopped at a safe boundary. Review the message below before continuing." },
  };

  return (
    <main className={`lulu-ai-native lulu-ai-native--${coreState}`}>
      <header className="lulu-ai-native__header">
        <button type="button" className="lulu-ai-native__history-toggle" aria-expanded={historyOpen} onClick={() => setHistoryOpen((current) => !current)}>
          <History aria-hidden="true" size={17} />
          <span>History</span>
          {conversations.length > 0 && <small>{conversations.length}</small>}
        </button>
        <div className="lulu-ai-native__identity" data-lulu-no-translate="true" translate="no"><BrainCircuit aria-hidden="true" size={18} /><strong>Lulu Core</strong></div>
        <div className="lulu-ai-native__header-actions">
          <button type="button" className="lulu-ai-native__header-button" onClick={() => void loadWorkspaceState()} aria-label="Refresh verified workspace state"><RefreshCw aria-hidden="true" size={16} /></button>
          <button type="button" className="lulu-ai-native__new-conversation" onClick={newConversation}><Sparkles aria-hidden="true" size={15} /> New intent</button>
        </div>
      </header>

      <aside className={`lulu-ai-native__history ${historyOpen ? "is-open" : ""}`} aria-label="Conversation history">
        <div className="lulu-ai-native__history-heading"><div><p>Company conversations</p><strong>{selectedWorkspace?.companyName ?? "Lulu workspace"}</strong></div><button type="button" aria-label="Close conversation history" onClick={() => setHistoryOpen(false)}><X aria-hidden="true" size={16} /></button></div>
        <button type="button" className="lulu-ai-native__start-history" onClick={newConversation}><Sparkles aria-hidden="true" size={15} /> Start a new intent</button>
        <div className="lulu-ai-native__conversation-list">
          {conversations.length === 0 ? <p>No saved conversations yet.</p> : conversations.map((conversation) => <button key={conversation.id} type="button" className={conversation.id === activeConversationId ? "is-active" : ""} onClick={() => void selectConversation(conversation.id)}><strong>{conversation.title || "Untitled conversation"}</strong><small>{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString() : "No messages yet"}</small></button>)}
        </div>
      </aside>
      {historyOpen && <button className="lulu-ai-native__history-backdrop" type="button" aria-label="Close conversation history" onClick={() => setHistoryOpen(false)} />}

      <div className="lulu-ai-native__scroll" ref={timelineRef}>
        <div className="lulu-ai-native__canvas">
          <section className="lulu-ai-native__core-stage" aria-live="polite">
            <div className="lulu-ai-native__core" aria-hidden="true"><span className="lulu-ai-native__core-ring lulu-ai-native__core-ring--outer" /><span className="lulu-ai-native__core-ring lulu-ai-native__core-ring--middle" /><span className="lulu-ai-native__core-center">{coreState === "completed" ? <Check size={28} /> : coreState === "attention" ? <CircleAlert size={28} /> : coreState === "needs-confirmation" ? <ShieldCheck size={28} /> : coreState === "listening" ? <Mic size={27} /> : processing ? <LoaderCircle size={28} className="animate-spin" /> : <Sparkles size={28} />}</span></div>
            <p className="lulu-ai-native__eyebrow"><Activity aria-hidden="true" size={14} /> {selectedWorkspace?.companyName ?? "Company operating system"}</p>
            <h1>{stateCopy[coreState].title}</h1>
            <p className="lulu-ai-native__core-detail">{stateCopy[coreState].detail}</p>
            <div className="lulu-ai-native__signal-row" aria-label="Verified workspace signals">
              <span><Database aria-hidden="true" size={14} /><strong>{snapshot ? snapshot.records.total : "-"}</strong> records</span>
              <span><Activity aria-hidden="true" size={14} /><strong>{snapshot ? snapshot.metrics.length : "-"}</strong> metrics</span>
              <span><ShieldCheck aria-hidden="true" size={14} /><strong>{snapshot ? snapshot.approvals.pending : "-"}</strong> approvals</span>
              <span><Bot aria-hidden="true" size={14} /><strong>{permissions.capabilities.length}</strong> permissions</span>
            </div>
          </section>

          {messages.length === 0 ? (
            <section className="lulu-ai-native__intent-starters" aria-label="Suggested intents">
              <p>Start from an outcome, a question, a file or a live business signal.</p>
              <div>{starterIntents.map((intent) => <button key={intent} type="button" onClick={() => setInput(intent)}>{intent}<ArrowUpRight aria-hidden="true" size={15} /></button>)}</div>
            </section>
          ) : (
            <section className="lulu-ai-native__timeline" aria-label={activeConversation?.title ?? "Active conversation"}>
              {messages.map((message) => <article key={message.id} className={`lulu-ai-native__message lulu-ai-native__message--${message.role}`}>
                <div className="lulu-ai-native__message-meta"><span>{message.role === "assistant" ? <Bot aria-hidden="true" size={15} /> : <Sparkles aria-hidden="true" size={15} />}</span><strong>{message.role === "assistant" ? "Lulu" : "You"}</strong><time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>
                <div className="lulu-ai-native__message-content">{responseContent(message.content)}</div>
                {message.attachments && message.attachments.length > 0 && <div className="lulu-ai-native__attachments">{message.attachments.map((attachment) => <span key={attachment.id}><FileText aria-hidden="true" size={13} /> {attachment.name}<small>Imported to Company Brain</small></span>)}</div>}
              </article>)}
              {processing && <div className="lulu-ai-native__processing"><LoaderCircle aria-hidden="true" size={16} className="animate-spin" /> Lulu is preparing a verified response.</div>}
            </section>
          )}

          {(latestSurfaces || actions.length > 0) && <section className="lulu-ai-native__workbench" aria-label="Live work surfaces">
            <div className="lulu-ai-native__section-title"><div><p>Dynamic workspace</p><h2>Evidence, outputs and action state</h2></div><PanelTopOpen aria-hidden="true" size={19} /></div>
            <div className="lulu-ai-native__workbench-grid">
              {latestSurfaces?.toolCalls?.map((call, index) => <ToolSurface key={`${call.name}-${index}`} call={call} />)}
              {actions.map((action) => <ActionSurface key={action.id} action={action} executing={executingActionId === action.id} onExecute={executeAction} />)}
            </div>
          </section>}

          <section className="lulu-ai-native__surface-index" aria-label="Operational workspaces">
            <div className="lulu-ai-native__section-title"><div><p>Operational surfaces</p><h2>Open the system behind the intent</h2></div><small>Existing workspace routes</small></div>
            <div className="lulu-ai-native__surface-links">{workspaceSurfaces.map((surface) => <button key={surface.label} type="button" onClick={() => navigate(surface.route)}><span><strong>{surface.label}</strong><small>{surface.detail}</small></span><ArrowUpRight aria-hidden="true" size={16} /></button>)}</div>
          </section>
        </div>
      </div>

      {error && <div className="lulu-ai-native__error" role="alert"><CircleAlert aria-hidden="true" size={17} /><span>{error}</span><button type="button" aria-label="Dismiss error" onClick={() => { setError(""); setCoreState("idle"); }}><X aria-hidden="true" size={16} /></button></div>}

      <footer className="lulu-ai-native__composer-shell">
        <form className="lulu-ai-native__composer" onSubmit={(event) => { event.preventDefault(); void send(); }}>
          <div className="lulu-ai-native__composer-modes" aria-label="Intent mode">{modes.map((item) => <button key={item} type="button" className={mode === item ? "is-active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div>
          {showReferenceUrl && <label className="lulu-ai-native__reference-input"><Link aria-hidden="true" size={15} /><input autoFocus type="url" value={referenceUrl} onChange={(event) => setReferenceUrl(event.target.value)} placeholder="https:// reference for this conversation" /><button type="button" aria-label="Remove reference link" onClick={() => { setReferenceUrl(""); setShowReferenceUrl(false); }}><X aria-hidden="true" size={15} /></button></label>}
          {pendingFiles.length > 0 && <div className="lulu-ai-native__pending-files">{pendingFiles.map((file) => <span key={`${file.name}-${file.lastModified}`}><FileText aria-hidden="true" size={13} /> {file.name}<button type="button" aria-label={`Remove ${file.name}`} onClick={() => setPendingFiles((current) => current.filter((item) => item !== file))}><X aria-hidden="true" size={13} /></button></span>)}</div>}
          <div className="lulu-ai-native__composer-main">
            <input ref={fileInputRef} className="sr-only" type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg,.webp" onChange={(event) => { const files = Array.from(event.target.files ?? []); setPendingFiles((current) => [...current, ...files]); event.target.value = ""; }} />
            <div className="lulu-ai-native__composer-tools">
              <button type="button" aria-label="Attach files to Company Brain" title="Attach files to Company Brain" onClick={() => fileInputRef.current?.click()} disabled={processing}><Paperclip aria-hidden="true" size={18} /></button>
              <button type="button" aria-label="Attach image or screenshot" title="Attach image or screenshot" onClick={() => fileInputRef.current?.click()} disabled={processing}><Image aria-hidden="true" size={18} /></button>
              <button type="button" className={showReferenceUrl ? "is-active" : ""} aria-label="Attach reference link" title="Attach reference link" onClick={() => setShowReferenceUrl((current) => !current)} disabled={processing}><Link aria-hidden="true" size={18} /></button>
            </div>
            <textarea value={input} rows={1} disabled={processing} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} placeholder="Describe the outcome you want Lulu to create, investigate or operate." />
            <div className="lulu-ai-native__composer-tools lulu-ai-native__composer-tools--end">
              <button type="button" className={coreState === "listening" ? "is-listening" : ""} aria-label={coreState === "listening" ? "Stop voice dictation" : "Start voice dictation"} title={coreState === "listening" ? "Stop voice dictation" : "Start voice dictation"} onClick={beginListening} disabled={processing}>{coreState === "listening" ? <Square aria-hidden="true" size={15} /> : <Mic aria-hidden="true" size={18} />}</button>
              <button type="submit" className="lulu-ai-native__send" disabled={processing || (!input.trim() && pendingFiles.length === 0 && !referenceUrl.trim())} aria-label="Send intent">{processing ? <LoaderCircle aria-hidden="true" size={17} className="animate-spin" /> : <Send aria-hidden="true" size={17} />}</button>
            </div>
          </div>
          <div className="lulu-ai-native__composer-status"><span><ShieldCheck aria-hidden="true" size={13} /> Workspace-scoped context and governed actions</span><span><Clock3 aria-hidden="true" size={13} /> Enter to send, Shift+Enter for a new line</span></div>
        </form>
      </footer>
    </main>
  );
}
