import { useTranslation } from 'react-i18next';
import style from '../../EditItemForm.module.css';

function Actions({ edit, updateMeta, handleEdit, handleEditSave }: any) {
  const { t } = useTranslation('item');
  return (
    <div className={style.actions}>
      <button
        className={style.action_save}
        type='button'
        disabled={!edit || updateMeta.isLoading}
        onClick={handleEditSave}
      >
        {t('header.edit.actions.save')}
      </button>
      <button
        type='button'
        onClick={handleEdit}
      >
        {edit ? `${t('header.edit.actions.cancel')}` : `${t('header.edit.actions.edit')}`}
      </button>
    </div>
  );
}

export default Actions;
