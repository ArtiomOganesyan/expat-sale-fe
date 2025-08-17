export function formatPrice(value: number, iso: string): string {
  if (isNaN(value)) return '';

  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 10_000) return (value / 1_000).toFixed(2) + 'K';

  const [intPart, decimalPart] = value.toString().split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decimalPart ? `${formattedInt}.${decimalPart}` : formattedInt;
}
