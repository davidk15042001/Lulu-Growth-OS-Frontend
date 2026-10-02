import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Layers3,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { getFriendlyErrorMessage } from "../../api/client";
import { officeApi, type OfficeEmployeeDetails, type OfficeEmployeeStatus, type OfficeEmployeeSummary, type OfficeOverview } from "../../api/office";
import { subscribeWorkspaceEvents, type WorkspaceLiveEvent } from "../../api/agent-stream";
import { useLuluApp } from "../../api/LuluAppContext";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import "./lulu-station.css";

type StatusTone = "idle" | "working" | "waiting" | "attention" | "offline";

type RoomLayout = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  prop: "desk" | "terminal" | "archive" | "brain";
};

const ROOM_LAYOUTS: RoomLayout[] = [
  { id: "room-a", x: 42, y: 82, width: 510, height: 244, color: "teal", prop: "desk" },
  { id: "room-b", x: 650, y: 82, width: 510, height: 244, color: "violet", prop: "terminal" },
  { id: "room-c", x: 42, y: 382, width: 510, height: 244, color: "gold", prop: "archive" },
  { id: "room-d", x: 650, y: 382, width: 510, height: 244, color: "blue", prop: "brain" },
];

function toneForStatus(status: OfficeEmployeeStatus): StatusTone {
  if (status === "OFFLINE") return "offline";
  if (status === "ERROR" || status === "WAITING_FOR_APPROVAL") return "attention";
  if (status === "WAITING" || status === "HUMAN_CONTROLLED") return "waiting";
  if (status === "WORKING" || status === "COLLABORATING" || status === "MONITORING") return "working";
  return "idle";
}

function statusLabel(status: OfficeEmployeeStatus) {
  return status.replaceAll("_", " ").toLowerCase();
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "LU";
}

function roomEmployees(overview: OfficeOverview | null) {
  return (overview?.departments ?? []).slice(0, ROOM_LAYOUTS.length).map((department, index) => ({
    room: ROOM_LAYOUTS[index]!,
    department,
    employees: department.employees.slice(0, 4),
  }));
}

function StationCharacter({
  employee,
  x,
  y,
  selected,
  onSelect,
}: {
  employee: OfficeEmployeeSummary;
  x: number;
  y: number;
  selected: boolean;
  onSelect: (employee: OfficeEmployeeSummary) => void;
}) {
  const tone = toneForStatus(employee.status);
  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(employee);
    }
  };
  return (
    <g
      className={`lulu-station__character lulu-station__character--${tone}${selected ? " is-selected" : ""}`}
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`${employee.name}, ${employee.title}, ${statusLabel(employee.status)}`}
      onClick={(event) => { event.stopPropagation(); onSelect(employee); }}
      onKeyDown={handleKeyDown}
    >
      <ellipse className="lulu-station__character-shadow" cx="0" cy="28" rx="28" ry="8" />
      <rect className="lulu-station__character-body" x="-16" y="-1" width="32" height="29" rx="10" />
      <circle className="lulu-station__character-head" cx="0" cy="-15" r="14" />
      <path className="lulu-station__character-hair" d="M-13-14c1-12 24-17 27-1-3-3-7-4-11-2-4-3-10-1-16 3Z" />
      <circle className="lulu-station__character-status" cx="16" cy="-25" r="4" />
      <text className="lulu-station__character-initials" x="0" y="17" textAnchor="middle">{initials(employee.name)}</text>
      <text className="lulu-station__character-name" x="0" y="48" textAnchor="middle">{employee.name.split(" ")[0]}</text>
    </g>
  );
}

function StationProp({ room, active, onSelect }: { room: RoomLayout; active: boolean; onSelect: () => void }) {
  const propName = room.prop === "desk" ? "Work desk" : room.prop === "terminal" ? "Integration terminal" : room.prop === "archive" ? "Deliverables archive" : "Company Brain core";
  return (
    <g
      className={`lulu-station__prop lulu-station__prop--${room.prop}${active ? " is-active" : ""}`}
      transform={`translate(${room.x + room.width - 112} ${room.y + room.height - 80})`}
      role="button"
      tabIndex={0}
      aria-label={propName}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(); } }}
    >
      <rect className="lulu-station__prop-shadow" x="-12" y="28" width="104" height="13" rx="7" />
      <rect className="lulu-station__prop-surface" x="0" y="0" width="80" height="30" rx="5" />
      {room.prop === "archive" ? <><rect className="lulu-station__prop-box" x="11" y="-25" width="22" height="25" rx="3" /><rect className="lulu-station__prop-box" x="39" y="-18" width="24" height="18" rx="3" /></> : null}
      {room.prop === "brain" ? <><circle className="lulu-station__prop-core" cx="40" cy="-20" r="18" /><circle className="lulu-station__prop-core-dot" cx="40" cy="-20" r="5" /></> : null}
      {room.prop === "terminal" ? <><rect className="lulu-station__prop-screen" x="18" y="-31" width="44" height="28" rx="3" /><path className="lulu-station__prop-screen-line" d="M25-20h29M25-13h19" /></> : null}
      {room.prop === "desk" ? <><rect className="lulu-station__prop-screen" x="22" y="-28" width="34" height="23" rx="3" /><path className="lulu-station__prop-screen-line" d="M28-17h21" /></> : null}
      <text className="lulu-station__prop-label" x="40" y="58" textAnchor="middle">{room.prop === "archive" ? "OUTBOX" : room.prop === "brain" ? "BRAIN" : room.prop === "terminal" ? "SYNC" : "WORK"}</text>
    </g>
  );
}

function roomDescription(prop: RoomLayout["prop"]) {
  if (prop === "terminal") return "Provider connections and synchronized systems.";
  if (prop === "archive") return "Verified outputs, quality artifacts and attachments.";
  if (prop === "brain") return "Signals, missions, decisions and operating cycles.";
  return "Active work items and specialist execution.";
}

export function LuluStation() {
  const t = useTranslation();
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overview, setOverview] = useState<OfficeOverview | null>(null);
  const [employeeDetail, setEmployeeDetail] = useState<OfficeEmployeeDetails | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedProp, setSelectedProp] = useState<RoomLayout["prop"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);

  const loadOverview = useCallback(async (background = false) => {
    if (!workspaceId) return;
    if (background) setRefreshing(true); else setLoading(true);
    try {
      const response = await officeApi.overview(workspaceId);
      setOverview(response.data);
      setError(null);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause));
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

  useEffect(() => {
    if (!workspaceId) return undefined;
    let refreshTimer: number | null = null;
    const unsubscribe = subscribeWorkspaceEvents(workspaceId, (event: WorkspaceLiveEvent) => {
      if (event.type === "connected") setLiveConnected(true);
      setLastEventAt(event.occurredAt);
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => void loadOverview(true), 450);
    });
    return () => {
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      unsubscribe();
      setLiveConnected(false);
    };
  }, [loadOverview, workspaceId]);

  const selectEmployee = useCallback(async (employee: OfficeEmployeeSummary) => {
    if (!workspaceId) return;
    setSelectedEmployeeId(employee.id);
    setSelectedRoomId(null);
    setSelectedProp(null);
    try {
      setEmployeeDetail((await officeApi.employee(workspaceId, employee.id)).data);
      setError(null);
    } catch (cause) {
      setError(getFriendlyErrorMessage(cause));
    }
  }, [workspaceId]);

  const rooms = useMemo(() => roomEmployees(overview), [overview]);
  const selectedRoom = rooms.find(({ room }) => room.id === selectedRoomId) ?? null;
  const openSignals = overview?.companyBrain?.signals.filter((signal) => signal.status === "OPEN").length ?? 0;
  const attentionCount = (overview?.summary.attentionEmployees ?? 0) + openSignals;

  if (!workspaceId) return null;
  if (loading && !overview) {
    return <section className="lulu-station lulu-station--state" aria-label="Lulu Station"><RefreshCw className="lulu-station__spin" size={20} /><span>{t("Loading verified office state…")}</span></section>;
  }
  if (!overview) {
    return <section className="lulu-station lulu-station--state" aria-label="Lulu Station"><ShieldCheck size={20} /><div><strong>{t("Virtual Office unavailable")}</strong><p>{error ?? "No verified station state is available."}</p><button type="button" onClick={() => void loadOverview()}>{t("Try again")}</button></div></section>;
  }

  return (
    <section className="lulu-station" aria-label="Lulu Station">
      <header className="lulu-station__header">
        <div>
          <div className="lulu-station__eyebrow"><Sparkles size={13} aria-hidden="true" />LULU STATION / VERIFIED OPERATING WORLD</div>
          <h1>Where the company works.</h1>
          <p>Every room, person and signal is a visual projection of this workspace&apos;s verified operational state.</p>
        </div>
        <div className="lulu-station__header-actions">
          <span className={`lulu-station__connection${liveConnected ? " is-live" : ""}`}><i />{liveConnected ? "Live events" : "Verified snapshot"}</span>
          <button type="button" className="lulu-station__refresh" onClick={() => void loadOverview(true)} disabled={refreshing}><RefreshCw size={15} className={refreshing ? "lulu-station__spin" : undefined} />{t("Refresh")}</button>
        </div>
      </header>

      <div className="lulu-station__metrics" aria-label="Station summary">
        <div><span><Zap size={14} />Work in motion</span><strong>{overview.summary.activeWorkItems}</strong><small>{overview.summary.workingEmployees} employees working</small></div>
        <div><span><Layers3 size={14} />Crew online</span><strong>{overview.summary.activeEmployees}</strong><small>{overview.summary.employeeCount} employees visible</small></div>
        <div className={attentionCount > 0 ? "is-attention" : ""}><span><Target size={14} />Needs attention</span><strong>{attentionCount}</strong><small>{openSignals} open Company Brain signals</small></div>
        <div><span><CheckCircle2 size={14} />Verified outcomes</span><strong>{overview.summary.completedToday}</strong><small>recently completed work items</small></div>
      </div>

      <div className="lulu-station__workspace">
        <div className="lulu-station__world-shell">
          <div className="lulu-station__world-toolbar"><span><i className="lulu-station__toolbar-dot" />Station map</span><small>{overview.summary.departmentCount} departments · {formatTime(overview.generatedAt)} snapshot</small></div>
          <div className="lulu-station__world" role="img" aria-label="Lulu Station map with departments and digital employees">
            <svg viewBox="0 0 1200 680" role="presentation">
              <defs>
                <linearGradient id="station-shell" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#182a3c" /><stop offset="1" stopColor="#0b1524" /></linearGradient>
                <linearGradient id="station-core" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#47e4d0" stopOpacity=".34" /><stop offset="1" stopColor="#7568ff" stopOpacity=".12" /></linearGradient>
                <pattern id="station-grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#6ba5c3" strokeOpacity=".09" /></pattern>
                <filter id="station-glow"><feGaussianBlur stdDeviation="9" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <rect x="0" y="0" width="1200" height="680" rx="24" fill="url(#station-shell)" />
              <rect x="0" y="0" width="1200" height="680" rx="24" fill="url(#station-grid)" />
              <path className="lulu-station__corridor" d="M552 204H650M552 504H650M298 326V382M902 326V382" />
              <path className="lulu-station__corridor-glow" d="M552 204H650M552 504H650M298 326V382M902 326V382" />
              <g className="lulu-station__core" transform="translate(600 354)" aria-hidden="true">
                <circle className="lulu-station__core-halo" r="54" filter="url(#station-glow)" />
                <circle className="lulu-station__core-orbit" r="39" />
                <circle className="lulu-station__core-center" r="22" fill="url(#station-core)" />
                <path d="M-7 0h14M0-7v14" />
                <text x="0" y="78" textAnchor="middle">LULU CORE</text>
              </g>
              {rooms.map(({ room, department, employees }) => {
                const roomSelected = room.id === selectedRoomId;
                return <g key={room.id} className={`lulu-station__room lulu-station__room--${room.color}${roomSelected ? " is-selected" : ""}`} onClick={() => { setSelectedRoomId(room.id); setSelectedEmployeeId(null); setSelectedProp(null); setEmployeeDetail(null); }}>
                  <rect className="lulu-station__room-floor" x={room.x} y={room.y} width={room.width} height={room.height} rx="18" />
                  <path className="lulu-station__room-border" d={`M${room.x + 18} ${room.y}H${room.x + room.width - 18}Q${room.x + room.width} ${room.y} ${room.x + room.width} ${room.y + 18}V${room.y + room.height - 18}Q${room.x + room.width} ${room.y + room.height} ${room.x + room.width - 18} ${room.y + room.height}H${room.x + 18}Q${room.x} ${room.y + room.height} ${room.x} ${room.y + room.height - 18}V${room.y + 18}Q${room.x} ${room.y} ${room.x + 18} ${room.y}Z`} />
                  <text className="lulu-station__room-kicker" x={room.x + 22} y={room.y + 31}>{department.name.toUpperCase()}</text>
                  <text className="lulu-station__room-caption" x={room.x + 22} y={room.y + 52}>{department.description}</text>
                  <text className="lulu-station__room-count" x={room.x + room.width - 22} y={room.y + 32} textAnchor="end">{department.employees.length} CREW</text>
                  <StationProp room={room} active={department.employees.some((employee) => toneForStatus(employee.status) === "working")} onSelect={() => { setSelectedProp(room.prop); setSelectedRoomId(room.id); setSelectedEmployeeId(null); setEmployeeDetail(null); }} />
                  {employees.map((employee, index) => <StationCharacter key={employee.id} employee={employee} x={room.x + 90 + (index % 2) * 150} y={room.y + 114 + Math.floor(index / 2) * 82} selected={employee.id === selectedEmployeeId} onSelect={(selected) => void selectEmployee(selected)} />)}
                  {employees.length === 0 && <text className="lulu-station__room-empty" x={room.x + room.width / 2} y={room.y + room.height / 2} textAnchor="middle">No crew assigned to this room</text>}
                </g>;
              })}
              {rooms.length === 0 && <g><rect className="lulu-station__empty-world" x="120" y="180" width="960" height="340" rx="24" /><text x="600" y="340" textAnchor="middle">No department roster is available for this workspace.</text><text x="600" y="370" textAnchor="middle">The station is waiting for verified workspace setup.</text></g>}
            </svg>
          </div>
          <div className="lulu-station__legend" aria-label="Station status legend">
            <span><i className="is-working" />working</span><span><i className="is-waiting" />waiting / approval</span><span><i className="is-attention" />attention</span><span><i className="is-idle" />idle</span>
          </div>
        </div>

        <aside className="lulu-station__inspector" aria-label="Station inspector">
          {employeeDetail ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__avatar-badge">{initials(employeeDetail.employee.name)}</span><span>Digital Employee</span><button type="button" onClick={() => { setEmployeeDetail(null); setSelectedEmployeeId(null); }} aria-label="Close employee inspector">×</button></div>
            <h2>{employeeDetail.employee.name}</h2>
            <p className="lulu-station__inspector-role">{employeeDetail.employee.title} · {employeeDetail.employee.department?.name}</p>
            <div className={`lulu-station__inspector-status lulu-station__inspector-status--${toneForStatus(employeeDetail.employee.status)}`}><i />{statusLabel(employeeDetail.employee.status)}</div>
            <div className="lulu-station__inspector-block"><span>Current work</span><strong>{employeeDetail.currentWorkItem?.title ?? "No current work item"}</strong><small>{employeeDetail.currentWorkItem?.status ?? "The employee is not running a visible work item."}</small></div>
            <div className="lulu-station__inspector-stats"><div><strong>{employeeDetail.workSummary.active}</strong><span>active</span></div><div><strong>{employeeDetail.workSummary.completedToday}</strong><span>completed</span></div><div><strong>{employeeDetail.workSummary.failed}</strong><span>failed</span></div></div>
            <div className="lulu-station__inspector-block"><span>Capabilities</span><div className="lulu-station__chips">{employeeDetail.capabilities.slice(0, 8).map((capability) => <span key={capability.key}>{capability.key}</span>)}</div></div>
            <button type="button" className="lulu-station__inspector-link" onClick={() => document.querySelector<HTMLElement>(".lulu-office-control")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Open operational control center <ArrowUpRight size={14} /></button>
          </> : selectedRoom ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__room-badge"><Layers3 size={16} /></span><span>Department room</span></div>
            <h2>{selectedRoom.department.name}</h2>
            <p className="lulu-station__inspector-role">{selectedRoom.department.description}</p>
            <div className="lulu-station__inspector-block"><span>Room function</span><strong>{roomDescription(selectedRoom.room.prop)}</strong><small>{selectedRoom.employees.length} visible employees in this room.</small></div>
            <div className="lulu-station__crew-list">{selectedRoom.employees.map((employee) => <button type="button" key={employee.id} onClick={() => void selectEmployee(employee)}><span className={`lulu-station__mini-dot lulu-station__mini-dot--${toneForStatus(employee.status)}`} /><span><strong>{employee.name}</strong><small>{statusLabel(employee.status)}</small></span><ArrowUpRight size={13} /></button>)}</div>
          </> : selectedProp ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__room-badge"><Zap size={16} /></span><span>Functional object</span></div>
            <h2>{selectedProp === "archive" ? "OUTBOX" : selectedProp === "brain" ? "Company Brain" : selectedProp === "terminal" ? "Integration terminal" : "Work desk"}</h2>
            <p className="lulu-station__inspector-role">This object is a visual entry point into an existing Lulu capability.</p>
            <div className="lulu-station__inspector-block"><span>Truth boundary</span><strong>No state is invented here.</strong><small>Open the relevant canonical workspace surface to inspect evidence or take an allowed action.</small></div>
          </> : <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__avatar-badge"><Sparkles size={15} /></span><span>Station briefing</span></div>
            <h2>The company is present.</h2>
            <p className="lulu-station__inspector-role">Select a room, employee or functional object to inspect its verified workspace state.</p>
            <div className="lulu-station__inspector-block"><span>Last backend snapshot</span><strong>{formatTime(overview.generatedAt)}</strong><small>{lastEventAt ? `Last event ${formatTime(lastEventAt)}.` : "The station refreshes every 30 seconds when live events are unavailable."}</small></div>
            <div className="lulu-station__inspector-block"><span>Evidence rule</span><strong>Animation follows persisted work.</strong><small>Idle rooms are quiet. Waiting rooms are explicit. Errors stop at a visible boundary.</small></div>
            <div className="lulu-station__inspector-links"><span><ShieldCheck size={14} />Workspace-scoped</span><span><Clock3 size={14} />Bounded timeline</span><span><Target size={14} />Quality-aware</span></div>
          </>}
          {error && <div className="lulu-station__inspector-error" role="alert">{error}</div>}
        </aside>
      </div>
    </section>
  );
}
