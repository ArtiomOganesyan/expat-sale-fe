import { Typography } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

function SafeSellerBadge({ size = 'm', showText = true }: { size?: 's' | 'm' | 'l'; showText?: boolean }) {
  const getBadgeSize = () => {
    switch (size) {
      case 's':
        return { fontSize: '12px', padding: '2px 4px' };
      case 'm':
        return { fontSize: '16px', padding: '4px 8px' };
      case 'l':
        return { fontSize: '20px', padding: '6px 12px' };
      default:
        return { fontSize: '16px', padding: '4px 8px' };
    }
  };

  const badgeSize = getBadgeSize();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        border: '2px solid var(--color-accent-strong)',
        borderRadius: '8px',
        padding: badgeSize.padding,
        background: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <HealthAndSafetyIcon sx={{ color: 'var(--color-accent-strong)' }} />
      {showText && (
        <Typography
          sx={{ fontSize: badgeSize.fontSize }}
          style={{ color: 'var(--color-text-primary)' }}
        >
          Safe Seller
        </Typography>
      )}
    </div>
  );
}

export default SafeSellerBadge;
