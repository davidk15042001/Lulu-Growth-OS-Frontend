import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { authApi, type CurrentUser } from "./auth";
import { ApiError } from "./client";
import { clearStoredUser, getSelectedWorkspaceId, getStoredUser, setSelectedWorkspaceId, setStoredUser } from "./session";
import { workspaceApi } from "./workspaces";
import type { Workspace, WorkspaceRole } from "./types";

type Permissions = { role: WorkspaceRole | null; canEdit: boolean; canAdminister: boolean };
type AppValue = { currentUser: CurrentUser | null; workspaces: Workspace[]; selectedWorkspace: Workspace | null; permissions: Permissions; capabilities: { aiGeneration: boolean; transactionalEmail: boolean }; loading: boolean; error: string | null; refresh: () => Promise<void>; selectWorkspace: (id: string) => void; updateWorkspace: (workspace: Workspace) => void; can: (permission: "edit" | "administer") => boolean };
const empty: Permissions = { role: null, canEdit: false, canAdminister: false };
const Context = createContext<AppValue | null>(null);
const permissionsFor = (workspace: Workspace | undefined): Permissions => workspace ? { role: workspace.role, canEdit: workspace.planKey !== "viewer" && ["owner", "admin", "member"].includes(workspace.role), canAdminister: workspace.planKey !== "viewer" && ["owner", "admin"].includes(workspace.role) } : empty;

export function LuluAppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => getStoredUser<CurrentUser>());
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getSelectedWorkspaceId());
  const selectedIdRef = useRef<string | null>(selectedId);
  const [permissions, setPermissions] = useState<Permissions>(empty);
  const [capabilities, setCapabilities] = useState({ aiGeneration: false, transactionalEmail: false });
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
        setCapabilities({ aiGeneration: true, transactionalEmail: true });
      } catch (workspaceCause) {
        if (workspaceCause instanceof ApiError && workspaceCause.status === 401) {
          // The user session is valid; do not turn a workspace/API problem into a logout loop.
          setWorkspaces([]); setPermissions(empty); setCapabilities({ aiGeneration: false, transactionalEmail: false });
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        } else {
          setError("Your session is valid, but workspace data could not be loaded. Please try again.");
        }
      }
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) { clearStoredUser(); setCurrentUser(null); setWorkspaces([]); setPermissions(empty); setCapabilities({ aiGeneration: false, transactionalEmail: false }); setError(null); }
      else setError("Your session could not be restored. Please sign in again.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const selectedWorkspace = useMemo(() => workspaces.find((item) => item.id === selectedId) ?? null, [selectedId, workspaces]);
  const selectWorkspace = useCallback((id: string) => { const workspace = workspaces.find((item) => item.id === id); if (!workspace) return; setSelectedWorkspaceId(id); selectedIdRef.current = id; setSelectedId(id); setPermissions(permissionsFor(workspace)); }, [workspaces]);
  const updateWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((current) => current.map((item) => item.id === workspace.id ? workspace : item));
    if (selectedIdRef.current === workspace.id) setPermissions(permissionsFor(workspace));
  }, []);
  const value = useMemo<AppValue>(() => ({ currentUser, workspaces, selectedWorkspace, permissions, capabilities, loading, error, refresh, selectWorkspace, updateWorkspace, can: (permission) => permission === "edit" ? permissions.canEdit : permissions.canAdminister }), [currentUser, workspaces, selectedWorkspace, permissions, capabilities, loading, error, refresh, selectWorkspace, updateWorkspace]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLuluApp() { const value = useContext(Context); if (!value) throw new Error("useLuluApp must be used within LuluAppProvider"); return value; }
