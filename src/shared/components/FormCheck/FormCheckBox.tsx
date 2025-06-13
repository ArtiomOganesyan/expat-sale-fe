import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"

type FormCheckBoxProps = {
  label?: string
  labelPlacement?: "top" | "bottom" | "start" | "end"
  id: string
  name: string
  checked?: boolean
  disabled?: boolean
  onChange: (e: React.SyntheticEvent<Element, Event>, checked: boolean) => void
}

function FormCheckBox({
  label,
  id,
  name,
  onChange,
  checked,
  disabled,
  labelPlacement = "bottom",
}: FormCheckBoxProps) {
  return (
    <FormControlLabel
      id={id}
      name={name}
      disabled={disabled}
      checked={checked}
      value="bottom"
      control={<Checkbox />}
      label={label}
      labelPlacement={labelPlacement}
      onChange={onChange}
    />
  )
}

export default FormCheckBox
