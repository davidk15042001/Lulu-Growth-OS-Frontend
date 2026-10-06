import { Theme } from './settings/types';
import { RevenueOverviewWorkspace } from '../../components/RevenueOverviewWorkspace';

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

  return <RevenueOverviewWorkspace />;
}

export default App;
