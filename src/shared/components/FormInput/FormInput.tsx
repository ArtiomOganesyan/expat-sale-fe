import TextField from '@mui/material/TextField';
import type { ChangeEvent, FocusEvent, ReactNode, Ref } from 'react';

type FormInputProps = {
  id: string;
  type: string;
  name: string;
  label?: string;
  value?: string | number;
  placeholder?: string;
  disabled?: boolean;
  inlineStyles?: React.CSSProperties;
  slotProps?: any;
  sx?: any;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: ReactNode;
  options?: any;
  inputRef?: Ref<HTMLInputElement>;
  maxLength?: number;
};

function FormInput({
  label,
  type,
  id,
  name,
  onChange,
  onBlur,
  value,
  placeholder,
  disabled,
  sx,
  slotProps,
  error,
  helperText,
  options,
  inputRef,
  maxLength,
}: FormInputProps) {
  return (
    <TextField
      variant='outlined'
      id={id}
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      helperText={helperText}
      sx={{ ...sx, width: '100%' }}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...(slotProps?.htmlInput ?? {}),
          maxLength,
        },
      }}
      inputRef={inputRef}
      {...options}
      size='small'
    />
  );
}

export default FormInput;
