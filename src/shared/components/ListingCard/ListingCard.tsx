import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router';
import { type Item } from '../../../entities/items/items.type';
import styles from './ListingCard.module.css';

function ListingCard({ item }: { item: Item }) {
  return (
    <div style={{ borderBottom: '1px solid #ccc' }}>
      {item.images?.length ? (
        <Carousel
          autoPlay={false}
          animation='slide'
          height={200}
          indicators={true}
        >
          {item.images.map(image => (
            <img
              style={{
                objectFit: 'contain',
                height: '200px',
                width: '100%',
              }}
              src={image.public_url}
              alt='product'
            />
          ))}
        </Carousel>
      ) : null}
      <div style={{ marginTop: '1rem' }}>
        <Link to={`/listing/${item.id}`}>
          <div>{item.title}</div>
          <div>
            {item.price} {item.currency}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
