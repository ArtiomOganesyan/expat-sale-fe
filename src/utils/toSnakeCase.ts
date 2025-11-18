export function toSnakeCase(str: string) {
  return str
    .trim() // Убираем пробелы по краям
    .toLowerCase() // Приводим к нижнему регистру
    .replace(/[,()\s]+/g, '')
    .replace(/[-\s]+/g, '_');
}
