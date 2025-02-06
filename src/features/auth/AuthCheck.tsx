import { useEffect } from "react"
import { useAuthCheckQuery } from "./authAPI"

function AuthCheck() {
  const { error, isLoading } = useAuthCheckQuery({})

  useEffect(() => {
    if (error) {
      console.error("Error loading user", error)
    }
  }, [error])

  if (isLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9999,
          background: "white",
        }}
      >
        Loading....
      </div>
    )
  }

  return null
}

export default AuthCheck
