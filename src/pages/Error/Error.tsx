// Error boundary component for catching render/runtime errors in the tree.
import { Button, Paper, Typography } from '@mui/material';
import React from 'react';

type Props = {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error | null;
};

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Keep logging minimal here; you can hook into your logging service
    // (Sentry, LogRocket, etc.) from this method.
    // eslint-disable-next-line no-console
    console.error('Uncaught error in component tree:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      if (this.props.fallback) return <>{this.props.fallback}</>;

      return (
        <Paper sx={{ padding: 2, margin: 2 }}>
          <Typography variant='h2'>Something went wrong</Typography>
          {error && error.message && <Typography color='error'>It seems {error.message}</Typography>}
          <Button
            variant='outlined'
            onClick={this.reset}
            sx={{ marginTop: 4 }}
          >
            Try again
          </Button>
        </Paper>
      );
    }

    return this.props.children ?? null;
  }
}

export default ErrorBoundary;
