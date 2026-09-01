import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Bot, Check, Plus, Send, Sparkles, User, X } from "lucide-react";
import {
  aiApi,
  type AssistantPendingAction,
  type AssistantToolCall,
  type Conversation,
  type AiMessage,
} from "../../../../api/ai";
import { getFriendlyErrorMessage } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";

type PendingActionState = AssistantPendingAction & {
  status: "pending" | "approved" | "rejected";
  result?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  toolCalls?: AssistantToolCall[];
  pendingActions?: PendingActionState[];
};

function toolLabel(name: string) {
  if (name === "list_records") return "Daten abgefragt";
  if (name === "get_knowledge") return "Knowledge gelesen";
  if (name === "get_agent_health") return "Agenten geprüft";
  if (name === "request_action") return "Aktion vorgeschlagen";
  return name;
}

function actionLabel(type: string) {
  const labels: Record<string, string> = {
    "crm.create_followup_task": "CRM-Follow-up erstellen",
    "sales.create_followup_task": "Sales-Follow-up erstellen",
    "advertising.create_optimization": "Anzeigen-Optimierung erstellen",
    "finance.create_automation": "Finanz-Automation erstellen",
    "google_reviews.reply": "Google-Bewertung beantworten",
    "email.create_draft": "E-Mail-Entwurf erstellen",
    "email.create_ai_draft": "KI-E-Mail-Entwurf erstellen",
    "website.publish_job": "Website veröffentlichen",
  };
  return labels[type] ?? type;
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const buffer: string[] = [];
  const flush = () => {
    if (buffer.length) {
      nodes.push(buffer.join(""));
      buffer.length = 0;
    }
  };

  while (i < text.length) {
    const rest = text.slice(i);

    if (rest.startsWith("**")) {
      const end = text.indexOf("**", i + 2);
      if (end > i + 2) {
        flush();
        nodes.push(<strong key={key++} className="font-semibold">{text.slice(i + 2, end)}</strong>);
        i = end + 2;
        continue;
      }
    }

    if (rest.startsWith("`")) {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        flush();
        nodes.push(<code key={key++} className="rounded bg-[var(--secondary)] px-1.5 py-0.5 font-mono text-[13px]">{text.slice(i + 1, end)}</code>);
        i = end + 1;
        continue;
      }
    }

    const link = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link) {
      flush();
      nodes.push(
        <a key={key++} href={link[2]} target="_blank" rel="noreferrer" className="underline decoration-[var(--primary)]/40 underline-offset-2 hover:text-[var(--primary)]">
          {link[1]}
        </a>
      );
      i += link[0].length;
      continue;
    }

    if (rest.startsWith("*") && !rest.startsWith("**")) {
      const end = text.indexOf("*", i + 1);
      if (end > i + 1) {
        flush();
        nodes.push(<em key={key++}>{text.slice(i + 1, end)}</em>);
        i = end + 1;
        continue;
      }
    }

    buffer.push(text[i]);
    i += 1;
  }
  flush();
  return nodes;
}

function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push(
        <pre key={key++} className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 font-mono text-[13px] leading-5">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const content = heading[2];
      if (level === 1) blocks.push(<h1 key={key++} className="mt-1 text-lg font-semibold">{renderInline(content)}</h1>);
      else if (level === 2) blocks.push(<h2 key={key++} className="mt-1 text-base font-semibold">{renderInline(content)}</h2>);
      else blocks.push(<h3 key={key++} className="mt-1 text-sm font-semibold">{renderInline(content)}</h3>);
      i += 1;
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(<li key={key++}>{renderInline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>);
        i += 1;
      }
      blocks.push(<ul key={key++} className="my-1 list-disc space-y-1 pl-5">{items}</ul>);
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: ReactNode[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(<li key={key++}>{renderInline(lines[i].replace(/^\s*\d+[.)]\s+/, ""))}</li>);
        i += 1;
      }
      blocks.push(<ol key={key++} className="my-1 list-decimal space-y-1 pl-5">{items}</ol>);
      continue;
    }

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length
      && lines[i].trim() !== ""
      && !/^#{1,3}\s/.test(lines[i])
      && !/^\s*[-*]\s+/.test(lines[i])
      && !/^\s*\d+[.)]\s+/.test(lines[i])
      && !lines[i].trim().startsWith("```")
    ) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(<p key={key++} className="whitespace-pre-wrap">{renderInline(paragraph.join(" "))}</p>);
  }

  return blocks;
}

export function LuluAIAssistant() {
  const workspaceId = getSelectedWorkspaceId();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const loadConversations = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const result = await aiApi.conversations(workspaceId);
      setConversations(result.data.items);
    } catch {
      // History is optional; the chat itself still works.
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, processing]);

  const mapHistory = (items: AiMessage[]): ChatMessage[] =>
    items
      .filter((item) => item.role === "user" || item.role === "assistant")
      .map((item) => ({
        id: item.id,
        role: item.role as "user" | "assistant",
        content: item.content,
      }));

  const selectConversation = async (conversationId: string) => {
    if (!workspaceId) return;
    setActiveConversationId(conversationId);
    setLoadingHistory(true);
    setError("");
    try {
      const result = await aiApi.messages(workspaceId, conversationId);
      setMessages(mapHistory(result.data.items));
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Unterhaltung konnte nicht geladen werden."));
    } finally {
      setLoadingHistory(false);
    }
  };

  const newConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setInput("");
    setError("");
  };

  const send = async () => {
    const content = input.trim();
    if (!content || !workspaceId || processing) return;
    setError("");
    setInput("");
    setProcessing(true);
    setMessages((current) => [...current, { id: `local-${Date.now()}`, role: "user", content }]);

    try {
      let conversationId = activeConversationId;
      if (!conversationId) {
        const conversation = await aiApi.createConversation(workspaceId, { title: content.slice(0, 80) });
        conversationId = conversation.data.id;
        setActiveConversationId(conversationId);
      }

      const response = await aiApi.respond(workspaceId, conversationId, content);

      setMessages((current) => [
        ...current,
        {
          id: response.data.assistantMessage.id,
          role: "assistant",
          content: response.data.assistantMessage.content,
          toolCalls: response.data.toolCalls,
          pendingActions: response.data.pendingActions.map((action) => ({ ...action, status: "pending" })),
        },
      ]);
      void loadConversations();
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Lulu AI konnte keine Antwort vorbereiten. Bitte versuche es erneut."));
    } finally {
      setProcessing(false);
    }
  };

  const decideAction = async (messageId: string, actionId: string, decision: "approved" | "rejected") => {
    if (!workspaceId || !activeConversationId) return;
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId && message.pendingActions
          ? {
              ...message,
              pendingActions: message.pendingActions.map((action) =>
                action.id === actionId ? { ...action, status: decision } : action
              ),
            }
          : message
      )
    );

    if (decision === "rejected") return;

    const action = messages.find((message) => message.id === messageId)?.pendingActions?.find((item) => item.id === actionId);
    if (!action) return;

    try {
      const result = await aiApi.executeAction(workspaceId, activeConversationId, action);
      const resultText = result.data.message || `${actionLabel(action.type)} ausgeführt.`;
      setMessages((current) => [
        ...current,
        { id: `result-${Date.now()}`, role: "assistant", content: resultText },
      ]);
      setMessages((current) =>
        current.map((message) =>
          message.id === messageId && message.pendingActions
            ? {
                ...message,
                pendingActions: message.pendingActions.map((item) =>
                  item.id === actionId ? { ...item, status: "approved", result: resultText } : item
                ),
              }
            : message
        )
      );
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause, "Die Aktion konnte nicht ausgeführt werden."));
    }
  };

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? null;

  return (
    <main className="flex h-[calc(100dvh-0px)] min-h-0 flex-col bg-[var(--background)] text-[var(--foreground)]">
      <header className="flex shrink-0 items-center gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-6">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)]">
          <Sparkles size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">{activeConversation?.title ?? "Lulu AI Assistant"}</h1>
          <p className="truncate text-xs text-[var(--muted-foreground)]">Fragt ab · steuert · Agenten antworten im Chat</p>
        </div>
        <button
          type="button"
          onClick={newConversation}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition hover:bg-[var(--secondary)]"
        >
          <Plus size={15} />
          Neuer Chat
        </button>
      </header>

      {conversations.length > 0 && (
        <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-[var(--border)] px-4 py-2 sm:px-6">
          {conversations.slice(0, 12).map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => void selectConversation(conversation.id)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs transition ${
                conversation.id === activeConversationId
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
              }`}
            >
              {conversation.title || "Unterhaltung"}
            </button>
          ))}
        </div>
      )}

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {!loadingHistory && messages.length === 0 && (
            <div className="mx-auto mt-10 max-w-md text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Bot size={24} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Womit kann ich dir helfen?</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                Frag nach Daten, lass dir Handlungen empfehlen oder steuere dein System direkt. Riskante Aktionen bestätigst du hier im Chat.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[88%] gap-2.5 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
                  message.role === "user" ? "bg-[var(--secondary)] text-[var(--muted-foreground)]" : "bg-[var(--primary)] text-[var(--primary-foreground)]"
                }`}>
                  {message.role === "user" ? <User size={15} /> : <Bot size={15} />}
                </span>

                <div className={`min-w-0 rounded-2xl border px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "border-[var(--border)] bg-[var(--secondary)]/40"
                    : "border-[var(--border)] bg-[var(--card)]"
                }`}>
                  <div className="space-y-2">{renderMarkdown(message.content)}</div>

                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {message.toolCalls.map((call, index) => (
                        <span key={index} className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2 py-0.5 text-[11px] text-[var(--muted-foreground)]">
                          {toolLabel(call.name)}
                        </span>
                      ))}
                    </div>
                  )}

                  {message.pendingActions && message.pendingActions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.pendingActions.map((action) => (
                        <div key={action.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                          <p className="text-xs font-medium">{actionLabel(action.type)}</p>
                          <p className="mt-1 text-xs text-[var(--muted-foreground)]">{action.summary}</p>
                          {action.status === "pending" ? (
                            <div className="mt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => void decideAction(message.id, action.id, "approved")}
                                className="inline-flex items-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
                              >
                                <Check size={13} />
                                Bestätigen
                              </button>
                              <button
                                type="button"
                                onClick={() => void decideAction(message.id, action.id, "rejected")}
                                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold transition hover:bg-[var(--secondary)]"
                              >
                                <X size={13} />
                                Ablehnen
                              </button>
                            </div>
                          ) : action.status === "approved" ? (
                            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600"><Check size={13} /> Ausgeführt</p>
                          ) : (
                            <p className="mt-2 text-xs text-[var(--muted-foreground)]">Abgelehnt</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {processing && (
            <div className="flex justify-start">
              <div className="flex gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <Bot size={15} />
                </span>
                <div className="flex items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--muted-foreground)] [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mx-auto mb-2 w-full max-w-3xl px-4 sm:px-6">
          <p className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 px-4 py-2.5 text-sm text-[var(--destructive)]">
            {error}
          </p>
        </div>
      )}

      <footer className="shrink-0 border-t border-[var(--border)] px-4 py-3 sm:px-6">
        <form
          className="mx-auto flex w-full max-w-3xl items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void send();
          }}
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            placeholder="Frage stellen oder steuern …"
            rows={1}
            className="min-h-[44px] flex-1 resize-none rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]"
            disabled={processing}
          />
          <button
            type="submit"
            disabled={processing || !input.trim()}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            Senden
          </button>
        </form>
      </footer>
    </main>
  );
}
