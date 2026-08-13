import { Theme } from './settings/types';
import { LuluContacts } from './components/generated/LuluContacts';

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

  return <LuluContacts />;
}

export default App;