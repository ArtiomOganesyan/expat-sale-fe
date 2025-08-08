import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarOptions {
  title: string;
  subtitle?: string;
  severity?: SnackbarSeverity;
  duration?: number;
}

interface SnackbarContextProps {
  showSnackbar: (options: SnackbarOptions) => void;
}

export const SnackbarContext = createContext<SnackbarContextProps>({
  showSnackbar: () => {},
});

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<SnackbarOptions>({
    title: '',
    subtitle: '',
    severity: 'info',
    duration: 3000,
  });

  const showSnackbar = ({ title, subtitle = '', severity = 'info', duration = 3000 }: SnackbarOptions) => {
    setMessage({ title, subtitle, severity, duration });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={message.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={message.severity}
          variant='filled'
          sx={{
            width: '100%',
            color: '#fff', 
            fontWeight: 'bold',
            bgcolor:
              message.severity === 'success'
                ? '#5ee628ff'
                : message.severity === 'error'
                  ? '#f44336'
                  : message.severity === 'warning'
                    ? '#ffa000'
                    : '#2196f3', 
          }}
        >
          <strong>{message.title}</strong>
          {message.subtitle && <div>{message.subtitle}</div>}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
