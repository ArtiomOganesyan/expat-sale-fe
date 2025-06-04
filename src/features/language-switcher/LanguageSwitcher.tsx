import { useTranslation } from "react-i18next"
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Paper,
} from "@mui/material"
import FlagIcon from "@mui/icons-material/Flag"

const languages = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
]

type LanguageSwitcherProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function LanguageSwitcher({
  open,
  setOpen,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation()

  // Получаем текущий язык из i18n
  const currentLanguage =
    languages.find(lang => lang.code === i18n.language) || languages[0]

  const handleChange = (
    _event: any,
    newValue: (typeof languages)[number] | null,
  ) => {
    if (newValue) {
      i18n.changeLanguage(newValue.code)
      localStorage.setItem("language", newValue.code)
    }
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Paper elevation={2}>
        <DialogContent>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Autocomplete
              options={languages}
              getOptionLabel={option => option.label}
              value={currentLanguage}
              onChange={handleChange}
              renderInput={params => (
                <TextField {...params} label="Language" size="small" />
              )}
              sx={{ width: 300 }}
              disableClearable
              renderOption={(props, option) => (
                <li {...props}>
                  <InputAdornment position="start">
                    {option.flag}
                  </InputAdornment>
                  {option.label}
                </li>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  )
}
