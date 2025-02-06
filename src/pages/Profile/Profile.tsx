import { useNavigate } from "react-router"
import { useLazyLogoutQuery } from "../../features/auth/authAPI"

function Profile() {
  const [logout, meta] = useLazyLogoutQuery()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const res = await logout()

      if (res.isSuccess) {
        navigate("/auth/login")
      }
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  return (
    <button onClick={() => handleLogout()} disabled={meta.isLoading}>
      Logout
    </button>
  )
}

export default Profile
