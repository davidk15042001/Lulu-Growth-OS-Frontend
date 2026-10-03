import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFriendlyErrorMessage } from "../../api/client";
import { officeApi, type OfficeEmployeeDetails, type OfficeEmployeeStatus, type OfficeEmployeeSummary, type OfficeOverview } from "../../api/office";
import { subscribeWorkspaceEvents, type WorkspaceLiveEvent } from "../../api/agent-stream";
import { useLuluApp } from "../../api/LuluAppContext";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { routes } from "../../routing";
import { AgentNativeWorkspace } from "./AgentNativeWorkspace";
import "./lulu-station.css";

type StationStatus = OfficeEmployeeStatus | "BLOCKED";
type StatusTone = "idle" | "working" | "monitoring" | "waiting" | "attention" | "blocked" | "offline";
type RoomProp = "desk" | "terminal" | "archive" | "brain" | "review" | "commerce" | "calendar" | "finance";

type RoomLayout = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  prop: RoomProp;
};

const WORLD_WIDTH = 1440;
const WORLD_TOP = 128;
const ROOM_COLUMNS = 3;
const ROOM_WIDTH = 432;
const ROOM_X_GAP = 36;
const ROOM_Y_GAP = 38;
const ROOM_MIN_HEIGHT = 460;
const ROOM_CREW_COLUMNS = 2;
const ROOM_CREW_TOP = 132;
const ROOM_CREW_ROW_PITCH = 116;
const ROOM_CREW_BOTTOM = 136;
const ROOM_ZONE_CAPACITY = 8;

const ROOM_THEMES: ReadonlyArray<Pick<RoomLayout, "color" | "prop">> = [
  { color: "teal", prop: "brain" },
  { color: "violet", prop: "terminal" },
  { color: "blue", prop: "calendar" },
  { color: "gold", prop: "desk" },
  { color: "coral", prop: "review" },
  { color: "green", prop: "commerce" },
  { color: "indigo", prop: "finance" },
  { color: "rose", prop: "archive" },
  { color: "cyan", prop: "terminal" },
];

type RoomAssignment = {
  room: RoomLayout;
  department: OfficeOverview["departments"][number];
  employees: OfficeEmployeeSummary[];
  zoneIndex: number;
  zoneCount: number;
};

type StationWorld = {
  rooms: RoomAssignment[];
  worldHeight: number;
  corridorYs: number[];
};

function effectiveStatus(status: OfficeEmployeeStatus, aiExecutionAvailable: boolean): StationStatus {
  if (!aiExecutionAvailable && (status === "WORKING" || status === "COLLABORATING" || status === "MONITORING")) return "BLOCKED";
  return status;
}

function toneForStatus(status: StationStatus): StatusTone {
  if (status === "BLOCKED") return "blocked";
  if (status === "OFFLINE") return "offline";
  if (status === "ERROR" || status === "WAITING_FOR_APPROVAL") return "attention";
  if (status === "WAITING" || status === "HUMAN_CONTROLLED") return "waiting";
  if (status === "MONITORING") return "monitoring";
  if (status === "WORKING" || status === "COLLABORATING") return "working";
  return "idle";
}

function statusLabel(status: StationStatus) {
  if (status === "BLOCKED") return "blocked — AI credit required";
  return status.replaceAll("_", " ").toLowerCase();
}

function isOnlineStatus(status: StationStatus) {
  return status === "WORKING" || status === "COLLABORATING" || status === "MONITORING";
}

function roomName({ department, zoneIndex, zoneCount }: Pick<RoomAssignment, "department" | "zoneIndex" | "zoneCount">) {
  return zoneCount > 1 ? `${department.name} · Room ${zoneIndex + 1}` : department.name;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "LU";
}

function roomHeight(employeeCount: number) {
  const rows = Math.max(1, Math.ceil(Math.max(employeeCount, 1) / ROOM_CREW_COLUMNS));
  return Math.max(ROOM_MIN_HEIGHT, ROOM_CREW_TOP + (rows - 1) * ROOM_CREW_ROW_PITCH + 52 + ROOM_CREW_BOTTOM);
}

function roomEmployees(overview: OfficeOverview | null): StationWorld {
  const departments = overview?.departments ?? [];
  const departmentZones = departments.flatMap((department) => {
    const zoneCount = Math.max(1, Math.ceil(department.employees.length / ROOM_ZONE_CAPACITY));
    return Array.from({ length: zoneCount }, (_, zoneIndex) => ({
      department,
      employees: department.employees.slice(zoneIndex * ROOM_ZONE_CAPACITY, (zoneIndex + 1) * ROOM_ZONE_CAPACITY),
      zoneIndex,
      zoneCount,
    }));
  });
  const rooms: RoomAssignment[] = [];
  const corridorYs: number[] = [];
  let rowY = WORLD_TOP;

  for (let firstRoom = 0; firstRoom < departmentZones.length; firstRoom += ROOM_COLUMNS) {
    const rowZones = departmentZones.slice(firstRoom, firstRoom + ROOM_COLUMNS);
    const rowHeight = Math.max(...rowZones.map((zone) => roomHeight(zone.employees.length)));
    corridorYs.push(rowY - ROOM_Y_GAP / 2);

    rowZones.forEach((zone, column) => {
      const theme = ROOM_THEMES[(firstRoom + column) % ROOM_THEMES.length];
      rooms.push({
        room: {
          id: `${zone.department.id}-${zone.zoneIndex + 1}`,
          x: 36 + column * (ROOM_WIDTH + ROOM_X_GAP),
          y: rowY,
          width: ROOM_WIDTH,
          height: rowHeight,
          ...theme,
        },
        ...zone,
      });
    });

    rowY += rowHeight + ROOM_Y_GAP;
  }

  return {
    rooms,
    corridorYs,
    worldHeight: Math.max(620, rowY - ROOM_Y_GAP + 68),
  };
}

function shortLabel(value: string, limit: number) {
  return value.length <= limit ? value : `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function StationCharacter({
  employee,
  aiExecutionAvailable,
  x,
  y,
  selected,
  onSelect,
}: {
  employee: OfficeEmployeeSummary;
  aiExecutionAvailable: boolean;
  x: number;
  y: number;
  selected: boolean;
  onSelect: (employee: OfficeEmployeeSummary) => void;
}) {
  const status = effectiveStatus(employee.status, aiExecutionAvailable);
  const tone = toneForStatus(status);
  const avatarVariant = Math.abs(Array.from(employee.key).reduce((sum, character) => sum + character.charCodeAt(0), 0)) % 4;
  const handleKeyDown = (event: React.KeyboardEvent<SVGGElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(employee);
    }
  };
  return (
    <g
      className={`lulu-station__character lulu-station__character--${tone} lulu-station__character--avatar-${avatarVariant}${selected ? " is-selected" : ""}`}
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      aria-label={`${employee.name}, ${employee.title}, ${statusLabel(status)}`}
      onClick={(event) => { event.stopPropagation(); onSelect(employee); }}
      onKeyDown={handleKeyDown}
    >
      <g className={`lulu-station__workstation lulu-station__workstation--${tone}`} aria-hidden="true">
        <ellipse className="lulu-station__workstation-shadow" cx="0" cy="51" rx="43" ry="10" />
        <rect className="lulu-station__workstation-surface" x="-43" y="34" width="86" height="14" rx="5" />
        <rect className="lulu-station__workstation-screen" x="20" y="12" width="21" height="20" rx="3" />
        <path className="lulu-station__workstation-screen-line" d="M24 20h12M24 25h8" />
        <path className="lulu-station__workstation-chair" d="M-15 52h30l-4 9h-22z" />
      </g>
      <ellipse className="lulu-station__character-shadow" cx="0" cy="43" rx="30" ry="8" />
      <path className="lulu-station__character-legs" d="M-11 21v21M11 21v21" />
      <rect className="lulu-station__character-body" x="-20" y="-1" width="40" height="32" rx="12" />
      <path className="lulu-station__character-arm lulu-station__character-arm--left" d="M-18 7l-13 12" />
      <path className="lulu-station__character-arm lulu-station__character-arm--right" d="M18 7l13 12" />
      <circle className="lulu-station__character-head" cx="0" cy="-18" r="16" />
      <path className="lulu-station__character-hair" d="M-15-17c1-14 27-19 32-1-4-4-8-5-13-3-5-3-12-1-19 4Z" />
      <path className="lulu-station__character-visor" d="M-9-18h18" />
      <circle className="lulu-station__character-status" cx="19" cy="-30" r="5" />
      <text className="lulu-station__character-initials" x="0" y="18" textAnchor="middle">{initials(employee.name)}</text>
      <text className="lulu-station__character-name" x="0" y="74" textAnchor="middle">{employee.name.split(" ")[0]}</text>
    </g>
  );
}

function StationProp({ room, active, onSelect }: { room: RoomLayout; active: boolean; onSelect: () => void }) {
  const propName = room.prop === "desk" ? "Work desk" : room.prop === "terminal" ? "Integration terminal" : room.prop === "archive" ? "Deliverables archive" : room.prop === "brain" ? "Company Brain core" : room.prop === "review" ? "Quality review station" : room.prop === "commerce" ? "Commerce inventory station" : room.prop === "calendar" ? "Communication calendar station" : "Finance billing terminal";
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
      {room.prop === "desk" || room.prop === "review" || room.prop === "finance" || room.prop === "calendar" ? <><rect className="lulu-station__prop-screen" x="22" y="-28" width="34" height="23" rx="3" /><path className="lulu-station__prop-screen-line" d="M28-17h21" /></> : null}
      {room.prop === "commerce" ? <><path className="lulu-station__prop-crate" d="M15-24h50v24H15zM15-16h50M31-24v24M49-24v24" /><circle className="lulu-station__prop-core-dot" cx="74" cy="-19" r="4" /></> : null}
      <text className="lulu-station__prop-label" x="40" y="58" textAnchor="middle">{room.prop === "archive" ? "OUTBOX" : room.prop === "brain" ? "BRAIN" : room.prop === "terminal" ? "SYNC" : room.prop === "review" ? "REVIEW" : room.prop === "commerce" ? "STOCK" : room.prop === "calendar" ? "COMMS" : room.prop === "finance" ? "LEDGER" : "WORK"}</text>
    </g>
  );
}

function RoomFixtures({ room }: { room: RoomLayout }) {
  return <g className="lulu-station__fixtures" aria-hidden="true">
    <rect className="lulu-station__ceiling-light" x={room.x + room.width / 2 - 46} y={room.y + 17} width="92" height="4" rx="2" />
    <rect className="lulu-station__window" x={room.x + room.width - 112} y={room.y + 22} width="68" height="23" rx="5" />
    <path className="lulu-station__window-line" d={`M${room.x + room.width - 78} ${room.y + 22}v23M${room.x + room.width - 112} ${room.y + 34}h68`} />
    <g className={`lulu-station__decor lulu-station__decor--${room.prop}`} transform={`translate(${room.x + 38} ${room.y + room.height - 42})`}>
      <path className="lulu-station__plant-pot" d="M0 0h22l-3 19H3z" />
      <path className="lulu-station__plant-leaf" d="M11 0C-5-18 2-28 11-13 13-31 25-27 18-9 34-22 38-10 20 3" />
    </g>
    <path className="lulu-station__floor-mark" d={`M${room.x + 22} ${room.y + room.height - 22}h${room.width - 44}`} />
  </g>;
}

function roomDescription(prop: RoomLayout["prop"]) {
  if (prop === "terminal") return "Provider connections and synchronized systems.";
  if (prop === "archive") return "Verified outputs, quality artifacts and attachments.";
  if (prop === "brain") return "Signals, missions, decisions and operating cycles.";
  if (prop === "review") return "Quality gates, verification evidence and recovery.";
  if (prop === "commerce") return "Catalog, inventory and customer-facing commerce operations.";
  if (prop === "calendar") return "Messages, meetings, schedules and coordinated follow-up.";
  if (prop === "finance") return "Billing, ledger state and guarded financial operations.";
  return "Active work items and specialist execution.";
}

function propTitle(prop: RoomLayout["prop"]) {
  if (prop === "archive") return "OUTBOX / Deliverables";
  if (prop === "brain") return "Company Brain core";
  if (prop === "terminal") return "Provider integration terminal";
  if (prop === "review") return "Quality review station";
  if (prop === "commerce") return "Commerce inventory station";
  if (prop === "calendar") return "Communication calendar station";
  if (prop === "finance") return "Finance ledger terminal";
  return "Work desk";
}

export function LuluStation() {
  const t = useTranslation();
  const navigate = useNavigate();
  const { selectedWorkspace } = useLuluApp();
  const workspaceId = selectedWorkspace?.id ?? null;
  const [overviewSnapshot, setOverviewSnapshot] = useState<{ workspaceId: string; data: OfficeOverview } | null>(null);
  const [employeeDetailSnapshot, setEmployeeDetailSnapshot] = useState<{ workspaceId: string; employeeId: string; data: OfficeEmployeeDetails } | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedProp, setSelectedProp] = useState<RoomLayout["prop"] | null>(null);
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  const [departmentQuery, setDepartmentQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveConnected, setLiveConnected] = useState(false);
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);
  const closeModalRef = useRef<HTMLButtonElement | null>(null);
  const focusBeforeEmployeeModalRef = useRef<HTMLElement | null>(null);
  const overviewRequestRef = useRef(0);
  const employeeRequestRef = useRef(0);
  const overview = overviewSnapshot?.workspaceId === workspaceId ? overviewSnapshot.data : null;
  const employeeDetail = employeeDetailSnapshot?.workspaceId === workspaceId && employeeDetailSnapshot.employeeId === selectedEmployeeId
    ? employeeDetailSnapshot.data
    : null;

  const loadOverview = useCallback(async (background = false) => {
    if (!workspaceId) return;
    const requestId = ++overviewRequestRef.current;
    const isCurrentRequest = () => requestId === overviewRequestRef.current;
    if (background) setRefreshing(true); else setLoading(true);
    try {
      const response = await officeApi.overview(workspaceId);
      if (!isCurrentRequest()) return;
      setOverviewSnapshot({ workspaceId, data: response.data });
      setError(null);
    } catch (cause) {
      if (!isCurrentRequest()) return;
      setError(getFriendlyErrorMessage(cause));
    } finally {
      if (!isCurrentRequest()) return;
      if (background) setRefreshing(false);
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    overviewRequestRef.current += 1;
    employeeRequestRef.current += 1;
    setOverviewSnapshot(null);
    setEmployeeDetailSnapshot(null);
    setSelectedEmployeeId(null);
    setEmployeeLoading(false);
    setSelectedRoomId(null);
    setSelectedProp(null);
    setError(null);
    setLiveConnected(false);
    setLastEventAt(null);
    if (!workspaceId) {
      setLoading(false);
      setRefreshing(false);
      return undefined;
    }
    void loadOverview();
    const interval = window.setInterval(() => void loadOverview(true), 30_000);
    return () => {
      overviewRequestRef.current += 1;
      employeeRequestRef.current += 1;
      window.clearInterval(interval);
    };
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
    const requestId = ++employeeRequestRef.current;
    const isCurrentRequest = () => requestId === employeeRequestRef.current;
    focusBeforeEmployeeModalRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedEmployeeId(employee.id);
    setEmployeeDetailSnapshot(null);
    setEmployeeLoading(true);
    setSelectedRoomId(null);
    setSelectedProp(null);
    try {
      const response = await officeApi.employee(workspaceId, employee.id);
      if (!isCurrentRequest()) return;
      setEmployeeDetailSnapshot({ workspaceId, employeeId: employee.id, data: response.data });
      setError(null);
    } catch (cause) {
      if (!isCurrentRequest()) return;
      setError(getFriendlyErrorMessage(cause));
    } finally {
      if (isCurrentRequest()) setEmployeeLoading(false);
    }
  }, [workspaceId]);

  const closeEmployeePopup = useCallback(() => {
    employeeRequestRef.current += 1;
    const focusTarget = focusBeforeEmployeeModalRef.current;
    setSelectedEmployeeId(null);
    setEmployeeDetailSnapshot(null);
    setEmployeeLoading(false);
    window.requestAnimationFrame(() => {
      if (focusTarget?.isConnected) focusTarget.focus();
    });
  }, []);

  const selectRoom = useCallback((roomId: string, prop: RoomProp | null = null) => {
    employeeRequestRef.current += 1;
    setSelectedRoomId(roomId);
    setSelectedProp(prop);
    setSelectedEmployeeId(null);
    setEmployeeDetailSnapshot(null);
    setDepartmentMenuOpen(false);
    setDepartmentQuery("");
    window.requestAnimationFrame(() => {
      document.getElementById(`lulu-station-room-${roomId}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    });
  }, []);

  useEffect(() => {
    if (!selectedEmployeeId) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeEmployeePopup();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeEmployeePopup, selectedEmployeeId]);

  useEffect(() => {
    if (!selectedEmployeeId) return undefined;
    const frame = window.requestAnimationFrame(() => closeModalRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [selectedEmployeeId]);

  const trapEmployeeModalFocus = useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.offsetParent !== null);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement);
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && currentIndex <= 0) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (currentIndex === focusable.length - 1 || currentIndex === -1)) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const openWorkspace = useCallback(() => navigate(routes.app.dashboard), [navigate]);

  const stationWorld = useMemo(() => roomEmployees(overview), [overview]);
  const rooms = stationWorld.rooms;
  const selectedRoom = rooms.find(({ room }) => room.id === selectedRoomId) ?? null;
  const filteredRooms = useMemo(() => {
    const query = departmentQuery.trim().toLocaleLowerCase();
    if (!query) return rooms;
    return rooms.filter(({ department }) => `${department.name} ${department.description}`.toLocaleLowerCase().includes(query));
  }, [departmentQuery, rooms]);
  const openSignals = overview?.companyBrain?.signals.filter((signal) => signal.status === "OPEN").length ?? 0;
  const aiExecutionAvailable = overview?.executionReadiness?.ai.available ?? true;
  const allEmployees = overview?.departments.flatMap((department) => department.employees) ?? [];
  const onlineEmployees = allEmployees.filter((employee) => isOnlineStatus(effectiveStatus(employee.status, aiExecutionAvailable))).length;
  const blockedEmployees = allEmployees.filter((employee) => effectiveStatus(employee.status, aiExecutionAvailable) === "BLOCKED").length;
  const queuedOrWaitingWork = (overview?.summary.queuedWorkItems ?? 0) + (overview?.summary.waitingWorkItems ?? 0);
  const attentionCount = (overview?.summary.attentionEmployees ?? 0) + openSignals + blockedEmployees;
  const aiExecutionMessage = overview?.executionReadiness?.ai.reason === "AI_CREDIT_RECONCILIATION_REQUIRED"
    ? "AI credit reconciliation required"
    : "AI credit required";
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
        </div>
        <div className="lulu-station__header-actions">
          <span className={`lulu-station__connection${liveConnected ? " is-live" : ""}`}><i />{liveConnected ? "Live events" : "Verified snapshot"}</span>
          <button type="button" className="lulu-station__workspace-switch" onClick={openWorkspace}><LayoutDashboard size={15} />{t("Open workspace")}</button>
          <button type="button" className="lulu-station__refresh" onClick={() => void loadOverview(true)} disabled={refreshing}><RefreshCw size={15} className={refreshing ? "lulu-station__spin" : undefined} />{t("Refresh")}</button>
        </div>
      </header>

      <div className="lulu-station__metrics" aria-label="Station summary">
        <div className={!aiExecutionAvailable ? "is-blocked" : ""}><span><Zap size={14} />{aiExecutionAvailable ? "Work in motion" : "AI execution"}</span><strong>{aiExecutionAvailable ? (overview.summary.runningWorkItems ?? 0) : 0}</strong><small>{aiExecutionAvailable ? (queuedOrWaitingWork > 0 ? `${queuedOrWaitingWork} ${t("queued or awaiting review")}` : t("No work is waiting in the queue")) : `${overview.summary.activeWorkItems} work items queued safely`}</small></div>
        <div><span><Layers3 size={14} />Crew online</span><strong>{onlineEmployees}</strong><small>{!aiExecutionAvailable ? aiExecutionMessage : `${overview.summary.employeeCount} employees assigned`}</small></div>
        <div className={attentionCount > 0 ? "is-attention" : ""}><span><Target size={14} />Needs attention</span><strong>{attentionCount}</strong><small>{openSignals} open Company Brain signals</small></div>
        <div><span><CheckCircle2 size={14} />Verified outcomes</span><strong>{overview.summary.completedToday}</strong><small>recently completed work items</small></div>
      </div>

      <div className="lulu-station__workspace">
        <div className="lulu-station__world-shell">
          <div className="lulu-station__world-toolbar"><span><i className="lulu-station__toolbar-dot" />Station map</span><small>{overview.summary.departmentCount} departments · {rooms.length} rooms · {formatTime(overview.generatedAt)} snapshot</small></div>
          {rooms.length > 0 ? <div className="lulu-station__department-nav">
            <div className="lulu-station__department-picker">
              <button type="button" className="lulu-station__department-trigger" aria-haspopup="listbox" aria-expanded={departmentMenuOpen} aria-controls="lulu-station-department-list" onClick={() => setDepartmentMenuOpen((open) => !open)}><span>{selectedRoom ? roomName(selectedRoom) : "Station map"}</span><i /></button>
              {departmentMenuOpen ? <div className="lulu-station__department-menu">
                <div className="lulu-station__department-search"><Search size={14} aria-hidden="true" /><input autoFocus aria-label="Station map" placeholder="Station map" value={departmentQuery} onChange={(event) => setDepartmentQuery(event.target.value)} /></div>
                <div id="lulu-station-department-list" className="lulu-station__department-options" role="listbox" aria-label="Station map">
                  {filteredRooms.map((assignment) => <button key={assignment.room.id} type="button" role="option" aria-selected={assignment.room.id === selectedRoomId} onClick={() => selectRoom(assignment.room.id)}><span>{roomName(assignment)}</span><small>{assignment.employees.length} CREW</small></button>)}
                </div>
              </div> : null}
            </div>
            <span>{overview.summary.departmentCount} departments · {rooms.length} rooms</span>
          </div> : null}
          <div className="lulu-station__world" role="region" aria-label="Lulu Station map with departments and digital employees">
            <svg viewBox={`0 0 ${WORLD_WIDTH} ${stationWorld.worldHeight}`} role="presentation">
              <defs>
                <linearGradient id="station-shell" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#182a3c" /><stop offset="1" stopColor="#0b1524" /></linearGradient>
                <linearGradient id="station-core" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#47e4d0" stopOpacity=".34" /><stop offset="1" stopColor="#7568ff" stopOpacity=".12" /></linearGradient>
                <pattern id="station-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#6ba5c3" strokeOpacity=".09" /></pattern>
                <filter id="station-glow"><feGaussianBlur stdDeviation="9" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <rect x="0" y="0" width={WORLD_WIDTH} height={stationWorld.worldHeight} rx="24" fill="url(#station-shell)" />
              <rect x="0" y="0" width={WORLD_WIDTH} height={stationWorld.worldHeight} rx="24" fill="url(#station-grid)" />
              <path className="lulu-station__spine" d={`M720 102V${stationWorld.worldHeight - 32}M252 ${WORLD_TOP}V${stationWorld.worldHeight - 32}M1188 ${WORLD_TOP}V${stationWorld.worldHeight - 32}`} />
              <path className="lulu-station__corridor" d={`M720 102V${stationWorld.worldHeight - 32}M252 ${WORLD_TOP}V${stationWorld.worldHeight - 32}M1188 ${WORLD_TOP}V${stationWorld.worldHeight - 32}`} />
              <path className="lulu-station__corridor-glow" d={`M720 102V${stationWorld.worldHeight - 32}M252 ${WORLD_TOP}V${stationWorld.worldHeight - 32}M1188 ${WORLD_TOP}V${stationWorld.worldHeight - 32}`} />
              {stationWorld.corridorYs.map((y) => <path key={`spine-${y}`} className="lulu-station__spine" d={`M36 ${y}H1404`} />)}
              {stationWorld.corridorYs.map((y) => <path key={`corridor-${y}`} className="lulu-station__corridor" d={`M36 ${y}H1404`} />)}
              {stationWorld.corridorYs.map((y) => <path key={`glow-${y}`} className="lulu-station__corridor-glow" d={`M36 ${y}H1404`} />)}
              <g className="lulu-station__core" transform="translate(720 48)" aria-hidden="true">
                <circle className="lulu-station__core-halo" r="54" filter="url(#station-glow)" />
                <circle className="lulu-station__core-orbit" r="39" />
                <circle className="lulu-station__core-center" r="22" fill="url(#station-core)" />
                <path d="M-7 0h14M0-7v14" />
                <text x="0" y="58" textAnchor="middle">LULU CORE</text>
              </g>
              {rooms.map((assignment) => {
                const { room, department, employees } = assignment;
                const roomSelected = room.id === selectedRoomId;
                const roomHasFlow = employees.some((employee) => effectiveStatus(employee.status, aiExecutionAvailable) === "COLLABORATING");
                const label = roomName(assignment);
                return <g id={`lulu-station-room-${room.id}`} key={room.id} className={`lulu-station__room lulu-station__room--${room.color}${roomSelected ? " is-selected" : ""}`} role="button" tabIndex={0} aria-label={`${label} department room`} onClick={() => selectRoom(room.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectRoom(room.id); } }}>
                  <rect className="lulu-station__room-floor" x={room.x} y={room.y} width={room.width} height={room.height} rx="18" />
                  <path className="lulu-station__room-inner-floor" d={`M${room.x + 15} ${room.y + 72}h${room.width - 30}v${room.height - 88}H${room.x + 15}z`} />
                  <RoomFixtures room={room} />
                  <path className="lulu-station__room-border" d={`M${room.x + 18} ${room.y}H${room.x + room.width - 18}Q${room.x + room.width} ${room.y} ${room.x + room.width} ${room.y + 18}V${room.y + room.height - 18}Q${room.x + room.width} ${room.y + room.height} ${room.x + room.width - 18} ${room.y + room.height}H${room.x + 18}Q${room.x} ${room.y + room.height} ${room.x} ${room.y + room.height - 18}V${room.y + 18}Q${room.x} ${room.y} ${room.x + 18} ${room.y}Z`} />
                  <text className="lulu-station__room-kicker" x={room.x + 22} y={room.y + 31}><title>{label}</title>{shortLabel(label.toUpperCase(), 31)}</text>
                  <text className="lulu-station__room-caption" x={room.x + 22} y={room.y + 52}><title>{department.description}</title>{shortLabel(department.description, 56)}</text>
                  <text className="lulu-station__room-count" x={room.x + room.width - 22} y={room.y + 32} textAnchor="end">{employees.length} CREW</text>
                  {roomHasFlow ? <path className="lulu-station__handoff-active" d={`M${room.x + room.width / 2 - 32} ${room.y + room.height - 15}h64`} /> : null}
                  <StationProp room={room} active={employees.some((employee) => isOnlineStatus(effectiveStatus(employee.status, aiExecutionAvailable)))} onSelect={() => selectRoom(room.id, room.prop)} />
                  {employees.map((employee, index) => <StationCharacter key={employee.id} employee={employee} aiExecutionAvailable={aiExecutionAvailable} x={room.x + 130 + (index % ROOM_CREW_COLUMNS) * 148} y={room.y + ROOM_CREW_TOP + Math.floor(index / ROOM_CREW_COLUMNS) * ROOM_CREW_ROW_PITCH} selected={employee.id === selectedEmployeeId} onSelect={(selected) => void selectEmployee(selected)} />)}
                  {employees.length === 0 && <text className="lulu-station__room-empty" x={room.x + room.width / 2} y={room.y + room.height / 2} textAnchor="middle">No crew assigned to this room</text>}
                </g>;
              })}
              {rooms.length === 0 && <g><rect className="lulu-station__empty-world" x="120" y="180" width="1200" height="280" rx="24" /><text x="720" y="310" textAnchor="middle">No department roster is available for this workspace.</text><text x="720" y="340" textAnchor="middle">The station is waiting for verified workspace setup.</text></g>}
            </svg>
          </div>
          <div className="lulu-station__legend" aria-label="Station status legend">
            <span><i className="is-working" />working</span><span><i className="is-monitoring" />monitoring</span><span><i className="is-waiting" />waiting / human control</span><span><i className="is-attention" />approval / error</span><span><i className="is-blocked" />AI credit required</span><span><i className="is-idle" />idle</span><span><i className="is-offline" />offline</span>
          </div>
        </div>

        <aside className="lulu-station__inspector" aria-label="Station inspector">
          {employeeDetail ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__avatar-badge">{initials(employeeDetail.employee.name)}</span><span>Digital Employee</span><button type="button" onClick={closeEmployeePopup} aria-label="Close employee inspector">×</button></div>
            <h2>{employeeDetail.employee.name}</h2>
            <p className="lulu-station__inspector-role">{employeeDetail.employee.title} · {employeeDetail.employee.department?.name}</p>
            <div className={`lulu-station__inspector-status lulu-station__inspector-status--${toneForStatus(effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable))}`}><i />{statusLabel(effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable))}</div>
            <div className="lulu-station__inspector-block"><span>Current work</span><strong>{effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable) === "BLOCKED" ? "Execution is paused until AI credit is available" : employeeDetail.currentWorkItem?.title ?? "No current work item"}</strong><small>{effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable) === "BLOCKED" ? aiExecutionMessage : employeeDetail.currentWorkItem?.status ?? "The employee is not running a visible work item."}</small></div>
            <div className="lulu-station__inspector-stats"><div><strong>{employeeDetail.workSummary.active}</strong><span>active</span></div><div><strong>{employeeDetail.workSummary.completedToday}</strong><span>completed</span></div><div><strong>{employeeDetail.workSummary.failed}</strong><span>failed</span></div></div>
            <div className="lulu-station__inspector-block"><span>Capabilities</span><div className="lulu-station__chips">{employeeDetail.capabilities.slice(0, 8).map((capability) => <span key={capability.key}>{capability.key}</span>)}</div></div>
          </> : selectedRoom ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__room-badge"><Layers3 size={16} /></span><span>Department room</span></div>
            <h2>{roomName(selectedRoom)}</h2>
            <p className="lulu-station__inspector-role">{selectedRoom.department.description}</p>
            <div className="lulu-station__inspector-block"><span>Room function</span><strong>{roomDescription(selectedRoom.room.prop)}</strong><small>{selectedRoom.employees.length} employees at dedicated stations{selectedRoom.zoneCount > 1 ? ` · Room ${selectedRoom.zoneIndex + 1} of ${selectedRoom.zoneCount}` : ""}.</small></div>
            <div className="lulu-station__crew-list">{selectedRoom.employees.map((employee) => <button type="button" key={employee.id} onClick={() => void selectEmployee(employee)}><span className={`lulu-station__mini-dot lulu-station__mini-dot--${toneForStatus(effectiveStatus(employee.status, aiExecutionAvailable))}`} /><span><strong>{employee.name}</strong><small>{statusLabel(effectiveStatus(employee.status, aiExecutionAvailable))}</small></span><ArrowUpRight size={13} /></button>)}</div>
          </> : selectedProp ? <>
            <div className="lulu-station__inspector-kicker"><span className="lulu-station__room-badge"><Zap size={16} /></span><span>Functional object</span></div>
            <h2>{propTitle(selectedProp)}</h2>
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

      {selectedEmployeeId ? <div className="lulu-station__modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEmployeePopup(); }}>
        <section className="lulu-station__employee-modal lulu-station__employee-modal--workspace" role="dialog" aria-modal="true" aria-labelledby="lulu-station-employee-title" onKeyDown={trapEmployeeModalFocus}>
          <button ref={closeModalRef} type="button" className="lulu-station__modal-close" onClick={closeEmployeePopup} aria-label="Close employee workspace">×</button>
          {employeeLoading || !employeeDetail ? <div className="lulu-station__modal-loading"><RefreshCw className="lulu-station__spin" size={22} /><strong>Opening verified employee workspace…</strong><span>Loading the employee state and recent evidence.</span></div> : <>
            <header className="lulu-station__modal-header">
              <div className={`lulu-station__modal-avatar lulu-station__modal-avatar--${toneForStatus(effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable))}`}><span>{initials(employeeDetail.employee.name)}</span><i /></div>
              <div><span className="lulu-station__modal-kicker">DIGITAL EMPLOYEE WORKSPACE</span><h2 id="lulu-station-employee-title">{employeeDetail.employee.name}</h2><p>{employeeDetail.employee.title} · {employeeDetail.employee.department?.name ?? "Lulu Station"}</p></div>
              <div className={`lulu-station__modal-status lulu-station__modal-status--${toneForStatus(effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable))}`}><i />{statusLabel(effectiveStatus(employeeDetail.employee.status, aiExecutionAvailable))}</div>
            </header>
            <div className="lulu-station__modal-body">
              <AgentNativeWorkspace workspaceId={workspaceId} employeeDetail={employeeDetail} />
              <div className="lulu-station__modal-details">
                <div className="lulu-station__modal-section"><span className="lulu-station__modal-label">CURRENT WORK</span><strong>{employeeDetail.currentWorkItem?.title ?? "No current work item"}</strong><p>{employeeDetail.currentWorkItem?.objective ?? "This employee has no active work item in the verified office projection."}</p><small>{employeeDetail.currentWorkItem?.status ?? "No active work"}{employeeDetail.currentWorkItem?.relatedObjectType ? ` · ${employeeDetail.currentWorkItem.relatedObjectType}` : ""}</small></div>
                <div className="lulu-station__modal-stats"><div><strong>{employeeDetail.workSummary.active}</strong><span>active</span></div><div><strong>{employeeDetail.workSummary.completedToday}</strong><span>completed today</span></div><div><strong>{employeeDetail.workSummary.failed}</strong><span>failed</span></div></div>
                <div className="lulu-station__modal-section"><span className="lulu-station__modal-label">RECENT EVIDENCE</span><div className="lulu-station__modal-timeline">{employeeDetail.recentTimeline.slice(0, 4).map((item) => <div key={item.id}><i /><span><strong>{item.title}</strong><small>{item.type} · {formatTime(item.occurredAt)}</small></span></div>)}{employeeDetail.recentTimeline.length === 0 ? <p>No recent employee events are available.</p> : null}</div></div>
                <div className="lulu-station__modal-section"><span className="lulu-station__modal-label">CAPABILITIES</span><div className="lulu-station__modal-chips">{employeeDetail.capabilities.slice(0, 8).map((capability) => <span key={capability.key}>{capability.key}</span>)}</div></div>
              </div>
            </div>
            <footer className="lulu-station__modal-footer"><span><ShieldCheck size={14} />Workspace-scoped verified state</span><button type="button" className="lulu-station__inspector-link" onClick={openWorkspace}><LayoutDashboard size={14} />{t("Open workspace")}</button></footer>
          </>}
        </section>
      </div> : null}
    </section>
  );
}
