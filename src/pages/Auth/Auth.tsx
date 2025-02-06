import { useLocation } from "react-router"
import LoginForm from "../../features/auth/LoginForm"
import RegisterForm from "../../features/auth/RegisterForm"

function Auth() {
  const { pathname } = useLocation()

  return (
    <div>{pathname === "/auth/login" ? <LoginForm /> : <RegisterForm />}</div>
  )
}

export default Auth
