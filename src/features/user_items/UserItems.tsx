import { useNavigate } from "react-router"
import { IconButton, Paper } from "@mui/material"
import AddBoxIcon from "@mui/icons-material/AddBox"
import { useGetItemsByUserIdQuery } from "../../entities/items/itemsAPI"
import { useAppSelector } from "../../hooks/hooks"
import { selectUser } from "../../entities/user/userSlice"

function UserItems() {
  const navigate = useNavigate()
  const user = useAppSelector(selectUser)

  const { data, isLoading, isFetching, isError, error } =
    useGetItemsByUserIdQuery({ user_id: user?.id })

  const createNewItem = () => {
    navigate("/item/new")
  }

  if (isLoading || isFetching) {
    return <p>Loading...</p>
  }

  if (isError) {
    return <p>Error loading items</p>
  }

  return (
    <Paper
      elevation={10}
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <p>My Listings: {data.length}</p>
        <IconButton onClick={createNewItem}>
          <AddBoxIcon />
        </IconButton>
      </div>
    </Paper>
  )
}

export default UserItems
