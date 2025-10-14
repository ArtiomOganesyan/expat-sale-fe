import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router';
import './i18n';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './assets/styles/theme';
import './assets/fonts/GeneralSans/index.css';
import './assets/fonts/VelaSans/index.css';
// Register service worker for PWA (Add to Home Screen / standalone)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        // eslint-disable-next-line no-console
        console.log('Service worker registered.', reg);
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed:', err);
      });
  });
}

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file."
  );
}
