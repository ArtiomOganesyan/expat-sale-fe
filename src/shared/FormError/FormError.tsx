import React from "react"

type FormErrorProps = {
  error: string
}

function FormError({ error }: FormErrorProps) {
  return (
    <div
      style={{
        opacity: error ? 1 : 0,
        lineHeight: error ? 1 : 0,
        fontSize: 12,
        color: "var(--color-error)",
        transition: "opacity 0.3s, line-height 0.3s",
      }}
    >
      {error}
    </div>
  )
}

export default FormError
