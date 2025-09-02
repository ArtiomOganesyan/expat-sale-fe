import TextField from '@mui/material/TextField';

function MainFilter({
  inputValue,
  handleChange,
}: {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      <TextField
        id='search'
        type='text'
        placeholder='What are you looking for?'
        name='search'
        value={inputValue}
        onChange={handleChange}
        onKeyDown={e => {
          if (e.key === ' ') {
            (e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value += ' ';
            e.stopPropagation();
            e.preventDefault();
          }
          handleChange(e as any);
        }}
        fullWidth
        variant='outlined'
        size='small'
      />
    </div>
  );
}

export default MainFilter;
