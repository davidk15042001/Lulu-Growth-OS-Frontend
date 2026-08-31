import { useState } from "react";
import { Bot, Plus, Send } from "lucide-react";
import { getFriendlyErrorMessage, requestApi } from "../../../../api/client";
import { getSelectedWorkspaceId } from "../../../../api/session";

type LiveMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ConversationResponse = {
  id: string;
};

type AiResponse = {
  assistantMessage: {
    id: string;
    content: string;
  };
};

export function LuluAIAssistant() {
  const [query, setQuery] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([]);
  const [processingState, setProcessingState] = useState(false);
  const [messageError, setMessageError] = useState("");

  const startNewConversation = () => {
    setConversationId(null);
    setLiveMessages([]);
    setQuery("");
    setMessageError("");
  };

  const sendMessage = async (message = query) => {
    const content = message.trim();
    const workspaceId = getSelectedWorkspaceId();
    if (!content || !workspaceId || processingState) return;

    setMessageError("");
    setQuery("");
    setLiveMessages((current) => [...current, { id: `local-${Date.now()}`, role: "user", content }]);
    setProcessingState(true);

    try {
      let activeId = conversationId;
      if (!activeId) {
        const conversation = await requestApi<ConversationResponse>({
          path: `/workspaces/${workspaceId}/ai/conversations`,
          method: "POST",
          body: { title: content.slice(0, 80) },
        });
        activeId = conversation.data.id;
        setConversationId(activeId);
      }

      const response = await requestApi<AiResponse>({
        path: `/workspaces/${workspaceId}/ai/conversations/${activeId}/respond`,
        method: "POST",
        body: { content },
      });

      setLiveMessages((current) => [
        ...current,
        {
          id: response.data.assistantMessage.id,
          role: "assistant",
          content: response.data.assistantMessage.content,
        },
      ]);
    } catch (error) {
      setMessageError(getFriendlyErrorMessage(error, "Lulu AI could not prepare an answer. Please try again."));
    } finally {
      setProcessingState(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                AI Assistant
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                Ask Lulu AI
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                Ask about your workspace, records, connected systems, or next actions. This page now keeps only the
                conversation itself visible.
              </p>
            </div>
            <button
              type="button"
              onClick={startNewConversation}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--foreground)]/35 sm:w-auto"
            >
              <Plus size={16} />
              New conversation
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/70 p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Bot size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">Best used for</p>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">
                  Summaries, explanations, next-step planning, and quick answers based on your connected workspace
                  context.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-5 flex flex-1 flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-sm sm:p-5">
          <div className="flex flex-1 flex-col gap-3">
            {!liveMessages.length ? (
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)]/60 p-6 text-center">
                <p className="text-sm font-medium text-[var(--foreground)]">Start with one clear question.</p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Example: &quot;What should I focus on first this week?&quot;
                </p>
              </div>
            ) : (
              liveMessages.map((message) => (
                <article
                  key={message.id}
                  className={`w-full max-w-[94%] rounded-2xl border border-[var(--border)] p-3 text-sm leading-6 sm:max-w-[86%] sm:p-4 ${
                    message.role === "user"
                      ? "self-end bg-[var(--background)]/70"
                      : "self-start bg-[var(--secondary)]/35"
                  }`}
                >
                  {message.content}
                </article>
              ))
            )}

            {messageError ? (
              <p className="rounded-xl border border-[var(--destructive)]/30 bg-[var(--destructive)]/10 p-3 text-sm text-[var(--destructive)]">
                {messageError}
              </p>
            ) : null}
          </div>

          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask Lulu AI about your workspace..."
              className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[var(--ring)]"
              disabled={processingState}
            />
            <button
              type="submit"
              disabled={processingState || !query.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={16} />
              {processingState ? "Working..." : "Send"}
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
