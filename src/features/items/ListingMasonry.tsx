import { useLocation } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import styles from './ListingMasonry.module.css';
import { useGetListingMasonryQuery } from '../../entities/items/itemsAPI';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';

function ListingMasonry() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');
  const title = searchParams.get('title');
  const isFree = searchParams.get('isFree');
  const isNew = searchParams.get('isNew');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const country = searchParams.get('country');
  const region = searchParams.get('region');
  const city = searchParams.get('city');
  const radius = searchParams.get('radius');
  const userId = searchParams.get('userId');
  const favorite = searchParams.get('favorite');

  const [offset, setOffset] = useState(0);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const limit = 10;

  const queryParams = {
    limit: 10,
    offset,
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
    favorite: favorite === 'true',
  };

  const { data, isError, error, isFetching } = useGetListingMasonryQuery(queryParams);

  useEffect(() => {
    setOffset(0);
    setAllItems([]);
    setHasMore(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId, title, isFree, isNew, minPrice, maxPrice, country, region, city, radius, userId, favorite]);

  useEffect(() => {
    if (data) {
      setAllItems(prevItems => (offset === 0 ? data : [...prevItems, ...data]));

      if (data.length < limit) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setOffset(prevOffset => prevOffset + limit);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, isFetching]);

  if (isError) {
    console.error(error);
    return <div>Error: {(error as any)?.message || (error as any)?.error || 'error'}</div>;
  }

  return (
    <div className={styles.container}>
      {allItems.map(listing => (
        <ListingCard
          key={listing.id}
          item={listing}
          url='/listing'
        />
      ))}

      {isFetching && <div style={{ textAlign: 'center', padding: '20px' }}>Loading more items...</div>}

      <div
        ref={loadingRef}
        style={{ height: '20px', width: '100%' }}
      />

      {!hasMore && allItems.length > 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No more items to load</div>
      )}

      {isFetching && allItems.length === 0 && <LoadingComponent />}
    </div>
  );
}

export default ListingMasonry;
