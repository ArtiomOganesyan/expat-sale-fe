import { Outlet } from "react-router";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";

export default function Layout() {
  return (
    <Box mb={'50px'}>

      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h2">Bazzar</Typography>
        </Toolbar>
      </AppBar> */}

      {/* Контент */}
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
