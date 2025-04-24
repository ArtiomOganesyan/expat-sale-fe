type FormInputProps = {
  label?: string
  id: string
  name: string
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function FormTextArea({
  label,
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
      <textarea
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

export default FormTextArea
