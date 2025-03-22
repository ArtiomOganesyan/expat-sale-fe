import { Route, Routes } from "react-router"
import PrivateRoute from "./routes/PrivateRoute"
import ListingMenu from "../pages/ListingMenu/ListingMenu"
import Listing from "../pages/Listing/Listing"
import Item from "../pages/Item/Item"
import NewItem from "../pages/NewItem/NewItem"
import LoginForm from "../features/auth/ui/LoginForm"
import RegisterForm from "../features/auth/ui/RegisterForm"
import Auth from "../pages/Auth/Auth"
import ProfilePage from "../pages/Profile/ProfilePage"

function AppRouter() {
  return (
    <Routes>
      <Route index element={<ListingMenu />}></Route>
      <Route path="listing" element={<Listing />}></Route>
      <Route path="listing/:id" element={<Item />}></Route>
      <Route path="about" element={<div>ABOUT</div>}></Route>

      <Route path="auth" element={<Auth />}>
        <Route path="login" element={<LoginForm />}></Route>
        <Route path="register" element={<RegisterForm />}></Route>
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<ProfilePage />}></Route>
        <Route path="item/new" element={<NewItem />}></Route>
      </Route>
    </Routes>
  )
}

export default AppRouter
