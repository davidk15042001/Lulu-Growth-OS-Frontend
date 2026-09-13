import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { authApi, type CurrentUser } from "./auth";
import { ApiError } from "./client";
import { clearSelectedWorkspaceId, clearStoredUser, getSelectedWorkspaceId, getStoredUser, setSelectedWorkspaceId, setStoredUser } from "./session";
import { workspaceApi, type EffectiveEntitlement } from "./workspaces";
import type { Workspace, WorkspaceRole } from "./types";

type PermissionStatus = "unknown" | "loading" | "ready" | "unavailable";
type Permissions = { role: WorkspaceRole | null; canEdit: boolean; canAdminister: boolean; capabilities: string[]; status: PermissionStatus };
type AppValue = { currentUser: CurrentUser | null; workspaces: Workspace[]; selectedWorkspace: Workspace | null; permissions: Permissions; capabilities: { aiGeneration: boolean; transactionalEmail: boolean }; entitlements: Record<string, EffectiveEntitlement>; loading: boolean; error: string | null; refresh: () => Promise<void>; selectWorkspace: (id: string) => void; updateWorkspace: (workspace: Workspace) => void; can: (permission: "edit" | "administer") => boolean; hasCapability: (capability: string) => boolean };
const emptyPermissions = (role: WorkspaceRole | null = null, status: PermissionStatus = "unknown"): Permissions => ({ role, canEdit: false, canAdminister: false, capabilities: [], status });
const empty = emptyPermissions();
const Context = createContext<AppValue | null>(null);
const permissionsFromBootstrap = (input: { role: WorkspaceRole; canEdit: boolean; canAdminister: boolean; capabilities: string[] }): Permissions => ({
  role: input.role,
  canEdit: input.canEdit,
  canAdminister: input.canAdminister,
  capabilities: [...input.capabilities],
  status: "ready",
});

export function LuluAppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getStoredUser<CurrentUser>());
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getSelectedWorkspaceId());
  const selectedIdRef = useRef<string | null>(selectedId);
  const requestGenerationRef = useRef(0);
  const activeRequestRef = useRef<AbortController | null>(null);
  const [permissions, setPermissions] = useState<Permissions>(empty);
  const [capabilities, setCapabilities] = useState({ aiGeneration: false, transactionalEmail: false });
  const [entitlements, setEntitlements] = useState<Record<string, EffectiveEntitlement>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    const requestGeneration = ++requestGenerationRef.current;
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    setLoading(true); setError(null);
    setEntitlements({});
    setCapabilities({ aiGeneration: false, transactionalEmail: false });
    setPermissions((current) => emptyPermissions(current.role, "loading"));
    try {
      // Restore the authenticated user first. Requesting workspaces in parallel with
      // `/auth/me` caused both requests to race through refresh-token rotation after a reload.
      const user = await authApi.me();
      if (requestGeneration !== requestGenerationRef.current) return;
      setCurrentUser(user.data);
      setStoredUser(user.data);

      try {
        let result;
        try {
          result = await workspaceApi.list(controller.signal);
        } catch (firstWorkspaceError) {
          if (firstWorkspaceError instanceof ApiError && firstWorkspaceError.status === 401) throw firstWorkspaceError;
          await new Promise((resolve) => window.setTimeout(resolve, 350));
          if (requestGeneration !== requestGenerationRef.current) return;
          result = await workspaceApi.list(controller.signal);
        }
        if (requestGeneration !== requestGenerationRef.current) return;
        setWorkspaces(result.data.items);
        const savedSelectedId = selectedIdRef.current;
        const id = savedSelectedId && result.data.items.some((item) => item.id === savedSelectedId) ? savedSelectedId : result.data.items[0]?.id ?? null;
        if (id !== selectedIdRef.current) {
          if (id) setSelectedWorkspaceId(id); else clearSelectedWorkspaceId();
          selectedIdRef.current = id;
          setSelectedId(id);
        }
        const selected = result.data.items.find((item) => item.id === id);
        setPermissions(emptyPermissions(selected?.role ?? null, id ? "loading" : "ready"));
        try {
          const bootstrapResult = id ? await workspaceApi.bootstrap(id, controller.signal) : null;
          if (requestGeneration !== requestGenerationRef.current) return;
          const effective = bootstrapResult?.data.entitlements ?? {};
          setEntitlements(effective);
          setPermissions(bootstrapResult ? permissionsFromBootstrap(bootstrapResult.data.permissions) : emptyPermissions(null, "ready"));
          setCapabilities(bootstrapResult
            ? { aiGeneration: bootstrapResult.data.capabilities.aiGeneration, transactionalEmail: bootstrapResult.data.capabilities.transactionalEmail }
            : { aiGeneration: false, transactionalEmail: false });
        } catch {
          if (requestGeneration !== requestGenerationRef.current) return;
          // The workspace remains usable during a rolling deployment; backend
          // authorization remains authoritative when the endpoint is unavailable.
          // Mutation controls stay disabled until permissions are known.
          setEntitlements({});
          setPermissions(emptyPermissions(selected?.role ?? null, "unavailable"));
          setCapabilities({ aiGeneration: false, transactionalEmail: false });
        }
      } catch (workspaceCause) {
        if (workspaceCause instanceof ApiError && workspaceCause.status === 401) {
          // The user session is valid; do not turn a workspace/API problem into a logout loop.
          setWorkspaces([]); setPermissions(emptyPermissions()); setEntitlements({}); setCapabilities({ aiGeneration: false, transactionalEmail: false });
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        } else {
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        }
      }
    } catch (cause) {
      if (requestGeneration !== requestGenerationRef.current) return;
      if (cause instanceof ApiError && (cause.status === 401 || cause.code === 'SESSION_REFRESH_UNAVAILABLE' || cause.code === 'ACCOUNT_UNVERIFIED' || cause.code === 'ACCOUNT_DELETED')) { clearStoredUser(); clearSelectedWorkspaceId(); selectedIdRef.current = null; setSelectedId(null); setCurrentUser(null); setWorkspaces([]); setPermissions(emptyPermissions()); setEntitlements({}); setCapabilities({ aiGeneration: false, transactionalEmail: false }); setError(null); }
      else setError("Your session could not be restored. Please sign in again.");
    } finally {
      if (requestGeneration === requestGenerationRef.current) {
        setLoading(false);
        if (activeRequestRef.current === controller) activeRequestRef.current = null;
      }
    }
  }, []);
  useEffect(() => {
    void refresh();
    return () => { requestGenerationRef.current += 1; activeRequestRef.current?.abort(); };
  }, [refresh]);
  const selectedWorkspace = useMemo(() => workspaces.find((item) => item.id === selectedId) ?? null, [selectedId, workspaces]);
  const selectWorkspace = useCallback((id: string) => {
    const workspace = workspaces.find((item) => item.id === id);
    if (!workspace || id === selectedIdRef.current && permissions.status === "ready") return;
    const requestGeneration = ++requestGenerationRef.current;
    activeRequestRef.current?.abort();
    const controller = new AbortController();
    activeRequestRef.current = controller;
    setLoading(false);
    setSelectedWorkspaceId(id);
    selectedIdRef.current = id;
    setSelectedId(id);
    setEntitlements({});
    setCapabilities({ aiGeneration: false, transactionalEmail: false });
    setPermissions(emptyPermissions(workspace.role, "loading"));
    void workspaceApi.bootstrap(id, controller.signal).then((result) => {
      if (requestGeneration !== requestGenerationRef.current || selectedIdRef.current !== id) return;
      setEntitlements(result.data.entitlements);
      setPermissions(permissionsFromBootstrap(result.data.permissions));
      setCapabilities({ aiGeneration: result.data.capabilities.aiGeneration, transactionalEmail: result.data.capabilities.transactionalEmail });
    }).catch(() => {
      if (requestGeneration !== requestGenerationRef.current || selectedIdRef.current !== id) return;
      setPermissions(emptyPermissions(workspace.role, "unavailable"));
    }).finally(() => {
      if (activeRequestRef.current === controller) activeRequestRef.current = null;
    });
  }, [permissions.status, workspaces]);
  const updateWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((current) => current.map((item) => item.id === workspace.id ? workspace : item));
    if (selectedIdRef.current === workspace.id) setPermissions((current) => ({ ...current, role: workspace.role }));
  }, []);
  const value = useMemo<AppValue>(() => ({ currentUser, workspaces, selectedWorkspace, permissions, capabilities, entitlements, loading, error, refresh, selectWorkspace, updateWorkspace, can: (permission) => permission === "edit" ? permissions.canEdit : permissions.canAdminister, hasCapability: (capability) => permissions.capabilities.includes(capability) }), [currentUser, workspaces, selectedWorkspace, permissions, capabilities, entitlements, loading, error, refresh, selectWorkspace, updateWorkspace]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLuluApp() { const value = useContext(Context); if (!value) throw new Error("useLuluApp must be used within LuluAppProvider"); return value; }
