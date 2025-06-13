import TextField from "@mui/material/TextField"

type FormInputProps = {
  id: string
  type: string
  name: string
  label?: string
  value?: string | number
  placeholder?: string
  disabled?: boolean
  inlineStyles?: React.CSSProperties
  slotProps?: any
  sx?: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  options?: any
}

function FormInput({
  label,
  type,
  id,
  name,
  onChange,
  value,
  placeholder,
  disabled,
  sx,
  slotProps,
  options,
}: FormInputProps) {
  return (
    <TextField
      variant="outlined"
      id={id}
      label={label}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      sx={{ ...sx, width: "100%" }}
      slotProps={slotProps}
      {...options}
    />
  )
}

export default FormInput
