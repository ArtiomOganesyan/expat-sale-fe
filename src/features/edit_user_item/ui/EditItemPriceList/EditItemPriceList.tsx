// src/components/EditItemPriceList/EditItemPriceList.tsx
import { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Box, Button, Grid, Typography, Grid2 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLazyGetPriceListByItemQuery, useUploadPriceListMutation } from '../../../../entities/items/itemAPI';
import { useSnackbar } from '../../../../shared/hooks/useSnackbar';
import FromPriceListUpload from '../../../../shared/components/FormPriceListUpload/FromPriceListUpload';
import { useTranslation } from 'react-i18next';

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

type Props = {
  itemId?: string;
  editEnabled?: boolean;
};

export default function EditItemPriceList({ itemId, editEnabled = true }: Props) {
  const { t } = useTranslation('item');
  const [triggerGet, { isFetching: isFetchingPrice }] = useLazyGetPriceListByItemQuery();
  const [uploadPriceList, { isLoading: isUploading }] = useUploadPriceListMutation();
  const { showSnackbar } = useSnackbar();

  const [currentRows, setCurrentRows] = useState<string[][]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  const [newFile, setNewFile] = useState<File | null>(null);

  const reloadPrice = async () => {
    if (!itemId) return;
    try {
      const csv = await triggerGet({ itemId }).unwrap();
      const rows = parseCSV(csv);
      if (rows.length === 0) {
        setCurrentRows([]);
        setFetchError('empty');
      } else {
        setCurrentRows(rows);
        setFetchError(null);
      }
    } catch {
      setCurrentRows([]);
      setFetchError('fetch-failed');
    }
  };

  useEffect(() => {
    if (itemId) reloadPrice();
  }, [itemId]);

  const handleReplace = async () => {
    if (!itemId || !newFile) return;
    try {
      await uploadPriceList({ itemId, file: newFile }).unwrap();
      setNewFile(null);
      showSnackbar({
        title: 'Price list updated',
        subtitle: 'Your new price list has been uploaded',
        severity: 'success',
      });
      await reloadPrice();
    } catch (err: any) {
      showSnackbar({
        title: 'Failed to upload price list',
        subtitle: err?.data?.message || 'Please try again later',
        severity: 'error',
      });
    }
  };

  const hasPrice = currentRows.length > 0 && !fetchError;

  return (
    <Grid2
      container
      spacing={1}
      sx={{ mt: 2, width: '100%' }}
    >
      {hasPrice && (
        <Grid2 sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Grid2>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700 }}
            >
              {t('form.pricelist')}
            </Typography>
          </Grid2>

          <Grid2>
            <Accordion
              expanded={previewExpanded}
              onChange={(_, isExp) => setPreviewExpanded(isExp)}
              sx={{ width: '100%' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='body2'>
                  {previewExpanded ? `${t('form.pricelist.hide')}` : `${t('form.pricelist.show')}`}
                </Typography>
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
                      {currentRows.map((r, ri) => (
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
        </Grid2>
      )}

      <Grid2 sx={{ width: '100%', mt: hasPrice ? 1 : 0, opacity: editEnabled ? 1 : 0.5 }}>
        <Typography
          variant='subtitle2'
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {hasPrice ? `${t('form.pricelist.replace')}` : `${t('form.pricelist.upload')}`}
        </Typography>
        <FromPriceListUpload
          file={newFile}
          setFile={setNewFile}
          maxSizeMB={2}
          disabled={!editEnabled}
        />
        <Button
          variant='outlined'
          sx={{ mt: 1 }}
          onClick={handleReplace}
          disabled={!editEnabled || !newFile || isUploading}
          fullWidth
        >
          {isUploading
            ? `${t('form.pricelist.downloading')}`
            : hasPrice
              ? `${t('form.pricelist.replace.new')}`
              : `${t('form.pricelist.choose')}`}
        </Button>
      </Grid2>
    </Grid2>
  );
}
