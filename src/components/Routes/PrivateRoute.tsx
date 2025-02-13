import { selectUser } from "../../features/user/userSlice"
import { useAppSelector } from "../../app/hooks"
import { Outlet } from "react-router"

function PrivateRoute() {
  const user = useAppSelector(selectUser)

  if (!user?.id) {
    return <div>Not authorized</div>
  }

  return <Outlet />
}

export default PrivateRoute
