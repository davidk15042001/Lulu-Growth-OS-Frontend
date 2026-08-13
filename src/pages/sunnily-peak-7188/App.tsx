import { Theme } from './settings/types';
import { LuluPublishingCenter } from './components/generated/LuluPublishingCenter';

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

  return <LuluPublishingCenter />;
}

export default App;