// FromPriceListUpload.tsx
import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  IconButton,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import FormError from '../FormError/FormError';

type Props = {
  file: File | null;
  setFile: (f: File | null) => void;
  maxSizeMB?: number;
  disabled?: boolean;
};

export default function FromPriceListUpload({
  file,
  setFile,
  maxSizeMB = 2,
  disabled = false
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const [rows, setRows] = useState<string[][]>([]);
  const [expanded, setExpanded] = useState(false);

  const parseCSV = (text: string): string[][] => {
    const out: string[][] = [];
    let row: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          row.push(cur.trim());
          cur = '';
        } else if (ch === '\n') {
          row.push(cur.trim());
          out.push(row);
          row = [];
          cur = '';
        } else if (ch !== '\r') {
          cur += ch;
        }
      }
    }
    if (cur.length > 0 || inQuotes || row.length > 0) {
      row.push(cur.trim());
      out.push(row);
    }
    return out.filter(r => r.some(cell => cell !== ''));
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const handlePickClick = () => {
    setError('');
    inputRef.current?.click();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setError('No file selected');
      return;
    }
    const sizeMB = f.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setError(`File size exceeds ${maxSizeMB} MB`);
      e.currentTarget.value = '';
      return;
    }
    const allowedMime = ['text/csv', 'application/vnd.ms-excel', 'application/csv'];
    const looksLikeCsv = f.name.toLowerCase().endsWith('.csv') || allowedMime.includes(f.type);
    if (!looksLikeCsv) {
      setError('Please select a CSV file (.csv)');
      e.currentTarget.value = '';
      return;
    }

    setFile(f);
    setExpanded(false);
    e.currentTarget.value = '';
  };

  const handleRemove = () => {
    setFile(null);
    setRows([]);
    setExpanded(false);
  };

  useEffect(() => {
    if (!file) {
      setRows([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      setRows(parseCSV(text));
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file, 'utf-8');
  }, [file]);

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handlePickClick}
        sx={{ width: '100%' }}
        disabled={disabled}
      >
        {file ? 'Change CSV' : 'Choose CSV'}
      </Button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept=".csv,text/csv,application/vnd.ms-excel,application/csv"
        onChange={handleFileChange}
      />

      {file && (
        <Box
          sx={{
            mt: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: theme => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap title={file.name}>
              {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
              {rows.length ? ` · ${rows.length} rows` : ''}
            </Typography>
          </Box>
          <IconButton size="small" aria-label="remove file" onClick={handleRemove}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {file && rows.length > 0 && (
        <Accordion
          expanded={expanded}
          onChange={(_, isExp) => setExpanded(isExp)}
          sx={{ mt: 1, width: '100%' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="body2">Preview price list</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Box
              sx={{
                maxHeight: 360,
                overflow: 'auto',
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri}>
                      {r.map((cell, ci) => (
                        <td
                          key={ci}
                          style={{
                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                            padding: '6px 8px',
                            fontSize: ri === 0 ? 14 : 12,
                            fontWeight: ri === 0 ? 600 : 400,
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            maxWidth: 260,
                          }}
                          title={cell}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      <FormError
        error={error}
        style={{ background: 'white', padding: error ? 10 : 0, borderRadius: 5, marginTop: 8 }}
      />
    </Box>
  );
}
