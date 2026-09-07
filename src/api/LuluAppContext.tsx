import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { authApi, type CurrentUser } from "./auth";
import { ApiError } from "./client";
import { clearStoredUser, getSelectedWorkspaceId, getStoredUser, setSelectedWorkspaceId, setStoredUser } from "./session";
import { workspaceApi, workspaceFoundationApi, type EffectiveEntitlement } from "./workspaces";
import type { Workspace, WorkspaceRole } from "./types";

type Permissions = { role: WorkspaceRole | null; canEdit: boolean; canAdminister: boolean };
type AppValue = { currentUser: CurrentUser | null; workspaces: Workspace[]; selectedWorkspace: Workspace | null; permissions: Permissions; capabilities: { aiGeneration: boolean; transactionalEmail: boolean }; entitlements: Record<string, EffectiveEntitlement>; loading: boolean; error: string | null; refresh: () => Promise<void>; selectWorkspace: (id: string) => void; updateWorkspace: (workspace: Workspace) => void; can: (permission: "edit" | "administer") => boolean };
const empty: Permissions = { role: null, canEdit: false, canAdminister: false };
const Context = createContext<AppValue | null>(null);
const permissionsFor = (workspace: Workspace | undefined, effective?: Record<string, EffectiveEntitlement>): Permissions => workspace ? { role: workspace.role, canEdit: workspace.role !== "viewer" && effective?.["workspace.write"]?.enabled !== false, canAdminister: ["owner", "admin"].includes(workspace.role) && effective?.["workspace.write"]?.enabled !== false } : empty;

export function LuluAppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getStoredUser<CurrentUser>());
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getSelectedWorkspaceId());
  const selectedIdRef = useRef<string | null>(selectedId);
  const [permissions, setPermissions] = useState<Permissions>(empty);
  const [capabilities, setCapabilities] = useState({ aiGeneration: false, transactionalEmail: false });
  const [entitlements, setEntitlements] = useState<Record<string, EffectiveEntitlement>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Restore the authenticated user first. Requesting workspaces in parallel with
      // `/auth/me` caused both requests to race through refresh-token rotation after a reload.
      const user = await authApi.me();
      setCurrentUser(user.data);
      setStoredUser(user.data);

      try {
        let result;
        try {
          result = await workspaceApi.list();
        } catch (firstWorkspaceError) {
          if (firstWorkspaceError instanceof ApiError && firstWorkspaceError.status === 401) throw firstWorkspaceError;
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          result = await workspaceApi.list();
        }
        setWorkspaces(result.data.items);
        const savedSelectedId = selectedIdRef.current;
        const id = savedSelectedId && result.data.items.some((item) => item.id === savedSelectedId) ? savedSelectedId : result.data.items[0]?.id ?? null;
        if (id && id !== selectedIdRef.current) { setSelectedWorkspaceId(id); selectedIdRef.current = id; setSelectedId(id); }
        setPermissions(permissionsFor(result.data.items.find((item) => item.id === id)));
        try {
          const entitlementResult = id ? await workspaceFoundationApi.entitlements(id) : null;
          const effective = entitlementResult?.data ?? {};
          setEntitlements(effective);
          setPermissions(permissionsFor(result.data.items.find((item) => item.id === id), effective));
          setCapabilities({ aiGeneration: entitlementResult?.data?.["ai.enabled"]?.enabled !== false, transactionalEmail: true });
        } catch {
          // The workspace remains usable during a rolling deployment; backend
          // authorization remains authoritative when the endpoint is unavailable.
          setEntitlements({});
          setCapabilities({ aiGeneration: true, transactionalEmail: true });
        }
      } catch (workspaceCause) {
        if (workspaceCause instanceof ApiError && workspaceCause.status === 401) {
          // The user session is valid; do not turn a workspace/API problem into a logout loop.
          setWorkspaces([]); setPermissions(empty); setEntitlements({}); setCapabilities({ aiGeneration: false, transactionalEmail: false });
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        } else {
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        }
      }
    } catch (cause) {
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === 'SESSION_REFRESH_UNAVAILABLE' || cause.code === 'ACCOUNT_UNVERIFIED' || cause.code === 'ACCOUNT_DELETED')) { clearStoredUser(); setCurrentUser(null); setWorkspaces([]); setPermissions(empty); setEntitlements({}); setCapabilities({ aiGeneration: false, transactionalEmail: false }); setError(null); }
      else setError("Your session could not be restored. Please sign in again.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const selectedWorkspace = useMemo(() => workspaces.find((item) => item.id === selectedId) ?? null, [selectedId, workspaces]);
  const selectWorkspace = useCallback((id: string) => { const workspace = workspaces.find((item) => item.id === id); if (!workspace) return; setSelectedWorkspaceId(id); selectedIdRef.current = id; setSelectedId(id); setPermissions(permissionsFor(workspace)); void workspaceFoundationApi.entitlements(id).then((result) => { setEntitlements(result.data); setPermissions(permissionsFor(workspace, result.data)); setCapabilities((current) => ({ ...current, aiGeneration: result.data["ai.enabled"]?.enabled !== false })); }).catch(() => undefined); }, [workspaces]);
  const updateWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((current) => current.map((item) => item.id === workspace.id ? workspace : item));
    if (selectedIdRef.current === workspace.id) setPermissions(permissionsFor(workspace, entitlements));
  }, [entitlements]);
  const value = useMemo<AppValue>(() => ({ currentUser, workspaces, selectedWorkspace, permissions, capabilities, entitlements, loading, error, refresh, selectWorkspace, updateWorkspace, can: (permission) => permission === "edit" ? permissions.canEdit : permissions.canAdminister }), [currentUser, workspaces, selectedWorkspace, permissions, capabilities, entitlements, loading, error, refresh, selectWorkspace, updateWorkspace]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLuluApp() { const value = useContext(Context); if (!value) throw new Error("useLuluApp must be used within LuluAppProvider"); return value; }
