import { Theme } from './settings/types';
import { SalesGoals } from './components/generated/SalesGoals';

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

  return <SalesGoals />;
}

export default App;