import React from "react"
import styles from "./AuthForm.module.css"
import { useNavigate } from "react-router"
import { useRegisterMutation } from "./authAPI"

function RegisterForm() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const navigate = useNavigate()

  const [register, meta] = useRegisterMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await register({ username, password })

    if (res?.data?.id) {
      navigate("/")
    }
  }

  return (
    <div className={styles.container}>
      <div>Register</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Username</label>
          <input
            type="username"
            id="username"
            name="username"
            onChange={e => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>

        <div
          style={{
            opacity: password !== confirmPassword || meta.isError ? 1 : 0,
            lineHeight: password !== confirmPassword || meta.isError ? 1 : 0,
            fontSize: 12,
            color: "red",
            transition: "opacity 0.3s, line-height 0.3s",
          }}
        >
          {(meta?.error as any)?.data?.error ||
            (meta.isError && "An error occurred.") ||
            "Passwords do not match"}
        </div>
        <button
          type="submit"
          disabled={!password || !username || password !== confirmPassword}
        >
          {meta.isLoading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm
