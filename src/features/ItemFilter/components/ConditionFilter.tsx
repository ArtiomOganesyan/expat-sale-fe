function ConditionFilter({
  filters,
  handleChange,
}: {
  filters: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}) {
  return (
    <div>
      <select
        id='isNew'
        name='isNew'
        onChange={e => handleChange(e)}
        value={filters.isNew}
        defaultValue={''}
      >
        <option
          value=''
          disabled
        >
          Condition filter
        </option>
        <option value='true'>New</option>
        <option value='false'>Used</option>
      </select>
    </div>
  );
}

export default ConditionFilter;
