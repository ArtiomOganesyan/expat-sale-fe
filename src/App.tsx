import InitialLoad from './shared/components/InitialLoad';

import './assets/styles/global.css';
import './assets/styles/variables.css';
import AppRouter from './router/AppRouter';
import MobileNavbar from './widget/Navbar/MobileNavbar';
import { SnackbarProvider } from './shared/context/SnackbarProvider/SnackbarProvider';

import style from './App.module.css';
import ErrorFallback from './shared/components/ErrorComponent/ErrorComponent';
import ErrorBoundary from './pages/Error/Error';

const App = () => {
  return (
    <SnackbarProvider>
      <ErrorBoundary>
        <div className={style.container}>
          <InitialLoad />
          {/* <UserLocationMap /> */}
          <AppRouter />
          <MobileNavbar />
        </div>
      </ErrorBoundary>
    </SnackbarProvider>
  );
};

export default App;
