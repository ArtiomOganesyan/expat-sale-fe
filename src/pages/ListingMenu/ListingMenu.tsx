import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';
import CategoryItem from './components/CategoryItem';

function ListingMenu() {
  const { data: categories, isLoading } = useGetParentCategoriesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: '1rem',
        flexWrap: 'wrap',
      }}
    >
      {categories.map(category => (
        <CategoryItem
          key={category.id}
          category={category}
        />
      ))}
    </div>
  );
}

export default ListingMenu;
