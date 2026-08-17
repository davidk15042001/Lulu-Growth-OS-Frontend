import { Theme } from './settings/types';
import { DynamicWorkspaceDashboard } from '../../components/DynamicWorkspaceDashboard';

let theme: Theme = 'light';

function App() {
  function setTheme(theme: Theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <DynamicWorkspaceDashboard />;
}

export default App;