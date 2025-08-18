import { useState, useEffect, useRef, useCallback } from 'react';
import { useUserProductStatQuery, useGetListingMasonryQuery, useLazyGetListingMasonryQuery } from '../../entities/items/itemsAPI';
import { selectUser } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import styles from './UserItemsList.module.css';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import { Button, IconButton, Paper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';
import { Item } from '../../entities/items/types/items';
import { LoadingComponent } from '../../widget/Loading/LoadingComponent';

function UserItemsList() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [offset, setOffset] = useState(0);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const limit = 10;
  const query = { limit, offset, userId: user?.id };

  const { data: userStats, isError: userStatsIsError } = useUserProductStatQuery();

  useEffect(() => {
    setOffset(0);
    setAllItems([]);
    setHasMore(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user?.id]);

  const [triggerLazyQuery, { data, isError, error, isFetching, isLoading }] = useLazyGetListingMasonryQuery();

  useEffect(() => {
    triggerLazyQuery(query);
  }, [offset]);

  useEffect(() => {
    if (data) {
      setAllItems(prevItems => (offset === 0 ? data : [...prevItems, ...data]));

      if (data.length < limit) {
        setHasMore(false);
      }
    }
  }, [data]);

  useEffect(() => {
    let lastScroll = 0;
    const onScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
      lastScroll = currentScroll;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const loadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setOffset(prev => prev + limit);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isFetching) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadingRef.current) observerRef.current.observe(loadingRef.current);

    return () => observerRef.current?.disconnect();
  }, [loadMore, hasMore, isFetching]);

  if (isError && offset === 0) {
    console.error(error);
    return <p>Error loading items</p>;
  }

  return (
    <div className={styles.container}>
      <Paper
        elevation={10}
        className={styles.header_container}
        sx={{
          height: collapsed ? 64 : 186,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div className={styles.title_container}>
          <IconButton
            className={styles.title_icon}
            onClick={() => navigate('/profile')}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <div className={styles.title}>My Products</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div className={styles.stat}> Total items: {userStats?.total}</div>
          <div className={styles.stat}> Published: {userStats?.published} / 5</div>
        </div>
        <Button onClick={() => navigate('/item/new')}>Add New Item</Button>
      </Paper>
      <div>
        {allItems.length === 0 && !isLoading ? (
          <div
            className={styles.list}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            No items found
          </div>
        ) : (
          <div className={styles.list}>
            {allItems.map(listing => (
              <ListingCard
                key={listing.id}
                item={listing}
                url={'/profile/userItemsList'}
              />
            ))}
          </div>
        )}
        {isLoading && <div style={{ textAlign: 'center', padding: '20px' }}>Loading more items...</div>}
        <div
          ref={loadingRef}
          style={{ height: '20px', width: '100%' }}
        />
        {!hasMore && allItems.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No more items to load</div>
        )}
        {isFetching && allItems.length === 0 && <LoadingComponent />}
      </div>
    </div>
  );
}

export default UserItemsList;
