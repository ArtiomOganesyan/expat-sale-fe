import { Link } from 'react-router';
import { type Category } from '../../../entities/categories/categories.type';
import { Paper } from '@mui/material';

function CategoryItem({ category }: { category: Category }) {
  return (
    <div style={{ padding: '0.5rem', position: 'relative', width: '50%' }}>
      <Link to={`/listing?categoryId=${category.id}`}>
        <Paper
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundImage:
              "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT__ALALbxeQ1J6lQcoC8BFLMZt0sWAy7J2vEDC3fO4Lj1bJCorR9TbehXdcTuaa9XytRM&usqp=CAU')",
            backgroundSize: 'cover',
            height: '125px',
          }}
        >
          <span
            style={{
              margin: '.25rem 1rem',
              width: '50%',
              background: 'rgba(255, 255, 255, 0.75)',
              padding: '1rem',
              borderRadius: '8px',
            }}
          >
            {category.name}
          </span>
        </Paper>
      </Link>
    </div>
  );
}

export default CategoryItem;
