import { Route, Routes } from "react-router"
import Navbar from "../../components/Navbar/Navbar"
import styles from "./Layout.module.css"
import Auth from "../Auth/Auth"
import Profile from "../Profile/Profile"
import PrivateRoute from "../../components/Routes/PrivateRoute"

function Layout() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route index element={<div>MAIN</div>}></Route>
        <Route path="about" element={<div>ABOUT</div>}></Route>

        <Route path="auth">
          <Route path="login" element={<Auth />}></Route>
          <Route path="register" element={<Auth />}></Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />}></Route>
        </Route>
      </Routes>

      <Navbar></Navbar>
    </div>
  )
}

export default Layout
