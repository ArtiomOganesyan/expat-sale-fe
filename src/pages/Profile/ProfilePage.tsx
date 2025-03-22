import UserData from "../../features/Userdata/UserData"
import UserItems from "../../features/UserItems/UserItems"
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
