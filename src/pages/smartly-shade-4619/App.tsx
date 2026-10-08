import { Theme } from './settings/types';
import { SalesPipelineWorkspace } from '../../components/SalesPipelineWorkspace';
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

  return <SalesPipelineWorkspace mode="deal" />; // %EXPORT_STATEMENT%
}

export default App;
