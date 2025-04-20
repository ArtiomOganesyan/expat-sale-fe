import IconButton from "@mui/material/IconButton"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { useNavigate } from "react-router"

import styles from "./NewItem.module.css"

function NewItemHeader() {
  const navigate = useNavigate()

  return (
    <div className={styles.header_container}>
      <h2>Create New Item</h2>
      <IconButton onClick={() => navigate("/profile")}>
        <ArrowBackIosNewIcon />
      </IconButton>
    </div>
  )
}

export default NewItemHeader
