type FormInputProps = {
  label?: string
  type: string
  id: string
  name: string
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
}: FormInputProps) {
  return (
    <div>
      {label || <label htmlFor={id}>{label}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

export default FormInput
