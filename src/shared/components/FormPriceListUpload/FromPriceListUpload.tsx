// FromPriceListUpload.tsx
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormError from '../FormError/FormError';

type Props = {
  file: File | null;
  setFile: (f: File | null) => void;
  maxSizeMB?: number;
  previewRows?: number;
};

export default function FromPriceListUpload({
  file,
  setFile,
  maxSizeMB = 5,
  previewRows = 10,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState('');
  const [previewTable, setPreviewTable] = useState<string[][]>([]);

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
    e.currentTarget.value = '';
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewTable([]);
  };

  useEffect(() => {
    if (!file) {
      setPreviewTable([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');

      const lines = text.split(/\r?\n/).filter(Boolean).slice(0, previewRows);
      const rows = lines.map(line => {

        return line.split(',').map(cell => cell.trim());
      });
      setPreviewTable(rows);
    };
    reader.onerror = () => setError('Failed to read file');
    const blobSlice = file.slice(0, 200 * 1024);
    reader.readAsText(blobSlice, 'utf-8');
  }, [file, previewRows]);

  return (
    <Box sx={{ width: '100%' }}>
      <Button
        variant="contained"
        startIcon={<CloudUploadIcon />}
        onClick={handlePickClick}
        sx={{ width: '100%' }}
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

      {/* инфо + удалить */}
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
            </Typography>
          </Box>
          <IconButton size="small" aria-label="remove file" onClick={handleRemove}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* превью таблицы */}
      {previewTable.length > 0 && (
        <Box
          sx={{
            mt: 1,
            maxHeight: 220,
            overflow: 'auto',
            border: theme => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {previewTable.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      style={{
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        padding: '6px 8px',
                        fontSize: 12,
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: 220,
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
      )}

      <FormError
        error={error}
        style={{ background: 'white', padding: error ? 10 : 0, borderRadius: 5, marginTop: 8 }}
      />
    </Box>
  );
}
