import { useEffect } from 'react';
import { useGetItemsByUserIdQuery } from '../../entities/items/itemsAPI';
import { selectUser } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import styles from './UserItemsList.module.css';
import ListingCard from '../../shared/components/ListingCard/ListingCard';

function UserItemsList() {
  const user = useAppSelector(selectUser);
  const { data, isLoading, isFetching, isError } = useGetItemsByUserIdQuery({ user_id: user?.id });

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }
  return (
    <div className={styles.container}>
      {data?.map((listing: any) => (
        <ListingCard
          key={listing.id}
          item={listing}
          url={'/profile/userItemsList'}
        />
      ))}
    </div>
  );
}

export default UserItemsList;
