import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router';
import { type Item } from '../../../entities/items/items.type';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  item: Item;
  url: string;
  convertedPrice?: number | null;
  convertedCurrency?: string | null;
}

function ListingCard({ item, url, convertedPrice, convertedCurrency }: ListingCardProps) {
  const hasConverted = convertedPrice != null && convertedCurrency != null;
  const isSameCurrency = item.currency === convertedCurrency;

  return (
    <div className={styles.cardContainer}>
      {item.images?.length ? (
        <Carousel
          autoPlay={false}
          animation="slide"
          height={200}
          indicators={true}
        >
          {item.images.map(image => (
            <img
              key={image.public_url}
              className={styles.carouselImage}
              src={image.public_url}
              alt="product"
            />
          ))}
        </Carousel>
      ) : null}

      <div className={styles.cardContent}>
        <Link to={`${url}/${item.id}`} className={styles.cardLink}>
          <div>{item.title}</div>

          {hasConverted ? (
            isSameCurrency ? (
              <div className={styles.mainPrice}>
                {convertedPrice} {convertedCurrency}
              </div>
            ) : (
              <>
                <div className={styles.mainPrice}>
                  {item.price} {item.currency}
                </div>
                <div className={styles.convertedPrice}>
                  ({convertedPrice} {convertedCurrency})
                </div>
              </>
            )
          ) : (
            <div className={styles.mainPrice}>
              {item.price} {item.currency}
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
