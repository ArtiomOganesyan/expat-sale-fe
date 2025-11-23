import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUserProductStatQuery } from '../../entities/items/itemsAPI';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';
import { useTranslation } from 'react-i18next';

function UserProfileNavigation() {
  const navigate = useNavigate();
  const { t } = useTranslation('profile');

  const { isLoading, isFetching, isError, error } = useUserProductStatQuery();

  const moveToUserItems = () => {
    navigate('/profile/userItemsList');
  };

  if (isLoading || isFetching) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Button onClick={() => navigate('/item/new')}>{t('profile.buttons.actions.newitems')}</Button>
      <Button
        variant='outlined'
        onClick={moveToUserItems}
      >
        {t('profile.buttons.actions.myproducts')}
      </Button>
    </div>
  );
}

export default UserProfileNavigation;
