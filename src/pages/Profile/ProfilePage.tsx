import UserData from "../../features/user_data/UserData"
import UserItemsButton from "../../features/user_items/UserItemsButton"
import style from "./ProfilePage.module.css"

function ProfilePage() {
  return (
    <div className={style.container}>
      <UserData />
      <UserItemsButton />
    </div>
  )
}

export default ProfilePage
