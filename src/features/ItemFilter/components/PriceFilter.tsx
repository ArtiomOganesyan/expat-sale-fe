import { useState, useEffect, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router';
import { useGetMaxPriceQuery } from '../../../entities/items/itemsAPI';
import { useGetCurrencyRateQuery } from '../../../entities/currency/currencyAPI';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/Item';
import { formatPrice } from '../../../utils/formatPrice';

type PriceFilterProps = {
  filters: Record<string, any>;
  onPriceChange: (minPriceBase: number, maxPriceBase: number) => void;
};

const BASE_ISO = 'usd';

function PriceFilter({ filters, onPriceChange }: PriceFilterProps) {
  const { search } = useLocation();
  const categoryId = new URLSearchParams(search).get('categoryId');
  const { data: maxData } = useGetMaxPriceQuery({ categoryId: categoryId || '' }, { skip: !categoryId });
  const { data: rates = [] } = useGetCurrencyRateQuery();
  const selectedISO = (localStorage.getItem(LOCAL_STORAGE_KEY) || 'usd').toLowerCase();

  const getRate = useCallback(
    (iso: string): number | null => {
      const r = rates.find(x => x.iso_4217?.toLowerCase() === iso.toLowerCase())?.rate;
      return r != null ? Number(r) : null;
    },
    [rates]
  );

  const convert = useCallback(
    (amount: number, fromISO: string, toISO: string): number | null => {
      if (!Number.isFinite(amount)) return null;
      const fromRate = getRate(fromISO);
      const toRate = getRate(toISO);
      if (!fromRate || !toRate) return null;
      const v = (amount / fromRate) * toRate;
      return Number(v.toFixed(2));
    },
    [getRate]
  );

  const maxBase = useMemo(() => {
    const v = maxData?.maxPrice;
    return v && v > 0 ? Number(v) : 1000;
  }, [maxData?.maxPrice]);

  const maxSelected = useMemo(() => {
    if (selectedISO === BASE_ISO) return maxBase;
    const c = convert(maxBase, BASE_ISO, selectedISO);
    return c ?? maxBase;
  }, [maxBase, selectedISO, convert]);

  const [value, setValue] = useState<[number, number]>([0, maxSelected]);

  useEffect(() => {
    const minBase = filters.minPrice ? Number(filters.minPrice) : 0;
    const maxBaseFromFilter = filters.maxPrice != null ? Number(filters.maxPrice) : maxBase;

    const minSelected = selectedISO === BASE_ISO ? minBase : (convert(minBase, BASE_ISO, selectedISO) ?? minBase);

    const maxSelectedVal =
      selectedISO === BASE_ISO
        ? Math.min(maxBaseFromFilter, maxBase)
        : (convert(Math.min(maxBaseFromFilter, maxBase), BASE_ISO, selectedISO) ?? Math.min(maxBaseFromFilter, maxBase));

    setValue([Math.max(0, minSelected), Math.max(0, maxSelectedVal)]);
  }, [filters.minPrice, filters.maxPrice, maxBase, selectedISO, convert]);

  useEffect(() => {
    if (!Number.isFinite(maxSelected)) return;
    setValue(prev => [prev[0], Math.max(prev[0], maxSelected)]);
  }, [maxSelected]);

  const debouncedPriceChange = useCallback(
    (() => {
      let timeoutId: number | undefined;
      return (minSel: number, maxSel: number) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
          const minBase = selectedISO === BASE_ISO ? minSel : (convert(minSel, selectedISO, BASE_ISO) ?? minSel);
          const maxBaseOut = selectedISO === BASE_ISO ? maxSel : (convert(maxSel, selectedISO, BASE_ISO) ?? maxSel);

          onPriceChange(Math.max(0, Number(minBase.toFixed(2))), Math.max(0, Number(maxBaseOut.toFixed(2))));
        }, 500); // 500ms debounce
      };
    })(),
    [onPriceChange, selectedISO, convert]
  );

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue) || newValue.length !== 2) return;

    const [minSel, maxSel] = newValue as [number, number];
    const clampedMin = Math.max(0, Math.min(minSel, maxSel));
    const clampedMax = Math.max(0, Math.max(minSel, maxSel));

    setValue([clampedMin, clampedMax]);

    // Only trigger filter update if values are different from current filters
    const currentMinBase = filters.minPrice ? Number(filters.minPrice) : 0;
    const currentMaxBase = filters.maxPrice != null ? Number(filters.maxPrice) : maxBase;
    const minBaseCandidate = selectedISO === BASE_ISO ? clampedMin : (convert(clampedMin, selectedISO, BASE_ISO) ?? clampedMin);
    const maxBaseCandidate = selectedISO === BASE_ISO ? clampedMax : (convert(clampedMax, selectedISO, BASE_ISO) ?? clampedMax);

    if (
      Number(minBaseCandidate.toFixed(2)) !== Number(currentMinBase.toFixed(2)) ||
      Number(maxBaseCandidate.toFixed(2)) !== Number(currentMaxBase.toFixed(2))
    ) {
      debouncedPriceChange(clampedMin, clampedMax);
    }
  };

  if (!categoryId) return null;
  if (filters.isFree) return null;
  const [minSel, maxSel] = value;
  if (minSel === maxSel) return null;
  const isoLabel = selectedISO;

  return (
    <Box sx={{ width: '100%', maxWidth: '350px', px: 2, py: 1 }}>
      <Typography
        id='price-range-slider'
        gutterBottom
      >
        Price Range: {formatPrice(minSel, isoLabel)} {isoLabel} - {formatPrice(maxSel, isoLabel)} {isoLabel}
      </Typography>
      <Slider
        getAriaLabel={() => 'Price range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay='auto'
        getAriaValueText={v => `${isoLabel} ${v}`}
        min={0}
        max={Number.isFinite(maxSelected) ? maxSelected : 1000}
        step={10}
      />
    </Box>
  );
}

export default PriceFilter;
