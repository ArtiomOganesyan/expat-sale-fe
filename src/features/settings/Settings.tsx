import CurrencySettings from './ui/CurrencySettings';
import { Box } from '@mui/material';
import LocalizationSettings from './ui/LocalizationSettings';

const Settings = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      gap={2}
    >
      <CurrencySettings />
      <LocalizationSettings />
    </Box>
  );
};

export default Settings;
