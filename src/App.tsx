import InitialLoad from "./shared/InitialLoad"

import "./assets/styles/global.css"
import "./assets/styles/variables.css"
import AppRouter from "./router/AppRouter"
import MobileNavbar from "./widget/Navbar/MobileNavbar"

import style from "./App.module.css"

const App = () => {
  return (
    <div className={style.container}>
      <InitialLoad />
      {/* <UserLocationMap /> */}
      <AppRouter />
      <MobileNavbar />
    </div>
  )
}

export default App
