import { useCallback, useEffect, useState, type FormEvent } from "react";
import { aiApi, type AiMessage, type AssistantPendingAction, type Conversation } from "../ai";
import { agentApi, type AgentRunDetails } from "../agents";
import { getFriendlyErrorMessage } from "../client";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

export function AiPanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [actions, setActions] = useState<AssistantPendingAction[]>([]);
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [agentGoal, setAgentGoal] = useState("");
  const [agentRuns, setAgentRuns] = useState<AgentRunDetails[]>([]);
  const [agentBusy, setAgentBusy] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      const items = (await aiApi.conversations(workspaceId)).data.items;
      setConversations(items);
      setSelectedId((current) => current && items.some((item) => item.id === current) ? current : items[0]?.id ?? "");
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load your conversations. Please try again.")); }
  }, [workspaceId]);

  const loadMessages = useCallback(async () => {
    if (!selectedId) { setMessages([]); return; }
    try { setMessages((await aiApi.messages(workspaceId, selectedId)).data.items); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load these messages. Please try again.")); }
  }, [selectedId, workspaceId]);

  useEffect(() => { void loadConversations(); }, [loadConversations]);
  useEffect(() => { void loadMessages(); }, [loadMessages]);

  const loadActions = useCallback(async () => {
    if (!selectedId) { setActions([]); return; }
    try { setActions((await aiApi.actions(workspaceId, selectedId)).data); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load the assistant actions.")); }
  }, [selectedId, workspaceId]);
  useEffect(() => { void loadActions(); }, [loadActions]);

  const loadAgentRuns = useCallback(async () => {
    try {
      const runs = (await agentApi.list(workspaceId)).data.items;
      setAgentRuns(await Promise.all(runs.slice(0, 8).map((run) => agentApi.detail(workspaceId, run.id).then((response) => response.data))));
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not load agent runs. Please try again.")); }
  }, [workspaceId]);
  useEffect(() => { void loadAgentRuns(); }, [loadAgentRuns]);

  async function startAgentRun(event: FormEvent) {
    event.preventDefault();
    if (!agentGoal.trim()) return;
    setAgentBusy(true); setError("");
    try { await agentApi.create(workspaceId, agentGoal.trim()); setAgentGoal(""); await loadAgentRuns(); }
    catch (cause) { setError(getFriendlyErrorMessage(cause, "Lulu could not start the coordinated agent run.")); }
    finally { setAgentBusy(false); }
  }

  async function newConversation() {
    setBusy(true); setError("");
    try {
      const conversation = (await aiApi.createConversation(workspaceId, { title: "New conversation" })).data;
      await loadConversations(); setSelectedId(conversation.id); setMessages([]);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "We could not create the conversation. Please try again.")); }
    finally { setBusy(false); }
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setBusy(true); setError("");
    try {
      let conversationId = selectedId;
      if (!conversationId) conversationId = (await aiApi.createConversation(workspaceId, { title: content.trim().slice(0, 80) })).data.id;
      const response = await aiApi.respond(workspaceId, conversationId, content.trim());
      setContent(""); setSelectedId(conversationId);
      setActions(response.data.pendingActions);
      await Promise.all([
        loadConversations(),
        aiApi.messages(workspaceId, conversationId).then((messagesResponse) => setMessages(messagesResponse.data.items)),
        aiApi.actions(workspaceId, conversationId).then((actionsResponse) => setActions(actionsResponse.data)),
      ]);
    } catch (cause) { setError(getFriendlyErrorMessage(cause, "Lulu AI could not prepare an answer. Please try again.")); }
    finally { setBusy(false); }
  }

  return <LivePanelShell title="Live AI assistant" subtitle="Backend conversation and OpenAI integration" onClose={onClose}>
    <LiveError message={error} />
    <LiveSection title="Conversations" action={<button className="lulu-live-button" onClick={() => void newConversation()} disabled={busy}>New</button>}>
      {conversations.length === 0 ? <LiveEmpty>No conversations yet.</LiveEmpty> : <div className="lulu-live-form"><label>Conversation<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{conversations.map((conversation) => <option key={conversation.id} value={conversation.id}>{conversation.title}</option>)}</select></label></div>}
      {selectedId && <button className="lulu-live-button danger" style={{ marginTop: 10 }} onClick={async () => { if (!window.confirm("Archive this conversation?")) return; await aiApi.archiveConversation(workspaceId, selectedId); setSelectedId(""); await loadConversations(); }}>Archive</button>}
    </LiveSection>
    <LiveSection title="Coordinated agent runs">
      <p style={{ marginTop: 0 }}>Planner, Analyst, Strategist and Reviewer work through one persisted orchestration run. Risky tools pause for approval.</p>
      <form className="lulu-live-form" onSubmit={startAgentRun}><label>Business goal<textarea value={agentGoal} onChange={(event) => setAgentGoal(event.target.value)} placeholder="Tell Lulu what outcome to achieve…" /></label><button className="lulu-live-button primary" disabled={agentBusy || !agentGoal.trim()}>{agentBusy ? "Starting…" : "Start agent run"}</button></form>
      {agentRuns.length === 0 ? <LiveEmpty>No coordinated agent runs yet.</LiveEmpty> : agentRuns.map((details) => { const result = details.run.result as Record<PropertyKey, unknown> | null; const isInitialAnalysis = details.run.goal.startsWith("[initial-business-analysis]"); return <article className="lulu-live-message" key={details.run.id}><strong>{details.run.goal}</strong><small>{details.run.status} · {details.steps.filter((step) => step.status === "completed").length}/{details.steps.length} steps completed · {formatLiveDate(details.run.updatedAt)}</small>{details.run.errorMessage && <span>{details.run.errorCode}: {details.run.errorMessage}</span>}{isInitialAnalysis && result?.executiveSummary != null && <p style={{ whiteSpace: "pre-wrap" }}>{String(result.executiveSummary)}</p>}{isInitialAnalysis && Array.isArray(result?.dataGaps) && <small>{result.dataGaps.length} · {String(result?.confidence ?? "unknown")}</small>}{details.steps.filter((step) => step.status === "waiting_approval").map((step) => <button className="lulu-live-button" key={step.id} onClick={async () => { await agentApi.approve(workspaceId, details.run.id, step.id); await loadAgentRuns(); }}>Approve {step.toolName ?? "step"}</button>)}</article>; })}
    </LiveSection>
    <LiveSection title="Messages">
      {messages.length === 0 ? <LiveEmpty>Start the conversation below.</LiveEmpty> : messages.map((message) => <article className={`lulu-live-message ${message.role}`} key={message.id}><small>{message.role} · {formatLiveDate(message.createdAt)}</small>{message.content}</article>)}
      <form className="lulu-live-form" onSubmit={send}><label>Message<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Ask Lulu AI…" /></label><button className="lulu-live-button primary" disabled={busy || !content.trim()}>{busy ? "Generating…" : "Send"}</button></form>
    </LiveSection>
    <LiveSection title="Assistant actions">
      {actions.length === 0 ? <LiveEmpty>No assistant actions for this conversation.</LiveEmpty> : actions.map((action) => <article className="lulu-live-row" key={action.id}>
        <div className="lulu-live-row-top"><div><strong>{action.summary}</strong><span>{action.type}</span></div><span className={`lulu-live-badge ${action.status === "succeeded" ? "good" : ""}`}>{action.status.replaceAll("_", " ")}</span></div>
        {action.status === "pending_approval" && <small>Owner/Admin approval required{action.approvalId ? ` · ${action.approvalId}` : ""}.</small>}
        {action.errorMessage && <span>{action.errorMessage}</span>}
        {action.result && <small>{JSON.stringify(action.result)}</small>}
        {["pending_approval", "ready", "executing"].includes(action.status) && <button className="lulu-live-button" style={{ marginTop: 8 }} onClick={async () => {
          setBusy(true); setError("");
          try { await aiApi.executeAction(workspaceId, action.conversationId, action.id); await loadActions(); }
          catch (cause) { setError(getFriendlyErrorMessage(cause, "The assistant action could not be refreshed or executed.")); }
          finally { setBusy(false); }
        }}>{action.status === "pending_approval" ? "Check approval" : "Run now"}</button>}
      </article>)}
    </LiveSection>
  </LivePanelShell>;
}
