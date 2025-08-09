import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';
import { useUserProductStatQuery } from '../../entities/items/itemsAPI';

function UserItemsButton() {
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
    <div style={{ width: '100%' }}>
      <Button onClick={moveToUserItems}>My Products</Button>
    </div>
  );
}

export default UserItemsButton;
