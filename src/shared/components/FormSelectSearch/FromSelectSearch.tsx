import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';

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
}: FormSelectProps<TOption>) {
  return (
    <Autocomplete
      disablePortal
      noOptionsText={error ? error : 'No options'}
      id={id}
      onChange={onChange}
      options={options}
      getOptionLabel={option => option.label}
      value={value}
      inputValue={inputValue}
      onInputChange={onInputChange}
      groupBy={option => option.groupBy || ''}
      filterOptions={x => x}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          disabled={disabled}
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
      disabled={disabled}
      loading={isLoading}
    />
  );
}

export default FromSelectSearch;
