// src/components/Item/ItemPriceList.tsx
import { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Grid2, Typography, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DownloadIcon from '@mui/icons-material/Download';
import { useGetItemByIdQuery, useLazyGetPriceListByItemQuery } from '../../entities/items/itemAPI';
import { useParams } from 'react-router';
import { safeLang } from '../../utils/saveLang';

type ItemPriceListProps = {
  itemId: string | undefined;
};

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
      if (ch === '"') inQuotes = true;
      else if (ch === ',') {
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

export default function ItemPriceList({ itemId }: ItemPriceListProps) {
  const params = useParams();
  const [trigger, { isFetching }] = useLazyGetPriceListByItemQuery();
  const { data, isLoading, isError } = useGetItemByIdQuery({ itemId: params.id });
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleDownloadPriceList = async () => {
    try {
      const itemId = data?.id ?? params.id ?? '';
      if (!itemId) return;
      const csvText = await trigger({ itemId }).unwrap();
      const fileName = `price-list_${itemId}_${safeLang()}.csv`;

      try {
        const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        const a = document.createElement('a');
        a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvText);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error('Failed to download price list', e);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!itemId) return;
      try {
        const csv = await trigger({ itemId }).unwrap();
        const parsed = parseCSV(csv);
        if (parsed.length === 0) {
          setRows([]);
          setError('empty');
        } else {
          setRows(parsed);
          setError(null);
        }
      } catch {
        setRows([]);
        setError('fetch-failed');
      }
    };
    load();
  }, [itemId]);

  if (error || rows.length === 0) return null;

  return (
    <>
      <Grid2
        sx={{ mt: 2, display: 'flex', gap: '8px' }}
        direction={'row'}
      >
        <Grid2>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 700 }}
          >
            Price list
          </Typography>
        </Grid2>
        <Grid2>
          <IconButton
            onClick={handleDownloadPriceList}
            sx={{
              color: 'primary.main',
              padding: 0,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Grid2>
      </Grid2>

      <Grid2 sx={{ m: 2, width: '100%' }}>
        <Accordion
          expanded={expanded}
          onChange={(_, isExp) => setExpanded(isExp)}
          sx={{ width: '100%' }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='body2'>{expanded ? 'Hide full price list' : 'Show full price list'}</Typography>
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
                            fontSize: 12,
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
      </Grid2>
    </>
  );
}
