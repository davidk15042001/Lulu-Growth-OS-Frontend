import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  RefreshCw,
  ShieldAlert,
  Target,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import { officeApi, type OfficeEmployeeDetails, type OfficeEmployeeSummary, type OfficeOverview } from "../../api/office";
import { useLuluApp } from "../../api/LuluAppContext";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import "./virtual-office-control-center.css";

type Tone = "good" | "attention" | "critical" | "neutral";

function statusTone(status: OfficeEmployeeSummary["status"]): Tone {
  if (status === "ERROR") return "critical";
  if (status === "WAITING_FOR_APPROVAL" || status === "WAITING") return "attention";
  if (status === "WORKING" || status === "COLLABORATING") return "good";
  return "neutral";
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString([], { dateStyle: "short", timeStyle: "short" });
}

function EmployeeCard({ employee, onOpen }: { employee: OfficeEmployeeSummary; onOpen: (employeeId: string) => void }) {
  const tone = statusTone(employee.status);
  return (
    <button type="button" className="lulu-office-control__employee" onClick={() => onOpen(employee.id)}>
      <span className={`lulu-office-control__avatar lulu-office-control__avatar--${tone}`} aria-hidden="true"><Bot size={17} /></span>
      <span className="lulu-office-control__employee-copy">
        <strong>{employee.name}</strong>
        <small>{employee.title}</small>
        <span className="lulu-office-control__employee-status"><i className={`lulu-office-control__status-dot lulu-office-control__status-dot--${tone}`} />{employee.status.replaceAll("_", " ")}</span>
      </span>
      <ChevronRight size={16} aria-hidden="true" />
    </button>
  );
}

function Metric({ label, value, detail, icon: Icon, tone = "neutral" }: { label: string; value: string | number; detail: string; icon: typeof Activity; tone?: Tone }) {
  return <article className={`lulu-office-control__metric lulu-office-control__metric--${tone}`}>
    <span className="lulu-office-control__metric-icon" aria-hidden="true"><Icon size={17} /></span>
    <span><small>{label}</small><strong>{value}</strong><em>{detail}</em></span>
  </article>;
}

function EmployeeDrawer({ detail, onClose }: { detail: OfficeEmployeeDetails; onClose: () => void }) {
  const t = useTranslation();
  const { employee, currentWorkItem, capabilities, recentTimeline } = detail;
  return <aside className="lulu-office-control__drawer" aria-label={t("Employee details")}>
    <div className="lulu-office-control__drawer-header">
      <div><span className="lulu-office-control__eyebrow">{t("AI workforce")}</span><h2>{employee.name}</h2><p>{employee.title} · {employee.department?.name}</p></div>
      <button type="button" className="lulu-office-control__icon-button" aria-label={t("Close employee details")} onClick={onClose}><X size={18} /></button>
    </div>
    <div className="lulu-office-control__drawer-section"><span className="lulu-office-control__eyebrow">{t("Current state")}</span><div className="lulu-office-control__state-line"><span className={`lulu-office-control__status-dot lulu-office-control__status-dot--${statusTone(employee.status)}`} />{employee.status.replaceAll("_", " ")}</div>{currentWorkItem ? <p className="lulu-office-control__drawer-muted">{currentWorkItem.title}</p> : <p className="lulu-office-control__drawer-muted">{t("No current work item.")}</p>}</div>
    <div className="lulu-office-control__drawer-grid"><div><small>{t("Active")}</small><strong>{employee.workSummary.active}</strong></div><div><small>{t("Completed today")}</small><strong>{employee.workSummary.completedToday}</strong></div><div><small>{t("Failed")}</small><strong>{employee.workSummary.failed}</strong></div></div>
    <div className="lulu-office-control__drawer-section"><span className="lulu-office-control__eyebrow">{t("Capabilities")}</span><div className="lulu-office-control__tag-list">{capabilities.slice(0, 12).map((capability) => <span key={capability.key}>{capability.key}</span>)}</div></div>
    <div className="lulu-office-control__drawer-section"><span className="lulu-office-control__eyebrow">{t("Recent activity")}</span><div className="lulu-office-control__drawer-timeline">{recentTimeline.slice(0, 6).map((item) => <div key={item.id}><strong>{item.title}</strong><small>{formatTime(item.occurredAt)}</small></div>)}{recentTimeline.length === 0 && <p className="lulu-office-control__drawer-muted">{t("No recent activity.")}</p>}</div></div>
  </aside>;
}

export function VirtualOfficeControlCenter() {
  const t = useTranslation();
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overview, setOverview] = useState<OfficeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentKey, setDepartmentKey] = useState<string | null>(null);
  const [employeeDetail, setEmployeeDetail] = useState<OfficeEmployeeDetails | null>(null);
  const [employeeLoading, setEmployeeLoading] = useState(false);

  const loadOverview = useCallback(async (background = false) => {
    if (!workspaceId) return;
    if (background) setRefreshing(true); else setLoading(true);
    try {
      const response = await officeApi.overview(workspaceId);
      setOverview(response.data);
      setError(null);
    } catch (loadError) {
      setError(getFriendlyErrorMessage(loadError));
    } finally {
      if (background) setRefreshing(false); else setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    void loadOverview();
    if (!workspaceId) return undefined;
    const interval = window.setInterval(() => void loadOverview(true), 30_000);
    return () => window.clearInterval(interval);
  }, [loadOverview, workspaceId]);

  const openEmployee = useCallback(async (employeeId: string) => {
    if (!workspaceId) return;
    setEmployeeLoading(true);
    try {
      setEmployeeDetail((await officeApi.employee(workspaceId, employeeId)).data);
    } catch (loadError) {
      setError(getFriendlyErrorMessage(loadError));
    } finally {
      setEmployeeLoading(false);
    }
  }, [workspaceId]);

  const activeEmployees = useMemo(() => (overview?.departments.flatMap((department) => department.employees) ?? [])
    .filter((employee) => employee.status !== "IDLE" && employee.status !== "OFFLINE")
    .sort((left, right) => Number(right.status !== "WAITING") - Number(left.status !== "WAITING")), [overview]);
  const attentionEmployees = useMemo(() => (overview?.departments.flatMap((department) => department.employees) ?? [])
    .filter((employee) => employee.status === "ERROR" || employee.status === "WAITING_FOR_APPROVAL" || employee.status === "WAITING"), [overview]);
  const selectedDepartment = overview?.departments.find((department) => department.key === departmentKey) ?? null;
  const signals = overview?.companyBrain?.signals ?? [];

  if (!workspaceId) return null;
  if (loading && !overview) return <section className="lulu-office-control lulu-office-control--state"><RefreshCw className="lulu-office-control__spin" size={20} /><span>{t("Loading verified office state…")}</span></section>;
  if (error && !overview) return <section className="lulu-office-control lulu-office-control--state"><ShieldAlert size={20} /><div><strong>{t("Virtual Office unavailable")}</strong><p>{error}</p><button type="button" onClick={() => void loadOverview()}>{t("Try again")}</button></div></section>;
  if (!overview) return null;

  return <section className="lulu-office-control" aria-label={t("Virtual Office control center")}>
    <header className="lulu-office-control__header">
      <div><span className="lulu-office-control__eyebrow">{t("AI workforce control center")}</span><h1>{t("Virtual Office")}</h1><p>{t("A live projection of your company’s verified work, attention and outcomes.")}</p></div>
      <button type="button" className="lulu-office-control__refresh" onClick={() => void loadOverview(true)} disabled={refreshing}><RefreshCw className={refreshing ? "lulu-office-control__spin" : undefined} size={16} />{t("Refresh")}</button>
    </header>
    {error && <div className="lulu-office-control__notice" role="status"><AlertTriangle size={16} />{error}</div>}
    <div className="lulu-office-control__metrics">
      <Metric label={t("Business operations")} value={overview.summary.activeWorkItems} detail={t("active work items")} icon={Activity} tone={overview.summary.failedWorkItems > 0 ? "attention" : "good"} />
      <Metric label={t("AI workforce")} value={overview.summary.activeEmployees} detail={`${overview.summary.workingEmployees} ${t("working now")}`} icon={Users} tone="good" />
      <Metric label={t("Needs attention")} value={attentionEmployees.length + signals.filter((signal) => signal.status === "OPEN").length} detail={t("approvals, blockers and signals")} icon={AlertTriangle} tone={attentionEmployees.length > 0 ? "attention" : "neutral"} />
      <Metric label={t("Completed recently")} value={overview.summary.completedToday} detail={t("completed work items")} icon={CheckCircle2} tone="good" />
    </div>
    <div className="lulu-office-control__layout">
      <div className="lulu-office-control__main">
        <div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Operational map")}</span><h2>{t("Departments")}</h2></div><span>{overview.summary.departmentCount} {t("departments")}</span></div>
        <div className="lulu-office-control__departments">{overview.departments.map((department) => <button type="button" key={department.id} className={`lulu-office-control__department${selectedDepartment?.id === department.id ? " is-selected" : ""}`} onClick={() => setDepartmentKey((current) => current === department.key ? null : department.key)}><span className="lulu-office-control__department-icon"><Bot size={18} /></span><span><strong>{department.name}</strong><small>{department.employees.filter((employee) => employee.status !== "IDLE" && employee.status !== "OFFLINE").length} {t("active employees")}</small></span><ChevronRight size={16} /></button>)}</div>
        {selectedDepartment && <div className="lulu-office-control__department-detail"><div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Department view")}</span><h2>{selectedDepartment.name}</h2></div><span>{selectedDepartment.description}</span></div><div className="lulu-office-control__employee-grid">{selectedDepartment.employees.map((employee) => <EmployeeCard key={employee.id} employee={employee} onOpen={(id) => void openEmployee(id)} />)}</div></div>}
        <div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Real backend state")}</span><h2>{t("Active workforce")}</h2></div><span>{activeEmployees.length} {t("active")}</span></div>
        <div className="lulu-office-control__employee-grid">{activeEmployees.slice(0, 8).map((employee) => <EmployeeCard key={employee.id} employee={employee} onOpen={(id) => void openEmployee(id)} />)}{activeEmployees.length === 0 && <div className="lulu-office-control__empty"><Bot size={18} />{t("No active AI employees right now.")}</div>}</div>
        {activeEmployees.length > 8 && <p className="lulu-office-control__muted">{t("Showing the active workforce first. Use the employee details or directory for the full registry.")}</p>}
      </div>
      <aside className="lulu-office-control__rail">
        <div className="lulu-office-control__rail-card"><div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Attention center")}</span><h2>{t("What needs you")}</h2></div><AlertTriangle size={17} /></div>{attentionEmployees.slice(0, 5).map((employee) => <button type="button" className="lulu-office-control__attention" key={employee.id} onClick={() => void openEmployee(employee.id)}><span className={`lulu-office-control__status-dot lulu-office-control__status-dot--${statusTone(employee.status)}`} /><span><strong>{employee.name}</strong><small>{employee.status.replaceAll("_", " ")}{employee.currentWorkItem ? ` · ${employee.currentWorkItem.title}` : ""}</small></span><ChevronRight size={15} /></button>)}{signals.filter((signal) => signal.status === "OPEN").slice(0, 3).map((signal) => <div className="lulu-office-control__attention" key={signal.id}><span className="lulu-office-control__status-dot lulu-office-control__status-dot--attention" /><span><strong>{signal.signalType.replaceAll("_", " ")}</strong><small>{signal.explanation}</small></span></div>)}{attentionEmployees.length === 0 && signals.filter((signal) => signal.status === "OPEN").length === 0 && <div className="lulu-office-control__empty"><CheckCircle2 size={17} />{t("Nothing currently requires attention.")}</div>}</div>
        <div className="lulu-office-control__rail-card"><div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Company Brain")}</span><h2>{t("Missions and signals")}</h2></div><Target size={17} /></div><div className="lulu-office-control__brain-grid"><div><small>{t("Active missions")}</small><strong>{overview.companyBrain?.counts.activeMissions ?? 0}</strong></div><div><small>{t("Open signals")}</small><strong>{overview.companyBrain?.counts.openSignals ?? 0}</strong></div><div><small>{t("Decisions")}</small><strong>{overview.companyBrain?.counts.decisions ?? 0}</strong></div></div>{(overview.companyBrain?.missions ?? []).slice(0, 4).map((mission) => <div className="lulu-office-control__mission" key={mission.id}><Workflow size={15} /><span><strong>{mission.title}</strong><small>{mission.status} · {mission.priority === 1 ? t("high priority") : t("priority")} </small></span></div>)}</div>
        <div className="lulu-office-control__rail-card"><div className="lulu-office-control__section-heading"><div><span className="lulu-office-control__eyebrow">{t("Activity chronicle")}</span><h2>{t("Recent activity")}</h2></div><Clock3 size={17} /></div>{overview.timeline.slice(0, 6).map((item) => <div className="lulu-office-control__activity" key={item.id}><span className="lulu-office-control__activity-line" /><span><strong>{item.title}</strong><small>{item.employeeName ?? t("Company operation")} · {formatTime(item.occurredAt)}</small></span></div>)}{overview.timeline.length === 0 && <div className="lulu-office-control__empty"><Clock3 size={17} />{t("No recent activity.")}</div>}</div>
      </aside>
    </div>
    {employeeLoading && <div className="lulu-office-control__drawer-loading"><RefreshCw className="lulu-office-control__spin" size={18} />{t("Loading employee details…")}</div>}
    {employeeDetail && <EmployeeDrawer detail={employeeDetail} onClose={() => setEmployeeDetail(null)} />}
  </section>;
}
