import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React from 'react';

type FormSelectProps<TOption> = {
  value?: (TOption & { label: string; groupBy?: string }) | null;
  label?: string;
  id: string;
  disabled?: boolean;
  onChange: (e: React.SyntheticEvent<Element, Event>, newValue: (TOption & { label: string; groupBy?: string }) | null) => void;
  options: (TOption & { label: string; groupBy?: string })[];
  sx?: any;
  inputValue: string;
  onInputChange?: (event: React.SyntheticEvent, newInputValue: string, reason: string) => void;
  isLoading?: boolean;
  error?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
};

function FromSelectSearch<TOption>({
  value,
  label,
  id,
  onChange,
  disabled,
  options,
  sx,
  inputValue,
  onInputChange,
  isLoading,
  error,
  onBlur
}: FormSelectProps<TOption>) {
  return (
    <Autocomplete
      disablePortal
      disabled={disabled}
      noOptionsText={error ? error : 'No options'}
      id={id}
      onChange={onChange}
      options={options}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(opt, val) => opt.label === (val as any)?.label}
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      groupBy={option => option.groupBy || ''}
      filterOptions={x => x}
      loading={isLoading}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          disabled={disabled}
          error={Boolean(error)}
          helperText={error || ''}
          onBlur={onBlur}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress
                      color='inherit'
                      size={20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            },
          }}
        />
      )}
      sx={{ ...sx, width: '100%' }}
    />
  );
}

export default FromSelectSearch;
