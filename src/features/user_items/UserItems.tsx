import { useNavigate } from 'react-router';
import { Button, IconButton, Paper } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { useGetItemsByUserIdQuery } from '../../entities/items/itemsAPI';
import { useAppSelector } from '../../hooks/hooks';
import { selectUser } from '../../entities/user/userSlice';

function UserItems() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const { data, isLoading, isFetching, isError, error } = useGetItemsByUserIdQuery({ user_id: user?.id });

  const createNewItem = () => {
    navigate('/item/new');
  };
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
    <div style={{ width: '100%', padding: '0 1rem' }}>
      <Button onClick={moveToUserItems}>My Products</Button>
    </div>
  );
}

export default UserItems;
