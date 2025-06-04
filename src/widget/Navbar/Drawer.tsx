import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import TextField from "@mui/material/TextField"
import Autocomplete from "@mui/material/Autocomplete"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Button from "@mui/material/Button"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"

type FilterMenuProps = {
  open: boolean
  toggleDrawer: (newOpen: boolean) => void
}

const categories = ["Электроника", "Одежда", "Книги", "Игрушки", "Дом и сад"]

const cities = [
  "Москва",
  "Санкт-Петербург",
  "Новосибирск",
  "Екатеринбург",
  "Казань",
]

export default function FilterMenu(props: FilterMenuProps) {
  const { open, toggleDrawer } = props

  const [priceFrom, setPriceFrom] = React.useState("")
  const [priceTo, setPriceTo] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null,
  )
  const [selectedCity, setSelectedCity] = React.useState<string | null>(null)

  const handleSearch = () => {
    console.log("Поиск с фильтрами:", {
      priceFrom,
      priceTo,
      selectedCategory,
      selectedCity,
    })
    // Закрытие Drawer после поиска
    toggleDrawer(false)
    // Добавьте вашу логику поиска здесь
  }

  const DrawerList = (
    <Box
      sx={{ width: "100%", padding: 2 }}
      role="presentation"
      onClick={e => e.stopPropagation()}
    >
      <Paper sx={{ padding: 2 }}>
        <Stack spacing={2}>
          {/* Используем Grid для того, чтобы расположить цену от и до в ряд */}

          <Stack display={"flex"} direction={"row"} gap={3}>
            <TextField
              label="Цена от"
              type="number"
              value={priceFrom}
              onChange={e => setPriceFrom(e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="Цена до"
              type="number"
              value={priceTo}
              onChange={e => setPriceTo(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>

          <Autocomplete
            options={categories}
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            renderInput={params => (
              <TextField {...params} label="Категория товара" size="small" />
            )}
            fullWidth
            size="small"
          />

          <Autocomplete
            options={cities}
            value={selectedCity}
            onChange={(_, newValue) => setSelectedCity(newValue)}
            renderInput={params => (
              <TextField {...params} label="Город" size="small" />
            )}
            fullWidth
            size="small"
          />

          {/* Кнопка "Найти" */}
          <Button
            onClick={handleSearch}
            variant="contained"
            color="primary"
            fullWidth
          >
            Найти
          </Button>
        </Stack>
      </Paper>
    </Box>
  )

  return (
    <div>
      <Drawer anchor="top" open={open} onClose={() => toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  )
}
