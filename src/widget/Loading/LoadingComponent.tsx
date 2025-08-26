import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

export function LoadingComponent() {
  return (
    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <svg
        width={0}
        height={0}
      >
        <defs>
          <linearGradient
            id='my_gradient'
            x1='0%'
            y1='0%'
            x2='0%'
            y2='100%'
          >
            <stop
              offset='0%'
              stopColor='#bebebeff'
            />
            <stop
              offset='100%'
              stopColor='#000000ff'
            />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </Box>
  );
}
