import { Theme } from './settings/types';
import { ActivityTimeline } from './components/generated/ActivityTimeline';
// %IMPORT_STATEMENT

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

  return <ActivityTimeline />; // %EXPORT_STATEMENT%
}

export default App;