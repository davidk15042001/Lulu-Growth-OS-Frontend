import { useState } from 'react';
import { Theme } from './settings/types';
import { LuluIntegrations } from './components/generated/LuluIntegrations';
import { IntegrationsPanel } from '../../api/panels/IntegrationsPanel';
import { useLuluApp } from '../../api/LuluAppContext';

let theme: Theme = 'light';

function App() {
  const { selectedWorkspace, loading } = useLuluApp();
  const [livePanelOpen, setLivePanelOpen] = useState(true);

  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');

  return <>
    <LuluIntegrations />
    {!loading && selectedWorkspace && livePanelOpen ? <IntegrationsPanel workspaceId={selectedWorkspace.id} onClose={() => setLivePanelOpen(false)} /> : null}
    {!loading && selectedWorkspace && !livePanelOpen ? <button type="button" className="lulu-live-launch" onClick={() => setLivePanelOpen(true)}><i aria-hidden="true" />Live integrations</button> : null}
  </>;
}

export default App;
