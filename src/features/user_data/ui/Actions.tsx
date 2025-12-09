import { useTranslation } from 'react-i18next';
import style from '../UserData.module.css';

function Actions({ edit, updateMeta, handleEdit, handleEditSave, handleLogout, logoutMeta }: any) {
  const { t } = useTranslation('profile');
  return (
    <div className={style.actions}>
      <button
        className={style.action_save}
        type='button'
        disabled={!edit || updateMeta.isLoading}
        onClick={handleEditSave}
      >
        {t('profile.edit.actions.save')}
      </button>
      <button
        type='button'
        onClick={handleEdit}
      >
        {edit ? `${t('profile.edit.actions.cancel')}` : `${t('profile.edit.actions.edit')}`}
      </button>
      <button
        className={style.action_logout}
        type='button'
        onClick={() => handleLogout()}
        disabled={logoutMeta.isLoading}
      >
        {t('profile.edit.actions.logout')}
      </button>
    </div>
  );
}

export default Actions;
