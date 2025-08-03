import { useGetParentCategoriesQuery } from '../../entities/categories/categoriesAPI';
import CategoryItem from './components/CategoryItem';
import styles from './ListingMenu.module.css';

function ListingMenu() {
  const { data: categories, isLoading } = useGetParentCategoriesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (
    <div
      className={styles.container}
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
