import { Theme } from './settings/types';
import { LuluTransactions } from './components/generated/LuluTransactions';

let theme: Theme = 'light';

function App() {
  function setTheme(nextTheme: Theme) {
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme);

  return <LuluTransactions />;
}

export default App;