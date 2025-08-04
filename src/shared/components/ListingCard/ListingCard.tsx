import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router';
import { type Item } from '../../../entities/items/items.type';
import { useGetCurrencyRateQuery } from '../../../entities/currency/currencyAPI';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/Item';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  item: Item;
  url: string;
}

function ListingCard({ item, url }: ListingCardProps) {
  const [index, setIndex] = useState<number>(0);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(prev => prev + 1),
    onSwipedRight: () => setIndex(prev => prev - 1),
    trackMouse: true,
  });

  const imagesToShow = item.images?.length
    ? item.images
    : [
        {
          public_url:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT__ALALbxeQ1J6lQcoC8BFLMZt0sWAy7J2vEDC3fO4Lj1bJCorR9TbehXdcTuaa9XytRM&usqp=CAU',
        },
      ];

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

  const itemPrice = Number(item.price);
  const itemCurrency = item.currency;

  let displayMainPrice = `${itemPrice} ${itemCurrency}`;
  let displayConvertedPrice: string | null = null;

  if (!selectedCurrency) {
    if (itemCurrency !== fallbackCurrency) {
      const converted = convertPrice(itemPrice, itemCurrency, fallbackCurrency);
      if (converted != null) {
        displayMainPrice = `${converted} ${fallbackCurrency}`;
      }
    }
  } else if (selectedCurrency === itemCurrency) {
    displayMainPrice = `${itemPrice} ${itemCurrency}`;
  } else {
    const converted = convertPrice(itemPrice, itemCurrency, selectedCurrency);
    if (converted != null) {
      displayMainPrice = `${itemPrice} ${itemCurrency}`;
      displayConvertedPrice = `(${converted} ${selectedCurrency})`;
    }
  }

  return (
    <div className={styles.cardContainer} {...handlers}>
      <Carousel
        index={index}
        // @ts-ignore
        onChange={now => setIndex(now)}
        autoPlay={false}
        animation='slide'
        height={200}
        indicators={true}
      >
        {imagesToShow.map(image => (
          <img
            key={image.public_url}
            className={styles.carouselImage}
            src={image.public_url}
            alt='product'
          />
        ))}
      </Carousel>

      <div className={styles.cardContent}>
        <Link to={`${url}/${item.id}`} className={styles.cardLink}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.mainPrice}>{displayMainPrice}</div>
          {displayConvertedPrice && <div className={styles.convertedPrice}>{displayConvertedPrice}</div>}
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
