import Carousel from 'react-material-ui-carousel';
import { Link, useNavigate } from 'react-router';
import { useRef, useState } from 'react';
import { useGetCurrencyRateQuery } from '../../../entities/currency/currencyAPI';
import { LOCAL_STORAGE_KEY } from '../../../utils/constants/Item';
import { useSwipeable } from 'react-swipeable';
import styles from './ListingCard.module.css';
import { type Item } from '../../../entities/items/types/items';
import { formatPrice } from '../../../utils/formatPrice';
import ImageWithSkeleton from '../ImageWithSkeleton/ImageWithSkeleton';

interface ListingCardProps {
  item: Item;
  url: string;
}

function ListingCard({ item, url }: ListingCardProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number>(0);
  const imgRef = useRef<HTMLDivElement | null>(null);

  const isService = item.category?.type === 'services';
  const itemPriceNum = Number(item.price);
  const shouldHidePrice = isService && (itemPriceNum === 0 || item.is_free);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIndex(prev => prev + 1),
    onSwipedRight: () => setIndex(prev => prev - 1),
    trackMouse: true,
  });

  const HOTSPOT_W = 0.6;
  const HOTSPOT_H = 0.6;

  const { ref: swipeRef, ...imageTapHandlers } = useSwipeable({
    onTap: (e: any) => {
      const ev: MouseEvent | TouchEvent | undefined = e?.event;
      if (!imgRef.current || !ev) return;
      let x: number | undefined, y: number | undefined;
      if ('changedTouches' in ev && ev.changedTouches?.length) {
        x = ev.changedTouches[0].clientX;
        y = ev.changedTouches[0].clientY;
      } else if ('clientX' in ev) {
        x = (ev as MouseEvent).clientX;
        y = (ev as MouseEvent).clientY;
      }
      if (x == null || y == null) return;

      const r = imgRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = Math.abs(x - cx);
      const dy = Math.abs(y - cy);

      const halfW = (r.width * HOTSPOT_W) / 2;
      const halfH = (r.height * HOTSPOT_H) / 2;

      if (dx <= halfW && dy <= halfH) {
        navigate(`${url}/${item.id}`);
      }
    },
    trackMouse: true,
  });

  const setRefs = (el: HTMLDivElement | null) => {
    imgRef.current = el;
    swipeRef(el);
  };

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

  let displayMainPrice = '';
  let displayConvertedPrice: string | null = null;

  if (!shouldHidePrice) {
    const itemCurrency = item.currency;
    const itemPrice = itemPriceNum;

    if (!selectedCurrency) {
      if (itemCurrency !== fallbackCurrency) {
        const converted = convertPrice(itemPrice, itemCurrency, fallbackCurrency);
        if (converted != null) {
          displayMainPrice = `${converted} ${fallbackCurrency}`;
        } else {
          displayMainPrice = `${formatPrice(itemPrice, itemCurrency)} ${itemCurrency}`;
        }
      } else {
        displayMainPrice = `${formatPrice(itemPrice, itemCurrency)} ${itemCurrency}`;
      }
    } else if (selectedCurrency === itemCurrency) {
      displayMainPrice = `${formatPrice(itemPrice, itemCurrency)} ${itemCurrency}`;
    } else {
      const converted = convertPrice(itemPrice, itemCurrency, selectedCurrency);
      if (converted != null) {
        displayMainPrice = `${formatPrice(itemPrice, itemCurrency)} ${itemCurrency}`;
        displayConvertedPrice = `(${formatPrice(converted, selectedCurrency)} ${selectedCurrency})`;
      } else {
        displayMainPrice = `${formatPrice(itemPrice, itemCurrency)} ${itemCurrency}`;
      }
    }
  }

  return (
    <div
      className={styles.card_container}
      style={{ gridColumn: item.xl ? 'span 2' : 'auto', gridRow: item.xl ? 'span 2' : 'auto' }}
      {...handlers}
    >
      <div
        ref={setRefs}
        {...imageTapHandlers}
        style={{ background: '#fafafa', borderRadius: 12, overflow: 'hidden', height: item.xl ? 400 : 200, cursor: 'pointer' }}
        role='link'
        aria-label='Open item'
      >
        <Carousel
          index={index}
          // @ts-ignore
          onChange={now => setIndex(now)}
          autoPlay={true}
          animation='slide'
          height={item.xl ? 400 : 200}
        >
          {imagesToShow.map(image => (
            <ImageWithSkeleton
              key={image.public_url}
              src={image.public_url}
              alt={'product'}
              height={item.xl ? 400 : 200}
            />
          ))}
        </Carousel>
      </div>

      <div className={styles.cardContent}>
        <Link
          to={`${url}/${item.id}`}
          className={styles.cardLink}
        >
          <div className={styles.title}>{item.title}</div>

          <div
            className={`${styles.price} ${styles.mainPrice}`}
            style={{ visibility: shouldHidePrice ? 'hidden' : 'visible' }}
          >
            {shouldHidePrice ? '\u00A0' : displayMainPrice}
          </div>

          {!shouldHidePrice && displayConvertedPrice && <div className={styles.price}>{displayConvertedPrice}</div>}
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
