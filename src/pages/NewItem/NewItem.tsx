import styles from "./NewItemPage.module.css"
import NewItemHeader from "../../features/new_item/NewItemHeader"
import NewItemForm from "../../features/new_item/NewItemForm"
import { Paper } from "@mui/material"

function NewItem() {
  return (
    <Paper elevation={10} className={styles.container}>
      <NewItemHeader />
      <NewItemForm />
    </Paper>
  )
}

export default NewItem
