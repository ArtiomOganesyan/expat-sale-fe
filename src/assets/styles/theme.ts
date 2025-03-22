import { createTheme } from "@mui/material"

export const theme = createTheme({
  components: {
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-info)",
          "&:hover": {
            backgroundColor: "var(--color-info)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--color-bg-secondary)",
          color: "var(--color-text-primary)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--color-bg-main)",
          color: "var(--color-text-primary)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backgroundColor: "var(--color-accent)",
          "&:hover": {
            backgroundColor: "var(--color-accent-hover)",
          },
          color: "var(--color-text-primary)",
        },
      },
    },
  },
})
