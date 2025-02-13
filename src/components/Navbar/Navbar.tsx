import { Link } from "react-router"
import styles from "./Navbar.module.css"
import { useAppSelector } from "../../app/hooks"
import { selectUser } from "../../features/user/userSlice"

function Navbar() {
  const user = useAppSelector(selectUser)

  const authLinks = () => {
    return (
      <>
        <li>
          <Link to={"/profile"}>profile</Link>
        </li>
      </>
    )
  }

  const nonAuthLinks = () => {
    return (
      <>
        <li>
          <Link to={"/auth/login"}>item 3</Link>
        </li>
        <li>
          <Link to={"/auth/register"}>item 4</Link>
        </li>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <ul className={styles.navbar}>
        <li>
          <Link to={"/"}>item 1</Link>
        </li>
        <li>
          <Link to={"/about"}>item 2</Link>
        </li>

        {user?.id ? authLinks() : nonAuthLinks()}
      </ul>
    </div>
  )
}

export default Navbar
