import UserData from "../../features/user_data/UserData"
import UserItems from "../../features/user_items/UserItems"
import style from "./ProfilePage.module.css"

function ProfilePage() {
  return (
    <div className={style.container}>
      <UserData />
      <UserItems />
    </div>
  )
}

export default ProfilePage
