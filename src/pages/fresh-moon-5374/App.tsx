import { Theme } from './settings/types';
import { AiNativeWorkspace } from '../../components/AiNativeWorkspace';
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

  return <AiNativeWorkspace />; // %EXPORT_STATEMENT%
}

export default App;
