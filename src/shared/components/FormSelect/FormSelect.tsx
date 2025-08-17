import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { ReactNode } from 'react';

type FormSelectProps<TOption> = {
  label?: string;
  id: string;
  disabled?: boolean;
  onChange: (e: React.SyntheticEvent<Element, Event>, newValue: (TOption & { label: string; groupBy?: string }) | null) => void;
  options: (TOption & { label: string; groupBy?: string })[];
  sx?: any;
  value?: (TOption & { label: string; groupBy?: string }) | null;
  error?: boolean;
  helperText?: ReactNode;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

function FormSelect<TOption>({ label, id, onChange, disabled, options, sx, value, error, helperText, onBlur}: FormSelectProps<TOption>) {
  return (
    <Autocomplete
      value={value || null}
      disablePortal
      id={id}
      onChange={onChange}
      options={options}
      getOptionLabel={option => option.label}
      groupBy={option => option.groupBy || ''}
      sx={{ ...sx, width: '100%' }}
      disabled={disabled}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          onBlur={onBlur}
        />
      )}
    />
  );
}

export default FormSelect;
