import styles from "./NewItemPage.module.css"
import NewItemHeader from "../../features/new_item/NewItemHeader"
import NewItemForm from "../../features/new_item/NewItemForm"
import { Paper } from "@mui/material"

function NewItem() {
  return (
    <div className={styles.container}>
      <NewItemHeader />
      <NewItemForm />
    </div>
  )
}

export default NewItem
