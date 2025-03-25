import style from "../UserData.module.css"

function Actions({
  edit,
  updateMeta,
  handleEdit,
  handleEditSave,
  handleLogout,
  logoutMeta,
}: any) {
  return (
    <div className={style.actions}>
      <button
        className={style.action_save}
        type="button"
        disabled={!edit || updateMeta.isLoading}
        onClick={handleEditSave}
      >
        Save
      </button>
      <button type="button" onClick={handleEdit}>
        {edit ? "Cancel" : "Edit"}
      </button>
      <button
        className={style.action_logout}
        type="button"
        onClick={() => handleLogout()}
        disabled={logoutMeta.isLoading}
      >
        Logout
      </button>
    </div>
  )
}

export default Actions
