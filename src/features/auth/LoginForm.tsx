import React from "react"
import styles from "./AuthForm.module.css"
import { useLoginMutation } from "./authAPI"
import { useNavigate } from "react-router"

function LoginForm() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const navigate = useNavigate()

  const [login, meta] = useLoginMutation()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await login({ username, password })

    if (res?.data?.id) {
      navigate("/")
    }
  }

  return (
    <div className={styles.container}>
      <div>Login</div>
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
        <div
          style={{
            opacity: meta.isError ? 1 : 0,
            lineHeight: meta.isError ? 1 : 0,
            fontSize: 12,
            color: "red",
            transition: "opacity 0.3s, line-height 0.3s",
          }}
        >
          {(meta?.error as any)?.data?.error ||
            (meta.isError && "An error occurred.")}
        </div>
        <button type="submit" disabled={!password || !username}>
          {meta.isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginForm
