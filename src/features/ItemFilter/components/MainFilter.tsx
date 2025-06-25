import { type Category } from '../../../entities/categories/categories.type';

function MainFilter({
  inputValue,
  filters,
  categories,
  handleChange,
}: {
  inputValue: string;
  filters: Record<string, any>;
  categories: Category[] | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{ width: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      <input
        id='title'
        type='text'
        placeholder='What are you looking for?'
        name='title'
        value={inputValue}
        onChange={handleChange}
      />
      <select
        id='categoryId'
        name='categoryId'
        onChange={e => handleChange(e)}
        value={filters.categoryId}
        defaultValue={''}
      >
        <option
          value=''
          disabled
        >
          Category filter
        </option>
        {categories?.map(category => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MainFilter;
