import { useEffect } from 'react';
import { useGetItemsByUserIdQuery } from '../../entities/items/itemsAPI';
import { selectUser } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import styles from './UserItemsList.module.css';
import ListingCard from '../../shared/components/ListingCard/ListingCard';

function UserItemsList() {
  const user = useAppSelector(selectUser);
  const { data, isLoading, isFetching, isError } = useGetItemsByUserIdQuery({ user_id: user?.id });

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading items</p>;
  }

  const totalCount = data?.length ?? 0;
  const publishedCount = data?.filter(item => item.published)?.length ?? 0;

  return (
    <div className={styles.block}>
      <div className={styles.count}>
        <div className={styles.stat}> Total items: {totalCount}</div>
        <div className={styles.stat}> Published: {publishedCount}</div>
      </div>
      <div>
        <div className={styles.container}>
          {data?.map((listing: any) => (
            <ListingCard
              key={listing.id}
              item={listing}
              url={'/profile/userItemsList'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserItemsList;
