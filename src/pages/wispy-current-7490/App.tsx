import { Theme } from './settings/types';
import { LuluForecasts } from './components/generated/LuluForecasts';

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

  return <LuluForecasts />;
}

export default App;