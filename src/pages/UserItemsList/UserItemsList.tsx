import { useState, useEffect, useRef, useCallback } from 'react';
import { useUserProductStatQuery, useGetListingMasonryQuery } from '../../entities/items/itemsAPI';
import { selectUser } from '../../entities/user/userSlice';
import { useAppSelector } from '../../hooks/hooks';
import styles from './UserItemsList.module.css';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import { IconButton, Paper, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';
import { Item } from '../../entities/items/types/items';
import AddBoxIcon from '@mui/icons-material/AddBox';

function UserItemsList() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [offset, setOffset] = useState(0);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const limit = 10;

  const { data, isError, error, isFetching } = useGetListingMasonryQuery(
    { userId: user?.id, limit, offset },
    { skip: !user?.id }
  );

  const { data: userStats, isError: userStatsIsError } = useUserProductStatQuery();

  useEffect(() => {
    setOffset(0);
    setAllItems([]);
    setHasMore(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user?.id]);

  useEffect(() => {
    if (data) {
      setAllItems(prev => (offset === 0 ? data : [...prev, ...data]));
      if (data.length < limit) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

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
      >
        <div className={styles.title_container}>
          <IconButton onClick={() => navigate('/profile')}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <div className={styles.title}>My Products</div>
          <IconButton onClick={() => navigate('/item/new')}>
            <AddBoxIcon sx={{ fontSize: '32px' }} />
          </IconButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.stat}> Total items: {userStats?.total}</div>
          <div className={styles.stat}> Published: {userStats?.published} / 5</div>
        </div>
      </Paper>
      <div>
        <div className={styles.list}>
          {allItems.map(listing => (
            <ListingCard
              key={listing.id}
              item={listing}
              url={'/profile/userItemsList'}
            />
          ))}
        </div>
        {isFetching && <div style={{ textAlign: 'center', padding: '20px' }}>Loading more items...</div>}
        <div
          ref={loadingRef}
          style={{ height: '20px', width: '100%' }}
        />
        {!hasMore && allItems.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No more items to load</div>
        )}
        {isFetching && allItems.length === 0 && <div>Loading...</div>}
      </div>
    </div>
  );
}

export default UserItemsList;
