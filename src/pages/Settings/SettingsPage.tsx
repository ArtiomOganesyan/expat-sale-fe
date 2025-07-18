import styles from "./SettingsPage.module.css"
import Settings from "../../features/settings/Settings"

const SettingsPage = () => {
  return (
    <div className={styles.container}>
      <h2>Settings</h2>
      <Settings />
    </div>
  )
}

export default SettingsPage
