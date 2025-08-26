import type React from 'react';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router';

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ message = 'Something went wrong...', onRetry }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      minHeight='70vh'
      padding={3}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(90deg, #f44336 0%, #ff9800 50%, #f44336 100%)',
            animation: 'shimmer 2s infinite linear',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '-200px 0' },
              '100%': { backgroundPosition: '200px 0' },
            },
            backgroundSize: '200px 100%',
          }}
        />

        <SentimentVeryDissatisfiedIcon
          color='error'
          sx={{
            fontSize: 80,
            mb: 2,
            animation: 'bounce 2s infinite ease-in-out',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-15px)' },
            },
          }}
        />

        <Typography
          variant='h5'
          gutterBottom
          fontWeight='bold'
        >
          Oops! An error occurred
        </Typography>

        <Typography
          variant='body1'
          color='text.secondary'
          paragraph
        >
          {message}
        </Typography>

        <Box
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderRadius: 1,
            padding: 2,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ErrorOutlineIcon color='error' />
          <Typography variant='body2'>Try refreshing the page or returning to the home page</Typography>
        </Box>

        <Stack
          direction='row'
          spacing={2}
          justifyContent='center'
        >
          {onRetry && (
            <Button
              variant='contained'
              color='primary'
              onClick={onRetry}
              startIcon={<span>🔄</span>}
            >
              Retry
            </Button>
          )}
          <Button
            variant='outlined'
            onClick={handleGoHome}
            startIcon={<span>🏠</span>}
          >
            Home
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ErrorFallback;
