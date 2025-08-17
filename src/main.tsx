import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { BrowserRouter } from 'react-router';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './assets/styles/theme';
import './assets/fonts/GeneralSans/index.css';
import './assets/fonts/VelaSans/index.css';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  console.log('Root element found, rendering the application...');
  console.log('Environment variables:', {
    backendUrl: import.meta.env.VITE_BACKEND_URL,
  });

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
