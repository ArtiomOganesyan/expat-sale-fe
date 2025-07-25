import { useLocation } from 'react-router';
import ListingCard from '../../shared/components/ListingCard/ListingCard';
import styles from './ListingMasonry.module.css';
import { useGetListingMasonryQuery } from '../../entities/items/itemsAPI';
import { useGetCurrencyRateQuery } from '../../entities/currency/currencyAPI';

const LOCAL_STORAGE_KEY = 'userCurrency';

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

  const { data, isError, error, isLoading } = useGetListingMasonryQuery({
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

  const { data: rates = [] } = useGetCurrencyRateQuery();

  const fallbackCurrency = 'usd';
  const selectedCurrency = localStorage.getItem(LOCAL_STORAGE_KEY);

  const getRate = (iso: string): number | null => {
    const rate = rates.find(r => r.iso_4217 === iso)?.rate;
    return rate ? Number(rate) : null;
  };

  const convertPrice = (price: number, from: string, to: string): number | null => {
    const fromRate = getRate(from);
    const toRate = getRate(to);
    if (!fromRate || !toRate) return null;
    const result = (price / fromRate) * toRate;
    if (result < 0.01 && result > 0) return 0.01;
    return +result.toFixed(2);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error(error);
    return <div>Error: {(error as any)?.message || (error as any)?.error || 'error'}</div>;
  }

  return (
    <div className={styles.container}>
      {data?.map(listing => {
        const price = Number(listing.price);
        const itemCurrency = listing.currency;

        if (!selectedCurrency) {
          const convertedPrice = itemCurrency !== fallbackCurrency
            ? convertPrice(price, itemCurrency, fallbackCurrency)
            : price;

          return (
            <ListingCard
              key={listing.id}
              item={{ ...listing, price: convertedPrice.toString(), currency: fallbackCurrency }}
              url='/listing'
            />
          );
        }

        if (selectedCurrency === itemCurrency) {
          return (
            <ListingCard
              key={listing.id}
              item={listing}
              url='/listing'
            />
          );
        }

        const convertedPrice = convertPrice(price, itemCurrency, selectedCurrency);
        return (
          <ListingCard
            key={listing.id}
            item={listing}
            url='/listing'
            convertedPrice={convertedPrice}
            convertedCurrency={selectedCurrency}
          />
        );
      })}
    </div>
  );
}

export default ListingMasonry;