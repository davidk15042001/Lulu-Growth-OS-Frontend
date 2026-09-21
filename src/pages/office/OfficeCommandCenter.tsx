import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bot,
  ChevronDown,
  CircleAlert,
  Clock3,
  Database,
  FileText,
  History,
  Image,
  LayoutDashboard,
  Link,
  LoaderCircle,
  Mic,
  Paperclip,
  PanelTopOpen,
  PhoneOff,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Square,
  UserRound,
  Volume2,
  X,
} from "lucide-react";
import {
  aiApi,
  type AiMessage,
  type AssistantPendingAction,
  type AssistantToolCall,
  type Conversation,
} from "../../api/ai";
import { getFriendlyErrorMessage } from "../../api/client";
import { ingestRecord, type WorkspaceRecord } from "../../api/records";
import { useLuluApp } from "../../api/LuluAppContext";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { navigateApp, pagePath, routes } from "../../routing";
import "./office-command-center.css";

type CoreState = "idle" | "listening" | "thinking" | "working" | "completed" | "needs-confirmation" | "attention";
type VoiceMode = "off" | "listening" | "thinking" | "speaking";
type Attachment = { id: string; name: string; resourceType: string; uploadedAt: string };
type CommandMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  toolCalls?: AssistantToolCall[];
  pendingActions?: AssistantPendingAction[];
  attachments?: Attachment[];
};
type SpeechResultEvent = Event & { results: ArrayLike<ArrayLike<{ transcript: string; isFinal?: boolean }>> };
type SpeechRecognitionErrorEvent = Event & { error?: string };
type SpeechRecognizer = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognizerConstructor = new () => SpeechRecognizer;

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

function historyToMessages(items: AiMessage[]): CommandMessage[] {
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

function shortValue(value: unknown) {
  if (value == null) return "-";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return `${value.length} items`;
  return "Available";
}

function responseContent(content: string): ReactNode[] {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let lineIndex = 0;
  let key = 0;

  while (lineIndex < lines.length) {
    const line = lines[lineIndex] ?? "";
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
    while (lineIndex < lines.length && (lines[lineIndex] ?? "").trim() !== "" && !/^(#{1,3})\s+/.test(lines[lineIndex] ?? "") && !/^\s*[-*]\s+/.test(lines[lineIndex] ?? "")) {
      paragraph.push(lines[lineIndex] ?? "");
      lineIndex += 1;
    }
    blocks.push(<p key={key++}>{paragraph.join(" ").replace(/\*\*/g, "")}</p>);
  }
  return blocks;
}

function ToolSurface({ call }: { call: AssistantToolCall }) {
  const t = useTranslation();
  const result = asRecord(call.result);
  const items = Array.isArray(result?.items) ? result.items.map(asRecord).filter((item): item is Record<string, unknown> => Boolean(item)) : [];
  const visibleItems = items.slice(0, 5);
  const columns = visibleItems.length
    ? Object.keys(visibleItems[0] ?? {}).filter((key) => ["name", "status", "stage", "valueAmount", "updatedAt", "createdAt", "id"].includes(key)).slice(0, 4)
    : [];
  const summaryEntries = result ? Object.entries(result).filter(([key]) => key !== "items").slice(0, 4) : [];

  return <section className="lulu-office-command__tool-surface" aria-label={t(titleForTool(call.name))}>
    <div className="lulu-office-command__surface-heading"><span><Database aria-hidden="true" size={14} />{t(titleForTool(call.name))}</span><small>{t("Verified tool output")}</small></div>
    {visibleItems.length > 0 && columns.length > 0 ? <div className="lulu-office-command__table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{visibleItems.map((item, index) => <tr key={String(item.id ?? index)}>{columns.map((column) => <td key={column}>{shortValue(item[column])}</td>)}</tr>)}</tbody></table></div>
      : summaryEntries.length > 0 ? <dl className="lulu-office-command__tool-summary">{summaryEntries.map(([key, value]) => <div key={key}><dt>{key.replaceAll("_", " ")}</dt><dd>{shortValue(value)}</dd></div>)}</dl>
        : <p className="lulu-office-command__empty-surface">{t("The tool returned no displayable records.")}</p>}
  </section>;
}

function ActionSurface({ action, executing, onExecute }: { action: AssistantPendingAction; executing: boolean; onExecute: (action: AssistantPendingAction) => void }) {
  const t = useTranslation();
  const canRun = action.status === "ready";
  const payloadAmount = action.payload.amount ?? action.payload.total ?? action.payload.value;
  const payloadRecipient = action.payload.recipientEmail ?? action.payload.recipientSearch ?? action.payload.recipient;
  const actionDetail = payloadAmount != null || payloadRecipient != null
    ? [payloadAmount != null ? `${String(payloadAmount)} ${String(action.payload.currency ?? "")}`.trim() : null, payloadRecipient != null ? String(payloadRecipient) : null].filter(Boolean).join(" · ")
    : null;
  return <section className={`lulu-office-command__action-surface is-${action.status}`} aria-label={action.summary}>
    <div className="lulu-office-command__surface-heading"><span><ShieldCheck aria-hidden="true" size={14} />{t("Action package")}</span><small>{t(action.status.replaceAll("_", " "))}</small></div>
    <h3>{action.summary}</h3>
    <div className="lulu-office-command__action-meta"><span>{t(action.type.replaceAll("_", " "))}</span>{actionDetail && <span>{actionDetail}</span>}{action.requiresApproval && <span>{t("Confirmation required")}</span>}{action.errorMessage && <span>{action.errorMessage}</span>}</div>
    {canRun && <button type="button" className="lulu-office-command__execute-action" disabled={executing} onClick={() => onExecute(action)}>{executing ? <LoaderCircle aria-hidden="true" size={15} className="lulu-office-spin" /> : <ArrowUpRight aria-hidden="true" size={15} />}{t(action.requiresApproval ? "Confirm and execute" : "Run checked action")}</button>}
  </section>;
}

function OfficeSettingsMenu({ workspaceName }: { workspaceName: string }) {
  const t = useTranslation();
  const navigateTo = (target: string) => navigateApp(target);

  return <details className="lulu-office-command__settings-menu">
    <summary aria-label={t("Settings")} title={t("Settings")}>
      <Settings2 aria-hidden="true" size={16} />
      <span>{t("Settings")}</span>
      <ChevronDown aria-hidden="true" size={14} />
    </summary>
    <div className="lulu-office-command__settings-popover">
      <div className="lulu-office-command__settings-heading">
        <span>{t("Workspace")}</span>
        <strong title={workspaceName}>{workspaceName}</strong>
      </div>
      <div className="lulu-office-command__settings-links">
        <button type="button" onClick={() => navigateTo(pagePath("profile"))}><UserRound aria-hidden="true" size={15} />{t("Workspace settings")}</button>
        <button type="button" onClick={() => navigateTo(routes.app.funds)}><ShieldCheck aria-hidden="true" size={15} />{t("Billing")}</button>
      </div>
      <div className="lulu-office-command__settings-divider" />
      <button type="button" className="lulu-office-command__settings-workspace" onClick={() => navigateTo(routes.app.dashboard)}><LayoutDashboard aria-hidden="true" size={15} />{t("Open workspace")}</button>
    </div>
  </details>;
}

export function OfficeCommandCenter() {
  const { selectedWorkspace } = useLuluApp();
  const t = useTranslation();
  const workspaceId = selectedWorkspace?.id ?? null;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerInputRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<SpeechRecognizer | null>(null);
  const voiceRecognitionRef = useRef<SpeechRecognizer | null>(null);
  const activeConversationIdRef = useRef<string | null>(null);
  const voiceBaseInputRef = useRef("");
  const voiceTranscriptRef = useRef("");
  const dictationStoppedByUserRef = useRef(false);
  const voiceSessionRef = useRef(false);
  const voiceProcessingRef = useRef(false);
  const voiceSpeakingRef = useRef(false);
  const voiceStopRequestedRef = useRef(false);
  const voiceRestartTimerRef = useRef<number | null>(null);
  const voiceFinalizedRef = useRef(false);
  const [coreState, setCoreState] = useState<CoreState>("idle");
  const [input, setInput] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("off");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [showReferenceUrl, setShowReferenceUrl] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CommandMessage[]>([]);
  const [actions, setActions] = useState<AssistantPendingAction[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const response = await aiApi.conversations(workspaceId, "limit=30&archived=false");
      setConversations(response.data.items);
    } catch {
      // The new intent flow remains usable when history cannot be loaded.
    }
  }, [workspaceId]);

  useEffect(() => {
    activeConversationIdRef.current = null;
    setActiveConversationId(null);
    setMessages([]);
    setActions([]);
    setError("");
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => () => {
    dictationStoppedByUserRef.current = true;
    recognitionRef.current?.stop();
    voiceSessionRef.current = false;
    voiceRecognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    if (voiceRestartTimerRef.current !== null) window.clearTimeout(voiceRestartTimerRef.current);
  }, []);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

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
      activeConversationIdRef.current = conversationId;
      setMessages(historyToMessages(messagesResult.data.items));
      setActions(actionsResult.data);
      setHistoryOpen(false);
      setCoreState(actionsResult.data.some((action) => action.requiresApproval || action.status === "pending_approval") ? "needs-confirmation" : "idle");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("The selected conversation could not be loaded.")));
      setCoreState("attention");
    }
  };

  const startNewIntent = () => {
    if (processing) return;
    if (recognitionRef.current) {
      dictationStoppedByUserRef.current = true;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    voiceSessionRef.current = false;
    voiceStopRequestedRef.current = true;
    voiceRecognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    if (voiceRestartTimerRef.current !== null) window.clearTimeout(voiceRestartTimerRef.current);
    setVoiceMode("off");
    setHistoryOpen(false);
    setActiveConversationId(null);
    activeConversationIdRef.current = null;
    setMessages([]);
    setActions([]);
    setInput("");
    setReferenceUrl("");
    setShowReferenceUrl(false);
    setPendingFiles([]);
    setError("");
    voiceTranscriptRef.current = "";
    setVoiceTranscript("");
    setCoreState("idle");
    requestAnimationFrame(() => composerInputRef.current?.focus());
  };

  const beginListening = () => {
    if (processing) return;
    if (recognitionRef.current) {
      dictationStoppedByUserRef.current = true;
      recognitionRef.current.stop();
      return;
    }
    const voiceWindow = window as Window & { SpeechRecognition?: SpeechRecognizerConstructor; webkitSpeechRecognition?: SpeechRecognizerConstructor };
    const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError(t("Voice dictation is not available in this browser. You can still type or attach context."));
      setCoreState("attention");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    dictationStoppedByUserRef.current = false;
    voiceBaseInputRef.current = input.trim();
    voiceTranscriptRef.current = "";
    setVoiceTranscript("");
    setError("");
    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const finalTranscript = results
        .filter((result) => result[0]?.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      const interimTranscript = results
        .filter((result) => !result[0]?.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      const transcript = [finalTranscript, interimTranscript].filter(Boolean).join(" ").trim();
      voiceTranscriptRef.current = transcript;
      setVoiceTranscript(transcript);
      if (finalTranscript) setInput(`${voiceBaseInputRef.current}${voiceBaseInputRef.current ? " " : ""}${finalTranscript}`.trim());
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (dictationStoppedByUserRef.current || event.error === "aborted") return;
      const message = event.error === "not-allowed" || event.error === "service-not-allowed"
        ? "Microphone access is blocked. Allow microphone access for this site and try again."
        : event.error === "audio-capture"
          ? "No microphone was detected. Connect one and try again."
          : event.error === "no-speech"
            ? "No speech was detected. Try again or type your request."
            : event.error === "network"
              ? "Voice dictation could not reach the speech service. Check your connection and try again."
              : "Voice dictation could not start. Try again or type your request.";
      setError(t(message));
      setCoreState(event.error === "no-speech" ? "idle" : "attention");
    };
    recognition.onend = () => {
      const transcript = voiceTranscriptRef.current.trim();
      if (transcript) {
        setInput((current) => {
          const base = voiceBaseInputRef.current.trim();
          const next = [base, transcript].filter(Boolean).join(" ");
          return current.trim() === next ? current : next;
        });
      }
      recognitionRef.current = null;
      dictationStoppedByUserRef.current = false;
      voiceTranscriptRef.current = "";
      setVoiceTranscript("");
      setCoreState((current) => current === "listening" ? "idle" : current);
    };
    recognitionRef.current = recognition;
    setCoreState("listening");
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      voiceTranscriptRef.current = "";
      setVoiceTranscript("");
      setError(t("Voice dictation could not start. Try again or type your request."));
      setCoreState("attention");
    }
  };

  const stopVoiceConversation = () => {
    voiceSessionRef.current = false;
    voiceStopRequestedRef.current = true;
    voiceProcessingRef.current = false;
    voiceSpeakingRef.current = false;
    voiceRecognitionRef.current?.stop();
    voiceRecognitionRef.current = null;
    window.speechSynthesis?.cancel();
    if (voiceRestartTimerRef.current !== null) window.clearTimeout(voiceRestartTimerRef.current);
    voiceRestartTimerRef.current = null;
    voiceTranscriptRef.current = "";
    setVoiceTranscript("");
    setVoiceMode("off");
    setCoreState((current) => ["listening", "thinking"].includes(current) ? "idle" : current);
  };

  const startVoiceRecognition = () => {
    if (!voiceSessionRef.current || voiceRecognitionRef.current || voiceProcessingRef.current || voiceSpeakingRef.current) return;
    const voiceWindow = window as Window & { SpeechRecognition?: SpeechRecognizerConstructor; webkitSpeechRecognition?: SpeechRecognizerConstructor };
    const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognition) {
      setError(t("Voice conversation is not available in this browser. Try Chrome or Edge."));
      stopVoiceConversation();
      setCoreState("attention");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";
    voiceFinalizedRef.current = false;
    voiceTranscriptRef.current = "";
    setVoiceTranscript("");
    setVoiceMode("listening");
    setCoreState("listening");
    recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const finalTranscript = results
        .filter((result) => result[0]?.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      const interimTranscript = results
        .filter((result) => !result[0]?.isFinal)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      const transcript = finalTranscript || interimTranscript;
      voiceTranscriptRef.current = transcript;
      setVoiceTranscript(transcript);
      if (finalTranscript && !voiceFinalizedRef.current) {
        voiceFinalizedRef.current = true;
        void handleVoiceTurn(finalTranscript);
        recognition.stop();
      }
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "aborted" || !voiceSessionRef.current) return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError(t("Microphone access is blocked. Allow microphone access for this site and try again."));
        stopVoiceConversation();
        setCoreState("attention");
      } else if (event.error !== "no-speech") {
        setError(t("Voice dictation could not continue. Check your connection and try again."));
        stopVoiceConversation();
        setCoreState("attention");
      }
    };
    recognition.onend = () => {
      if (voiceRecognitionRef.current === recognition) voiceRecognitionRef.current = null;
      if (voiceSessionRef.current && !voiceProcessingRef.current && !voiceSpeakingRef.current && !voiceStopRequestedRef.current) {
        voiceRestartTimerRef.current = window.setTimeout(() => {
          voiceRestartTimerRef.current = null;
          startVoiceRecognition();
        }, 180);
      }
    };
    voiceRecognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      voiceRecognitionRef.current = null;
      setError(t("Voice dictation could not start. Try again or type your request."));
      stopVoiceConversation();
      setCoreState("attention");
    }
  };

  const startVoiceConversation = () => {
    if (processing || voiceSessionRef.current) return;
    const voiceWindow = window as Window & { SpeechRecognition?: SpeechRecognizerConstructor; webkitSpeechRecognition?: SpeechRecognizerConstructor };
    if (!(voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition) || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setError(t("Voice conversation is not available in this browser. Try Chrome or Edge."));
      setCoreState("attention");
      return;
    }
    voiceSessionRef.current = true;
    voiceStopRequestedRef.current = false;
    voiceProcessingRef.current = false;
    voiceSpeakingRef.current = false;
    setError("");
    setVoiceMode("listening");
    startVoiceRecognition();
  };

  const interruptVoiceResponse = () => {
    if (!voiceSessionRef.current) return;
    voiceSpeakingRef.current = false;
    window.speechSynthesis?.cancel();
    setVoiceMode("listening");
    setCoreState("listening");
    startVoiceRecognition();
  };

  const speakVoiceResponse = (content: string) => {
    if (!voiceSessionRef.current || !content.trim()) return;
    const synthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(content.trim());
    utterance.lang = navigator.language || "en-US";
    utterance.onstart = () => {
      if (!voiceSessionRef.current) {
        synthesis.cancel();
        return;
      }
      voiceSpeakingRef.current = true;
      setVoiceMode("speaking");
      setCoreState("completed");
    };
    utterance.onend = () => {
      voiceSpeakingRef.current = false;
      if (voiceSessionRef.current) {
        setVoiceMode("listening");
        setCoreState("listening");
        startVoiceRecognition();
      }
    };
    utterance.onerror = () => {
      voiceSpeakingRef.current = false;
      if (voiceSessionRef.current) startVoiceRecognition();
    };
    synthesis.cancel();
    synthesis.speak(utterance);
  };

  const toggleVoiceConversation = () => {
    if (voiceSessionRef.current) stopVoiceConversation();
    else startVoiceConversation();
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

  const sendContent = async (contentOverride?: string, options?: { voice?: boolean }): Promise<string | null> => {
    const voiceRequest = options?.voice === true;
    const trimmed = (contentOverride ?? input).trim();
    const cleanReferenceUrl = voiceRequest ? "" : referenceUrl.trim();
    const filesForRequest = voiceRequest ? [] : pendingFiles;
    if ((!trimmed && filesForRequest.length === 0 && !cleanReferenceUrl) || !workspaceId || processing) return null;

    setError("");
    setProcessing(true);
    setCoreState(filesForRequest.length ? "working" : "thinking");
    const localId = `office-intent-${Date.now()}`;
    const visibleContent = trimmed || (filesForRequest.length ? t("Review the files I added to the Company Brain.") : `${t("Review this reference:")} ${cleanReferenceUrl}`);

    try {
      const attachments = filesForRequest.length ? await uploadFiles() : [];
      const promptSections = [visibleContent];
      if (attachments.length) promptSections.push(`${t("Imported workspace knowledge for this request")}: ${attachments.map((attachment) => attachment.name).join(", ")}.`);
      if (cleanReferenceUrl) promptSections.push(`${t("Reference link supplied by the user")}: ${cleanReferenceUrl}`);
      const content = promptSections.join("\n\n");
      setMessages((current) => [...current, { id: localId, role: "user", content: visibleContent, createdAt: new Date().toISOString(), attachments }]);
      setInput("");
      setReferenceUrl("");
      setShowReferenceUrl(false);
      setPendingFiles([]);

      let conversationId = activeConversationIdRef.current ?? activeConversationId;
      if (!conversationId) {
        const conversation = await aiApi.createConversation(workspaceId, { title: visibleContent.slice(0, 80), metadata: { origin: "office_command_center", voice: voiceRequest } });
        conversationId = conversation.data.id;
        activeConversationIdRef.current = conversationId;
        setActiveConversationId(conversationId);
      }

      const response = await aiApi.respond(workspaceId, conversationId, content, {
        origin: "office_command_center",
        voice: voiceRequest,
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
      return response.data.assistantMessage.content;
    } catch (cause) {
      setMessages((current) => current.filter((message) => message.id !== localId));
      setError(getFriendlyErrorMessage(cause, t("Lulu could not complete this request. No unverified action was assumed.")));
      setCoreState("attention");
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const handleVoiceTurn = async (transcript: string) => {
    if (!voiceSessionRef.current || voiceProcessingRef.current || !transcript.trim()) return;
    voiceProcessingRef.current = true;
    setVoiceMode("thinking");
    setCoreState("thinking");
    const response = await sendContent(transcript.trim(), { voice: true });
    voiceProcessingRef.current = false;
    if (response && voiceSessionRef.current) speakVoiceResponse(response);
    else if (voiceSessionRef.current) startVoiceRecognition();
  };

  const send = () => {
    void sendContent();
  };

  const executeAction = async (action: AssistantPendingAction) => {
    if (!workspaceId || !activeConversationId || action.status !== "ready") return;
    setExecutingActionId(action.id);
    setError("");
    setCoreState("working");
    try {
      const response = await aiApi.executeAction(workspaceId, activeConversationId, action.id);
      setActions((current) => current.map((item) => item.id === action.id ? response.data : item));
      setCoreState(response.data.status === "succeeded" ? "completed" : response.data.status === "pending_approval" ? "needs-confirmation" : "attention");
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, t("The action could not be executed. Its current workspace state was preserved.")));
      setCoreState("attention");
    } finally {
      setExecutingActionId(null);
    }
  };

  const latestSurfaces = useMemo(() => messages.slice().reverse().find((message) => message.role === "assistant" && ((message.toolCalls?.length ?? 0) > 0 || (message.pendingActions?.length ?? 0) > 0)), [messages]);
  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;
  const stateCopy: Record<CoreState, { title: string; detail: string }> = {
    idle: { title: "At your command", detail: "Tell Lulu what to investigate, create, decide or run." },
    listening: { title: "Listening", detail: "Lulu is drafting from your voice. Nothing is sent until you do." },
    thinking: { title: "Thinking", detail: "Lulu is checking your company context and selecting verified tools." },
    working: { title: "Working", detail: "Lulu is preparing work across your connected systems." },
    completed: { title: "Ready for your next instruction", detail: "The outcome and its evidence are now available in this conversation." },
    "needs-confirmation": { title: "Confirmation required", detail: "A governed action is waiting for its workspace approval." },
    attention: { title: "Needs attention", detail: "Lulu stopped at a safe boundary. Review the message below before continuing." },
  };

  const hasConversation = messages.length > 0;

  return <section className={`lulu-office-command lulu-office-command--${coreState}${hasConversation ? " has-conversation" : ""}`} aria-label={t("Lulu Core")}>
    <header className="lulu-office-command__header">
      <OfficeSettingsMenu workspaceName={selectedWorkspace?.companyName ?? t("Lulu workspace")} />
      <div className="lulu-office-command__header-actions"><button type="button" className="lulu-office-command__history-toggle" aria-expanded={historyOpen} onClick={() => setHistoryOpen((current) => !current)}><History aria-hidden="true" size={16} /><span>{t("History")}</span>{conversations.length > 0 && <small>{conversations.length}</small>}</button><button type="button" className="lulu-office-command__new-intent" onClick={startNewIntent}><Sparkles aria-hidden="true" size={15} /><span>{t("New intent")}</span></button></div>
    </header>

    <aside className={`lulu-office-command__history ${historyOpen ? "is-open" : ""}`} aria-label={t("Conversation history")}>
      <div className="lulu-office-command__history-heading"><div><p>{t("Company conversations")}</p><strong>{selectedWorkspace?.companyName ?? t("Lulu workspace")}</strong></div><button type="button" aria-label={t("Close conversation history")} onClick={() => setHistoryOpen(false)}><X aria-hidden="true" size={16} /></button></div>
      <button type="button" className="lulu-office-command__start-history" onClick={startNewIntent}><Sparkles aria-hidden="true" size={15} />{t("Start a new intent")}</button>
      <div className="lulu-office-command__conversation-list">{conversations.length === 0 ? <p>{t("No saved conversations yet.")}</p> : conversations.map((conversation) => <button key={conversation.id} type="button" className={conversation.id === activeConversationId ? "is-active" : ""} onClick={() => void selectConversation(conversation.id)}><strong>{conversation.title || t("Untitled conversation")}</strong><small>{conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString() : t("No messages yet")}</small></button>)}</div>
    </aside>
    {historyOpen && <button type="button" className="lulu-office-command__history-backdrop" aria-label={t("Close conversation history")} onClick={() => setHistoryOpen(false)} />}

    <div className="lulu-office-command__body">
      <section className="lulu-office-command__core-stage" aria-live="polite">
        <div className="lulu-office-command__core" aria-hidden="true"><span className="lulu-office-command__core-ring lulu-office-command__core-ring--outer" /><span className="lulu-office-command__core-ring lulu-office-command__core-ring--inner" /><span className="lulu-office-command__core-center"><img src="/branding/lulu-agentic-mark.svg" alt="" draggable={false} /></span></div>
        <div className="lulu-office-command__core-copy"><p>{selectedWorkspace?.companyName ?? t("Company operating system")}</p><h2>{t(stateCopy[coreState].title)}</h2><span>{t(stateCopy[coreState].detail)}</span></div>
      </section>

      {hasConversation && <section className="lulu-office-command__timeline" aria-label={activeConversation?.title ?? t("Active conversation")}>{messages.map((message) => <article key={message.id} className={`lulu-office-command__message lulu-office-command__message--${message.role}`}><div className="lulu-office-command__message-meta"><span>{message.role === "assistant" ? <Bot aria-hidden="true" size={14} /> : <Sparkles aria-hidden="true" size={14} />}</span><strong>{message.role === "assistant" ? "Lulu" : t("You")}</strong><time>{new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div><div className="lulu-office-command__message-content">{responseContent(message.content)}</div>{message.attachments && message.attachments.length > 0 && <div className="lulu-office-command__attachments">{message.attachments.map((attachment) => <span key={attachment.id}><FileText aria-hidden="true" size={13} />{attachment.name}</span>)}</div>}</article>)}{processing && <div className="lulu-office-command__processing"><LoaderCircle aria-hidden="true" size={16} className="lulu-office-spin" />{t("Lulu is preparing a verified response.")}</div>}</section>}

      {(latestSurfaces || actions.length > 0) && <section className="lulu-office-command__workbench" aria-label={t("Live work surfaces")}><div className="lulu-office-command__section-title"><div><p>{t("Dynamic workspace")}</p><h2>{t("Evidence, outputs and action state")}</h2></div><PanelTopOpen aria-hidden="true" size={18} /></div><div className="lulu-office-command__workbench-grid">{latestSurfaces?.toolCalls?.map((call, index) => <ToolSurface key={`${call.name}-${index}`} call={call} />)}{actions.map((action) => <ActionSurface key={action.id} action={action} executing={executingActionId === action.id} onExecute={executeAction} />)}</div></section>}
    </div>

    {error && <div className="lulu-office-command__error" role="alert"><CircleAlert aria-hidden="true" size={16} /><span>{error}</span><button type="button" aria-label={t("Dismiss error")} onClick={() => { setError(""); setCoreState("idle"); }}><X aria-hidden="true" size={15} /></button></div>}

    <footer className="lulu-office-command__composer-shell"><form className="lulu-office-command__composer" onSubmit={(event) => { event.preventDefault(); void send(); }}>
      {showReferenceUrl && <label className="lulu-office-command__reference-input"><Link aria-hidden="true" size={15} /><input autoFocus type="url" value={referenceUrl} onChange={(event) => setReferenceUrl(event.target.value)} placeholder={t("https:// reference for this conversation")} /><button type="button" aria-label={t("Remove reference link")} onClick={() => { setReferenceUrl(""); setShowReferenceUrl(false); }}><X aria-hidden="true" size={15} /></button></label>}
      {pendingFiles.length > 0 && <div className="lulu-office-command__pending-files">{pendingFiles.map((file) => <span key={`${file.name}-${file.lastModified}`}><FileText aria-hidden="true" size={13} />{file.name}<button type="button" aria-label={`${t("Remove")} ${file.name}`} onClick={() => setPendingFiles((current) => current.filter((item) => item !== file))}><X aria-hidden="true" size={13} /></button></span>)}</div>}
      {voiceMode !== "off" && <div className={`lulu-office-command__voice-conversation lulu-office-command__voice-conversation--${voiceMode}`} role="status" aria-live="polite"><div className="lulu-office-command__voice-conversation-main"><span className="lulu-office-command__voice-badge">{voiceMode === "speaking" ? <Volume2 aria-hidden="true" size={15} /> : <Mic aria-hidden="true" size={15} />}</span><div className="lulu-office-command__voice-panel-copy"><strong>{t(voiceMode === "listening" ? "Lulu is listening" : voiceMode === "thinking" ? "Lulu is thinking" : "Lulu is speaking")}</strong><span>{voiceTranscript || t("Voice conversation")}</span></div><div className="lulu-office-command__voice-actions">{voiceMode === "speaking" && <button type="button" className="lulu-office-command__voice-action" aria-label={t("Interrupt")} title={t("Interrupt")} onClick={interruptVoiceResponse}><Mic aria-hidden="true" size={13} />{t("Interrupt")}</button>}<button type="button" className="lulu-office-command__voice-action lulu-office-command__voice-action--end" aria-label={t("End voice conversation")} title={t("End voice conversation")} onClick={stopVoiceConversation}><PhoneOff aria-hidden="true" size={13} />{t("End voice conversation")}</button></div></div><div className="lulu-office-command__voice-wave" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} style={{ animationDelay: `${index * 55}ms` }} />)}</div></div>}
      {coreState === "listening" && voiceMode === "off" && <div className="lulu-office-command__voice-panel" role="status" aria-live="polite"><div className="lulu-office-command__voice-panel-main"><span className="lulu-office-command__voice-badge"><Mic aria-hidden="true" size={15} /></span><div className="lulu-office-command__voice-panel-copy"><strong>{t("Listening")}</strong><span>{voiceTranscript || t("Listening")}</span></div><button type="button" className="lulu-office-command__voice-stop" aria-label={t("Stop voice dictation")} title={t("Stop voice dictation")} onClick={beginListening}><Square aria-hidden="true" size={13} />{t("Stop voice dictation")}</button></div><div className="lulu-office-command__voice-wave" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <span key={index} style={{ animationDelay: `${index * 55}ms` }} />)}</div></div>}
      <div className="lulu-office-command__composer-main"><input ref={fileInputRef} className="sr-only" type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg,.webp" onChange={(event) => { const files = Array.from(event.target.files ?? []); setPendingFiles((current) => [...current, ...files]); event.target.value = ""; }} /><div className="lulu-office-command__composer-tools"><button type="button" aria-label={t("Attach files to Company Brain")} title={t("Attach files to Company Brain")} onClick={() => fileInputRef.current?.click()} disabled={processing || voiceMode !== "off"}><Paperclip aria-hidden="true" size={17} /></button><button type="button" aria-label={t("Attach image or screenshot")} title={t("Attach image or screenshot")} onClick={() => fileInputRef.current?.click()} disabled={processing || voiceMode !== "off"}><Image aria-hidden="true" size={17} /></button><button type="button" className={showReferenceUrl ? "is-active" : ""} aria-label={t("Attach reference link")} title={t("Attach reference link")} onClick={() => setShowReferenceUrl((current) => !current)} disabled={processing || voiceMode !== "off"}><Link aria-hidden="true" size={17} /></button></div><textarea ref={composerInputRef} value={input} rows={1} disabled={processing || voiceMode !== "off"} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} placeholder={t("Describe the outcome you want Lulu to create, investigate or operate.")} /><div className="lulu-office-command__composer-tools lulu-office-command__composer-tools--end"><button type="button" className={coreState === "listening" ? "is-listening" : ""} aria-label={t(coreState === "listening" ? "Stop voice dictation" : "Start voice dictation")} title={t(coreState === "listening" ? "Stop voice dictation" : "Start voice dictation")} onClick={beginListening} disabled={processing || voiceMode !== "off"}>{coreState === "listening" ? <Square aria-hidden="true" size={14} /> : <Mic aria-hidden="true" size={17} />}</button><button type="button" className={voiceMode !== "off" ? "is-voice-active" : ""} aria-label={t(voiceMode !== "off" ? "End voice conversation" : "Start voice conversation")} title={t(voiceMode !== "off" ? "End voice conversation" : "Start voice conversation")} onClick={toggleVoiceConversation} disabled={processing && voiceMode === "off"}>{voiceMode !== "off" ? <PhoneOff aria-hidden="true" size={16} /> : <Volume2 aria-hidden="true" size={17} />}</button><button type="submit" className="lulu-office-command__send" disabled={processing || voiceMode !== "off" || (!input.trim() && pendingFiles.length === 0 && !referenceUrl.trim())} aria-label={t("Send intent")}>{processing ? <LoaderCircle aria-hidden="true" size={17} className="lulu-office-spin" /> : <Send aria-hidden="true" size={17} />}</button></div></div>
      <div className="lulu-office-command__composer-status"><span><ShieldCheck aria-hidden="true" size={13} />{t("Workspace-scoped context and governed actions")}</span><span><Clock3 aria-hidden="true" size={13} />{t("Enter to send, Shift+Enter for a new line")}</span></div>
    </form></footer>
  </section>;
}
