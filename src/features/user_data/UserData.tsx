import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useLazyLogoutQuery } from "../../entities/user/authAPI"
import { useAppSelector } from "../../hooks/hooks"
import { selectUser } from "../../entities/user/userSlice"
import {
  useUpdateUserAvatarMutation,
  useUpdateUserMutation,
} from "../../entities/user/userAPI"
import { useNavigate } from "react-router"
import style from "./UserData.module.css"
import FormInput from "../../shared/FormInput/FormInput"
import ImageContainer from "./ui/ImageContainer"
import Actions from "./ui/Actions"
import FormError from "../../shared/FormError/FormError"
import { InputAdornment, Paper } from "@mui/material"

function UserData() {
  const [edit, setEdit] = useState(false)
  const [error, setError] = useState("")
  const [updatedUser, setUpdatedUser] = useState<any | null>(null)
  const [logout, logoutMeta] = useLazyLogoutQuery()

  const user = useAppSelector(selectUser)
  const [updateUserMutation, updateMeta] = useUpdateUserMutation()
  const [updateUserAvatarMutation, updateAvatarMeta] =
    useUpdateUserAvatarMutation()

  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setUpdatedUser(user)
  }, [user])

  useEffect(() => {
    if (updateMeta.isError) {
      setError((updateMeta?.error as any)?.data?.error || "An error occurred.")

      setTimeout(() => {
        setError("")
      }, 3000)
    }
  }, [updateMeta])

  const handleEdit = () => {
    setEdit(bool => {
      if (bool) {
        setUpdatedUser(() => user)
      }
      return !bool
    })
  }

  const handleEditSave = () => {
    setEdit(false)
    updateUserMutation({ id: user?.id, data: updatedUser })
  }

  const handleUpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value })
  }

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

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const updateUserAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)

    try {
      await updateUserAvatarMutation(formData)
    } catch (error) {
      console.error("Error updating avatar:", error)
    }
  }

  return (
    <Paper elevation={10} className={style.container}>
      <form>
        <div className={style.header}>
          <ImageContainer
            user={user}
            updateUserAvatar={updateUserAvatar}
            fileInputRef={fileInputRef}
            handleFileInputClick={handleFileInputClick}
          />

          <FormInput
            id="username"
            label="Username"
            type="text"
            name="username"
            placeholder="Username"
            value={updatedUser?.username || ""}
            disabled={!edit}
            onChange={handleUpdateUser}
          />

          <Actions
            edit={edit}
            updateMeta={updateMeta}
            handleEdit={handleEdit}
            handleEditSave={handleEditSave}
            handleLogout={handleLogout}
            logoutMeta={logoutMeta}
          />
        </div>
        <div className={style.break_line} />
        <div className={style.user_data}>
          <FormInput
            id="email"
            type="text"
            label="Email"
            placeholder="Email"
            name="email"
            value={updatedUser?.email || ""}
            disabled={!edit}
            onChange={handleUpdateUser}
          />
          <FormInput
            id="telegram"
            type="text"
            label="Telegram"
            placeholder="Telegram"
            name="telegram"
            value={updatedUser?.telegram || ""}
            disabled={!edit}
            onChange={handleUpdateUser}
          />
          <FormInput
            id="zalo"
            type="text"
            label="Zalo"
            placeholder="Zalo"
            name="zalo"
            value={updatedUser?.zalo || ""}
            disabled={!edit}
            onChange={handleUpdateUser}
          />
          <FormInput
            id="facebook"
            type="text"
            label="Facebook"
            placeholder="Facebook"
            name="facebook"
            value={updatedUser?.facebook || ""}
            disabled={!edit}
            onChange={handleUpdateUser}
          />
          <div className={style.phone_data}>
            <p>Phone Number</p>
            <FormInput
              id="phone_code"
              type="number"
              placeholder="Code"
              name="phone_code"
              value={updatedUser?.phone_code || ""}
              disabled={!edit}
              onChange={handleUpdateUser}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">+</InputAdornment>
                  ),
                },
              }}
            />
            <FormInput
              id="phone"
              type="number"
              placeholder="Phone number"
              name="phone"
              value={updatedUser?.phone || ""}
              disabled={!edit}
              onChange={handleUpdateUser}
            />
          </div>
        </div>
        <FormError error={error} />
      </form>
    </Paper>
  )
}

export default UserData
