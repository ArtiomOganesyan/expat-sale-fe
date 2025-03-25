import { useNavigate } from "react-router"
import { IconButton } from "@mui/material"
import AddBoxIcon from "@mui/icons-material/AddBox"

function UserItems() {
  const navigate = useNavigate()

  const createNewItem = () => {
    navigate("/item/new")
  }

  return (
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
        <IconButton onClick={createNewItem}>
          <AddBoxIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default UserItems
