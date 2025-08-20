import { Link } from 'react-router';
import { type Category } from '../../../entities/categories/categories.type';
import { Paper, Typography } from '@mui/material';
import ClothingImage from '../../../assets/images/cloth.jpg';
import ElectronicsImage from '../../../assets/images/electronics.jpg';
import FurnitureImage from '../../../assets/images/furniture.jpg';
import KidsImage from '../../../assets/images/kids.jpg';
import KitchenImage from '../../../assets/images/kitchen.jpg';
import OtherImage from '../../../assets/images/other.jpg';
import PetsImage from '../../../assets/images/pets.jpg';
import RelocationImage from '../../../assets/images/relocation.jpg';
import ServicesImage from '../../../assets/images/services.jpg';
import SportsImage from '../../../assets/images/sports.jpg';

function CategoryItem({ category }: { category: Category }) {
  const imageUrl = (name: string) => {
    switch (name) {
      case 'clothing':
        return ClothingImage;
      case 'electronics':
        return ElectronicsImage;
      case 'furniture':
        return FurnitureImage;
      case 'baby-and-kids':
        return KidsImage;
      case 'kitchen-and-dining':
        return KitchenImage;
      case 'other':
        return OtherImage;
      case 'pets':
        return PetsImage;
      case 'relocation':
        return RelocationImage;
      case 'services':
        return ServicesImage;
      case 'sports-and-fitness':
        return SportsImage;
      default:
        return OtherImage;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Link to={`/listing?categoryId=${category.id}`}>
        <Paper
          style={{
            width: '100%',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundImage: `url(${imageUrl(category.slug)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '125px',
          }}
        >
          <Typography
            sx={{
              background: 'rgba(255, 255, 255, 0.75)',
              padding: ' 0 1rem',
              letterSpacing: '-1px',
            }}
            variant='h6'
            fontWeight={300}
          >
            {category.name}
          </Typography>
        </Paper>
      </Link>
    </div>
  );
}

export default CategoryItem;
