import { useNavigate } from "react-router"
import { useLazyLogoutQuery } from "../../features/auth/authAPI"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/user/userSlice"
import { type ChangeEvent, useEffect, useRef, useState } from "react"
import {
  useUpdateUserAvatarMutation,
  useUpdateUserMutation,
} from "../../features/user/userAPI"

const imgSrc =
  "data:image/png;base64,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"

function Profile() {
  const [edit, setEdit] = useState(false)
  const [updatedUser, setUpdatedUser] = useState<any | null>(null)
  const [updatedAvatar, setUpdatedAvatar] = useState<any | null>(null)
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

  const handleEdit = () => {
    setEdit(bool => {
      if (bool) {
        setUpdatedUser(() => user)
      }
      return !bool
    })
    if (edit) {
      handleEditSave()
    }
  }

  const handleEditSave = () => {
    console.log({ updatedUser })
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

  const createNewItem = () => {
    navigate("/item/new")
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
      console.log("Avatar updated successfully")
    } catch (error) {
      console.error("Error updating avatar:", error)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "90vw",
          padding: "1rem",
          margin: "1rem auto",
          border: "1px solid #ccc",
          borderRadius: 10,
        }}
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 .25rem",
            }}
          >
            <img
              width={50}
              height={50}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ccc",
              }}
              src={user?.avatar || imgSrc}
              alt="user_avatar"
            />
            <input
              name="username"
              placeholder="Username"
              value={updatedUser?.username || ""}
              disabled={!edit}
              onChange={handleUpdateUser}
            />
            <button type="button" onClick={handleEdit}>
              {edit ? "Cancel" : "Edit"}
            </button>
          </div>
          <div
            style={{
              width: "100%",
              border: "1px solid #ccc",
              margin: "1rem 0",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 .25rem",
                }}
              >
                <button
                  type="button"
                  disabled={!edit}
                  onClick={handleFileInputClick}
                >
                  Add New Avatar
                </button>
                <input
                  style={{
                    display: "none",
                  }}
                  type="file"
                  name="image"
                  disabled={!edit}
                  onChange={updateUserAvatar}
                  ref={fileInputRef}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0 .25rem",
                }}
              >
                <label>Email:</label>
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={updatedUser?.email || ""}
                  disabled={!edit}
                  onChange={handleUpdateUser}
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 .25rem",
                  }}
                >
                  <label>Telegram:</label>
                  <input
                    type="text"
                    placeholder="Telegram"
                    name="telegram"
                    value={updatedUser?.telegram || ""}
                    disabled={!edit}
                    onChange={handleUpdateUser}
                  />
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 .25rem",
                  }}
                >
                  <label>Zalo:</label>
                  <input
                    type="text"
                    placeholder="Zalo"
                    name="zalo"
                    value={updatedUser?.zalo || ""}
                    disabled={!edit}
                    onChange={handleUpdateUser}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              opacity: updateMeta.isError ? 1 : 0,
              lineHeight: updateMeta.isError ? 1 : 0,
              fontSize: 12,
              color: "red",
              transition: "opacity 0.3s, line-height 0.3s",
            }}
          >
            {(updateMeta?.error as any)?.data?.error ||
              (updateMeta.isError && "An error occurred.")}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              disabled={!edit || updateMeta.isLoading}
              onClick={handleEdit}
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => handleLogout()}
              disabled={logoutMeta.isLoading}
            >
              Logout
            </button>
          </div>
        </form>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "90vw",
          padding: "1rem",
          margin: "1rem auto",
          border: "1px solid #ccc",
          borderRadius: 10,
        }}
      >
        <div>
          <div>My Listings: __AMOUNT__</div>
          <button onClick={createNewItem}>+</button>
        </div>
      </div>
    </div>
  )
}

export default Profile
