import styles from "./UserItemEdit.module.css"
import { Paper } from "@mui/material"
import EditItemHeader from "../../features/edit_user_item/EditItemHeader"
import EditItemForm from "../../features/edit_user_item/EditItemForm"

function NewItem() {
  return (
    <Paper elevation={10} className={styles.container}>
      <EditItemHeader />
      <EditItemForm />
    </Paper>
  )
}

export default NewItem