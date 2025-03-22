import AuthCheck from "./shared/AuthCheck"

import "./assets/styles/global.css"
import "./assets/styles/variables.css"
import AppRouter from "./router/AppRouter"
import MobileNavbar from "./widget/Navbar/MobileNavbar"

import style from "./App.module.css"

const App = () => {
  return (
    <div className={style.container}>
      <AuthCheck />
      <AppRouter />
      <MobileNavbar />
    </div>
  )
}

export default App
