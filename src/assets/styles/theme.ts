import { createTheme } from "@mui/material"

export const theme = createTheme({
  palette: {
    primary: {
      main: "#c27fc2",
    },
    success: {
      main: "#6ca878",
    },
    error: {
      main: "#e45a4d",
    },
    text: {
      primary: "#292929",
      secondary: "#696969",
    },
  },
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
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          border: "1px solid var(--color-invisible)",
          width: "100%",
          "&.Mui-disabled": {
            WebkitTextFillColor: "var(--color-text-primary)",
            color: "var(--color-text-primary)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          background: "var(--color-bg-main)",
          padding: "0 12px",
          transition: "0.2s",
          fontSize: "1rem",
          borderRadius: 4,
          "&.Mui-disabled": {
            transition: "0.2s",
            fontSize: "1rem",
            background: "var(--color-bg-main)",
            padding: "0 6px",
            color: "var(--color-text-primary)",
          },
        },
      },
    },
  },
})
