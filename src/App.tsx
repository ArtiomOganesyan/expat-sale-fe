import InitialLoad from "./shared/components/InitialLoad"

import "./assets/styles/global.css"
import "./assets/styles/variables.css"
import AppRouter from "./router/AppRouter"
import MobileNavbar from "./widget/Navbar/MobileNavbar"
import { SnackbarProvider } from "./shared/components/SnackbarProvider/SnackbarProvider"

import style from "./App.module.css"

const App = () => {
  return (
    <SnackbarProvider>
    <div className={style.container}>
      <InitialLoad />
      {/* <UserLocationMap /> */}
      <AppRouter />
      <MobileNavbar />
    </div>
    </SnackbarProvider>
  )
}

export default App
