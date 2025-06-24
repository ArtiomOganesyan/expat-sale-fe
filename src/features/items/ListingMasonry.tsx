import { useLocation } from 'react-router';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import styles from './ListingMasonry.module.css';
import { useGetListingMasonryQuery } from '../../entities/items/itemsAPI';

function ListingMasonry() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');
  const title = searchParams.get('title');

  console.log(title);

  const isFree = searchParams.get('is_free');

  const { data, isError, error, isLoading, isFetching } = useGetListingMasonryQuery({
    limit: 10,
    offset: 0,
    categoryId,
    isFree,
    title,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error(error);
    return <div>Error: {(error as any)?.message || (error as any)?.error || 'error'}</div>;
  }

  return (
    <div className={styles.container}>
      {data?.map(listing => (
        <ListingCard
          key={listing.id}
          item={listing}
          url={'/listing'}
        />
      ))}
    </div>
  );
}

export default ListingMasonry;
