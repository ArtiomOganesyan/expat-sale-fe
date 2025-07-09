type Option = {
  [key: string]: any;
};

export function getSelectedOption<T extends Option>(
  options: T[],
  compareKey: keyof T,
  value: any
): T | null {
  return options.find(opt => opt[compareKey] === value) || null;
}