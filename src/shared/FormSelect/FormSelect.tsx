import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"

type FormSelectProps<TOption> = {
  label?: string
  id: string
  disabled?: boolean
  onChange: (
    e: React.SyntheticEvent<Element, Event>,
    newValue: (TOption & { label: string; groupBy?: string }) | null,
  ) => void
  options: (TOption & { label: string; groupBy?: string })[]
  sx?: any
}

function FormSelect<TOption>({
  label,
  id,
  onChange,
  disabled,
  options,
  sx,
}: FormSelectProps<TOption>) {
  return (
    <Autocomplete
      disablePortal
      id={id}
      onChange={onChange}
      options={options}
      getOptionLabel={option => option.label}
      groupBy={option => option.groupBy || ""}
      renderInput={params => <TextField {...params} label={label} />}
      sx={{ ...sx, width: "100%" }}
      disabled={disabled}
    />
  )
}

export default FormSelect
