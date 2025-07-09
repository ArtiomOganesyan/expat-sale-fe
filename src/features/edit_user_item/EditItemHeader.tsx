import IconButton from "@mui/material/IconButton"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import { useNavigate } from "react-router"

import styles from "./EditItemForm.module.css"

function EditItemHeader() {
  const navigate = useNavigate()

  return (
    <div className={styles.header_container}>
      <h2>Return to Item List</h2>
      <IconButton onClick={() => navigate("/profile/userItemsList")}>
        <ArrowBackIosNewIcon />
      </IconButton>
    </div>
  )
}

export default EditItemHeader