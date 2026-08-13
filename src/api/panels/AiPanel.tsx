import { useCallback, useEffect, useState, type FormEvent } from "react";
import { aiApi, type AiMessage, type Conversation } from "../ai";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function AiPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadConversations = useCallback(async () => {
    try {
      const items = (await aiApi.conversations(workspaceId)).data.items;
      setConversations(items);
      setSelectedId((current) => current && items.some((item) => item.id === current) ? current : items[0]?.id ?? "");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Conversations could not be loaded."); }
  }, [workspaceId]);

  const loadMessages = useCallback(async () => {
    if (!selectedId) { setMessages([]); return; }
    try { setMessages((await aiApi.messages(workspaceId, selectedId)).data.items); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Messages could not be loaded."); }
  }, [selectedId, workspaceId]);

  useEffect(() => { void loadConversations(); }, [loadConversations]);
  useEffect(() => { void loadMessages(); }, [loadMessages]);

  async function newConversation() {
    setBusy(true); setError("");
    try {
      const conversation = (await aiApi.createConversation(workspaceId, { title: "New conversation" })).data;
      await loadConversations(); setSelectedId(conversation.id); setMessages([]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Conversation could not be created."); }
    finally { setBusy(false); }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setBusy(true); setError("");
    try {
      let conversationId = selectedId;
      if (!conversationId) conversationId = (await aiApi.createConversation(workspaceId, { title: content.trim().slice(0, 80) })).data.id;
      await aiApi.respond(workspaceId, conversationId, content.trim());
      setContent(""); setSelectedId(conversationId);
      await Promise.all([loadConversations(), aiApi.messages(workspaceId, conversationId).then((response) => setMessages(response.data.items))]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "AI response could not be generated."); }
    finally { setBusy(false); }
  }

  return <LivePanelShell title="Live AI assistant" subtitle="Backend conversation and OpenAI integration" onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title="Conversations" action={<button className="lulu-live-button" onClick={() => void newConversation()} disabled={busy}>New</button>}>
      {conversations.length === 0 ? <LiveEmpty>No conversations yet.</LiveEmpty> : <div className="lulu-live-form"><label>Conversation<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{conversations.map((conversation) => <option key={conversation.id} value={conversation.id}>{conversation.title}</option>)}</select></label></div>}
      {selectedId && <button className="lulu-live-button danger" style={{ marginTop: 10 }} onClick={async () => { if (!window.confirm("Archive this conversation?")) return; await aiApi.archiveConversation(workspaceId, selectedId); setSelectedId(""); await loadConversations(); }}>Archive</button>}
    </LiveSection>
    <LiveSection title="Messages">
      {messages.length === 0 ? <LiveEmpty>Start the conversation below.</LiveEmpty> : messages.map((message) => <article className={`lulu-live-message ${message.role}`} key={message.id}><small>{message.role} · {formatLiveDate(message.createdAt)}</small>{message.content}</article>)}
      <form className="lulu-live-form" onSubmit={send}><label>Message<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Ask Lulu AI…" /></label><button className="lulu-live-button primary" disabled={busy || !content.trim()}>{busy ? "Generating…" : "Send"}</button></form>
    </LiveSection>
  </LivePanelShell>;
}
