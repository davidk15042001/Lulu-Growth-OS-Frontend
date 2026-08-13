import { Theme } from './settings/types';
import { LuluExistingPlatforms } from './components/generated/LuluExistingPlatforms';

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

  return <LuluExistingPlatforms />;
}

export default App;