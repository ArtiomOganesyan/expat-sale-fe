import { Link } from 'react-router';
import { type Category } from '../../entities/categories/categories.type';
import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';

function ListingMenu() {
  const { data: categories, isLoading } = useGetParentCategoriesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  const renderCategoryItem = (category: Category) => {
    return (
      <div
        key={category.id}
        style={{ padding: '1rem', position: 'relative', width: '50%' }}
      >
        <Link to={`/listing?categoryId=${category.id}`}>
          <div
            style={{
              border: '1px solid grey',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
            }}
          >
            {category.name}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        padding: '1rem',
        flexWrap: 'wrap',
      }}
    >
      {categories.map(category => renderCategoryItem(category))}
    </div>
  );
}

export default ListingMenu;
