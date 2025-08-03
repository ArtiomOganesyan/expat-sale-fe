import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router';
import { type Item } from '../../../entities/items/items.type';
import styles from './ListingCard.module.css';
import { useSwipeable } from 'react-swipeable';
import { useState } from 'react';

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

  return (
    <div
      className={styles.block}
      {...handlers}
    >
      <Carousel
        index={index}
        // @ts-ignore
        onChange={now => setIndex(now)}
        autoPlay={false}
        animation='slide'
        height={173}
        indicators={true}
      >
        {imagesToShow.map(image => (
          <img
            key={image.public_url}
            className={styles.image}
            src={image.public_url}
            alt='product'
          />
        ))}
      </Carousel>

      <div>
        <Link to={`${url}/${item.id}`}>
          <div className={styles.title}>{item.title}</div>
          <div className={styles.price}>
            {item.price} {item.currency}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ListingCard;
