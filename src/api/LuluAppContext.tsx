import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authApi, type CurrentUser } from "./auth";
import { ApiError } from "./client";
import { getSelectedWorkspaceId, setSelectedWorkspaceId } from "./session";
import { workspaceApi } from "./workspaces";
import type { Workspace, WorkspaceRole } from "./types";

type Permissions = { role: WorkspaceRole | null; canEdit: boolean; canAdminister: boolean };
type AppValue = { currentUser: CurrentUser | null; workspaces: Workspace[]; selectedWorkspace: Workspace | null; permissions: Permissions; capabilities: { aiGeneration: boolean; transactionalEmail: boolean }; loading: boolean; error: string | null; refresh: () => Promise<void>; selectWorkspace: (id: string) => void; can: (permission: "edit" | "administer") => boolean };
const empty: Permissions = { role: null, canEdit: false, canAdminister: false };
const Context = createContext<AppValue | null>(null);
const permissionsFor = (workspace: Workspace | undefined): Permissions => workspace ? { role: workspace.role, canEdit: ["owner", "admin", "member"].includes(workspace.role), canAdminister: ["owner", "admin"].includes(workspace.role) } : empty;

export function LuluAppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getSelectedWorkspaceId());
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

      try {
        const result = await workspaceApi.list();
        setWorkspaces(result.data.items);
        const id = selectedId && result.data.items.some((item) => item.id === selectedId) ? selectedId : result.data.items[0]?.id ?? null;
        if (id && id !== selectedId) { setSelectedWorkspaceId(id); setSelectedId(id); }
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
      if (cause instanceof ApiError && cause.status === 401) { setCurrentUser(null); setWorkspaces([]); setPermissions(empty); setCapabilities({ aiGeneration: false, transactionalEmail: false }); setError(null); }
      else setError("Your session could not be restored. Please sign in again.");
    } finally { setLoading(false); }
  }, [selectedId]);
  useEffect(() => { void refresh(); }, [refresh]);
  const selectedWorkspace = useMemo(() => workspaces.find((item) => item.id === selectedId) ?? null, [selectedId, workspaces]);
  const selectWorkspace = useCallback((id: string) => { const workspace = workspaces.find((item) => item.id === id); if (!workspace) return; setSelectedWorkspaceId(id); setSelectedId(id); setPermissions(permissionsFor(workspace)); }, [workspaces]);
  const value = useMemo<AppValue>(() => ({ currentUser, workspaces, selectedWorkspace, permissions, capabilities, loading, error, refresh, selectWorkspace, can: (permission) => permission === "edit" ? permissions.canEdit : permissions.canAdminister }), [currentUser, workspaces, selectedWorkspace, permissions, capabilities, loading, error, refresh, selectWorkspace]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLuluApp() { const value = useContext(Context); if (!value) throw new Error("useLuluApp must be used within LuluAppProvider"); return value; }
