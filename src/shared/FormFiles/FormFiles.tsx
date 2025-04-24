import { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"

import FormError from "../FormError/FormError"

export default function InputFileUpload({
  files,
  setFiles,
}: {
  files: File[]
  setFiles: (files: File[]) => void
}) {
  const [error, setError] = useState("")

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("")
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [error])

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onClick={() => {
        setError("")
        setFiles([])
      }}
      sx={{
        width: "100%",
      }}
    >
      {files.length ? "Images Are Ready" : "Upload Images"}
      <input
        hidden
        type="file"
        onChange={event => {
          if (event.target.files && event.target.files.length > 5) {
            setError("You can only upload 5 files")
            return
          }

          if (!event.target.files || event.target.files.length === 0) {
            setError("No files selected")
            return
          }

          const selectedFiles = Array.from(event.target.files)
          const validFiles = selectedFiles.filter(file => {
            const fileSizeInMB = file.size / (1024 * 1024)
            if (fileSizeInMB > 5) {
              setError("File size exceeds 5 MB")
              return false
            }
            return true
          })
          setFiles(validFiles)
        }}
        multiple
        max={5}
        maxLength={5}
      />
      <FormError
        error={error}
        style={{ background: "white", padding: 10, borderRadius: 5 }}
      />
    </Button>
  )
}
