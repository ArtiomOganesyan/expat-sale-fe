type FormInputProps = {
  label: string
  type: string
  id: string
  name: string
  value?: string
  placeholder?: string
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
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default FormInput
