import { Theme } from './settings/types';
import { LuluIntegrations } from './components/generated/LuluIntegrations';

let theme: Theme = 'light';

function App() {
  if (theme === 'dark') document.documentElement.classList.add('dark');
  else document.documentElement.classList.remove('dark');

  return <LuluIntegrations />;
}

export default App;
