import { Link } from "react-router"
import { useAppSelector } from "../../hooks/hooks"
import { selectUser } from "../../entities/user/userSlice"

import styles from "./Navbar.module.css"

function Navbar() {
  const user = useAppSelector(selectUser)

  return (
    <div className={styles.container}>
      <ul className={styles.navbar}>
        <li>
          <Link to={"/"}>Listing</Link>
        </li>
        <li>
          <Link to={"/about"}>item 2</Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar
