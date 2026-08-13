import { Theme } from './settings/types';
import { LuluCompetitors } from './components/generated/LuluCompetitors';

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

  return <LuluCompetitors />;
}

export default App;