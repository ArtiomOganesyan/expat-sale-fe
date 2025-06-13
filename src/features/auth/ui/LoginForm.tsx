import React, { useEffect } from "react"
import styles from "./AuthForm.module.css"
import { useLoginMutation } from "../../../entities/user/authAPI"
import { useNavigate } from "react-router"
import FormInput from "../../../shared/components/FormInput/FormInput"
import FormError from "../../../shared/components/FormError/FormError"
import { Button } from "@mui/material"

function LoginForm() {
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")

  const navigate = useNavigate()

  const [login, meta] = useLoginMutation()

  useEffect(() => {
    if (meta.isError) {
      setError((meta?.error as any)?.data?.error || "An error occurred.")

      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }, [meta])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await login({ username, password })

    if (res?.data?.id) {
      navigate("/")
    }
  }

  return (
    <div className={styles.container}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <FormInput
          label={"Username"}
          type={"text"}
          id={"username"}
          name={"username"}
          placeholder={"What's your username?"}
          onChange={e => setUsername(e.target.value)}
        />
        <FormInput
          label={"Password"}
          type={"password"}
          id={"password"}
          name={"password"}
          placeholder={"What was your password?"}
          onChange={e => setPassword(e.target.value)}
        />
        <FormError error={error} />
        <Button type="submit" disabled={!password || !username}>
          {meta.isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
