import { useEffect } from 'react';
import { navigateApp } from '../../routing';

function App() {
  useEffect(() => {
    navigateApp('/app/sturdy-month-1562', { replace: true });
  }, []);

  return null;
}

export default App;
