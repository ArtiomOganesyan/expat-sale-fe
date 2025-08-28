import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import styles from './ListingMasonry.module.css';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';
import { useLazyGetListingMasonryQuery } from '../../entities/items/itemsAPI';
import { Button, Paper, Typography } from '@mui/material';

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
  // Track when the initial page (offset 0) has completed loading (successfully or empty)
  const [firstPageLoaded, setFirstPageLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

  const [triggerLazyQuery, { data, isError, error, isFetching, isLoading }] = useLazyGetListingMasonryQuery();

  useEffect(() => {
    setOffset(0);
    setAllItems([]);
    setHasMore(true);
    setFirstPageLoaded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Immediately fetch first page for new filters (will mark loaded when response arrives)
    triggerLazyQuery({ ...queryParams, offset: 0 });
  }, [categoryId, title, isFree, isNew, minPrice, maxPrice, country, region, city, radius, userId, favorite]);

  useEffect(() => {
    // Fetch subsequent pages when offset increases
    if (offset > 0) {
      triggerLazyQuery({ ...queryParams, offset });
    }
  }, [offset]);

  useEffect(() => {
    if (data) {
      setAllItems(prevItems => (offset === 0 ? data : [...prevItems, ...data]));

      if (data.length < limit) {
        setHasMore(false);
      }
      // mark that first page finished (even if empty)
      if (offset === 0) {
        setFirstPageLoaded(true);
      }
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore && allItems.length > 0) {
      setOffset(prevOffset => prevOffset + limit);
    }
  }, [isFetching, hasMore, allItems.length]);

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

  // While initial page is loading, suppress empty UI to avoid flicker
  if (!firstPageLoaded && allItems.length === 0) {
    return (
      <div className={styles.container}>
        <LoadingComponent />
      </div>
    );
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

      {/* Category-specific empty state */}
      {!allItems.length && !isFetching && firstPageLoaded && categoryId ? (
        <Paper
          sx={{
            backgroundColor: '#fff8e1',
            padding: '1rem',
            marginTop: '1rem',
            gridColumn: 'span 2',
          }}
        >
          <Typography
            variant='h5'
            fontWeight={500}
            color='textPrimary'
          >
            No items in this category
          </Typography>
          <Typography sx={{ marginTop: 1, color: '#666' }}>
            There are no listings in the selected category yet. You can add the first one.
          </Typography>
          <Button
            sx={{ marginTop: '1rem' }}
            onClick={() => navigate('/item/new')}
            variant='contained'
          >
            Add Item
          </Button>
        </Paper>
      ) : null}

      {/* Generic empty state when no filters/category */}
      {!allItems.length && !isFetching && firstPageLoaded && !categoryId ? (
        <Paper
          sx={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            marginTop: '1rem',
            gridColumn: 'span 2',
          }}
        >
          <Typography
            variant='h4'
            fontWeight={400}
            color='error'
          >
            No Items Found...
          </Typography>
          <Button
            sx={{ marginTop: '2rem' }}
            onClick={() => navigate('/item/new')}
            variant='outlined'
          >
            Add Item
          </Button>
        </Paper>
      ) : null}

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
