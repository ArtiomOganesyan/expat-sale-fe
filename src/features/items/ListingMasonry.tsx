import { useLocation } from 'react-router';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import styles from './ListingMasonry.module.css';
import { useGetListingMasonryQuery } from '../../entities/items/itemsAPI';

function ListingMasonry() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');
  const title = searchParams.get('title');
  const isNew = searchParams.get('isNew');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const country = searchParams.get('country');
  const region = searchParams.get('region');
  const city = searchParams.get('city');
  const radius = searchParams.get('radius');
  const userId = searchParams.get('userId');

  const isFree = searchParams.get('is_free');

  const { data, isError, error, isLoading, isFetching } = useGetListingMasonryQuery({
    limit: 10,
    offset: 0,
    categoryId,
    isFree: isFree === 'true',
    title,
    isNew: isNew === 'true',
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    country,
    region,
    city,
    radius: radius ? parseFloat(radius) : null,
    userId,
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
        />
      ))}
    </div>
  );
}

export default ListingMasonry;
