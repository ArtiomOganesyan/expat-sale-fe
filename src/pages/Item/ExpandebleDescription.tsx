import type React from 'react';
import { useState } from 'react';
import { Typography, Box } from '@mui/material';

interface ExpandableTextProps {
  text: string;
  maxChars?: number;
  sx?: object;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxChars = 100, sx = {} }) => {
  const [expanded, setExpanded] = useState(false);
  const needsTruncation = text.length > maxChars;

  const toggleExpanded = () => {
    if (needsTruncation) {
      setExpanded(!expanded);
    }
  };

  const displayText = expanded || !needsTruncation ? text : `${text.substring(0, maxChars)}`;

  return (
    <Box sx={sx}>
      <Typography
        variant='body1'
        paragraph
      >
        {displayText}
        {!expanded && needsTruncation && '...'}
      </Typography>

      {needsTruncation && (
        <Typography
          variant='body1'
          onClick={toggleExpanded}
          sx={{
            color: 'primary.main',
            cursor: 'pointer',
            '&:hover': {},
            mt: -2,
            mb: 2,
          }}
        >
          {expanded ? 'Свернуть' : 'Читать полностью'}
        </Typography>
      )}
    </Box>
  );
};

export default ExpandableText;
