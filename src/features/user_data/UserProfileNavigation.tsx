import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUserProductStatQuery } from '../../entities/items/itemsAPI';

function UserProfileNavigation() {
  const navigate = useNavigate();

  const { isLoading, isFetching, isError, error } = useUserProductStatQuery();

  const moveToUserItems = () => {
    navigate('/profile/userItemsList');
  };

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
      <Button
        onClick={moveToUserItems}
        style={{ flex: 2 }}
      >
        My Products
      </Button>
      <Button
        onClick={() => navigate('/item/new')}
        style={{ flex: 1 }}
      >
        New Item
      </Button>
    </div>
  );
}

export default UserProfileNavigation;
