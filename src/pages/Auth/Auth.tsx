import { Outlet } from "react-router"

import style from "./Auth.module.css"

function Auth() {
  return (
    <div className={style.container}>
      <h2>Authentication</h2>
      <Outlet />
    </div>
  )
}

export default Auth
