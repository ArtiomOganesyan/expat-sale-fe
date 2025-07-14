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
        id='title'
        type='text'
        placeholder='What are you looking for?'
        name='title'
        value={inputValue}
        onChange={handleChange}
        fullWidth
        variant='outlined'
        size='small'
      />
    </div>
  );
}

export default MainFilter;
