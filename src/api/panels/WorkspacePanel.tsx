import { useCallback, useEffect, useState, type FormEvent } from "react";
import { approvalApi, type Approval } from "../approvals";
import { notificationApi, type Notification } from "../notifications";
import { workspaceAppApi, type AuditEntry } from "../workspace-app";
import { workspaceApi } from "../workspaces";
import type { WorkspaceBootstrap, WorkspaceInvitation, WorkspaceMember } from "../types";
import { LiveEmpty, LiveError, LivePanelShell, LiveSection, formatLiveDate } from "../live-panel-ui";

type Tab = "overview" | "notifications" | "approvals" | "team" | "audit";

export function WorkspacePanel({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [bootstrap, setBootstrap] = useState<WorkspaceBootstrap | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [invite, setInvite] = useState({ email: "", role: "member" as "admin" | "member" | "viewer" });
  const [approval, setApproval] = useState({ title: "", actionType: "general", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const summary = (await workspaceApi.bootstrap(workspaceId)).data;
      setBootstrap(summary);
      const [notificationResponse, approvalResponse, memberResponse] = await Promise.all([
        notificationApi.list(workspaceId), approvalApi.list(workspaceId), workspaceAppApi.members(workspaceId),
      ]);
      setNotifications(notificationResponse.data.items); setUnread(notificationResponse.data.unread);
      setApprovals(approvalResponse.data.items); setMembers(memberResponse.data.members); setInvitations(memberResponse.data.invitations);
      if (summary.permissions.canAdminister) setAudit((await workspaceAppApi.audit(workspaceId)).data.items);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Workspace data could not be loaded."); }
    finally { setBusy(false); }
  }, [workspaceId]);
  useEffect(() => { void load(); }, [load]);

  async function sendInvite(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await workspaceAppApi.invite(workspaceId, invite.email.trim(), invite.role); setInvite({ email: "", role: "member" }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Invitation could not be sent."); setBusy(false); }
  }
  async function requestApproval(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try { await approvalApi.create(workspaceId, { title: approval.title.trim(), actionType: approval.actionType.trim(), description: approval.description.trim() || null }); setApproval({ title: "", actionType: "general", description: "" }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Approval could not be created."); setBusy(false); }
  }

  const canEdit = bootstrap?.permissions.canEdit ?? false;
  const canAdminister = bootstrap?.permissions.canAdminister ?? false;
  return <LivePanelShell title="Live workspace" subtitle={bootstrap?.workspace.companyName ?? "Workspace operations"} onClose={onClose}>
    <LiveError message={error} />
    <nav className="lulu-live-tabs" aria-label="Workspace live-data sections">{(["overview", "notifications", "approvals", "team", "audit"] as Tab[]).map((item) => <button type="button" key={item} aria-selected={tab === item} onClick={() => setTab(item)}>{item}</button>)}</nav>
    {tab === "overview" && <LiveSection title="Workspace summary" action={<button className="lulu-live-button" onClick={() => void load()} disabled={busy}>Refresh</button>}>
      {!bootstrap ? <LiveEmpty>Loading workspace…</LiveEmpty> : <><div className="lulu-live-kpis"><div className="lulu-live-kpi"><span>Records</span><strong>{bootstrap.records.total}</strong></div><div className="lulu-live-kpi"><span>Members</span><strong>{bootstrap.members.total}</strong></div><div className="lulu-live-kpi"><span>Unread</span><strong>{bootstrap.notifications.unread}</strong></div><div className="lulu-live-kpi"><span>Pending</span><strong>{bootstrap.approvals.pending}</strong></div></div><div className="lulu-live-row"><strong>Role: {bootstrap.permissions.role}</strong><span>AI {bootstrap.capabilities.aiGeneration ? "enabled" : "not configured"} · Email {bootstrap.capabilities.transactionalEmail ? "enabled" : "not configured"}</span></div>{bootstrap.recentActivity.map((entry) => <div className="lulu-live-row" key={entry.id}><strong>{entry.action}</strong><span>{entry.entityType}</span><small>{formatLiveDate(entry.createdAt)}</small></div>)}</>}
    </LiveSection>}
    {tab === "notifications" && <LiveSection title={`${unread} unread`} action={<button className="lulu-live-button" disabled={!unread || busy} onClick={async () => { await notificationApi.markAllRead(workspaceId); await load(); }}>Read all</button>}>
      {notifications.length === 0 ? <LiveEmpty>No notifications.</LiveEmpty> : notifications.map((item) => <article className="lulu-live-row" key={item.id}><div className="lulu-live-row-top"><div><strong>{item.title}</strong><span>{item.body || item.notificationType}</span></div><span className={`lulu-live-badge ${item.readAt ? "" : "good"}`}>{item.severity}</span></div><small>{formatLiveDate(item.createdAt)}</small><div className="lulu-live-actions" style={{ marginTop: 8 }}>{!item.readAt && <button className="lulu-live-button" onClick={async () => { await notificationApi.markRead(workspaceId, item.id); await load(); }}>Mark read</button>}<button className="lulu-live-button danger" onClick={async () => { await notificationApi.dismiss(workspaceId, item.id); await load(); }}>Dismiss</button></div></article>)}
    </LiveSection>}
    {tab === "approvals" && <><LiveSection title="Approval requests">{approvals.length === 0 ? <LiveEmpty>No approval requests.</LiveEmpty> : approvals.map((item) => <article className="lulu-live-row" key={item.id}><div className="lulu-live-row-top"><div><strong>{item.title}</strong><span>{item.description || item.actionType}</span></div><span className={`lulu-live-badge ${item.status === "approved" ? "good" : ""}`}>{item.status}</span></div>{item.status === "pending" && canEdit && <div className="lulu-live-actions" style={{ marginTop: 8 }}><button className="lulu-live-button" onClick={async () => { await approvalApi.decide(workspaceId, item.id, "approved"); await load(); }}>Approve</button><button className="lulu-live-button danger" onClick={async () => { await approvalApi.decide(workspaceId, item.id, "rejected"); await load(); }}>Reject</button></div>}</article>)}</LiveSection>{canEdit && <LiveSection title="Request approval"><form className="lulu-live-form" onSubmit={requestApproval}><label>Title<input value={approval.title} onChange={(event) => setApproval({ ...approval, title: event.target.value })} required /></label><label>Action type<input value={approval.actionType} onChange={(event) => setApproval({ ...approval, actionType: event.target.value })} required /></label><label>Description<textarea value={approval.description} onChange={(event) => setApproval({ ...approval, description: event.target.value })} /></label><button className="lulu-live-button primary" disabled={busy}>Create request</button></form></LiveSection>}</>}
    {tab === "team" && <><LiveSection title="Members">{members.map((member) => <article className="lulu-live-row" key={member.id}><div className="lulu-live-row-top"><div><strong>{[member.firstName, member.lastName].filter(Boolean).join(" ") || member.email}</strong><span>{member.email}</span></div>{canAdminister && member.role !== "owner" ? <select value={member.role} onChange={async (event) => { await workspaceAppApi.updateMember(workspaceId, member.id, event.target.value as "admin" | "member" | "viewer"); await load(); }}><option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option></select> : <span className="lulu-live-badge">{member.role}</span>}</div>{canAdminister && member.role !== "owner" && <button className="lulu-live-button danger" style={{ marginTop: 8 }} onClick={async () => { if (!window.confirm(`Remove ${member.email}?`)) return; await workspaceAppApi.removeMember(workspaceId, member.id); await load(); }}>Remove</button>}</article>)}</LiveSection><LiveSection title="Pending invitations">{invitations.length === 0 ? <LiveEmpty>No pending invitations.</LiveEmpty> : invitations.map((item) => <div className="lulu-live-row" key={item.id}><strong>{item.email}</strong><span>{item.role}</span><small>Expires {formatLiveDate(item.expiresAt)}</small></div>)}</LiveSection>{canAdminister && <LiveSection title="Invite teammate"><form className="lulu-live-form" onSubmit={sendInvite}><label>Email<input type="email" value={invite.email} onChange={(event) => setInvite({ ...invite, email: event.target.value })} required /></label><label>Role<select value={invite.role} onChange={(event) => setInvite({ ...invite, role: event.target.value as typeof invite.role })}><option value="admin">Admin</option><option value="member">Member</option><option value="viewer">Viewer</option></select></label><button className="lulu-live-button primary" disabled={busy}>Send invitation</button></form></LiveSection>}</>}
    {tab === "audit" && <LiveSection title="Audit log">{!canAdminister ? <LiveEmpty>Admin access is required.</LiveEmpty> : audit.length === 0 ? <LiveEmpty>No audit events.</LiveEmpty> : audit.map((entry) => <article className="lulu-live-row" key={entry.id}><strong>{entry.action}</strong><span>{entry.entityType}{entry.actorEmail ? ` · ${entry.actorEmail}` : ""}</span><small>{formatLiveDate(entry.createdAt)}</small></article>)}</LiveSection>}
  </LivePanelShell>;
}
