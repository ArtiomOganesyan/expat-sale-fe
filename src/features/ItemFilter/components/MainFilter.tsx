import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';

function MainFilter({
  inputValue,
  handleChange,
}: {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}) {
  const { t } = useTranslation('filter');

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{ width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '4px' }}
    >
      <TextField
        id='search'
        type='text'
        placeholder={t('filter')}
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
