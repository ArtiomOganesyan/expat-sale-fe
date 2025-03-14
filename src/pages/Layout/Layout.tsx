import { Route, Routes } from "react-router"
import Navbar from "../../components/Navbar/Navbar"
import styles from "./Layout.module.css"
import Auth from "../Auth/Auth"
import Profile from "../Profile/Profile"
import PrivateRoute from "../../components/Routes/PrivateRoute"
import ListingMenu from "../ListingMenu/ListingMenu"
import Listing from "../Listing/Listing"
import Item from "../Item/Item"
import NewItem from "../NewItem/NewItem"

function Layout() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route index element={<ListingMenu />}></Route>
        <Route path="listing" element={<Listing />}></Route>
        <Route path="listing/:id" element={<Item />}></Route>
        <Route path="about" element={<div>ABOUT</div>}></Route>

        <Route path="auth">
          <Route path="login" element={<Auth />}></Route>
          <Route path="register" element={<Auth />}></Route>
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="item/new" element={<NewItem />}></Route>
        </Route>
      </Routes>

      <Navbar></Navbar>
    </div>
  )
}

export default Layout
